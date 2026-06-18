<script lang="ts">
	import AbstractBanner from '$lib/components/AbstractBanner.svelte';
</script>

<h1 class="display-font my-5 text-4xl md:text-5xl">Teemad</h1>
<div class="flex w-full flex-col gap-4">
	<a href="/topics?topic=valitsus" class="hover:opacity-90">
		<AbstractBanner topic="Valitsus" />
	</a>
	<a href="/topics?topic=rahandus" class="hover:opacity-90">
		<AbstractBanner topic="Rahandus" />
	</a>
	<a href="/topics?topic=andmed" class="hover:opacity-90">
		<AbstractBanner topic="Andmed" />
	</a>
	<a href="/topics?topic=kliima" class="hover:opacity-90">
		<AbstractBanner topic="Kliima" />
	</a>
	<a href="/topics?topic=majandus" class="hover:opacity-90">
		<AbstractBanner topic="Majandus" />
	</a>
	<a href="/topics?topic=turvalisus" class="hover:opacity-90">
		<AbstractBanner topic="Turvalisus" />
	</a>
</div>
