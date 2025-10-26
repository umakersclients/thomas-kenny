<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
import { SiteNavigation } from "$lib/components/site-navigation";
import { AppSidebar } from "$lib/components/app-sidebar";
import type { NavigationSection } from "$lib/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "$lib/components/ui/sidebar";
	import { Toaster } from "$lib/components/ui/sonner";

	let { children } = $props();

const sidebarItems: NavigationSection[] = [
	{
		section: "Overview",
		links: [
			{ label: "Dashboard", href: "/", active: true },
			{
				label: "Filters",
				href: "#filters",
				description: "Adjust search text and character filters.",
			},
			{
				label: "Quotes",
				href: "#quotes",
				description: "Jump to the loaded quotes stream.",
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
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

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

<Toaster position="top-center" />
