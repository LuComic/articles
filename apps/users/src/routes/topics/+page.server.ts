import type { PageServerLoad } from './$types.js';
import { tryExtractArticle, type ArticleRecord, type UrlRow } from '@news/markdown-extraction';
import fetchedUrls from '../../../../../services/news-pipeline/extracting-urls/news_urls.json' with { type: 'json' };

const TOPICS: Record<string, string> = {
	valitsus: 'Valitsus',
	rahandus: 'Rahandus',
	andmed: 'Andmed',
	kliima: 'Kliima',
	majandus: 'Majandus',
	turvalisus: 'Turvalisus'
};

export const load: PageServerLoad = async ({ url }) => {
	const topicSlug = url.searchParams.get('topic');
	const topic = topicSlug ? (TOPICS[topicSlug] ?? null) : null;

	if (!topic) {
		return {
			topic,
			articles: [],
			articleImages: [],
			errors: []
		};
	}

	const rows = (fetchedUrls as UrlRow[]).slice(0, 16);
	const results = [];

	for (const row of rows) {
		results.push(await tryExtractArticle(row));
	}

	const articles = results.flatMap(({ record }) => (record ? [record] : []));
	const articleImages = articles.map((article) => firstValidImage(article));
	const errors = results.flatMap((result) => result.errors);

	return {
		topic,
		articles,
		articleImages,
		errors
	};
};

function firstValidImage(article: ArticleRecord): string | null {
	for (const candidate of article.images) {
		if (typeof candidate !== 'string') continue;
		if (isValidImageUrl(candidate)) return candidate;
	}

	return null;
}

function isValidImageUrl(value: string): boolean {
	try {
		const url = new URL(value);
		if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

		const pathname = url.pathname.toLowerCase();
		if (!pathname.includes('.')) return true;

		return /\.(avif|gif|jpe?g|png|webp)$/.test(pathname);
	} catch {
		return false;
	}
}
