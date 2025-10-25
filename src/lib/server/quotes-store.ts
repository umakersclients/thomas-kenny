/**
 * Provides filesystem-backed storage helpers for the South Park quotes dataset.
 */
import { access, mkdir, readFile, writeFile } from "fs/promises";
import { constants as fsConstants } from "fs";
import path from "path";
import { fetchQuotes, type Quote } from "$lib/api/fetch-quotes";

const DATA_DIRECTORY = path.resolve("data");
const QUOTES_FILE_PATH = path.join(DATA_DIRECTORY, "quotes.json");

async function ensureDataDirectoryExists() {
	await mkdir(DATA_DIRECTORY, { recursive: true });
}

async function fileExists(filePath: string) {
	try {
		await access(filePath, fsConstants.F_OK);
		return true;
	} catch {
		return false;
	}
}

/**
 * Ensures the quotes file exists, fetching the dataset from the API if required.
 * Returns the freshly fetched data when the file needed to be created.
 */
export async function ensureQuotesDataset(fetcher: typeof fetch): Promise<Quote[] | null> {
	await ensureDataDirectoryExists();

	const exists = await fileExists(QUOTES_FILE_PATH);

	if (exists) {
		return null;
	}

	const quotes = await fetchQuotes(fetcher);
	await writeQuotesDataset(quotes);

	return quotes;
}

/**
 * Reads the complete quotes dataset from the persisted JSON file.
 */
export async function readQuotesDataset(): Promise<Quote[]> {
	await ensureDataDirectoryExists();

	const contents = await readFile(QUOTES_FILE_PATH, "utf-8");
	return JSON.parse(contents) as Quote[];
}

/**
 * Persists the provided dataset to the quotes JSON file.
 */
export async function writeQuotesDataset(quotes: Quote[]) {
	await ensureDataDirectoryExists();
	await writeFile(QUOTES_FILE_PATH, JSON.stringify(quotes, null, 2), "utf-8");
}

/**
 * Updates a single quote in the stored dataset and returns the updated record.
 */
export async function updateQuoteRecord(
	id: string,
	payload: Pick<Quote, "quote" | "character">,
): Promise<Quote> {
	const quotes = await readQuotesDataset();
	const index = quotes.findIndex((quote) => quote.id === id);

	if (index === -1) {
		throw new Error(`Quote with id "${id}" was not found.`);
	}

	const updatedQuote: Quote = {
		...quotes[index],
		...payload,
	};

	quotes[index] = updatedQuote;

	await writeQuotesDataset(quotes);

	return updatedQuote;
}
