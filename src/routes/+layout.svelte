<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { page } from "$app/stores";
	import type { LayoutData } from "./$types";
	import type { Snippet } from "svelte";
	import { SiteNavigation } from "$lib/components/site-navigation";
	import { AppSidebar } from "$lib/components/app-sidebar";
	import type { NavigationSection } from "$lib/components/app-sidebar";
	import { SidebarProvider, SidebarInset } from "$lib/components/ui/sidebar";
	import { Toaster } from "$lib/components/ui/sonner";

	const {
		children,
		data,
	}: {
		children: Snippet;
		data: LayoutData;
	} = $props();

	const baseSidebarItems: NavigationSection[] = [
		{
			section: "Overview",
			links: [
				{
					label: "Quotes",
					href: "/quotes",
					description: "Manage and curate the quote library.",
				},
				{
					label: "Filters",
					href: "/filters",
					description: "Prototype new filter presets with flair.",
				},
			],
		},
		{
			section: "Shortcuts",
			links: [
				{
					label: "API Reference",
					href: "https://southparkquotes.onrender.com/",
					description: "View the public quotes API powering this dashboard.",
					external: true,
				},
			],
		},
	];

	const pageStore = page;
	const sidebarItems = $derived.by(() => {
		const currentPath = $pageStore.url.pathname;
		return baseSidebarItems.map((section) => ({
			...section,
			links: section.links.map((link) => ({
				...link,
				active:
					currentPath === link.href ||
					(currentPath.startsWith(link.href) && link.href !== "/"),
			})),
		}));
	});

	const isLoginPage = $derived.by(() => $pageStore.url.pathname.startsWith("/login"));
</script>

<svelte:head>
 	<link rel="icon" href={favicon} />
</svelte:head>

{#if isLoginPage}
	<main class="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background/95 to-background px-4 py-16">
		{@render children?.()}
	</main>
{:else}
	<SidebarProvider>
		<div class="min-h-screen bg-gradient-to-r from-background via-background/95 to-background">
			<div class="flex min-h-screen w-full">
				<AppSidebar items={sidebarItems} />

				<SidebarInset class="flex flex-1 flex-col">
					<SiteNavigation />
					<main class="mx-auto w-full max-w-6xl px-4 py-8">
						{@render children?.()}
					</main>
				</SidebarInset>
			</div>
		</div>
	</SidebarProvider>
{/if}

<Toaster position="top-center" />
