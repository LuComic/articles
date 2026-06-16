# News Pipeline

Python service for:

1. Discovering Estonian public-sector news sources and routes.
2. Extracting normalized article URLs into JSON.

It does not extract article bodies or create Markdown. Article-to-Markdown
conversion lives in `packages/markdown-extraction`.

## Setup

```bash
cd services/news-pipeline
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
```

## Run

Refresh sources and URLs:

```bash
python3 run_pipeline.py
```

By default there is no source-domain, route, or URL count limit. Network
timeouts and request delays still apply.

Find 20 usable source domains while still extracting URLs. Domains that fail
or have no valid news routes do not count toward the limit:

```bash
python3 run_pipeline.py --sources 20
```

Discover all configured sources but write only 20 article URLs:

```bash
python3 run_pipeline.py --urls 20
```

Limited URL output is selected round-robin across sources: one URL per source
before a second URL is taken from any source. If fewer usable sources are found
than requested URLs, sources can therefore appear more than once, but article
URLs remain unique.

`--urls` only limits URL output. Source discovery still probes routes for every
selected domain. For faster test runs, cap route candidates too:

```bash
python3 run_pipeline.py \
  --sources 20 \
  --urls 20 \
  --max-routes-per-domain 10
```

Reuse the current source discovery JSON and refresh only article URLs:

```bash
python3 run_pipeline.py --skip-source-finding
```

Run only source discovery:

```bash
python3 run_pipeline.py --sources-only
```

Check existing output counts without writing:

```bash
python3 run_pipeline.py --check
```

Outputs:

```text
finding-sources/public_sector_sources.json
extracting-urls/news_urls.json
extracting-urls/errors.json
```
