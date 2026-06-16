# News Monorepo

```text
apps/                          SvelteKit applications
services/news-pipeline/        Python source and URL discovery
packages/markdown-extraction/  Server-side URL-to-Markdown TypeScript package
infra/                         Reserved for later infrastructure configuration
```

Install JavaScript/TypeScript workspace dependencies:

```bash
bun install
```

Run the SvelteKit app:

```bash
bun run dev
```

Refresh Python sources and article URLs:

```bash
bun run pipeline
```

The default run has no source, route, or URL count limit. Timeout and request
delay settings still apply.

Limit the source domains analyzed:

```bash
bun run pipeline --sources 20
```

Run full source discovery but write only 20 article URLs:

```bash
bun run pipeline --urls 20
```

Limited URLs are selected round-robin across available sources. The extractor
tries to take one URL from each source before taking a second URL from any
source.

`--urls` does not reduce source-discovery work. To make a test discovery run
faster, also restrict candidate routes checked per domain:

```bash
bun run pipeline --sources 20 --urls 20 --max-routes-per-domain 10
```

Refresh URLs while reusing the current source discovery JSON:

```bash
bun run pipeline:urls
```

Run only source discovery:

```bash
bun run pipeline:sources
```

Check current JSON output counts without rewriting them:

```bash
bun run pipeline:check
```

Use the Markdown extractor from server-side SvelteKit code:

```ts
import { toMarkdown } from "@news/markdown-extraction";

const markdown = await toMarkdown(articleUrl);
```
