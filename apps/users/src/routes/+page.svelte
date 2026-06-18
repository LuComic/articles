<script lang="ts">
	import AsbstractImage from '$lib/components/AsbstractImage.svelte';
	import {
		ANDMED,
		DEFAULT_COLORS,
		KLIIMA,
		MAJANDUS,
		RAHANDUS,
		TURVALISUS,
		VALITSUS
	} from '$lib/colors.js';
	import type { PageProps } from './$types.js';

	let { data }: PageProps = $props();
	let failedImages = $state(new Set<string>());

	const showImage = (url: string | null): url is string => Boolean(url && !failedImages.has(url));

	function markImageFailed(url: string) {
		failedImages = new Set([...failedImages, url]);
	}

	const recentTopic = 'Hiljutine';
	let selectedTopic = $state('Hiljutine');
	let topicBarWidth = $state(0);
	const topics = [
		recentTopic,
		'Valitsus',
		'Rahandus',
		'Majandus',
		'Kliima',
		'Turvalisus',
		'Andmed'
	];

	const topicButtonColumns = $derived(topicBarWidth < 520 ? 4 : topicBarWidth < 800 ? 5 : 6);
	const topicTileIndexes = $derived(
		Array.from({ length: topicButtonColumns * 2 }, (_, index) => index)
	);

	function colorsForTopicButton(topic: string): string[] {
		const normalized = topic.toLocaleLowerCase('et-EE');

		if (normalized.includes('rahandus')) return RAHANDUS;
		if (normalized.includes('majandus')) return MAJANDUS;
		if (normalized.includes('kliima')) return KLIIMA;
		if (normalized.includes('turvalisus')) return TURVALISUS;
		if (normalized.includes('andmed')) return ANDMED;
		if (normalized.includes('valitsus')) return VALITSUS;

		return DEFAULT_COLORS;
	}

	function topicTileColor(topic: string, index: number): string {
		const palette = colorsForTopicButton(topic);

		return palette[topicTilePaletteIndex(topic, index, palette.length)];
	}

	function topicTilePaletteIndex(topic: string, index: number, paletteLength: number): number {
		let seed = 0;

		for (let charIndex = 0; charIndex < topic.length; charIndex += 1) {
			seed = Math.imul(seed ^ topic.charCodeAt(charIndex), 2654435761);
		}

		let mixed = Math.imul(seed + index * 1013904223, 2246822519);
		mixed ^= mixed >>> 15;

		return Math.abs(mixed) % paletteLength;
	}
</script>

