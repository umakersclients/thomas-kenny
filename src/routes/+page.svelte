<script lang="ts">
	import type { Quote } from "$lib/api/fetch-quotes";
	import { QuotesDashboard } from "$lib/components/quotes-dashboard";

	const { data } = $props<{ data: { quotes: Quote[] } }>();
</script>

<QuotesDashboard quotes={data.quotes} />
