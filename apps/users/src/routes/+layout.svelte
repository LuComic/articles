<script lang="ts">
	import './layout.css';
	import Header from '$lib/components/Header.svelte';
	import TopicSection from '$lib/components/TopicSection.svelte';

	const { children } = $props();
</script>

<div class="dashboard min-h-screen bg-(--paper) text-(--ink)">
	<div class="mx-auto w-full max-w-7xl px-4 py-5 pb-10 md:w-4/5 md:px-0">
		<Header />
		<TopicSection />
		{@render children()}
	</div>
</div>
