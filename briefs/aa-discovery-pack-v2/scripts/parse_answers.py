#!/usr/bin/env python3
"""Parse returned AA discovery answer files into grouped JSON."""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path


EXPECTED_KEYS = (
    "session_id",
    "name",
    "role",
    "business",
    "door",
    "consent",
    "opener_answer",
    "q1_goal",
    "q2_six_months",
    "q3_metric",
    "q4_owner_and_signoff",
    "q5_information_location",
    "q6_rules",
    "q7_systems_and_constraints",
    "q8_team_and_tacit_knowledge",
    "q9_first_version",
    "q10_blockers",
    "probes_used",
    "completed_at",
)

KEY_RE = re.compile(r"^([a-z][a-z0-9_]*):\s*(.*)$")


def answer_files(inputs: list[Path]) -> list[Path]:
    files: set[Path] = set()
    for item in inputs:
        if item.is_dir():
            files.update(path for path in item.glob("*.md") if path.is_file())
        elif item.is_file():
            files.add(item)
        else:
            raise FileNotFoundError(f"Not found: {item}")
    return sorted(files)


def parse_file(path: Path) -> tuple[dict[str, object], list[str]]:
    record: dict[str, str] = {}
    current_key: str | None = None

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        match = KEY_RE.match(raw_line)
        if match and match.group(1) in EXPECTED_KEYS:
            current_key = match.group(1)
            record[current_key] = match.group(2).strip()
        elif current_key and raw_line.strip() and not raw_line.startswith("#"):
            record[current_key] = f"{record[current_key]} {raw_line.strip()}".strip()

    warnings: list[str] = []
    for key in EXPECTED_KEYS:
        if key not in record:
            warnings.append(f"{path.name}: missing key {key}")
        elif not record[key]:
            warnings.append(f"{path.name}: empty answer {key}")

    result: dict[str, object] = {key: record.get(key, "") for key in EXPECTED_KEYS}
    probes = str(result["probes_used"])
    numbers = [int(value) for value in re.findall(r"\d+", probes)]
    result["probes_used"] = numbers
    result["source_file"] = path.name
    return result, warnings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("inputs", nargs="+", type=Path)
    parser.add_argument("-o", "--output", type=Path)
    args = parser.parse_args()

    try:
        files = answer_files(args.inputs)
    except FileNotFoundError as error:
        print(error, file=sys.stderr)
        return 2

    if not files:
        print("No markdown answer files found.", file=sys.stderr)
        return 2

    groups: defaultdict[str, list[dict[str, object]]] = defaultdict(list)
    warnings: list[str] = []
    for path in files:
        record, record_warnings = parse_file(path)
        business = str(record.get("business") or "Unspecified")
        groups[business].append(record)
        warnings.extend(record_warnings)

    payload = {
        "record_count": len(files),
        "groups": dict(sorted(groups.items())),
        "warnings": warnings,
    }
    rendered = json.dumps(payload, indent=2, ensure_ascii=False) + "\n"
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
    else:
        print(rendered, end="")

    for warning in warnings:
        print(f"WARNING: {warning}", file=sys.stderr)
    return 1 if warnings else 0


if __name__ == "__main__":
    raise SystemExit(main())
