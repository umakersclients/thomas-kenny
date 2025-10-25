<!-- Presents an individual South Park quote within a Shadcn card surface. -->
<script lang="ts" module>
	import type { Quote } from "$lib/api/fetch-quotes";

	export type QuoteCardProps = {
		quote: Quote;
		onCopy?: (quote: Quote) => Promise<void>;
		onInspect?: (quote: Quote) => void;
	};
</script>

<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import MessageSquareQuote from "@lucide/svelte/icons/message-square-quote";
	import Copy from "@lucide/svelte/icons/copy";

	let { quote, onCopy, onInspect }: QuoteCardProps = $props();

	async function handleCopy() {
		if (onCopy) {
			await onCopy(quote);
		}
	}

	function handleInspect() {
		if (onInspect) {
			onInspect(quote);
		}
	}
</script>

<Card class="group flex h-full flex-col border-border/70 bg-card/80 backdrop-blur transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
	<CardHeader class="space-y-3">
		<Badge variant="outline" class="w-fit gap-2 text-[10px] uppercase tracking-wide text-muted-foreground">
			<MessageSquareQuote class="size-3 text-primary/70" />
			Quote #{quote.id.split("-").at(-1)}
		</Badge>
		<CardTitle class="text-balance text-base font-semibold leading-relaxed text-foreground/90">
			{quote.quote}
		</CardTitle>
	</CardHeader>
	<CardContent class="mt-auto">
		<div class="flex items-center justify-between text-sm text-muted-foreground">
			<span class="font-semibold text-primary">{quote.character}</span>
			<span class="text-xs uppercase tracking-wide text-muted-foreground/70">{quote.id}</span>
		</div>
	</CardContent>
	<CardFooter class="mt-4 flex items-center justify-end gap-2 pt-3">
	<Button size="sm" variant="ghost" class="hover:text-primary" onclick={handleInspect}>
			View details
		</Button>
	<Button size="sm" variant="outline" onclick={handleCopy}>
			<Copy class="size-3.5" />
			Copy
		</Button>
	</CardFooter>
</Card>
