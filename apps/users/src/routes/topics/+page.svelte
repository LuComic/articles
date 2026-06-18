<script lang="ts">
	import AbstractBanner from '$lib/components/AbstractBanner.svelte';
	import AsbstractImage from '$lib/components/AsbstractImage.svelte';
	import TopicList from '$lib/components/TopicList.svelte';
	import type { PageProps } from './$types.js';

	let { data }: PageProps = $props();
	let failedImages = $state(new Set<string>());

	const shownArticles = $derived(data.articles);

	const showImage = (url: string | null): url is string => Boolean(url && !failedImages.has(url));

	function markImageFailed(url: string) {
		failedImages = new Set([...failedImages, url]);
	}
</script>

{#if data.topic === null}
	<TopicList />
{:else}
	<section class="py-5">
		<AbstractBanner topic={data.topic} />
	</section>

	<section class="flex flex-col gap-4 pb-8">
		{#each shownArticles as article, index (article.final_url || article.url)}
			<a
				class="grid grid-cols-[auto_1fr] gap-2 py-2 hover:bg-(--hover-gray)"
				href={article.final_url || article.url}
			>
				{#if showImage(data.articleImages[index])}
					<img
						class="h-full max-h-36 w-auto max-w-40 rounded object-cover"
						src={data.articleImages[index]}
						alt=""
						onerror={() => markImageFailed(data.articleImages[index] ?? '')}
					/>
				{:else}
					<div class="h-full max-h-36 w-40">
						<AsbstractImage class="h-full w-full" topic={data.topic} />
					</div>
				{/if}
				<div class="flex flex-col gap-2">
					<div class="meta">
						{article.source_name ?? article.source_domain ?? 'Tundmatu allikas'}
					</div>
					<h2 class="display-font text-xl">
						{article.title ?? 'Pealkirjata avalik teade'}
					</h2>
					{#if article.lead}
						<p class="text-sm text-(--muted)">{article.lead}</p>
					{/if}
					<div class="published">{article.published_at ?? 'Avaldamisaeg puudub'}</div>
				</div>
			</a>
		{:else}
			<article class="border-b border-(--line) pb-5 sm:col-span-2 lg:col-span-3">
				<h2 class="display-font text-2xl font-medium">Uudiseid pole veel saadaval</h2>
				<p class="mt-2 text-(--muted)">
					Kui väljavõtja tagastab uudised, ilmuvad selle teema alla hiljutised lood.
				</p>
			</article>
		{/each}
	</section>

	{#if data.errors.length}
		<section class="border-t border-(--line) py-5">
			<div class="meta mb-2">Väljavõtte märkused</div>
			<p class="text-(--muted)">
				Selle ülevaate koostamisel tagastas väljavõtja {data.errors.length} teadet.
			</p>
		</section>
	{/if}
{/if}
