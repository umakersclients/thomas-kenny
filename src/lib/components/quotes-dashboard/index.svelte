<!-- High-level dashboard for browsing and editing South Park quotes stored locally. -->
<script lang="ts" module>
	import type { Quote as QuoteModel } from "$lib/api/fetch-quotes";

	export type QuotesDashboardProps = {
		quotes: QuoteModel[];
	};
</script>

<script lang="ts">
import { enhance } from "$app/forms";
import { toast } from "svelte-sonner";
import type { SubmitFunction } from "@sveltejs/kit";
import BadgeCheck from "@lucide/svelte/icons/badge-check";
import CalendarClock from "@lucide/svelte/icons/calendar-clock";
import Copy from "@lucide/svelte/icons/copy";
import Filter from "@lucide/svelte/icons/filter";
import MessageCircle from "@lucide/svelte/icons/message-circle";
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

let dataset = $state([...quotes]);
let searchTerm = $state("");
let selectedCharacter = $state<"All" | string>("All");
let dialogOpen = $state(false);
let focusedQuote = $state<Quote | null>(null);
let editableQuote = $state("");
let editableCharacter = $state("");

$effect(() => {
	if (
		quotes.length !== dataset.length ||
		quotes.some((quote, index) => dataset[index]?.id !== quote.id)
	) {
		dataset = [...quotes];
	}
});

const characters = $derived([
	"All",
	...Array.from(new Set(dataset.map((quote) => quote.character))).sort((a, b) =>
		a.localeCompare(b),
	),
]);
const normalizedSearch = $derived(searchTerm.trim().toLowerCase());
const filtersActive = $derived(
	normalizedSearch.length > 0 || selectedCharacter !== "All",
);
const filteredQuotes = $derived(
	dataset.filter((quote) => {
		const matchesCharacter =
			selectedCharacter === "All" || quote.character === selectedCharacter;
		const matchesSearch =
			normalizedSearch.length === 0 ||
			quote.quote.toLowerCase().includes(normalizedSearch) ||
			quote.character.toLowerCase().includes(normalizedSearch);

		return matchesCharacter && matchesSearch;
	}),
);

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

function openQuoteDialog(quote: Quote | undefined) {
	if (!quote) return;
	focusedQuote = quote;
	editableQuote = quote.quote;
	editableCharacter = quote.character;
	dialogOpen = true;
}

function closeQuoteDialog() {
	dialogOpen = false;
}

async function copyFocusedQuote() {
	if (!focusedQuote) return;
	await copyQuote(focusedQuote);
}

const handleQuoteSubmit: SubmitFunction = () => {
	return async ({ result, update }) => {
		if (result.type === "failure") {
			toast.error("Unable to save quote", {
				description:
					"Please check the fields and try again. If the issue persists, reload the page.",
			});
			return;
		}

		await update({ reset: false });

		if (result.type === "success" && result.data?.updatedQuote) {
			const updatedQuote = result.data.updatedQuote as Quote;
			dataset = dataset.map((quote) =>
				quote.id === updatedQuote.id ? updatedQuote : quote,
			);
			focusedQuote = updatedQuote;
			editableQuote = updatedQuote.quote;
			editableCharacter = updatedQuote.character;
			toast.success("Quote updated", {
				description: `${updatedQuote.character}'s quote was saved to the dataset.`,
			});
			dialogOpen = false;
		}
	};
};
</script>

<section class="space-y-8">
	<header class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
		<div class="space-y-4">
			<div class="flex flex-wrap items-center gap-2">
				<Badge class="gap-2 bg-primary/15 text-primary shadow-sm shadow-primary/20" variant="outline">
					<Sparkles class="size-4" />
					Local dataset
				</Badge>
				<Badge variant="outline" class="gap-2">
					<BadgeCheck class="size-3.5 text-emerald-500" />
					{dataset.length} total quotes
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
				Browse and curate {dataset.length} locally cached South Park quotes. Every line is ready the
				moment the dashboard loads, and you can edit memorable quotes inline.
			</p>
		</div>
	</div>

