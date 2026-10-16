#!/usr/bin/env python3
"""Refresh the manifest and build a deterministic AA discovery pack zip."""

from __future__ import annotations

import hashlib
import subprocess
import sys
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ZIP_PATH = ROOT.parent / "aa-discovery-pack-v2.zip"
ZERO_HASH = "0" * 64


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def source_files() -> list[Path]:
    files = [
        path
        for path in ROOT.rglob("*")
        if path.is_file()
        and path.name not in {"MANIFEST.yaml", ".DS_Store"}
        and "__pycache__" not in path.parts
        and path.suffix != ".pyc"
    ]
    return [ROOT / "MANIFEST.yaml", *sorted(files, key=lambda path: path.relative_to(ROOT).as_posix())]


def role_for(relative: str) -> str:
    exact = {
        "MANIFEST.yaml": "manifest",
        "AGENTS.md": "system",
        "README.md": "instructions",
        "LICENCE.txt": "licence",
        "CHANGELOG.md": "changelog",
        "prompts/00-consent.md": "consent",
        "prompts/04-output-template.md": "output-template",
    }
    if relative in exact:
        return exact[relative]
    if relative.startswith("prompts/"):
        return "prompt"
    if relative.startswith("platform/"):
        return "platform"
    if relative.startswith("scripts/"):
        return "tool"
    if relative.startswith("examples/"):
        return "example"
    return "support"


def render_manifest(records: list[tuple[str, str, str]]) -> str:
    lines = [
        "pack: aa-discovery-pack",
        "version: 2.0.0",
        "owner: Advanced Analytica Ltd",
        "contact: jonathan@advancedanalytica.co.uk",
        "doors: [make, work]",
        "question_count: 10",
        "probe_limit_per_question: 1",
        "consent_option: B",
        'package_trigger: "package my answers"',
        "platforms: [chatgpt-project, chatgpt-custom-gpt, claude-project]",
        "files:",
    ]
    for path, role, digest in records:
        lines.extend((f"  - path: {path}", f"    role: {role}", f"    sha256: {digest}"))
    lines.extend(
        (
            "output:",
            "  format: markdown",
            "  template: prompts/04-output-template.md",
            '  filename_pattern: "{session_id}.md"',
            "  return_to: jonathan@advancedanalytica.co.uk",
        )
    )
    return "\n".join(lines) + "\n"


def refresh_manifest() -> list[Path]:
    files = source_files()
    records: list[tuple[str, str, str]] = []
    for path in files:
        relative = path.relative_to(ROOT).as_posix()
        digest = ZERO_HASH if relative == "MANIFEST.yaml" else sha256(path.read_bytes())
        records.append((relative, role_for(relative), digest))

    canonical = render_manifest(records).encode("utf-8")
    manifest_hash = sha256(canonical)
    final_records = [
        (path, role, manifest_hash if path == "MANIFEST.yaml" else digest)
        for path, role, digest in records
    ]
    (ROOT / "MANIFEST.yaml").write_text(render_manifest(final_records), encoding="utf-8")
    return source_files()


def write_zip(files: list[Path]) -> None:
    with zipfile.ZipFile(ZIP_PATH, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(files, key=lambda item: item.relative_to(ROOT).as_posix()):
            relative = path.relative_to(ROOT).as_posix()
            info = zipfile.ZipInfo(f"{ROOT.name}/{relative}", date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = (0o755 if path.suffix == ".py" else 0o644) << 16
            archive.writestr(info, path.read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)


def main() -> int:
    files = refresh_manifest()
    subprocess.run([sys.executable, str(ROOT / "scripts/validate_pack.py")], check=True)
    write_zip(files)
    print(f"Built {ZIP_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
