// Test all 4 dpriver reference examples
var { formatPlsql } = require('../plsql-indenter.js');

// === EXAMPLE 1: User's original APEX code ===
var ex1 = `BEGIN FOR c1 IN (SELECT item_name FROM apex_application_page_items WHERE application_id = :APP_ID AND page_id = :APP_PAGE_ID AND display_as_code IN ('NATIVE_TEXT_FIELD', 'NATIVE_TEXTAREA', 'NATIVE_NUMBER_FIELD')) LOOP apex_util.set_session_state(c1.item_name, regexp_replace(apex_util.get_session_state(c1.item_name), '^[[:space:]]*(.*?)[[:space:]]*$', '\\1')); END LOOP; END;`;

console.log('=== EXAMPLE 1: FOR cursor loop with SQL ===');
console.log(formatPlsql(ex1, { tabSize: 4 }));

// === EXAMPLE 2: IF/ELSIF with queries ===
var ex2 = `DECLARE v_count NUMBER; v_name VARCHAR2(100); BEGIN SELECT COUNT(*) INTO v_count FROM employees WHERE department_id = 10 AND salary > 5000; IF v_count > 0 THEN SELECT first_name INTO v_name FROM employees WHERE department_id = 10 AND ROWNUM = 1; DBMS_OUTPUT.PUT_LINE('Name: ' || v_name); ELSIF v_count = 0 THEN DBMS_OUTPUT.PUT_LINE('No employees found'); ELSE DBMS_OUTPUT.PUT_LINE('Error'); END IF; END;`;

console.log('=== EXAMPLE 2: IF/ELSIF with queries ===');
console.log(formatPlsql(ex2, { tabSize: 4 }));

// === EXAMPLE 3: CASE statement ===
var ex3 = `DECLARE v_grade CHAR(1); v_result VARCHAR2(50); BEGIN v_grade := 'A'; CASE v_grade WHEN 'A' THEN v_result := 'Excellent'; WHEN 'B' THEN v_result := 'Good'; WHEN 'C' THEN v_result := 'Average'; ELSE v_result := 'Unknown'; END CASE; DBMS_OUTPUT.PUT_LINE(v_result); END;`;

console.log('=== EXAMPLE 3: CASE statement ===');
console.log(formatPlsql(ex3, { tabSize: 4 }));

// === EXAMPLE 4: Procedure with exception ===
var ex4 = `CREATE OR REPLACE PROCEDURE update_salary(p_emp_id IN NUMBER, p_increase IN NUMBER) IS v_current_salary NUMBER; v_new_salary NUMBER; BEGIN SELECT salary INTO v_current_salary FROM employees WHERE employee_id = p_emp_id; v_new_salary := v_current_salary + p_increase; UPDATE employees SET salary = v_new_salary WHERE employee_id = p_emp_id; COMMIT; EXCEPTION WHEN NO_DATA_FOUND THEN DBMS_OUTPUT.PUT_LINE('Employee not found: ' || p_emp_id); ROLLBACK; WHEN OTHERS THEN DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM); ROLLBACK; END update_salary;`;

console.log('=== EXAMPLE 4: Procedure with exception ===');
console.log(formatPlsql(ex4, { tabSize: 4 }));
