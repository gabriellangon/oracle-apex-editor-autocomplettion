/**
 * injected.js
 * Runs in the page context (not the extension isolated world).
 * Has direct access to window.monaco and editor instances.
 * Hooks into existing and future Monaco editors to register autocomplete.
 */

(function () {
  'use strict';

  // Avoid double execution
  if (window.__apexAutocompleteActive) return;
  window.__apexAutocompleteActive = true;

  const LOG_PREFIX = '[APEX Autocomplete]';
  const registeredEditors = new WeakSet();
  let providerDisposable = null;

  // ─────────────────────────────────────────────
  // Editor language detection
  // ─────────────────────────────────────────────

  function getEditorLanguage(editor) {
    const model = editor.getModel();
    if (!model) return 'unknown';

    // Monaco in APEX assigns a language ID to the model
    const languageId = model.getLanguageId();
    if (languageId && languageId !== 'plaintext') {
      // APEX typically uses 'plsql' or 'sql' or 'javascript'
      if (
        languageId.includes('sql') ||
        languageId.includes('plsql') ||
        languageId === 'oracle'
      ) {
        return 'plsql';
      }
      if (languageId === 'javascript' || languageId === 'typescript') {
        return 'javascript';
      }
      return languageId;
    }

    // Fallback: analyze content
    const content = model.getValue().toUpperCase().substring(0, 2000);

    if (
      content.includes('DECLARE') ||
      content.includes('BEGIN') ||
      content.includes('CREATE OR REPLACE') ||
      (content.includes('SELECT') && !content.includes('{'))
    ) {
      return 'plsql';
    }

    if (content.includes('FUNCTION') && content.includes('{')) {
      return 'javascript';
    }

    // Default to PL/SQL — most common in APEX
    return 'plsql';
  }

  // ─────────────────────────────────────────────
  // Register completion provider
  // ─────────────────────────────────────────────

  function registerCompletions() {
    if (!window.monaco) {
      console.warn(LOG_PREFIX, 'Monaco not available');
      return;
    }

    if (providerDisposable) {
      // Already registered globally
      return;
    }

    if (!window.__createCompletionProvider) {
      console.warn(LOG_PREFIX, 'Completion provider not loaded');
      return;
    }

    const provider = window.__createCompletionProvider(window.monaco);

    // Register for multiple language IDs that APEX might use
    const languages = ['plsql', 'sql', 'oracle', 'oraclesql', 'plaintext'];

    for (const lang of languages) {
      try {
        providerDisposable = window.monaco.languages.registerCompletionItemProvider(
          lang,
          provider
        );
        console.log(LOG_PREFIX, `Registered completion provider for "${lang}"`);
      } catch (e) {
        // Language might not be registered, that's OK
        console.debug(LOG_PREFIX, `Could not register for "${lang}":`, e.message);
      }
    }

    // Also register for any language (fallback)
    try {
      window.monaco.languages.registerCompletionItemProvider('*', {
        ...provider,
        provideCompletionItems: function (model, position, context, token) {
          // Only provide completions for PL/SQL-like editors
          const editor = findEditorForModel(model);
          if (editor && getEditorLanguage(editor) !== 'plsql') {
            return { suggestions: [] };
          }
          return provider.provideCompletionItems(model, position, context, token);
        },
      });
      console.log(LOG_PREFIX, 'Registered wildcard completion provider');
    } catch (e) {
      console.debug(LOG_PREFIX, 'Wildcard registration failed:', e.message);
    }
  }

  // ─────────────────────────────────────────────
  // Find all Monaco editors on the page
  // ─────────────────────────────────────────────

  function findEditorForModel(model) {
    if (!window.monaco || !window.monaco.editor) return null;
    const editors = window.monaco.editor.getEditors
      ? window.monaco.editor.getEditors()
      : [];
    for (const ed of editors) {
      if (ed.getModel() === model) return ed;
    }
    return null;
  }

  function findAllEditors() {
    if (!window.monaco || !window.monaco.editor) return [];

    // Method 1: Monaco's getEditors() API (Monaco 0.21+)
    if (window.monaco.editor.getEditors) {
      return window.monaco.editor.getEditors();
    }

    // Method 2: Query DOM for Monaco containers and find editors
    const containers = document.querySelectorAll('.monaco-editor');
    const editors = [];
    containers.forEach((el) => {
      // APEX stores editor references in various ways
      const parent = el.closest('.apex-item-code-editor, .a-MonacoEditor');
      if (parent && parent._editor) {
        editors.push(parent._editor);
      }
    });
    return editors;
  }

  // ─────────────────────────────────────────────
  // Configure editor settings for better autocomplete UX
  // ─────────────────────────────────────────────

  function configureEditor(editor) {
    if (registeredEditors.has(editor)) return;
    registeredEditors.add(editor);

    try {
      // Enable quick suggestions (show completions as you type)
      editor.updateOptions({
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false,
        },
        suggestOnTriggerCharacters: true,
        wordBasedSuggestions: 'currentDocument',
        suggest: {
          showKeywords: true,
          showSnippets: true,
          showFunctions: true,
          showVariables: true,
          showMethods: true,
          insertMode: 'replace',
          filterGraceful: true,
          snippetsPreventQuickSuggestions: false,
        },
        acceptSuggestionOnEnter: 'on',
        tabCompletion: 'on',
      });

      const lang = getEditorLanguage(editor);
      console.log(
        LOG_PREFIX,
        `Configured editor (language: ${lang}, model: ${editor.getModel()?.uri?.toString()})`
      );
    } catch (e) {
      console.debug(LOG_PREFIX, 'Could not configure editor:', e.message);
    }
  }

  // ─────────────────────────────────────────────
  // Main initialization
  // ─────────────────────────────────────────────

  function init() {
    if (!window.monaco) {
      console.warn(LOG_PREFIX, 'Monaco not found, retrying...');
      setTimeout(init, 1000);
      return;
    }

    console.log(LOG_PREFIX, 'Initializing...');

    // Register the global completion provider
    registerCompletions();

    // Configure existing editors
    const editors = findAllEditors();
    editors.forEach(configureEditor);
    console.log(LOG_PREFIX, `Found and configured ${editors.length} existing editor(s)`);

    // Watch for new editors (APEX creates them dynamically)
    if (window.monaco.editor.onDidCreateEditor) {
      window.monaco.editor.onDidCreateEditor(function (editor) {
        console.log(LOG_PREFIX, 'New editor created, configuring...');
        configureEditor(editor);
      });
    }

    // Also observe DOM for dynamically added editors
    const observer = new MutationObserver(function (mutations) {
      let hasNewEditor = false;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (
            node.nodeType === 1 &&
            (node.classList?.contains('monaco-editor') ||
              node.querySelector?.('.monaco-editor'))
          ) {
            hasNewEditor = true;
            break;
          }
        }
        if (hasNewEditor) break;
      }

      if (hasNewEditor) {
        // Delay slightly to let APEX finish initializing the editor
        setTimeout(function () {
          const editors = findAllEditors();
          editors.forEach(configureEditor);
        }, 500);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Status indicator
    console.log(
      LOG_PREFIX,
      '✓ Active — SQL/PL/SQL/APEX API autocomplete enabled'
    );
  }

  // Start
  init();
})();
