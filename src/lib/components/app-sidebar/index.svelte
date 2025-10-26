<!-- Application sidebar navigation built on top of shadcn's sidebar primitives. -->
<script lang="ts">
	import { cn } from "$lib/utils";
	import {
		Root as Sidebar,
		SidebarContent,
		SidebarHeader,
		SidebarMenu,
		SidebarGroup,
		SidebarGroupLabel,
		SidebarMenuItem,
		SidebarFooter,
		SidebarGroupContent,
		SidebarMenuSkeleton,
	} from "$lib/components/ui/sidebar";
	import { Button } from "$lib/components/ui/button";
	import { Separator } from "$lib/components/ui/separator";
	import type { NavigationSection } from "./types";
	import Sparkles from "@lucide/svelte/icons/sparkles";

export type AppSidebarProps = {
	items?: NavigationSection[];
};

let { items = [] }: AppSidebarProps = $props();

	const baseLinkClasses =
		"flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition";

	/**
	 * Builds the classname string for a navigation link based on its active state.
	 */
	function linkClasses(active = false) {
		return cn(
			baseLinkClasses,
			active
				? "bg-primary text-primary-foreground shadow-sm"
				: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
		);
	}
</script>

<Sidebar class="border-r border-border/60 bg-background/95">
	<SidebarHeader class="flex items-center justify-between gap-2 px-4 py-5">
		<div class="flex items-center gap-3">
			<div class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
				<Sparkles class="size-5" />
			</div>
			<div class="flex flex-col">
				<span class="text-sm font-semibold text-foreground">South Park Quotes</span>
				<span class="text-xs text-muted-foreground">Curate &amp; edit quotes locally</span>
			</div>
		</div>
	</SidebarHeader>

	<SidebarContent class="space-y-4 px-3">
		{#if items.length === 0}
			<div class="space-y-3">
				<SidebarGroup>
					<SidebarGroupLabel>Loading navigation…</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{#each Array.from({ length: 3 }) as _}
								<SidebarMenuItem>
									<SidebarMenuSkeleton class="h-10 w-full" />
								</SidebarMenuItem>
							{/each}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</div>
		{:else}
			{#each items as section}
				<SidebarGroup>
					{#if section.section}
						<SidebarGroupLabel class="text-xs uppercase tracking-wide text-muted-foreground/70">
							{section.section}
						</SidebarGroupLabel>
					{/if}
					<SidebarGroupContent>
						<SidebarMenu>
							{#each section.links as link}
								{@const Icon = link.icon}
								<SidebarMenuItem>
									<a
										class={linkClasses(link.active)}
										href={link.href}
										target={link.external ? "_blank" : undefined}
										rel={link.external ? "noreferrer" : undefined}
									>
										{#if Icon}
											<Icon class="size-4 shrink-0" />
										{/if}
										<span class="flex-1 truncate">{link.label}</span>
										{#if link.badge}
											<span class="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
												{link.badge}
											</span>
										{/if}
									</a>
								</SidebarMenuItem>
							{/each}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			{/each}
		{/if}
	</SidebarContent>

	<SidebarFooter class="px-4 py-4">
		<Separator class="mb-4" />
		<div class="space-y-2">
			<p class="text-xs text-muted-foreground">
				Synced locally. Edits are stored in <code>data/quotes.db</code>.
			</p>
			<Button
				href="https://southparkquotes.onrender.com/"
				target="_blank"
				rel="noreferrer"
				size="sm"
				variant="outline"
				class="w-full"
			>
				View API docs
			</Button>
		</div>
	</SidebarFooter>

</Sidebar>
