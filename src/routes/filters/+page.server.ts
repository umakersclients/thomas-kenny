import { redirect } from "@sveltejs/kit";
import { userHasRole } from "$lib/server/auth";
import { loginAction, logoutAction } from "$lib/server/auth-actions";
import type { Actions, PageServerLoad } from "./$types";

/**
 * Exposes the authenticated user's display information to the filters prototype.
 */
export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user || !userHasRole(locals.user, "filter")) {
		const target = new URL("/login", url);
		target.searchParams.set("redirectTo", url.pathname + url.search);
		target.searchParams.set("reason", locals.user ? "forbidden" : "unauthenticated");
		target.searchParams.set("requiredRole", "filter");
		throw redirect(303, target);
	}

	return {
		authorized: true,
		user: {
			username: locals.user.username,
			roles: locals.user.roles,
		},
	};
};

export const actions: Actions = {
	login: async (event) => loginAction(event),
	logout: async (event) => logoutAction(event),
};
