# APEX API Dictionary Generation

This folder contains the tools to generate the APEX PL/SQL API dictionary used for autocompletion.

## Current Version

- **APEX Version**: 24.2
- **Last Updated**: 2026-02

## Files

| File | Description |
|------|-------------|
| `query.sql` | Oracle SQL query to extract all APEX package procedures/functions with their signatures |
| `apex-public-plsql-api.json` | List of public APEX API packages (from official Oracle documentation) |
| `generate_apex_api.py` | Python script to convert CSV export to JSON dictionary |

## How to Update the Dictionary

### Step 1: Export from Oracle Database

Run `query.sql` in SQL Developer or SQL*Plus against an APEX schema:

```sql
-- Connect to your APEX database
@query.sql
```

Export the results as CSV with headers:
- File: `apex-all-plsql-apis-args.csv`
- Encoding: UTF-8
- Delimiter: comma

### Step 2: Generate the JSON Dictionary

```bash
cd scripts

# Edit generate_apex_api.py to set CSV_INPUT filename if needed
python3 generate_apex_api.py
```

This will:
1. Read the CSV export
2. Filter only public APIs (listed in `apex-public-plsql-api.json`)
3. Generate `extension/dictionaries/apex-api.json`

### Step 3: Test

1. Reload the extension in Chrome (`chrome://extensions`)
2. Refresh your APEX page
3. Test autocompletion

## Output Format

The generated JSON follows this structure:

```json
{
  "packages": [
    {
      "name": "APEX_UTIL",
      "procedures": [
        {
          "label": "APEX_UTIL.GET_SESSION_ID",
          "detail": "WWV_FLOW_UTILITIES.GET_SESSION_ID",
          "kind": "function",
          "returnType": "NUMBER",
          "signature": "APEX_UTIL.GET_SESSION_ID RETURN NUMBER"
        }
      ]
    }
  ]
}
```

## Versioning Strategy

**Additive approach**: We keep all functions across APEX versions.

- New functions are added when updating to a newer APEX version
- Deprecated functions are NOT removed (they remain valid for older APEX instances)
- This ensures compatibility with all APEX versions

## Adding a New APEX Package

1. Add the package name to `apex-public-plsql-api.json`
2. Re-run the generation process

## Notes

- The query distinguishes functions from procedures using `ALL_ARGUMENTS.POSITION = 0`
- Functions have a `returnType` field and `RETURN` clause in their signature
- Overloaded procedures are deduplicated (keeping unique parameter combinations)
