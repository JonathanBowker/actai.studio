#!/usr/bin/env python3
"""Validate the AA discovery pack structure, content and manifest hashes."""

from __future__ import annotations

import hashlib
import importlib.util
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "MANIFEST.yaml"
ZERO_HASH = "0" * 64
REQUIRED_TOP_LEVEL = {
    "pack": "aa-discovery-pack",
    "version": "2.0.0",
    "question_count": "10",
    "probe_limit_per_question": "1",
    "consent_option": "B",
    "package_trigger": "package my answers",
}


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def canonical_manifest(data: bytes) -> bytes:
    text = data.decode("utf-8")
    pattern = r"(- path: MANIFEST\.yaml\n\s+role: manifest\n\s+sha256: )[0-9a-f]{64}"
    replaced, count = re.subn(pattern, rf"\g<1>{ZERO_HASH}", text)
    if count != 1:
        raise ValueError("MANIFEST.yaml must contain one canonical manifest entry")
    return replaced.encode("utf-8")


def parse_manifest(text: str) -> tuple[dict[str, str], list[dict[str, str]]]:
    top: dict[str, str] = {}
    files: list[dict[str, str]] = []
    current: dict[str, str] | None = None
    in_files = False

    for line in text.splitlines():
        if line == "files:":
            in_files = True
            continue
        if in_files and line.startswith("output:"):
            in_files = False
        if in_files:
            path_match = re.match(r"  - path: (.+)$", line)
            if path_match:
                current = {"path": path_match.group(1).strip().strip('"')}
                files.append(current)
                continue
            field_match = re.match(r"    (role|sha256): (.+)$", line)
            if field_match and current is not None:
                current[field_match.group(1)] = field_match.group(2).strip().strip('"')
            continue
        top_match = re.match(r"^([a-z_]+):\s*(.+)$", line)
        if top_match:
            top[top_match.group(1)] = top_match.group(2).strip().strip('"')
    return top, files


def pack_files() -> set[str]:
    return {
        path.relative_to(ROOT).as_posix()
        for path in ROOT.rglob("*")
        if path.is_file()
        and "__pycache__" not in path.parts
        and path.suffix != ".pyc"
        and path.name != ".DS_Store"
    }


def template_keys() -> tuple[str, ...]:
    template = (ROOT / "prompts/04-output-template.md").read_text(encoding="utf-8")
    return tuple(
        match.group(1)
        for line in template.splitlines()
        if (match := re.match(r"^([a-z][a-z0-9_]*):", line))
    )


def parser_keys() -> tuple[str, ...]:
    parser_path = ROOT / "scripts/parse_answers.py"
    sys.dont_write_bytecode = True
    spec = importlib.util.spec_from_file_location("aa_parse_answers", parser_path)
    if spec is None or spec.loader is None:
        raise RuntimeError("Could not load parse_answers.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return tuple(module.EXPECTED_KEYS)


def validate_questions(errors: list[str]) -> None:
    text = (ROOT / "prompts/02-questions.md").read_text(encoding="utf-8")
    sections = re.findall(r"^## Q(\d+)\n(.*?)(?=^## Q\d+\n|\Z)", text, re.MULTILINE | re.DOTALL)
    if [int(number) for number, _ in sections] != list(range(1, 11)):
        errors.append("Question file must contain Q1 through Q10 in order")
        return
    for number, body in sections:
        for field in ("QUESTION", "DESCRIPTOR", "PROBE_IF", "PROBE"):
            matches = re.findall(rf"^{field}:\s*(.*)$", body, re.MULTILINE)
            if len(matches) != 1 or not matches[0].strip():
                errors.append(f"Q{number} must contain exactly one non-empty {field} field")
        probe = re.search(r"^PROBE:\s*(.*)$", body, re.MULTILINE)
        if number == "10" and (probe is None or probe.group(1).strip() != "none"):
            errors.append("Q10 PROBE must be none")


def main() -> int:
    errors: list[str] = []
    if not MANIFEST.is_file():
        print("ERROR: MANIFEST.yaml is missing", file=sys.stderr)
        return 1

    manifest_bytes = MANIFEST.read_bytes()
    top, listed_entries = parse_manifest(manifest_bytes.decode("utf-8"))
    for key, expected in REQUIRED_TOP_LEVEL.items():
        if top.get(key) != expected:
            errors.append(f"Manifest {key} must be {expected!r}")

    listed_paths = {entry.get("path", "") for entry in listed_entries}
    actual_paths = pack_files()
    if listed_paths != actual_paths:
        for path in sorted(actual_paths - listed_paths):
            errors.append(f"File is not listed in manifest: {path}")
        for path in sorted(listed_paths - actual_paths):
            errors.append(f"Manifest lists missing file: {path}")

    for entry in listed_entries:
        relative = entry.get("path", "")
        expected_hash = entry.get("sha256", "")
        if not re.fullmatch(r"[0-9a-f]{64}", expected_hash):
            errors.append(f"Invalid hash for {relative}")
            continue
        path = ROOT / relative
        if not path.is_file():
            continue
        data = canonical_manifest(path.read_bytes()) if relative == "MANIFEST.yaml" else path.read_bytes()
        if sha256(data) != expected_hash:
            errors.append(f"Hash mismatch: {relative}")

    validate_questions(errors)

    consent = (ROOT / "prompts/00-consent.md").read_text(encoding="utf-8")
    consent_match = re.search(r"^CONSENT_OPTION:\s*(A|B)$", consent, re.MULTILINE)
    if consent_match is None or consent_match.group(1) != top.get("consent_option"):
        errors.append("Consent file does not match manifest consent_option")

    if template_keys() != parser_keys():
        errors.append("Output template keys do not match parse_answers.py EXPECTED_KEYS")

    trigger = top.get("package_trigger", "")
    for relative in ("AGENTS.md", "prompts/03-close.md"):
        if trigger not in (ROOT / relative).read_text(encoding="utf-8"):
            errors.append(f"Package trigger is missing from {relative}")

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"Pack valid: {len(actual_paths)} files, 10 questions, consent option B")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
