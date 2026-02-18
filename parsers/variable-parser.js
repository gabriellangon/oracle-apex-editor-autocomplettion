/**
 * parsers/variable-parser.js
 * Extracts declared variables, cursors, parameters, and loop variables
 * from PL/SQL code for autocomplete suggestions.
 */

(function () {
  'use strict';

  /**
   * Extract all declared variables from PL/SQL code.
   * @param {string} code - The full editor content
   * @returns {Array<{name: string, type: string, line: number}>}
   */
  function extractVariables(code) {
    const variables = [];
    const seen = new Set(); // avoid duplicates
    const lines = code.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines and comments
      if (!line || line.startsWith('--') || line.startsWith('/*')) continue;

      let match;

      // Pattern 1: variable_name TYPE[(size)][;| := | DEFAULT]
      // e.g., l_name VARCHAR2(100) := 'test';
      match = line.match(
        /^(\w+)\s+(VARCHAR2|NUMBER|INTEGER|PLS_INTEGER|BINARY_INTEGER|DATE|TIMESTAMP|BOOLEAN|CLOB|BLOB|RAW|XMLTYPE|JSON|SYS_REFCURSOR|LONG|CHAR|NVARCHAR2|NCHAR|NCLOB|BINARY_FLOAT|BINARY_DOUBLE|NATURAL|NATURALN|POSITIVE|POSITIVEN|SIGNTYPE|SIMPLE_INTEGER|SIMPLE_FLOAT|SIMPLE_DOUBLE)(\([^)]*\))?\s*(;|:=|DEFAULT)/i
      );
      if (match && !isReserved(match[1])) {
        addVar(match[1], match[2].toUpperCase(), i + 1);
        continue;
      }

      // Pattern 2: variable_name table.column%TYPE
      match = line.match(
        /^(\w+)\s+(\w+\.\w+)%TYPE\s*(;|:=|DEFAULT)/i
      );
      if (match && !isReserved(match[1])) {
        addVar(match[1], match[2] + '%TYPE', i + 1);
        continue;
      }

      // Pattern 3: variable_name table%ROWTYPE
      match = line.match(
        /^(\w+)\s+(\w+)%ROWTYPE\s*(;|:=)/i
      );
      if (match && !isReserved(match[1])) {
        addVar(match[1], match[2] + '%ROWTYPE', i + 1);
        continue;
      }

      // Pattern 4: CURSOR cursor_name IS
      match = line.match(
        /^CURSOR\s+(\w+)\s+IS/i
      );
      if (match) {
        addVar(match[1], 'CURSOR', i + 1);
        continue;
      }

      // Pattern 5: FOR rec IN (cursor/query)
      match = line.match(
        /^FOR\s+(\w+)\s+IN\s/i
      );
      if (match) {
        addVar(match[1], 'RECORD (loop)', i + 1);
        continue;
      }

      // Pattern 6: FOR i IN 1..N LOOP (numeric loop)
      match = line.match(
        /^FOR\s+(\w+)\s+IN\s+(\d+|REVERSE)\s*\.\./i
      );
      if (match) {
        addVar(match[1], 'PLS_INTEGER (loop)', i + 1);
        continue;
      }

      // Pattern 7: parameter_name IN/OUT/IN OUT TYPE
      // (inside procedure/function declarations)
      match = line.match(
        /^\s*(\w+)\s+(IN\s+OUT|IN|OUT)\s+(\w+)/i
      );
      if (match && !isReserved(match[1])) {
        addVar(match[1], match[3].toUpperCase(), i + 1);
        continue;
      }

      // Pattern 8: variable_name CONSTANT TYPE := value;
      match = line.match(
        /^(\w+)\s+CONSTANT\s+(\w+)(\([^)]*\))?\s*(;|:=)/i
      );
      if (match && !isReserved(match[1])) {
        addVar(match[1], match[2].toUpperCase() + ' (constant)', i + 1);
        continue;
      }

      // Pattern 9: TYPE type_name IS RECORD/TABLE OF/VARRAY
      match = line.match(
        /^TYPE\s+(\w+)\s+IS\s+(RECORD|TABLE\s+OF|VARRAY)/i
      );
      if (match) {
        addVar(match[1], 'TYPE (' + match[2].toUpperCase() + ')', i + 1);
        continue;
      }

      // Pattern 10: variable_name custom_type_name; (after TYPE declarations)
      // This is harder to detect without full parsing, skip for MVP
    }

    function addVar(name, type, line) {
      const key = name.toUpperCase();
      if (!seen.has(key)) {
        seen.add(key);
        variables.push({ name: name, type: type, line: line });
      }
    }

    return variables;
  }

  /**
   * Check if a word is a reserved PL/SQL keyword (to avoid false positives).
   */
  const RESERVED_WORDS = new Set([
    'DECLARE', 'BEGIN', 'END', 'EXCEPTION', 'IF', 'THEN', 'ELSIF', 'ELSE',
    'LOOP', 'WHILE', 'FOR', 'EXIT', 'CONTINUE', 'RETURN', 'NULL', 'TRUE',
    'FALSE', 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'FROM', 'WHERE', 'AND',
    'OR', 'NOT', 'IN', 'OUT', 'IS', 'AS', 'INTO', 'VALUES', 'SET', 'CREATE',
    'ALTER', 'DROP', 'TABLE', 'VIEW', 'INDEX', 'SEQUENCE', 'TRIGGER',
    'PROCEDURE', 'FUNCTION', 'PACKAGE', 'BODY', 'REPLACE', 'GRANT', 'REVOKE',
    'CURSOR', 'OPEN', 'FETCH', 'CLOSE', 'RAISE', 'WHEN', 'OTHERS', 'PRAGMA',
    'TYPE', 'SUBTYPE', 'RECORD', 'CONSTANT', 'DEFAULT', 'COMMIT', 'ROLLBACK',
    'SAVEPOINT', 'BULK', 'COLLECT', 'FORALL', 'CASE', 'WITH'
  ]);

  function isReserved(word) {
    return RESERVED_WORDS.has(word.toUpperCase());
  }

  // Expose globally
  window.__extractVariables = extractVariables;
})();