<div class="dashboard min-h-screen bg-(--paper) text-(--ink)">
	<div class="mx-auto w-full max-w-7xl px-4 py-5 pb-10 md:w-4/5 md:px-0">
		<header
			class="grid min-h-14 grid-cols-1 items-center gap-4 border-b border-(--line) pb-4 md:grid-cols-[auto_1fr] md:gap-6 md:pb-0"
		>
			<div class="display-font text-xl font-medium">Uudiste ülevaade</div>
			<input
				type="text"
				class="hidden h-9 items-center rounded border border-(--line) px-3 text-sm text-(--muted) focus:ring-2 focus:ring-blue-200/75 focus:ring-offset-0 focus:outline-none md:flex"
				placeholder="Otsi teemasid, uudiseid, märksõnu..."
			/>
		</header>

		<section
			class="sticky top-0 left-0 z-10 flex w-full items-center justify-between border-b border-(--line)"
			bind:clientWidth={topicBarWidth}
		>
			{#each topics as topic, index (topic)}
				<button
					class={`relative w-full overflow-hidden px-2 py-1 font-medium ${
						selectedTopic === topic
							? `${topic !== recentTopic ? 'text-white' : 'bg-(--ink) text-white'}`
							: 'bg-(--paper)'
					}
							${index === 0 ? 'border-l' : ''} border-r border-(--line)
					`}
					type="button"
					onclick={() => {
						selectedTopic = topic;
					}}
				>
					{#if selectedTopic === topic && topic !== recentTopic}
						<div
							class="absolute inset-0 grid grid-rows-2"
							style:grid-template-columns={`repeat(${topicButtonColumns}, minmax(0, 1fr))`}
							aria-hidden="true"
						>
							{#each topicTileIndexes as tileIndex (tileIndex)}
								<div style:background-color={topicTileColor(topic, tileIndex)}></div>
							{/each}
						</div>
						<span class="relative px-2 backdrop-blur-2xl">{topic}</span>
					{:else}
						<span class="relative">{topic}</span>
					{/if}
				</button>
			{/each}
		</section>

		<section class="w-full border-b border-(--line) py-7">
			<h1 class="display-font text-4xl font-medium md:text-5xl">
				Avaliku sektori aktuaalsed ja usaldusväärsed uudised käeulatuses.
			</h1>
		</section>

		<main class="grid grid-cols-1 gap-7 pt-7 lg:grid-cols-[1fr_320px]">
			<section class="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
				<article
					class="grid content-start border-b border-(--line) pb-5 sm:col-span-2 sm:row-span-2"
				>
					{#if data.lead}
						{#if showImage(data.lead.imageUrl)}
							<img
								class="mb-3 aspect-[1.18] w-full rounded border border-(--line) object-cover"
								src={data.lead.imageUrl}
								alt=""
								onerror={() => markImageFailed(data.lead?.imageUrl ?? '')}
							/>
						{:else}
							<AsbstractImage class="mb-3 aspect-[1.18]" topic={data.lead.topic} />
						{/if}
						<h2 class="display-font mb-3 text-3xl font-medium md:text-4xl">
							<a class="hover:underline hover:underline-offset-4" href={data.lead.url}>
								<span class="underline underline-offset-4">Hiljutine: </span>
								{data.lead.title}
							</a>
						</h2>
						<p class="text-(--muted)">{data.lead.summary}</p>
						<div class="published mt-4">{data.lead.publishedLabel}</div>
					{:else}
						<h2 class="display-font mb-3 text-3xl font-medium md:text-4xl">
							Väljavõetud uudiseid pole veel saadaval
						</h2>
						<p class="text-(--muted)">
							Kui väljavõtja tagastab uudised, liigub siia kõige hilisema avaldamisajaga lugu.
						</p>
						<div class="published mt-4">Avaldamisaeg puudub</div>
					{/if}
				</article>

				{#each data.latest as item (item.url)}
					<article class="grid min-h-60 content-start border-b border-(--line) pb-5">
						{#if showImage(item.imageUrl)}
							<img
								class="mb-3 aspect-square w-full rounded border border-(--line) object-cover"
								src={item.imageUrl}
								alt=""
								onerror={() => markImageFailed(item.imageUrl ?? '')}
							/>
						{:else}
							<AsbstractImage class="mb-3 aspect-square" topic={item.topic} />
						{/if}
						<div class="meta mb-2">{item.topic}</div>
						<h3 class="display-font text-lg font-medium">
							<a class="hover:underline hover:underline-offset-4" href={item.url}>{item.title}</a>
						</h3>
						<div class="mt-2.5 text-sm text-(--muted)">
							{item.sourceName} | {item.readMinutes} min lugemist
						</div>
					</article>
				{/each}
			</section>

			<aside class="border-(--line) lg:border-l lg:pl-7">
				<div class="meta">Veel uudiseid</div>
				{#each data.randomNews as item (item.url)}
					<article class="flex flex-col gap-2 border-b border-(--line) py-4">
						<h3 class="display-font text-lg font-medium">
							<a class="hover:underline hover:underline-offset-4" href={item.url}>{item.title}</a>
						</h3>
						<div class="text-sm text-(--muted)">{item.sourceName}</div>
					</article>
				{/each}

				{#if data.errors.length}
					<div class="mt-6 border-t border-(--line) pt-5">
						<div class="meta mb-2">Väljavõtte märkused</div>
						<p class="text-(--muted)">
							Selle ülevaate koostamisel tagastas väljavõtja {data.errors.length} teadet.
						</p>
					</div>
				{/if}
			</aside>
		</main>
	</div>
</div>
