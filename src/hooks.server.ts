/**
 * Global request guards that resolve the authenticated user from session cookies and attach
 * authorization metadata for downstream loads to react to.
 */
import {
	AUTH_COOKIE_MAX_AGE,
	AUTH_COOKIE_NAME,
	getUserFromToken,
	userHasRole,
} from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit";

const ROLE_GUARDS: Array<{ pattern: RegExp; role: string }> = [
	{ pattern: /^\/filters(\/.*)?$/, role: "filter" },
	{ pattern: /^\/quotes(\/.*)?$/, role: "quotes" },
];

export const handle: Handle = async ({ event, resolve }) => {
	const authToken = event.cookies.get(AUTH_COOKIE_NAME);
	const secureCookie = process.env.NODE_ENV === "production";

	const user = authToken ? await getUserFromToken(authToken) : null;

	if (!user && authToken) {
		event.cookies.delete(AUTH_COOKIE_NAME, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: secureCookie,
		});
	}

	event.locals.user = user;
	event.locals.authFailure = null;

	const routeId = event.route.id ?? null;
	const isLoginRoute = routeId === "/login";
	const matchedGuard = ROLE_GUARDS.find((guard) => guard.pattern.test(event.url.pathname));
	const requiresAuth = routeId !== null && !isLoginRoute;

	const missingUser = requiresAuth && !user;
	const missingRole = matchedGuard && user && !userHasRole(user, matchedGuard.role);

	if (missingUser || missingRole) {
		event.locals.authFailure = {
			reason: missingUser ? "unauthenticated" : "forbidden",
			requiredRole: matchedGuard?.role ?? null,
		};

		if (!isLoginRoute) {
			const target = new URL("/login", event.url);
			const redirectTo = event.url.pathname + event.url.search;
			target.searchParams.set("redirectTo", redirectTo);
			target.searchParams.set("reason", event.locals.authFailure.reason);
			if (event.locals.authFailure.requiredRole) {
				target.searchParams.set("requiredRole", event.locals.authFailure.requiredRole);
			}

			throw redirect(303, target);
		}
	}

	// Extend the cookie lifetime when the user is active.
	if (user && authToken) {
		event.cookies.set(AUTH_COOKIE_NAME, authToken, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: secureCookie,
			maxAge: AUTH_COOKIE_MAX_AGE,
		});
	}

	return resolve(event);
};