</header>

	<div class="grid gap-4 md:grid-cols-3">
		<Card class="border-border/60 bg-card/70">
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium text-muted-foreground">Total Quotes</CardTitle>
				<MessageCircle class="size-4 text-primary/80" />
			</CardHeader>
	<CardContent>
		<p class="text-3xl font-bold text-foreground">{dataset.length}</p>
		<p class="mt-2 text-xs text-muted-foreground">Persisted in data/quotes.db</p>
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
			<span class="font-semibold text-foreground">Matching:</span>
			{filteredQuotes.length} of {dataset.length}
		</p>
			</CardContent>
		</Card>
	</div>

	<Card id="filters" class="border-border/60 bg-card/70 backdrop-blur">
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
	<CardFooter class="pt-2">
		<div class="flex items-center gap-2 text-xs text-muted-foreground">
			<Filter class="size-3.5" />
			<span>
				{filteredQuotes.length} quote{filteredQuotes.length === 1 ? "" : "s"} matching your
				current filters.
			</span>
		</div>
	</CardFooter>
	</Card>

	<Card id="quotes" class="border-border/60 bg-card/60">
	<CardHeader class="flex flex-row items-center justify-between">
		<div>
			<CardTitle class="text-lg font-semibold">Quote stream</CardTitle>
			<CardDescription class="text-sm text-muted-foreground">
				All quotes are loaded at once; use the filters above to focus on specific lines.
			</CardDescription>
		</div>
		<Badge variant="outline" class="text-xs uppercase tracking-wide">
			{filteredQuotes.length} filtered
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
			<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{#each filteredQuotes as quote (quote.id)}
					<QuoteCard
						{quote}
						onCopy={copyQuote}
						onInspect={openQuoteDialog}
					/>
				{/each}
			</div>
		{/if}
	</CardContent>
</Card>
</section>

<Dialog bind:open={dialogOpen}>
	{#if focusedQuote}
		<DialogContent class="max-w-lg border-border/60 bg-card/80">
			<form method="POST" action="?/updateQuote" use:enhance={handleQuoteSubmit} class="space-y-6">
				<input type="hidden" name="id" value={focusedQuote.id} />

				<DialogHeader class="space-y-3">
					<Badge variant="secondary" class="w-fit gap-2 uppercase tracking-wide">
						<MessageCircle class="size-3" />
						{focusedQuote.character}
					</Badge>
					<DialogTitle class="text-xl font-semibold leading-tight">
						Edit quote details
					</DialogTitle>
					<DialogDescription class="text-sm text-muted-foreground">
				Update the quote text or character attribution. Saving will persist the change to
				<code class="rounded bg-muted px-1.5 py-0.5 text-xs">data/quotes.db</code>.
					</DialogDescription>
				</DialogHeader>

				<div class="space-y-4">
					<div class="space-y-2">
						<Label class="text-xs uppercase tracking-wide text-muted-foreground/70" for="character">
							Character
						</Label>
						<Input
							id="character"
							name="character"
							bind:value={editableCharacter}
							placeholder="Enter character name"
							required
						/>
					</div>

					<div class="space-y-2">
						<Label class="text-xs uppercase tracking-wide text-muted-foreground/70" for="quote">
							Quote
						</Label>
					<textarea
						id="quote"
						name="quote"
						bind:value={editableQuote}
						required
						rows="4"
						class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
						placeholder="Edit the quote text..."
					></textarea>
					</div>
				</div>

				<DialogFooter class="flex justify-end gap-3 pt-2">
					<Button variant="ghost" size="sm" type="button" onclick={closeQuoteDialog}>
						Dismiss
					</Button>
					<Button type="button" size="sm" variant="outline" onclick={copyFocusedQuote}>
						<Copy class="size-3.5" />
						Copy quote
					</Button>
					<Button type="submit" size="sm">
						Save changes
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	{/if}
</Dialog>
