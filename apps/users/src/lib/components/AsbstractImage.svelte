<script lang="ts">
	import {
		ANDMED,
		DEFAULT_COLORS,
		KLIIMA,
		MAJANDUS,
		RAHANDUS,
		TURVALISUS,
		VALITSUS,
		CORNER_CLASSES
	} from '$lib/colors.js';

	type Props = {
		topic?: string | null;
		rounding?: string;
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

	let { topic = null, rounding = '', class: className = '' }: Props = $props();

	let width = $state(0);
	let height = $state(0);
	let tileColors = $state<string[]>([]);

	const columns = $derived(width < 150 ? 10 : width < 260 ? 12 : width < 420 ? 14 : 16);
	const rows = $derived(
		width > 0 && height > 0 ? Math.max(2, Math.floor((columns * height) / width)) : columns
	);
	const tileCount = $derived(columns * rows);
	const tiles = $derived(Array.from({ length: tileCount }));

	$effect(() => {
		const palette = colorsForTopic(topic);
		tileColors = Array.from(
			{ length: tileCount },
			(_, index) => palette[index % palette.length]
		).sort(() => Math.random() - 0.5);
	});

	const cornerClasses = $derived(cornerClassesForRounding(rounding));
	const containerRoundingClass = $derived(containerClassForRounding(rounding));

	function cornerClassesForRounding(rounding: string) {
		const normalized = rounding.replace(/^rounded-?/, '');

		return CORNER_CLASSES[normalized] ?? CORNER_CLASSES[''];
	}

	function containerClassForRounding(rounding: string) {
		const normalized = rounding.replace(/^rounded-?/, '');

		if (normalized === 'none') return '';
		if (!normalized) return 'rounded';

		return `rounded-${normalized}`;
	}

	function getCornerClass(index: number): string {
		if (index === 0) return cornerClasses.tl;
		if (index === columns - 1) return cornerClasses.tr;
		if (index === tileCount - columns) return cornerClasses.bl;
		if (index === tileCount - 1) return cornerClasses.br;

		return '';
	}
</script>

<div
	class={`relative w-full overflow-hidden ${containerRoundingClass} ${className}`}
	bind:clientWidth={width}
	bind:clientHeight={height}
	aria-hidden="true"
>
	<div
		class="absolute inset-0 grid"
		style:grid-template-columns={`repeat(${columns}, minmax(0, 1fr))`}
		style:grid-template-rows={`repeat(${rows}, minmax(0, 1fr))`}
	>
		{#each tiles as _, i (i)}
			<div
				class={`abstract-tile ${getCornerClass(i)}`}
				style:background-color={tileColors[i]}
			></div>
		{/each}
	</div>
</div>

<style>
	.abstract-tile {
		width: calc(100% + 1px);
		height: calc(100% + 1px);
	}
</style>
