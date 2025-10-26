/**
 * Shared login/logout action handlers that issue or clear the lightweight auth cookie.
 */
import {
	AUTH_COOKIE_MAX_AGE,
	AUTH_COOKIE_NAME,
	createAuthToken,
	findUserByCredentials,
} from "$lib/server/auth";
import { fail, type RequestEvent } from "@sveltejs/kit";

const secureCookie = process.env.NODE_ENV === "production";

type ActionEvent = Pick<RequestEvent, "request" | "cookies">;

export async function loginAction({ request, cookies }: ActionEvent) {
	const formData = await request.formData();
	const username = formData.get("username")?.toString().trim() ?? "";
	const password = formData.get("password")?.toString() ?? "";
	const redirectTo = formData.get("redirectTo")?.toString().trim() || "/quotes";

	if (!username || !password) {
		return fail(400, {
			message: "Username and password are required.",
			fields: { username },
			action: "login",
			redirectTo,
		});
	}

	const user = await findUserByCredentials(username, password);
	if (!user) {
		return fail(401, {
			message: "Those credentials were not recognised.",
			fields: { username },
			action: "login",
			redirectTo,
		});
	}

	const token = createAuthToken(username, password);
	cookies.set(AUTH_COOKIE_NAME, token, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: secureCookie,
		maxAge: AUTH_COOKIE_MAX_AGE,
	});

	return {
		success: true,
		action: "login",
		username: user.username,
		redirectTo,
	};
}

export async function logoutAction({ cookies }: ActionEvent) {
	cookies.delete(AUTH_COOKIE_NAME, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: secureCookie,
	});

	return {
		success: true,
		action: "logout",
		redirectTo: "/login",
	};
}
