<!-- High-level dashboard for browsing and filtering South Park quotes pulled from the API. -->
<script lang="ts" module>
	import type { Quote as QuoteModel } from "$lib/api/fetch-quotes";

	export type QuotesDashboardProps = {
		quotes: QuoteModel[];
	};
</script>

<script lang="ts">
import { toast } from "svelte-sonner";
import BadgeCheck from "@lucide/svelte/icons/badge-check";
import CalendarClock from "@lucide/svelte/icons/calendar-clock";
import Copy from "@lucide/svelte/icons/copy";
import Filter from "@lucide/svelte/icons/filter";
import Info from "@lucide/svelte/icons/info";
import MessageCircle from "@lucide/svelte/icons/message-circle";
import RefreshCw from "@lucide/svelte/icons/refresh-cw";
import Sparkles from "@lucide/svelte/icons/sparkles";
import Users from "@lucide/svelte/icons/users";
	import { QuoteCard } from "$lib/components/ui/quote-card";
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
		CardFooter,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Separator } from "$lib/components/ui/separator";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import {
		Select,
		SelectTrigger,
		SelectContent,
		SelectItem,
	} from "$lib/components/ui/select";
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogDescription,
		DialogFooter,
	} from "$lib/components/ui/dialog";
	import type { Quote } from "$lib/api/fetch-quotes";

	let { quotes }: QuotesDashboardProps = $props();

	let searchTerm = $state("");
	let selectedCharacter = $state<"All" | string>("All");
	let dialogOpen = $state(false);
	let focusedQuote = $state<Quote | null>(null);

	const characters = $derived([
		"All",
		...Array.from(new Set(quotes.map((quote) => quote.character))).sort((a, b) =>
			a.localeCompare(b),
		),
	]);

	const normalizedSearch = $derived(searchTerm.trim().toLowerCase());
	const filtersActive = $derived(
		normalizedSearch.length > 0 || selectedCharacter !== "All",
	);

	const filteredQuotes = $derived(
		quotes.filter((quote) => {
			const matchesCharacter =
				selectedCharacter === "All" || quote.character === selectedCharacter;
			const matchesSearch =
				normalizedSearch.length === 0 ||
				quote.quote.toLowerCase().includes(normalizedSearch) ||
				quote.character.toLowerCase().includes(normalizedSearch);

			return matchesCharacter && matchesSearch;
		}),
	);

	// Copies the supplied quote to the clipboard and surfaces toast feedback.
	async function copyQuote(quote: Quote) {
		try {
			await navigator.clipboard.writeText(`"${quote.quote}" — ${quote.character}`);
			toast.success("Quote copied to clipboard", {
				description: `${quote.character}'s line is ready to paste.`,
			});
		} catch (error) {
			console.error("Failed to copy quote", error);
			toast.error("Unable to copy quote", {
				description: "Please try again or check clipboard permissions.",
			});
		}
	}

	// Opens the details dialog for richer context about the selected quote.
	function openQuoteDialog(quote: Quote | undefined) {
		if (!quote) return;
		focusedQuote = quote;
		dialogOpen = true;
	}

	// Resets all active filters to their default state.
	function resetFilters() {
		searchTerm = "";
		selectedCharacter = "All";
	}

	// Closes the quote detail dialog to return to the broader dashboard context.
	function closeQuoteDialog() {
		dialogOpen = false;
	}

	// Copies the active quote from the dialog when present.
	async function copyFocusedQuote() {
		if (!focusedQuote) return;
		await copyQuote(focusedQuote);
	}
</script>

