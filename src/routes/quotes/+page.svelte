<script lang="ts">
import type { Quote } from "$lib/api/fetch-quotes";
import { QuotesDashboard } from "$lib/components/quotes-dashboard";
import { ConfettiFireworks } from "$lib/components/ui/confetti-fireworks";

type QuotesPageData = {
	authorized: boolean;
	quotes?: Quote[];
	authContext?: import("$lib/server/auth").AuthFailure | null;
};

const { data } = $props<{ data: QuotesPageData }>();
</script>

{#if data.authorized && data.quotes}
	<section class="relative">
		<ConfettiFireworks class="pointer-events-none" />
		<div class="relative z-10">
			<QuotesDashboard quotes={data.quotes} />
		</div>
	</section>
{:else}
	<div class="rounded-xl border border-border/60 bg-background/70 p-10 text-center text-sm text-muted-foreground">
		Access to the quotes dashboard requires the <span class="font-semibold text-foreground">quotes</span> role.
	</div>
{/if}
