WITH pub_pkg AS (
  SELECT
         s.synonym_name AS alias,
         s.table_owner  AS owner,
         s.table_name   AS package_name
  FROM   all_synonyms s
  JOIN   all_objects  o
    ON   o.owner       = s.table_owner
   AND   o.object_name = s.table_name
   AND   o.object_type = 'PACKAGE'
  WHERE     s.table_owner LIKE 'APEX\_%' ESCAPE '\' and s.synonym_name LIKE 'APEX%'
),
procs AS (
  SELECT
         p.owner,
         p.object_name    AS package_name,
         p.procedure_name,
         p.subprogram_id,
         NVL(p.overload, 0) AS overload_n
  FROM   all_procedures p
  JOIN   pub_pkg x
    ON   x.owner        = p.owner
   AND   x.package_name = p.object_name
  WHERE  p.object_type = 'PACKAGE'
  AND    p.procedure_name IS NOT NULL
),
args AS (
  SELECT
         a.owner,
         a.package_name,
         a.object_name    AS procedure_name,
         a.subprogram_id,
         NVL(a.overload, 0) AS overload_n,
         a.argument_name,
         a.data_type,
         a.in_out,
         a.default_value,
         a.position
  FROM   all_arguments a
  WHERE  a.owner LIKE 'APEX\_%' ESCAPE '\'
),
return_types AS (

  SELECT
         a.owner,
         a.package_name,
         a.object_name    AS procedure_name,
         a.subprogram_id,
         NVL(a.overload, 0) AS overload_n,
         a.data_type       AS return_type
  FROM   all_arguments a
  WHERE  a.owner LIKE 'APEX\_%' ESCAPE '\'
  AND    a.position = 0
  AND    a.argument_name IS NULL
)
SELECT
  p.package_name,
  x.alias,
  p.procedure_name,
  CASE WHEN r.return_type IS NOT NULL THEN 'FUNCTION' ELSE 'PROCEDURE' END AS subprogram_type,
  r.return_type,
  a.argument_name,
  a.data_type,
  a.in_out,
  a.default_value,
  a.position
FROM   procs p
JOIN   pub_pkg x
  ON   x.owner        = p.owner
 AND   x.package_name = p.package_name
LEFT JOIN return_types r
  ON   r.owner         = p.owner
 AND   r.package_name  = p.package_name
 AND   r.procedure_name= p.procedure_name
 AND   r.subprogram_id = p.subprogram_id
 AND   r.overload_n    = p.overload_n
LEFT JOIN args a
  ON   a.owner         = p.owner
 AND   a.package_name  = p.package_name
 AND   a.procedure_name= p.procedure_name
 AND   a.subprogram_id = p.subprogram_id
 AND   a.overload_n    = p.overload_n
 AND   a.position > 0 
ORDER BY x.alias, p.procedure_name, a.position;
