# Markdown Extraction

Server-side TypeScript package that fetches an article URL and converts the
article into Markdown.

The extractor tries:

1. Known Estonian public-sector selectors.
2. `@extractus/article-extractor`.
3. Mozilla Readability.
4. RSS/Atom content for feed-backed URL rows.

## Use

```ts
import { toMarkdown } from "@news/markdown-extraction";

const markdown = await toMarkdown(
  "https://example.ee/uudised/example-article",
);
```

Use `tryExtractArticle` to retain metadata and extraction errors:

```ts
import { tryExtractArticle } from "@news/markdown-extraction";

const { record, errors } = await tryExtractArticle({
  url: "https://example.ee/uudised/example-article",
  source_domain: "example.ee",
  source_name: "Example source",
});
```

## Use fetched pipeline URLs

The news pipeline writes its fetched article URL rows to:

```text
services/news-pipeline/extracting-urls/news_urls.json
```

Import the generated JSON from server-side code and pass a complete row to
the extractor. Adjust the relative JSON path for the location of the importing
file.

```ts
import { tryExtractArticle, type UrlRow } from "@news/markdown-extraction";
import fetchedUrls from "../../../../services/news-pipeline/extracting-urls/news_urls.json";

const urls = fetchedUrls as UrlRow[];
const { record, errors } = await tryExtractArticle(urls[0]);
```

Passing the complete row, rather than only `row.url`, retains fields such as
`source_domain`, `source_name`, and `route_url`. The extractor uses this
metadata in its output and for RSS/Atom fallback extraction.

To extract every fetched URL without sending all requests at once:

```ts
import { tryExtractArticle, type UrlRow } from "@news/markdown-extraction";
import fetchedUrls from "../../../../services/news-pipeline/extracting-urls/news_urls.json";

const results = [];

for (const row of fetchedUrls as UrlRow[]) {
  results.push(await tryExtractArticle(row));
}

const articles = results.flatMap(({ record }) => (record ? [record] : []));
const errors = results.flatMap((result) => result.errors);
```

Refresh the JSON before importing it with `bun run pipeline` from the
repository root, or `bun run pipeline:urls` to reuse the current source
discovery data.

Use this package only in server-side SvelteKit code, such as
`+page.server.ts`, `+server.ts`, or modules under `$lib/server`. Fetching and
parsing third-party pages should not run in the browser.
