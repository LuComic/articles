<script lang="ts">
	import type { PageProps } from './$types.js';

	let { data }: PageProps = $props();
	let articles = $derived(data.articles);
	let errors = $derived(data.errors);
</script>

{#each articles as art, index (art)}
	<p>{art.title}</p>
	<p>{art.author}</p>
	{#if index !== articles.length - 1}
		<span class="block h-px w-screen bg-gray-200"></span>
	{/if}
{/each}

{#each errors as err (err)}
	<p>{err.message}</p>
{/each}
