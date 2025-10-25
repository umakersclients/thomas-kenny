/**
 * Provides utilities for retrieving and normalising South Park quotes from the public quotes API.
 */
const QUOTES_ENDPOINT = "https://southparkquotes.onrender.com/v1/quotes/500";

export type QuoteApiRecord = {
	quote: string;
	character: string;
};

export type Quote = QuoteApiRecord & {
	id: string;
};

/**
 * Fetches the full list of South Park quotes from the API and adds identifiers for use in the UI.
 */
export async function fetchQuotes(fetcher: typeof fetch = fetch): Promise<Quote[]> {
	const response = await fetcher(QUOTES_ENDPOINT);

	if (!response.ok) {
		throw new Error(`Failed to load quotes: ${response.status} ${response.statusText}`);
	}

	const payload = (await response.json()) as QuoteApiRecord[];

	return payload.map((record, index) => ({
		...record,
		id: `${record.character}-${index}`,
	}));
}
