/**
 * completion-provider.js
 * Core autocomplete logic. Registers a Monaco CompletionItemProvider
 * that merges SQL keywords, PL/SQL keywords, APEX API, and declared variables.
 */

(function () {
  'use strict';

  // ─────────────────────────────────────────────
  // Monaco CompletionItemKind mapping
  // ─────────────────────────────────────────────
  function getKind(monaco, category) {
    const map = {
      // SQL
      dml: monaco.languages.CompletionItemKind.Keyword,
      clause: monaco.languages.CompletionItemKind.Keyword,
      join: monaco.languages.CompletionItemKind.Keyword,
      set: monaco.languages.CompletionItemKind.Keyword,
      condition: monaco.languages.CompletionItemKind.Keyword,
      expression: monaco.languages.CompletionItemKind.Keyword,
      alias: monaco.languages.CompletionItemKind.Keyword,
      modifier: monaco.languages.CompletionItemKind.Keyword,
      logical: monaco.languages.CompletionItemKind.Keyword,
      ddl: monaco.languages.CompletionItemKind.Keyword,
      dcl: monaco.languages.CompletionItemKind.Keyword,
      tcl: monaco.languages.CompletionItemKind.Keyword,

      // PL/SQL
      block: monaco.languages.CompletionItemKind.Keyword,
      control: monaco.languages.CompletionItemKind.Keyword,
      loop: monaco.languages.CompletionItemKind.Keyword,
      cursor: monaco.languages.CompletionItemKind.Keyword,
      cursor_attr: monaco.languages.CompletionItemKind.Property,
      type_attr: monaco.languages.CompletionItemKind.Property,
      bulk: monaco.languages.CompletionItemKind.Keyword,
      type: monaco.languages.CompletionItemKind.TypeParameter,
      composite_type: monaco.languages.CompletionItemKind.Struct,
      exception: monaco.languages.CompletionItemKind.Event,
      program_unit: monaco.languages.CompletionItemKind.Keyword,
      parameter: monaco.languages.CompletionItemKind.Keyword,
      builtin_pkg: monaco.languages.CompletionItemKind.Function,
      function: monaco.languages.CompletionItemKind.Function,
      analytic: monaco.languages.CompletionItemKind.Function,

      // APEX API
      apex_proc: monaco.languages.CompletionItemKind.Method,
      apex_func: monaco.languages.CompletionItemKind.Function,
      apex_pkg: monaco.languages.CompletionItemKind.Module,

      // Variables
      variable: monaco.languages.CompletionItemKind.Variable,

      // Snippets
      snippet: monaco.languages.CompletionItemKind.Snippet,
    };
    return map[category] || monaco.languages.CompletionItemKind.Text;
  }

  // ─────────────────────────────────────────────
  // Build completion items from dictionaries
  // ─────────────────────────────────────────────

  function buildKeywordItems(monaco, dict) {
    if (!dict || !dict.keywords) return [];
    return dict.keywords.map((kw) => ({
      label: kw.label,
      kind: getKind(monaco, kw.category),
      detail: kw.detail || kw.category,
      insertText: kw.label,
      sortText: '2_' + kw.label, // keywords after variables
      filterText: kw.label,
      _source: 'keyword',
    }));
  }

  function buildSnippetItems(monaco, dict) {
    if (!dict || !dict.snippets) return [];
    return dict.snippets.map((sn) => ({
      label: sn.label,
      kind: monaco.languages.CompletionItemKind.Snippet,
      detail: sn.detail || 'Snippet',
      insertText: sn.insertText,
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      sortText: '4_' + sn.label,
      documentation: sn.detail,
      _source: 'snippet',
    }));
  }

  function buildApexApiItems(monaco, apiDict) {
    if (!apiDict || !apiDict.packages) return [];
    const items = [];
    for (const pkg of apiDict.packages) {
      // Package name itself as completion
      items.push({
        label: pkg.name,
        kind: getKind(monaco, 'apex_pkg'),
        detail: 'APEX Package',
        insertText: pkg.name,
        sortText: '3_' + pkg.name,
        _source: 'apex_api',
      });

      if (!pkg.procedures) continue;
      for (const proc of pkg.procedures) {
        items.push({
          label: proc.label,
          kind: getKind(
            monaco,
            proc.signature && proc.signature.includes('RETURN')
              ? 'apex_func'
              : 'apex_proc'
          ),
          detail: proc.detail || proc.label,
          insertText: proc.label,
          documentation: proc.signature || '',
          sortText: '3_' + proc.label,
          _source: 'apex_api',
        });
      }
    }
    return items;
  }

  function buildVariableItems(monaco, variables) {
    return variables.map((v) => ({
      label: v.name,
      kind: getKind(monaco, 'variable'),
      detail: v.type + ' (line ' + v.line + ')',
      insertText: v.name,
      sortText: '1_' + v.name, // variables first
      _source: 'variable',
    }));
  }

  // ─────────────────────────────────────────────
  // Get the current word being typed
  // ─────────────────────────────────────────────

  function getCurrentWord(model, position) {
    const wordInfo = model.getWordUntilPosition(position);
    return wordInfo ? wordInfo.word : '';
  }

  // ─────────────────────────────────────────────
  // Check if we're typing after a dot (for package.procedure)
  // ─────────────────────────────────────────────

  function getPackagePrefix(model, position) {
    const lineContent = model.getLineContent(position.lineNumber);
    const textBefore = lineContent.substring(0, position.column - 1);
    // Match APEX_SOMETHING. or DBMS_SOMETHING.
    const dotMatch = textBefore.match(/(\w+)\.\s*$/);
    if (dotMatch) {
      return dotMatch[1].toUpperCase();
    }
    return null;
  }

  // ─────────────────────────────────────────────
  // Main provider registration
  // ─────────────────────────────────────────────

  function createCompletionProvider(monaco) {
    // Pre-build static items
    const sqlItems = buildKeywordItems(monaco, window.__sqlKeywords);
    const plsqlItems = buildKeywordItems(monaco, window.__plsqlKeywords);
    const plsqlSnippets = buildSnippetItems(monaco, window.__plsqlKeywords);
    const apexItems = buildApexApiItems(monaco, window.__apexApi);

    // Combine all static items
    const allStaticItems = [...sqlItems, ...plsqlItems, ...plsqlSnippets, ...apexItems];

    // Build a lookup: package name -> procedures
    const packageProcMap = {};
    if (window.__apexApi && window.__apexApi.packages) {
      for (const pkg of window.__apexApi.packages) {
        if (pkg.procedures) {
          packageProcMap[pkg.name.toUpperCase()] = pkg.procedures.map(
            (proc) => ({
              label: proc.label.split('.').pop(), // just the procedure name
              fullLabel: proc.label,
              kind:
                proc.signature && proc.signature.includes('RETURN')
                  ? monaco.languages.CompletionItemKind.Function
                  : monaco.languages.CompletionItemKind.Method,
              detail: proc.detail || '',
              insertText: proc.label.split('.').pop(),
              documentation: proc.signature || '',
              sortText: '1_' + proc.label,
              _source: 'apex_api',
            })
          );
        }
      }
    }

    return {
      triggerCharacters: ['.', '_'],

      provideCompletionItems: function (model, position, context, token) {
        const word = getCurrentWord(model, position);
        const pkgPrefix = getPackagePrefix(model, position);

        // If typing after a dot (e.g., APEX_JSON.), show only that package's procs
        if (pkgPrefix && packageProcMap[pkgPrefix]) {
          const range = getRange(model, position);
          return {
            suggestions: packageProcMap[pkgPrefix].map((item) => ({
              ...item,
              range: range,
            })),
          };
        }

        // Otherwise, combine static items + dynamic variables
        const code = model.getValue();
        const variables = window.__extractVariables
          ? window.__extractVariables(code)
          : [];
        const variableItems = buildVariableItems(monaco, variables);

        const allItems = [...variableItems, ...allStaticItems];
        const range = getRange(model, position);

        return {
          suggestions: allItems.map((item) => ({
            ...item,
            range: range,
          })),
        };
      },
    };
  }

  /**
   * Compute the replacement range for the current word.
   */
  function getRange(model, position) {
    const wordInfo = model.getWordUntilPosition(position);
    return {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: wordInfo.startColumn,
      endColumn: position.column,
    };
  }

  // Expose
  window.__createCompletionProvider = createCompletionProvider;
})();
