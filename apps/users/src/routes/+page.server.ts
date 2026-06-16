import type { PageServerLoad } from './$types.js';
import { tryExtractArticle, type UrlRow } from '@news/markdown-extraction';
import { buildDashboardData } from '$lib/newsDashboard.js';
import fetchedUrls from '../../../../services/news-pipeline/extracting-urls/news_urls.json' with { type: 'json' };

export const load: PageServerLoad = async () => {
	const rows = (fetchedUrls as UrlRow[]).slice(0, 16);
	const results = await Promise.all(rows.map((row) => tryExtractArticle(row)));

	const articles = results.flatMap(({ record }, index) =>
		record ? [{ article: record, row: rows[index] }] : []
	);
	const errors = results.flatMap((result) => result.errors);

	return buildDashboardData(articles, rows, errors);
};
