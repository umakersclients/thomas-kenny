import { error } from "@sveltejs/kit";
import { fetchQuotes } from "$lib/api/fetch-quotes";
import type { PageServerLoad } from "./$types";

/**
 * Loads the quotes dataset so it can be rendered within the dashboard page.
 */
export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const quotes = await fetchQuotes(fetch);

		return { quotes };
	} catch (cause) {
		console.error("Failed to prepare quotes dashboard data", cause);
		throw error(502, "Unable to load South Park quotes at this time.");
	}
};
