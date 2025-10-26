<!-- Compact top header that sits above the sidebar content. -->
<script lang="ts">
import UserRound from "@lucide/svelte/icons/user-round";
import { Button } from "$lib/components/ui/button";
import { SidebarTrigger } from "$lib/components/ui/sidebar";

export type SiteNavigationProps = {
	title?: string;
	subtitle?: string;
};

let {
	title = "Dashboard",
	subtitle = "Manage the South Park quotes dataset",
}: SiteNavigationProps = $props();
</script>

<header class="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur">
	<div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4">
		<div class="flex items-center gap-3">
			<SidebarTrigger
				class="size-9 rounded-full border border-border/60 text-muted-foreground shadow-sm transition hover:border-primary/50 hover:text-foreground"
				aria-label="Toggle sidebar"
			/>
			{#if title || subtitle}
				<div class="flex flex-col">
					{#if title}
						<span class="text-base font-semibold tracking-tight text-foreground">{title}</span>
					{/if}
					{#if subtitle}
						<span class="text-xs text-muted-foreground">{subtitle}</span>
					{/if}
				</div>
			{/if}
		</div>

		<div class="flex items-center gap-2">
			<Button variant="outline" size="sm">
				<UserRound class="size-4" />
				<span class="hidden lg:inline">Team</span>
			</Button>
		</div>
	</div>
</header>
