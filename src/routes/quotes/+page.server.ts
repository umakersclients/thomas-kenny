import { error, fail, redirect } from "@sveltejs/kit";
import { ensureQuotesDataset, readQuotesDataset, updateQuoteRecord } from "$lib/server/quotes-db";
import { userHasRole } from "$lib/server/auth";
import { loginAction, logoutAction } from "$lib/server/auth-actions";
import type { Actions, PageServerLoad } from "./$types";

/**
 * Loads the curated quotes dataset so the quotes dashboard can render the latest state.
 */
export const load: PageServerLoad = async ({ fetch, locals, url }) => {
	if (!locals.user || !userHasRole(locals.user, "quotes")) {
		const target = new URL("/login", url);
		target.searchParams.set("redirectTo", url.pathname + url.search);
		target.searchParams.set("reason", locals.user ? "forbidden" : "unauthenticated");
		target.searchParams.set("requiredRole", "quotes");
		throw redirect(303, target);
	}

	try {
		await ensureQuotesDataset(fetch);
		const quotes = await readQuotesDataset();

		return { authorized: true, quotes };
	} catch (cause) {
		console.error("Failed to prepare quotes dashboard data", cause);
		throw error(502, "Unable to load South Park quotes at this time.");
	}
};

/**
 * Persists inline quote edits performed from the dashboard interface.
 */
export const actions: Actions = {
	login: async (event) => loginAction(event),
	logout: async (event) => logoutAction(event),
	updateQuote: async ({ request, locals }) => {
		if (!locals.user || !userHasRole(locals.user, "quotes")) {
			return fail(403, {
				message: "You do not have permission to update quotes.",
			});
		}

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
