<script lang="ts">
	import {
		ANDMED,
		DEFAULT_COLORS,
		KLIIMA,
		MAJANDUS,
		RAHANDUS,
		TURVALISUS,
		VALITSUS
	} from '$lib/colors.js';

	type Props = {
		topic?: string | null;
		class?: string;
	};

	export function colorsForTopic(topic: string | null | undefined): string[] {
		const normalized = topic?.toLocaleLowerCase('et-EE') ?? '';

		if (normalized.includes('rahandus')) return RAHANDUS;
		if (normalized.includes('majandus')) return MAJANDUS;
		if (normalized.includes('kliima')) return KLIIMA;
		if (normalized.includes('turvalisus') || normalized.includes('politsei')) return TURVALISUS;
		if (normalized.includes('andmed') || normalized.includes('digi')) return ANDMED;
		if (normalized.includes('valitsus') || normalized.includes('poliitika')) return VALITSUS;

		return DEFAULT_COLORS;
	}

	let { topic = null, class: className = '' }: Props = $props();

	let width = $state(0);
	let height = $state(0);
	let tileColors = $state<string[]>([]);
	let tileCornerClasses = $state<string[]>([]);

	const columns = $derived(width > 0 ? Math.max(10, Math.round(width / 28)) : 16);
	const rows = $derived(
		width > 0 && height > 0 ? Math.max(2, Math.round((columns * height) / width)) : 6
	);
	const tileWidth = $derived(width > 0 ? Math.ceil(width / columns) : 0);
	const tileHeight = $derived(height > 0 ? Math.ceil(height / rows) : 0);
	const gridColumns = $derived(
		tileWidth > 0 ? `repeat(${columns}, ${tileWidth}px)` : `repeat(${columns}, minmax(0, 1fr))`
	);
	const gridRows = $derived(
		tileHeight > 0 ? `repeat(${rows}, ${tileHeight}px)` : `repeat(${rows}, minmax(0, 1fr))`
	);
	const tileCount = $derived(columns * rows);
	const tiles = $derived(Array.from({ length: tileCount }));
	const randomCornerClasses = [
		'rounded-tl-full',
		'rounded-tr-full',
		'rounded-bl-full',
		'rounded-br-full'
	];

	$effect(() => {
		const palette = colorsForTopic(topic);
		tileColors = Array.from(
			{ length: tileCount },
			(_, index) => palette[index % palette.length]
		).sort(() => Math.random() - 0.5);
		tileCornerClasses = Array.from(
			{ length: tileCount },
			() => randomCornerClasses[Math.floor(Math.random() * randomCornerClasses.length)]
		);
	});
</script>

<div
	class={`abstract-banner relative block w-full overflow-hidden rounded-sm ${className}`}
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	<div
		class="absolute inset-0 grid"
		style:grid-template-columns={gridColumns}
		style:grid-template-rows={gridRows}
	>
		{#each tiles as _, i (i)}
			<div
				class={`abstract-tile ${tileCornerClasses[i]}`}
				style:background-color={tileColors[i]}
			></div>
		{/each}
	</div>
	<div class="absolute inset-0 grid place-items-center">
		<span
			class="topic-label display-font px-4 py-2 text-center text-2xl font-medium capitalize backdrop-blur-sm md:text-4xl"
		>
			{topic}
		</span>
	</div>
</div>

<style>
	.abstract-banner {
		min-height: 100px;
		height: min(32vw, 200px);
	}

	.abstract-tile {
		width: 100%;
		height: 100%;
	}

	.topic-label {
		max-width: min(90%, 900px);
		background: color-mix(in srgb, white 34%, transparent);
	}
</style>
