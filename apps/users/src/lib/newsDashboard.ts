import type { ArticleRecord, ExtractionError, UrlRow } from '@news/markdown-extraction';

export type NewsCard = {
	title: string;
	summary: string;
	sourceName: string;
	sourceDomain: string;
	publishedAt: string | null;
	publishedLabel: string;
	url: string;
	imageUrl: string | null;
	readMinutes: number;
	topic: string;
};

export type DashboardData = {
	lead: NewsCard | null;
	fourCategories: string[];
	latest: NewsCard[];
	randomNews: NewsCard[];
	errors: ExtractionError[];
	status: {
		activeItems: number;
		delayedItems: number;
		onTrackItems: number;
		needsConfirmation: number;
	};
};

export type ArticleWithRow = {
	article: ArticleRecord;
	row: UrlRow;
};

const FALLBACK_TOPICS = ['Valitsus', 'Kliima', 'Majandus', 'Turvalisus', 'Andmed', 'Poliitika'];

export function buildDashboardData(
	items: ArticleWithRow[],
	rows: UrlRow[],
	errors: ExtractionError[]
): DashboardData {
	const cards = items.map(({ article, row }, index) => toCard(article, row, index));
	const publishableCards = cards.filter((card) => timestamp(card.publishedAt) > 0);
	const sorted = [...publishableCards].sort(
		(a, b) => timestamp(b.publishedAt) - timestamp(a.publishedAt)
	);
	const lead = sorted[0] ?? null;
	const latest = [...cards]
		.filter((card) => card.url !== lead?.url)
		.sort((a, b) => timestamp(b.publishedAt) - timestamp(a.publishedAt))
		.slice(0, 4);
	const fourCategories = distinctSourceNames(cards, rows).slice(0, 4);
	const randomNews = shuffle(cards.filter((card) => card.url !== lead?.url)).slice(0, 3);

	return {
		lead,
		fourCategories,
		latest,
		randomNews,
		errors,
		status: {
			activeItems: cards.length,
			delayedItems: errors.length,
			onTrackItems: Math.max(cards.length - errors.length, 0),
			needsConfirmation: rows.length - cards.length
		}
	};
}

function toCard(article: ArticleRecord, row: UrlRow | undefined, index: number): NewsCard {
	const sourceName =
		article.source_name || row?.source_name || article.source_domain || 'Tundmatu allikas';
	const sourceDomain = article.source_domain || row?.source_domain || new URL(article.url).hostname;
	const publishedAt = article.published_at || row?.discovered_published_at || null;

	return {
		title: article.title || row?.discovered_title || 'Pealkirjata avalik teade',
		summary: summaryFor(article),
		sourceName,
		sourceDomain,
		publishedAt,
		publishedLabel: formatPublishedAt(publishedAt),
		url: article.final_url || article.url,
		imageUrl: firstValidImage(article),
		readMinutes: Math.max(1, Math.ceil(article.body_text.length / 900)),
		topic: topicFor(sourceName, sourceDomain, index)
	};
}

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

function summaryFor(article: ArticleRecord): string {
	if (article.lead) return article.lead;

	const firstParagraph = article.body_text
		.split(/\n{2,}/)
		.map((part) => part.trim())
		.find(Boolean);

	if (!firstParagraph) return 'Avalik teade, mille allikamaterjal on ülevaatamiseks valmis.';

	return firstParagraph.length > 190 ? `${firstParagraph.slice(0, 187).trim()}...` : firstParagraph;
}

function distinctSourceNames(cards: NewsCard[], rows: UrlRow[]): string[] {
	const names = [
		...cards.map((card) => card.sourceName),
		...rows.map((row) => row.source_name).filter((name) => typeof name === 'string')
	];

	return [...new Set(names)].filter(Boolean);
}

function formatPublishedAt(value: string | null): string {
	if (!value) return 'Avaldamisaeg puudub';

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;

	return new Intl.DateTimeFormat('et-EE', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(date);
}

function timestamp(value: string | null): number {
	if (!value) return 0;

	const parsed = Date.parse(value);
	return Number.isNaN(parsed) ? 0 : parsed;
}

function topicFor(sourceName: string, sourceDomain: string, index: number): string {
	const text = `${sourceName} ${sourceDomain}`.toLowerCase();

	if (text.includes('kliima') || text.includes('environment')) return 'Kliima';
	if (text.includes('fin') || text.includes('rahandus')) return 'Majandus';
	if (text.includes('politsei') || text.includes('safety')) return 'Turvalisus';
	if (text.includes('digi') || text.includes('data')) return 'Andmed';
	if (text.includes('valitsus') || text.includes('ministeerium')) return 'Valitsus';

	return FALLBACK_TOPICS[index % FALLBACK_TOPICS.length];
}

function shuffle<T>(items: T[]): T[] {
	const copy = [...items];

	for (let index = copy.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
	}

	return copy;
}
