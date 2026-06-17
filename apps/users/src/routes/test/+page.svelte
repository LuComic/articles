<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { COLORS } from '$lib/colors.js';

	let mounted = $state(false);
	let tileColors = $state<string[]>([]);

	onMount(() => {
		tileColors = [...COLORS].sort(() => Math.random() - 0.5);
		mounted = true;
	});

	const getDelay = (index: number) => index * 10;
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center gap-4">
	<h1 class="fancy-font text-6xl">Go and climb</h1>
	<div class="grid aspect-square w-100 grid-cols-8 gap-1">
		{#each Array.from({ length: 64 }) as _, i (i)}
			{#if mounted}
				<div
					class={`h-full w-full ${
						i === 0
							? 'rounded-tl-full'
							: i === 7
								? 'rounded-tr-full'
								: i === 56
									? 'rounded-bl-full'
									: i === 63
										? 'rounded-br-full'
										: ''
					}`}
					style:background-color={tileColors[i]}
					in:fade={{ duration: 500, delay: getDelay(i) }}
				></div>
			{/if}
		{/each}
	</div>
	<h1 class="fancy-font bg-black px-4 py-2 text-6xl text-white">Big Munamägi</h1>
</div>

<style>
	.fancy-font {
		font-family: 'Mg12', 'Libre Franklin', Inter, ui-sans-serif, system-ui, sans-serif;
	}
</style>
