#!/usr/bin/env python3
"""
Generate apex-api.json from the filtered CSV.

Input CSV columns (after running the updated query):
  PACKAGE_NAME, ALIAS, PROCEDURE_NAME, SUBPROGRAM_TYPE, RETURN_TYPE,
  ARGUMENT_NAME, DATA_TYPE, IN_OUT, DEFAULT_VALUE, POSITION

Output JSON structure:
{
  "packages": [
    {
      "name": "APEX_ACL",
      "procedures": [
        {
          "label": "APEX_ACL.ADD_USER_ROLE",
          "detail": "WWV_FLOW_ACL_API.ADD_USER_ROLE",
          "kind": "procedure",
          "signature": "APEX_ACL.ADD_USER_ROLE(...)"
        },
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
"""

import csv
import json
from collections import OrderedDict

# --- Input/Output files ---
CSV_INPUT = "apex-24.2-export.csv"  # Rename for your APEX version
JSON_ALLOWED = "apex-public-plsql-api.json"
JSON_OUTPUT = "../extension/dictionaries/apex-api.json"


def main():
    # Load allowed aliases
    with open(JSON_ALLOWED, "r", encoding="utf-8") as f:
        allowed_aliases = set(json.load(f))

    # Parse CSV and group by package -> procedure
    packages = OrderedDict()

    with open(CSV_INPUT, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            alias = row["ALIAS"]
            if alias not in allowed_aliases:
                continue

            pkg_name = row["PACKAGE_NAME"]
            proc_name = row["PROCEDURE_NAME"]
            subprogram_type = row.get("SUBPROGRAM_TYPE", "PROCEDURE")
            return_type = row.get("RETURN_TYPE", "")

            # Initialize package if needed
            if alias not in packages:
                packages[alias] = {
                    "name": alias,
                    "internal_name": pkg_name,
                    "procedures": OrderedDict()
                }

            # Create unique key for procedure (handles overloads)
            proc_key = proc_name

            # Initialize procedure if needed
            if proc_key not in packages[alias]["procedures"]:
                packages[alias]["procedures"][proc_key] = {
                    "label": f"{alias}.{proc_name}",
                    "detail": f"{pkg_name}.{proc_name}",
                    "kind": subprogram_type.lower() if subprogram_type else "procedure",
                    "returnType": return_type if return_type else None,
                    "arguments": []
                }

            # Add argument if present
            arg_name = row.get("ARGUMENT_NAME")
            if arg_name:
                data_type = row.get("DATA_TYPE", "")
                in_out = row.get("IN_OUT", "IN")
                position = int(row.get("POSITION", 0))

                # Avoid duplicate arguments (from multiple overloads in CSV)
                existing_args = packages[alias]["procedures"][proc_key]["arguments"]
                arg_exists = any(
                    a["name"] == arg_name and a["position"] == position
                    for a in existing_args
                )

                if not arg_exists:
                    existing_args.append({
                        "name": arg_name,
                        "type": data_type,
                        "direction": in_out,
                        "position": position
                    })

    # Build final JSON structure
    output = {"packages": []}

    for alias, pkg_data in packages.items():
        pkg_entry = {
            "name": pkg_data["name"],
            "procedures": []
        }

        for proc_name, proc_data in pkg_data["procedures"].items():
            # Sort arguments by position
            args = sorted(proc_data["arguments"], key=lambda a: a["position"])

            # Build signature
            if args:
                arg_strs = [
                    f"{a['name']} {a['direction']} {a['type']}"
                    for a in args
                ]
                args_part = ", ".join(arg_strs)
                signature = f"{proc_data['label']}({args_part})"
            else:
                signature = proc_data["label"]

            # Add RETURN clause for functions
            if proc_data["kind"] == "function" and proc_data["returnType"]:
                signature += f" RETURN {proc_data['returnType']}"

            proc_entry = {
                "label": proc_data["label"],
                "detail": proc_data["detail"],
                "kind": proc_data["kind"],
                "signature": signature
            }

            # Add returnType only for functions
            if proc_data["kind"] == "function" and proc_data["returnType"]:
                proc_entry["returnType"] = proc_data["returnType"]

            pkg_entry["procedures"].append(proc_entry)

        output["packages"].append(pkg_entry)

    # Write output JSON
    with open(JSON_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    # Print summary
    total_procs = sum(len(p["procedures"]) for p in output["packages"])
    func_count = sum(
        1 for p in output["packages"]
        for proc in p["procedures"]
        if proc["kind"] == "function"
    )
    proc_count = total_procs - func_count

    print(f"✔️ Generated {JSON_OUTPUT}")
    print(f"   Packages: {len(output['packages'])}")
    print(f"   Total: {total_procs} ({func_count} functions, {proc_count} procedures)")


if __name__ == "__main__":
    main()
