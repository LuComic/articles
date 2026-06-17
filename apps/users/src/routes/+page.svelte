<script lang="ts">
	import type { PageProps } from './$types.js';

	let { data }: PageProps = $props();
</script>

<div class="dashboard min-h-screen bg-(--paper) text-(--ink)">
	<div class="mx-auto w-[min(1220px,calc(100%-32px))] py-5 pb-10">
		<header
			class="grid min-h-14 grid-cols-1 items-center gap-4 border-b border-(--line) pb-4 md:grid-cols-[auto_1fr_auto] md:gap-6 md:pb-0"
		>
			<div class="text-xl font-extrabold">Uudiste ülevaade</div>
			<input
				type="text"
				class="hidden h-9 items-center rounded border border-(--line) bg-(--soft) px-3 text-sm text-(--muted) focus:ring-2 focus:ring-green-200/75 focus:ring-offset-0 focus:outline-none md:flex"
				placeholder="Otsi teemasid, uudiseid, märksõnu..."
			/>
			<div class="text-sm text-(--muted)">Just värskendatud</div>
		</header>

		<section
			class="grid grid-cols-1 items-end gap-5 border-b border-(--line) py-7 md:grid-cols-[1fr_auto]"
		>
			<h1 class="max-w-4xl text-4xl font-bold md:text-5xl">
				Tänased avalikud uudised kiireks ülevaateks
			</h1>
			<div class="flex flex-wrap gap-2">
				<span class="rounded border border-(--line) px-3 py-2 text-sm font-medium text-(--muted)">
					Hiljutine
				</span>
				<span class="rounded border border-(--line) px-3 py-2 text-sm font-medium text-(--muted)">
					Populaarne
				</span>
				<span class="rounded border border-(--line) px-3 py-2 text-sm font-medium text-(--muted)">
					Salvestatud
				</span>
			</div>
		</section>

		<main class="grid grid-cols-1 gap-7 pt-7 lg:grid-cols-[1.6fr_1fr]">
			<section>
				<article class="min-h-72 grid-cols-1 gap-6 border-b border-(--line) pb-7">
					<div>
						<div class="meta mb-2">Viimati avaldatud</div>
						{#if data.lead}
							<h2 class="mb-3 text-3xl font-semibold md:text-4xl">{data.lead.title}</h2>
							<p class="text-(--muted)">{data.lead.summary}</p>
							<div class="published mt-4">{data.lead.publishedLabel}</div>
						{:else}
							<h2 class="mb-3 text-3xl font-bold md:text-4xl">
								Väljavõetud uudiseid pole veel saadaval
							</h2>
							<p class="text-(--muted)">
								Kui väljavõtja tagastab uudised, liigub siia kõige hilisema avaldamisajaga lugu.
							</p>
							<div class="published mt-4">Avaldamisaeg puudub</div>
						{/if}

						<div class="mt-5 flex flex-wrap gap-2" aria-label="Allikate nimed">
							{#each data.fourCategories as source (source)}
								<span class="rounded border border-(--line) px-2.5 py-1.5 text-sm text-(--muted)">
									{source}
								</span>
							{/each}
						</div>
					</div>
				</article>

				<div class="mt-1 grid grid-cols-1 gap-x-6 md:grid-cols-2">
					{#each data.latest as item (item.url)}
						<article class="flex flex-col border-b border-(--line) py-5">
							<div class="meta">{item.topic}</div>
							<h3 class="my-2 text-lg font-bold">
								<a class="hover:underline hover:underline-offset-4" href={item.url}>{item.title}</a>
							</h3>
							<div class="mt-auto text-sm text-(--muted)">
								Allikas: {item.sourceName} | {item.readMinutes} min lugemist
							</div>
						</article>
					{/each}
				</div>
			</section>

			<aside class="border-(--line) lg:border-l lg:pl-7">
				<div class="meta mb-2">Veel uudiseid</div>
				{#each data.randomNews as item, index (item.url)}
					<article class="grid grid-cols-[34px_1fr] gap-3.5 border-b border-(--line) py-5">
						<div class="text-2xl font-bold text-(--muted)">{index + 1}</div>
						<div>
							<h3 class="text-lg font-bold">
								<a class="hover:underline hover:underline-offset-4" href={item.url}>{item.title}</a>
							</h3>
							<div class="mt-2.5 text-sm text-(--muted)">{item.sourceName}</div>
						</div>
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

<style>
	.dashboard {
		--paper: #f7faf9;
		--ink: #14201d;
		--muted: #586763;
		--line: #cbd8d3;
		--soft: #e7efec;
		font-family: 'Libre Franklin Variable', Inter, ui-sans-serif, system-ui, sans-serif;
	}

	.meta,
	.published {
		font-family: 'Libre Franklin Variable', Inter, ui-sans-serif, system-ui, sans-serif;
	}

	.meta,
	.published {
		color: var(--muted);
		font-size: 12px;
		text-transform: uppercase;
	}

	.published {
		color: var(--ink);
		font-size: 13px;
	}
</style>
