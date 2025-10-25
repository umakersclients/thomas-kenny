<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { SiteNavigation } from "$lib/components/site-navigation";
	import { Toaster } from "$lib/components/ui/sonner";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
	<SiteNavigation />

	<main class="mx-auto w-full max-w-6xl px-4 py-8">
		{@render children?.()}
	</main>
</div>

<Toaster position="top-center" />
