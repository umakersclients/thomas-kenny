import { error, fail } from "@sveltejs/kit";
import { ensureQuotesDataset, readQuotesDataset, updateQuoteRecord } from "$lib/server/quotes-db";
import type { Actions, PageServerLoad } from "./$types";

/**
 * Loads the quotes dataset so it can be rendered within the dashboard page.
 */
export const load: PageServerLoad = async ({ fetch }) => {
	try {
		await ensureQuotesDataset(fetch);
		const quotes = await readQuotesDataset();

		return { quotes };
	} catch (cause) {
		console.error("Failed to prepare quotes dashboard data", cause);
		throw error(502, "Unable to load South Park quotes at this time.");
	}
};

/**
 * Handles updates to individual quotes, persisting changes to the local dataset.
 */
export const actions: Actions = {
	updateQuote: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get("id")?.toString().trim() ?? "";
		const quote = formData.get("quote")?.toString().trim() ?? "";
		const character = formData.get("character")?.toString().trim() ?? "";

		if (!id || !quote || !character) {
			return fail(400, { message: "Quote, character, and identifier are required." });
		}

		try {
			const updatedQuote = await updateQuoteRecord(id, { quote, character });

			return {
				success: true,
				updatedQuote,
			};
		} catch (cause) {
			console.error(`Failed to update quote ${id}`, cause);
			return fail(500, { message: "Unable to update quote. Please try again later." });
		}
	},
};
