<script lang="ts">
	import {
		ANDMED,
		DEFAULT_COLORS,
		HILJUTINE,
		KLIIMA,
		MAJANDUS,
		RAHANDUS,
		TURVALISUS,
		VALITSUS
	} from '$lib/colors.js';

	const recentTopic = 'Hiljutine';
	let selectedTopic = $state('Hiljutine');
	let topicBarWidth = $state(0);
	let selectedTopicWidth = $state(0);
	let selectedTopicHeight = $state(0);
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
	const topicTileWidth = $derived(
		selectedTopicWidth > 0 ? Math.ceil(selectedTopicWidth / topicButtonColumns) : 0
	);
	const topicTileHeight = $derived(
		selectedTopicHeight > 0 ? Math.ceil(selectedTopicHeight / 2) : 0
	);
	const topicGridColumns = $derived(
		topicTileWidth > 0
			? `repeat(${topicButtonColumns}, ${topicTileWidth}px)`
			: `repeat(${topicButtonColumns}, minmax(0, 1fr))`
	);
	const topicGridRows = $derived(
		topicTileHeight > 0 ? `repeat(2, ${topicTileHeight}px)` : 'repeat(2, minmax(0, 1fr))'
	);
	const topicTileIndexes = $derived(
		Array.from({ length: topicButtonColumns * 2 }, (_, index) => index)
	);

	function colorsForTopicButton(topic: string): string[] {
		const normalized = topic.toLocaleLowerCase('et-EE');

		if (normalized.includes('hiljutine')) return HILJUTINE;
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

	function hrefForTopic(topic: string): string {
		if (topic === recentTopic) return '/topics';

		return `/topics?topic=${topic.toLocaleLowerCase('et-EE')}`;
	}
</script>

<section
	class="sticky top-0 left-0 z-10 flex w-full snap-x items-center overflow-x-auto border-b border-(--line) md:overflow-visible"
	bind:clientWidth={topicBarWidth}
>
	{#each topics as topic, index (topic)}
		<a
			class={`relative min-w-max flex-none snap-start overflow-hidden px-4 py-1 text-center font-medium whitespace-nowrap md:w-full md:flex-1 md:px-2 ${
				selectedTopic === topic ? 'text-white' : 'bg-(--paper)'
			}
							${index === 0 ? 'border-l' : ''} border-r border-(--line)
					`}
			href={hrefForTopic(topic)}
			onclick={() => {
				selectedTopic = topic;
			}}
		>
			{#if selectedTopic === topic}
				<div
					class="absolute inset-0 grid grid-rows-2"
					bind:clientWidth={selectedTopicWidth}
					bind:clientHeight={selectedTopicHeight}
					style:grid-template-columns={topicGridColumns}
					style:grid-template-rows={topicGridRows}
					aria-hidden="true"
				>
					{#each topicTileIndexes as tileIndex (tileIndex)}
						<div class="topic-tile" style:background-color={topicTileColor(topic, tileIndex)}></div>
					{/each}
				</div>
				<span class="relative px-2 backdrop-blur-2xl">{topic}</span>
			{:else}
				<span class="relative">{topic}</span>
			{/if}
		</a>
	{/each}
</section>

<style>
	.topic-tile {
		width: 100%;
		height: 100%;
	}
</style>