<section class="space-y-8">
	<header class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
		<div class="space-y-4">
			<div class="flex flex-wrap items-center gap-2">
				<Badge class="gap-2 bg-primary/15 text-primary shadow-sm shadow-primary/20" variant="outline">
					<Sparkles class="size-4" />
					Live dataset
				</Badge>
				<Badge variant="outline" class="gap-2">
					<BadgeCheck class="size-3.5 text-emerald-500" />
					API status: healthy
				</Badge>
				{#if filtersActive}
					<Badge variant="secondary" class="gap-2 text-xs uppercase tracking-wide">
						<Filter class="size-3.5" />
						Filters active
					</Badge>
				{/if}
			</div>

			<div class="space-y-2">
				<h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					South Park Quote Intelligence
				</h1>
				<p class="max-w-2xl text-sm text-muted-foreground sm:text-base">
					Dive into a curated snapshot of 500 public South Park quotes. Refine the list by character, dig
					into memorable one-liners, and surface inspiration for your next meme drop.
				</p>
			</div>
		</div>

		<div class="flex flex-wrap items-center gap-3">
		<Button variant="ghost" size="sm" onclick={resetFilters}>
				<RefreshCw class="size-4" />
				Reset filters
			</Button>
		<Button variant="default" size="sm" onclick={() => openQuoteDialog(quotes[0])}>
				<Info class="size-4" />
				Dataset primer
			</Button>
		</div>
	</header>

	<div class="grid gap-4 md:grid-cols-3">
		<Card class="border-border/60 bg-card/70">
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium text-muted-foreground">Total Quotes</CardTitle>
				<MessageCircle class="size-4 text-primary/80" />
			</CardHeader>
			<CardContent>
				<p class="text-3xl font-bold text-foreground">{quotes.length}</p>
				<p class="mt-2 text-xs text-muted-foreground">
					Powered by southparkquotes.onrender.com
				</p>
			</CardContent>
		</Card>

		<Card class="border-border/60 bg-card/70">
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium text-muted-foreground">Unique Characters</CardTitle>
				<Users class="size-4 text-primary/80" />
			</CardHeader>
			<CardContent>
				<p class="text-3xl font-bold text-foreground">{characters.length - 1}</p>
				<p class="mt-2 text-xs text-muted-foreground">Filter by your favourite personas.</p>
			</CardContent>
		</Card>

		<Card class="border-border/60 bg-card/70">
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium text-muted-foreground">Filter Summary</CardTitle>
				<CalendarClock class="size-4 text-primary/80" />
			</CardHeader>
			<CardContent class="space-y-2 text-sm text-muted-foreground">
				<p>
					<span class="font-semibold text-foreground">Search:</span>
					{#if normalizedSearch.length > 0}
						“{normalizedSearch}”
					{:else}
						No text filter
					{/if}
				</p>
				<p>
					<span class="font-semibold text-foreground">Character:</span> {selectedCharacter}
				</p>
				<p>
					<span class="font-semibold text-foreground">Results:</span> {filteredQuotes.length} matches
					active
				</p>
			</CardContent>
		</Card>
	</div>

	<Card class="border-border/60 bg-card/70 backdrop-blur">
		<CardHeader class="space-y-1">
			<CardTitle class="text-lg font-semibold">Filter quotes</CardTitle>
			<CardDescription class="text-sm text-muted-foreground">
				Combine search and character filters to spotlight specific lines.
			</CardDescription>
		</CardHeader>
		<CardContent class="grid gap-4 md:grid-cols-[2fr_1fr]">
			<div class="space-y-2">
				<Label class="text-xs uppercase tracking-wide text-muted-foreground/70" for="search">
					Search quotes
				</Label>
				<Input
					id="search"
					placeholder="Find quotes or characters..."
					bind:value={searchTerm}
					type="search"
				/>
			</div>

			<div class="space-y-2">
				<Label class="text-xs uppercase tracking-wide text-muted-foreground/70">Character</Label>
				<Select bind:value={selectedCharacter} type="single">
					<SelectTrigger class="w-full justify-between">
						<span class="text-sm">
							{selectedCharacter === "All" ? "All characters" : selectedCharacter}
						</span>
					</SelectTrigger>
					<SelectContent>
						{#each characters as character}
							<SelectItem value={character} class="text-sm">
								{character}
							</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			</div>
		</CardContent>
		<CardFooter class="flex flex-wrap items-center justify-between gap-3 pt-2">
			<div class="flex items-center gap-2 text-xs text-muted-foreground">
				<Filter class="size-3.5" />
				<span>
					Showing {filteredQuotes.length} of {quotes.length} quotes
					{#if filtersActive}
						matching your filters.
					{:else}
						from the live dataset.
					{/if}
				</span>
			</div>
		<Button size="sm" variant="outline" onclick={resetFilters}>
				Clear filters
			</Button>
		</CardFooter>
	</Card>

	<Card class="border-border/60 bg-card/60">
		<CardHeader class="flex flex-row items-center justify-between">
			<div>
				<CardTitle class="text-lg font-semibold">Quote stream</CardTitle>
				<CardDescription class="text-sm text-muted-foreground">
					Scroll through the curated grid and open details for any quote.
				</CardDescription>
			</div>
			<Badge variant="outline" class="text-xs uppercase tracking-wide">
				{filteredQuotes.length} active
			</Badge>
		</CardHeader>
		<Separator class="mx-6" />
		<CardContent class="pt-6">
			{#if filteredQuotes.length === 0}
				<div class="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/70 bg-background/60 p-12 text-center text-muted-foreground">
					<p class="text-lg font-semibold">No quotes found</p>
					<p class="text-sm text-muted-foreground/80">
						Try broadening your search or choose another character.
					</p>
				</div>
			{:else}
				<ScrollArea class="max-h-[640px] pr-3">
					<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{#each filteredQuotes as quote (quote.id)}
							<QuoteCard
								{quote}
								onCopy={copyQuote}
								onInspect={openQuoteDialog}
							/>
						{/each}
					</div>
				</ScrollArea>
			{/if}
		</CardContent>
	</Card>
</section>

<Dialog bind:open={dialogOpen}>
	{#if focusedQuote}
		<DialogContent class="max-w-lg border-border/60 bg-card/80">
			<DialogHeader class="space-y-3">
				<Badge variant="secondary" class="w-fit gap-2 uppercase tracking-wide">
					<MessageCircle class="size-3" />
					{focusedQuote.character}
				</Badge>
				<DialogTitle class="text-xl font-semibold leading-tight">
					{focusedQuote.quote}
				</DialogTitle>
				<DialogDescription class="text-sm text-muted-foreground">
					This quote surfaced from the South Park quotes API. Use it for inspiration, presentation
					copy, or to settle a meme debate.
				</DialogDescription>
			</DialogHeader>

			<div class="rounded-lg border border-dashed border-border/60 bg-background/60 p-4 text-sm text-muted-foreground">
				<p>
					<span class="font-semibold text-foreground">Quote ID:</span> {focusedQuote.id}
				</p>
				<p>
					<span class="font-semibold text-foreground">Speaker:</span> {focusedQuote.character}
				</p>
			</div>

			<DialogFooter class="mt-6 flex justify-end gap-3">
		<Button variant="ghost" size="sm" onclick={closeQuoteDialog}>Dismiss</Button>
		<Button size="sm" onclick={copyFocusedQuote}>
					<Copy class="size-3.5" />
					Copy quote
				</Button>
			</DialogFooter>
		</DialogContent>
	{/if}
</Dialog>
