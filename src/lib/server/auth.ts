/**
 * Lightweight helpers for verifying credentials against the local users.json dataset and managing
 * session cookies used for protecting pages inside the dashboard.
 */
import { readFile } from "fs/promises";
import { resolve } from "path";

const USERS_FILE_PATH = resolve("data/users.json");

export type UserAccount = {
	username: string;
	password: string;
	roles: string[];
};

export type AuthFailure = {
	reason: "unauthenticated" | "forbidden";
	requiredRole: string | null;
};

export const AUTH_COOKIE_NAME = "spq-auth";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // seven days

let cachedUsers: UserAccount[] | null = null;

/**
 * Loads the user dataset from disk (with basic in-memory caching for repeat checks).
 */
async function loadUsers(): Promise<UserAccount[]> {
	if (cachedUsers) {
		return cachedUsers;
	}

	const raw = await readFile(USERS_FILE_PATH, "utf-8");
	const parsed = JSON.parse(raw) as UserAccount[];
	// Cache parsed users so subsequent auth checks avoid hitting the filesystem.
	cachedUsers = parsed;
	return parsed;
}

/**
 * Attempts to find a user matching the provided credentials.
 */
export async function findUserByCredentials(
	username: string,
	password: string,
): Promise<UserAccount | null> {
	const users = await loadUsers();
	return users.find((user) => user.username === username && user.password === password) ?? null;
}

/**
 * Encodes the username/password pair into the token stored in the auth cookie.
 */
export function createAuthToken(username: string, password: string): string {
	return Buffer.from(`${username}:${password}`, "utf-8").toString("base64");
}

/**
 * Attempts to extract credentials from the persisted auth token.
 */
export function parseAuthToken(token: string): { username: string; password: string } | null {
	try {
		const decoded = Buffer.from(token, "base64").toString("utf-8");
		const separatorIndex = decoded.indexOf(":");
		if (separatorIndex === -1) {
			return null;
		}

		return {
			username: decoded.slice(0, separatorIndex),
			password: decoded.slice(separatorIndex + 1),
		};
	} catch (cause) {
		console.error("Failed to decode auth token", cause);
		return null;
	}
}

/**
 * Retrieves the user associated with the supplied auth token.
 */
export async function getUserFromToken(token: string): Promise<UserAccount | null> {
	const credentials = parseAuthToken(token);
	if (!credentials) {
		return null;
	}

	return findUserByCredentials(credentials.username, credentials.password);
}

/**
 * Utility to determine if a user has the required role flag.
 */
export function userHasRole(user: UserAccount, requiredRole: string): boolean {
	return user.roles.includes(requiredRole);
}
