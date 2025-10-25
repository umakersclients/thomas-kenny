<!-- Renders the top-level navigation chrome using shadcn components and responsive patterns. -->
<script lang="ts" module>
	type NavigationLink = {
		label: string;
		href: string;
		description?: string;
		category?: string;
	};

export type SiteNavigationProps = {
	links?: NavigationLink[];
};
</script>

<script lang="ts">
import Menu from "@lucide/svelte/icons/menu";
import Sparkles from "@lucide/svelte/icons/sparkles";
import UserRound from "@lucide/svelte/icons/user-round";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import {
		Root as NavigationMenu,
		List as NavigationMenuList,
		Item as NavigationMenuItem,
		Trigger as NavigationMenuTrigger,
		Content as NavigationMenuContent,
		Link as NavigationMenuLink,
		Indicator as NavigationMenuIndicator,
		Viewport as NavigationMenuViewport,
	} from "$lib/components/ui/navigation-menu";
	import { Separator } from "$lib/components/ui/separator";
	import {
		Sheet,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetDescription,
	} from "$lib/components/ui/sheet";

	let {
	links = [
		{
			label: "Dashboard",
			href: "/",
			description: "Browse the South Park quotes dashboard.",
		},
	],
}: SiteNavigationProps = $props();

	let mobileNavOpen = $state(false);

	// Closes the mobile navigation sheet after an interaction.
	function closeMobileNav() {
		mobileNavOpen = false;
	}
</script>

<nav class="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
	<div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
		<div class="flex items-center gap-3">
			<Button
				class="size-9 rounded-full border border-primary/40 bg-primary/10 text-primary shadow-md shadow-primary/10"
				size="icon"
				variant="ghost"
				aria-label="South Park Quotes"
			>
				<Sparkles class="size-4" />
			</Button>
			<div class="flex flex-col">
				<span class="text-base font-semibold tracking-tight text-foreground">
					South Park Quotes
				</span>
				<div class="flex items-center gap-2">
					<Badge variant="secondary" class="text-xs font-medium uppercase tracking-wide">
						Shadcn Dashboard
					</Badge>
					<span class="text-xs text-muted-foreground">Powered by southparkquotes API</span>
				</div>
			</div>
		</div>

		<div class="hidden items-center gap-6 md:flex">
			<NavigationMenu class="max-w-xl">
				<NavigationMenuList>
					{#each links as link}
						<NavigationMenuItem>
							<NavigationMenuLink
								href={link.href}
								class="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground data-[active]:bg-accent data-[active]:text-accent-foreground"
							>
								{link.label}
							</NavigationMenuLink>
						</NavigationMenuItem>
					{/each}

				</NavigationMenuList>
				<NavigationMenuIndicator />
				<NavigationMenuViewport />
			</NavigationMenu>

		<div class="flex items-center gap-3">
			<Button variant="outline" size="sm">
				<UserRound class="size-4" />
				<span class="hidden lg:inline">Team</span>
			</Button>
		</div>
	</div>

	<div class="flex items-center gap-3 md:hidden">
	<Button variant="outline" size="icon" aria-label="Open navigation" onclick={() => (mobileNavOpen = true)}>
		<Menu class="size-4" />
		</Button>
	</div>
	</div>
</nav>

<Sheet bind:open={mobileNavOpen}>
	<SheetContent side="right" class="w-full max-w-xs border-l border-border/80">
		<SheetHeader class="space-y-2 text-left">
			<SheetTitle class="flex items-center gap-2">
				<Sparkles class="size-4 text-primary" />
				South Park Quotes
			</SheetTitle>
			<SheetDescription>
				Dive into quote analytics, bookmarked favourites, and API documentation.
			</SheetDescription>
		</SheetHeader>

		<div class="mt-6 space-y-6">
			<div class="space-y-3">
				<p class="text-xs font-semibold uppercase text-muted-foreground/70">Navigate</p>
				{#each links as link}
					<a
						class="block rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition hover:border-border hover:bg-accent/40 hover:text-accent-foreground"
						href={link.href}
						onclick={closeMobileNav}
					>
						{link.label}
					</a>
				{/each}
			</div>

		<Separator />

			<div class="space-y-3">
				<p class="text-xs font-semibold uppercase text-muted-foreground/70">Workspace</p>
				<Button class="w-full justify-center" variant="default" size="sm" onclick={closeMobileNav}>
					View profile
				</Button>
				<Button class="w-full justify-center" variant="destructive" size="sm" onclick={closeMobileNav}>
					Log out
				</Button>
			</div>
		</div>
	</SheetContent>
</Sheet>
