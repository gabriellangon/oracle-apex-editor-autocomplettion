/**
 * typedefs-injector.js
 * Runs in the PAGE context (MAIN world).
 * Injects .d.ts type definitions into Monaco's TypeScript/JavaScript
 * language service using addExtraLib, enabling intelligent autocomplete
 * for jQuery and APEX JS APIs.
 *
 * The .d.ts content is received from the content script via CustomEvents.
 */

(function () {
    'use strict';

    // ── Listen for typedef content from content script ──

    document.addEventListener('__apexTypeDef', function (e) {
        var detail;
        try {
            detail = typeof e.detail === 'string' ? JSON.parse(e.detail) : e.detail;
        } catch (err) {
            console.error('[APEX Autocomplete] Failed to parse typedef event:', err);
            return;
        }

        var fileName = detail.fileName; // e.g. "jquery.d.ts"
        var content = detail.content;  // the .d.ts source text

        if (!content || !fileName) {
            console.warn('[APEX Autocomplete] Empty typedef received for', fileName);
            return;
        }

        if (!window.monaco || !window.monaco.languages || !window.monaco.languages.typescript) {
            console.warn('[APEX Autocomplete] Monaco TypeScript service not available, cannot inject', fileName);
            return;
        }

        var filePath = 'ts:apex-autocomplete/' + fileName;

        try {
            // Add to JavaScript defaults (for javascript editors)
            monaco.languages.typescript.javascriptDefaults.addExtraLib(content, filePath);

            // Also configure JS defaults for a good experience
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                target: monaco.languages.typescript.ScriptTarget.ES2015,
                allowNonTsExtensions: true,
                allowJs: true,
                checkJs: false,
                noEmit: true,
                moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs
            });

            // Disable semantic diagnostics to avoid false errors
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true,
                noSyntaxValidation: false
            });

            console.log('[APEX Autocomplete] Injected typedef:', fileName, '(' + content.length + ' chars)');
        } catch (err) {
            console.error('[APEX Autocomplete] Failed to inject typedef', fileName, err);
        }
    });

    console.log('[APEX Autocomplete] typedefs-injector.js loaded, waiting for .d.ts content');
})();
