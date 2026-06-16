<script lang="ts">
	import './layout.css';
	import { navigating } from '$app/state';

	const { children } = $props();
</script>

{#if navigating.to}
	<p>Loading...</p>
{/if}

{@render children()}
