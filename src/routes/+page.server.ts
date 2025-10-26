import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

/**
 * Redirects the root path to the dedicated quotes dashboard route.
 */
export const load: PageServerLoad = async () => {
	throw redirect(302, "/quotes");
};
