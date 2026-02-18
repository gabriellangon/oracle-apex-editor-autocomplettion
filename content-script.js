/**
 * content-script.js
 * Injected into APEX pages by Chrome extension.
 * Creates a bridge to inject scripts into the page context
 * where Monaco editor instances are accessible.
 */

(function () {
  'use strict';

  // Avoid double-injection
  if (window.__apexAutocompleteInjected) return;
  window.__apexAutocompleteInjected = true;

  console.log('[APEX Autocomplete] Content script loaded');

  /**
   * Inject a script file into the page context.
   * Content scripts run in an isolated world and cannot access
   * page JS objects (like Monaco). We inject into the MAIN world.
   */
  function injectScript(file) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL(file);
      script.type = 'text/javascript';
      script.onload = () => {
        script.remove();
        resolve();
      };
      script.onerror = (err) => {
        console.error(`[APEX Autocomplete] Failed to inject ${file}`, err);
        reject(err);
      };
      (document.head || document.documentElement).appendChild(script);
    });
  }

  /**
   * Inject a JSON dictionary as a global variable on the page.
   */
  function injectDictionary(file, globalName) {
    return fetch(chrome.runtime.getURL(file))
      .then((res) => res.json())
      .then((data) => {
        const script = document.createElement('script');
        script.textContent = `window.${globalName} = ${JSON.stringify(data)};`;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
      })
      .catch((err) => {
        console.error(`[APEX Autocomplete] Failed to load dictionary ${file}`, err);
      });
  }

  /**
   * Main injection sequence.
   * 1. Inject dictionaries as global variables
   * 2. Inject the variable parser
   * 3. Inject the completion provider logic
   * 4. Inject the main script that hooks into Monaco
   */
  async function init() {
    try {
      // Step 1: Inject dictionaries
      await Promise.all([
        injectDictionary('dictionaries/sql-keywords.json', '__sqlKeywords'),
        injectDictionary('dictionaries/plsql-keywords.json', '__plsqlKeywords'),
        injectDictionary('dictionaries/apex-api.json', '__apexApi'),
      ]);

      // Step 2: Inject parser
      await injectScript('parsers/variable-parser.js');

      // Step 3: Inject completion provider
      await injectScript('completion-provider.js');

      // Step 4: Inject main hook script
      await injectScript('injected.js');

      console.log('[APEX Autocomplete] All scripts injected successfully');
    } catch (err) {
      console.error('[APEX Autocomplete] Injection failed:', err);
    }
  }

  // Wait a bit for APEX to finish loading Monaco editors
  // APEX lazy-loads Monaco, so we use a MutationObserver + delay strategy
  function waitForMonaco() {
    // Check if Monaco is already loaded
    if (typeof window !== 'undefined') {
      // We can't check window.monaco from content script,
      // so we inject a probe
      const probe = document.createElement('script');
      probe.textContent = `
        (function checkMonaco() {
          if (window.monaco) {
            document.dispatchEvent(new CustomEvent('__apexMonacoReady'));
          } else {
            // Observe DOM for Monaco editor containers
            const observer = new MutationObserver(function(mutations) {
              if (window.monaco) {
                observer.disconnect();
                document.dispatchEvent(new CustomEvent('__apexMonacoReady'));
              }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            // Also poll as fallback
            let attempts = 0;
            const interval = setInterval(function() {
              attempts++;
              if (window.monaco) {
                clearInterval(interval);
                observer.disconnect();
                document.dispatchEvent(new CustomEvent('__apexMonacoReady'));
              }
              if (attempts > 60) { // 30 seconds max
                clearInterval(interval);
                observer.disconnect();
                // Try anyway — Monaco might load later via user interaction
                document.dispatchEvent(new CustomEvent('__apexMonacoReady'));
              }
            }, 500);
          }
        })();
      `;
      (document.head || document.documentElement).appendChild(probe);
      probe.remove();
    }

    document.addEventListener('__apexMonacoReady', function () {
      console.log('[APEX Autocomplete] Monaco detected, injecting...');
      init();
    }, { once: true });
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForMonaco);
  } else {
    waitForMonaco();
  }
})();
