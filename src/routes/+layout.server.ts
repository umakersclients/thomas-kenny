/**
 * Provides global layout data (current user and active auth failure state) for the root layout.
 */
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		user: locals.user,
		authFailure: locals.authFailure,
	};
};
