import { redirect } from "@sveltejs/kit";
import { loginAction, logoutAction } from "$lib/server/auth-actions";
import type { Actions, PageServerLoad } from "./$types";

/**
 * Provides the login form with contextual messaging and handles credential submission.
 */
export const load: PageServerLoad = async ({ url, locals }) => {
	const redirectTo = url.searchParams.get("redirectTo") ?? "/quotes";
	const reason = url.searchParams.get("reason");
	const requiredRole = url.searchParams.get("requiredRole");

	if (locals.user) {
		throw redirect(303, redirectTo);
	}

	return {
		reason,
		requiredRole,
		redirectTo,
	};
};

export const actions: Actions = {
	login: async (event) => {
		const result = await loginAction(event);
		if (result && "success" in result && result.success) {
			throw redirect(303, result.redirectTo ?? "/quotes");
		}

		return result;
	},
	logout: async (event) => {
		const result = await logoutAction(event);
		if (result && "success" in result && result.success) {
			throw redirect(303, result.redirectTo ?? "/login");
		}

		return result;
	},
};
