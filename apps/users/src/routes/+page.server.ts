import type { PageServerLoad } from './$types.js';
import { tryExtractArticle, type UrlRow } from '@news/markdown-extraction';
import fetchedUrls from '../../../../services/news-pipeline/extracting-urls/news_urls.json' with { type: 'json' };

export const load: PageServerLoad = async () => {
	const results = [];

	for (const row of fetchedUrls.slice(0, 10) as UrlRow[]) {
		results.push(await tryExtractArticle(row));
	}

	const articles = results.flatMap(({ record }) => (record ? [record] : []));
	const errors = results.flatMap((result) => result.errors);

	return {
		articles: articles,
		errors: errors
	};
};
