#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def run(command: list[str]) -> None:
    print("+", " ".join(command))
    subprocess.run(command, cwd=ROOT, check=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Discover public-sector sources and extract article URLs."
    )
    parser.add_argument("--skip-source-finding", action="store_true")
    parser.add_argument(
        "--sources",
        type=int,
        default=None,
        metavar="NUMBER",
        help=(
            "Find this many usable source domains. Failed or non-news domains "
            "do not count toward the limit."
        ),
    )
    parser.add_argument(
        "--urls",
        type=int,
        default=None,
        metavar="NUMBER",
        help="Limit how many unique article URLs are written.",
    )
    parser.add_argument(
        "--sources-only",
        action="store_true",
        help="Run source discovery without URL extraction.",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Read existing JSON outputs and print counts without writing.",
    )
    parser.add_argument("--timeout", type=int, default=25)
    parser.add_argument("--delay", type=float, default=0.35)
    parser.add_argument(
        "--max-routes-per-domain",
        type=int,
        default=None,
        help=(
            "Limit candidate routes checked per domain. Omitted means no limit; "
            "use this to make source discovery substantially faster."
        ),
    )
    parser.add_argument("--include-data-portal", action="store_true")
    parser.add_argument("--no-riha", action="store_true")
    return parser.parse_args()


def load_json_array(path: Path) -> list[object]:
    if not path.exists():
        raise FileNotFoundError(f"Missing {path.relative_to(ROOT)}")
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, list):
        raise ValueError(f"Expected a JSON array in {path.relative_to(ROOT)}")
    return value


def check_outputs() -> int:
    source_path = ROOT / "finding-sources/public_sector_sources.json"
    urls_path = ROOT / "extracting-urls/news_urls.json"
    errors_path = ROOT / "extracting-urls/errors.json"

    try:
        source_data = json.loads(source_path.read_text(encoding="utf-8"))
        if not isinstance(source_data, dict):
            raise ValueError("Source output must be a JSON object")
        sources = source_data.get("sources")
        if not isinstance(sources, list):
            raise ValueError("Source output is missing a sources array")
        routes = sum(
            len(source.get("articles_news_routes", []))
            for source in sources
            if isinstance(source, dict)
        )
        urls = load_json_array(urls_path)
        errors = load_json_array(errors_path) if errors_path.exists() else []
    except (FileNotFoundError, json.JSONDecodeError, ValueError) as exc:
        print(f"Pipeline check failed: {exc}", file=sys.stderr)
        return 1

    print("Pipeline output check")
    print(f"  Sources: {len(sources)}")
    print(f"  News/article routes: {routes}")
    print(f"  Article URLs: {len(urls)}")
    print(f"  URL extraction errors: {len(errors)}")
    print("  Status: OK" if sources and urls else "  Status: EMPTY")
    return 0 if sources and urls else 1


def main() -> int:
    args = parse_args()
    sources = "finding-sources/public_sector_sources.json"

    if args.check:
        return check_outputs()

    if not args.skip_source_finding:
        command = [
            sys.executable,
            "finding-sources/discover_public_sector_sources.py",
            "--output",
            sources,
            "--timeout",
            str(args.timeout),
        ]
        if args.sources is not None:
            command.extend(["--max-domains", str(args.sources)])
        if args.max_routes_per_domain is not None:
            command.extend(
                ["--max-routes-per-domain", str(args.max_routes_per_domain)]
            )
        if args.include_data_portal:
            command.append("--include-data-portal")
        if args.no_riha:
            command.append("--no-include-riha")
        run(command)
    else:
        print("Skipping source finding")

    if args.sources_only:
        print("Skipping URL extraction")
        return 0

    source_path = ROOT / sources
    if not source_path.exists():
        print(
            "Source JSON is missing. Run `bun run pipeline:sources` first or "
            "remove --skip-source-finding.",
            file=sys.stderr,
        )
        return 1

    command = [
        sys.executable,
        "extracting-urls/extract_news_urls.py",
        "--sources",
        sources,
        "--output",
        "extracting-urls/news_urls.json",
        "--errors",
        "extracting-urls/errors.json",
        "--timeout",
        str(args.timeout),
        "--delay",
        str(args.delay),
    ]
    if args.urls is not None:
        command.extend(["--limit", str(args.urls)])
    run(command)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
