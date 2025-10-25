/**
 * Provides SQLite-backed storage helpers for the South Park quotes dataset.
 */
import Database from "better-sqlite3";
import { mkdir } from "fs/promises";
import path from "path";
import { fetchQuotes, type Quote } from "$lib/api/fetch-quotes";

const DATA_DIRECTORY = path.resolve("data");
const DATABASE_PATH = path.join(DATA_DIRECTORY, "quotes.db");

let db: Database.Database | null = null;

async function ensureDataDirectoryExists() {
	await mkdir(DATA_DIRECTORY, { recursive: true });
}

function getDbInstance(): Database.Database {
	if (db) {
		return db;
	}

	db = new Database(DATABASE_PATH);
	db.pragma("journal_mode = WAL");
	db.exec(`
		CREATE TABLE IF NOT EXISTS quotes (
			id TEXT PRIMARY KEY,
			quote TEXT NOT NULL,
			character TEXT NOT NULL
		)
	`);

	return db;
}

/**
 * Ensures the database has a quotes dataset. If empty, the dataset is fetched and persisted.
 */
export async function ensureQuotesDataset(fetcher: typeof fetch): Promise<void> {
	await ensureDataDirectoryExists();
	const database = getDbInstance();

	const { count } = database.prepare("SELECT COUNT(*) AS count FROM quotes").get() as {
		count: number;
	};

	if (count > 0) {
		return;
}

	const quotes = await fetchQuotes(fetcher);
	const insert = database.prepare(
		"INSERT OR REPLACE INTO quotes (id, quote, character) VALUES (@id, @quote, @character)",
	);

	const insertMany = database.transaction((records: Quote[]) => {
		for (const record of records) {
			insert.run(record);
		}
	});

	insertMany(quotes);
}

/**
 * Reads all quotes from the SQLite database.
 */
export async function readQuotesDataset(): Promise<Quote[]> {
	await ensureDataDirectoryExists();
	const database = getDbInstance();

	const statement = database.prepare(
		"SELECT id, quote, character FROM quotes ORDER BY rowid ASC",
	);

	return statement.all() as Quote[];
}

/**
 * Updates a single quote record and returns the new value.
 */
export async function updateQuoteRecord(
	id: string,
	payload: Pick<Quote, "quote" | "character">,
): Promise<Quote> {
	await ensureDataDirectoryExists();
	const database = getDbInstance();

	const update = database.prepare(
		"UPDATE quotes SET quote = @quote, character = @character WHERE id = @id",
	);

	const result = update.run({
		id,
		quote: payload.quote,
		character: payload.character,
	});

	if (result.changes === 0) {
		throw new Error(`Quote with id "${id}" was not found.`);
	}

	return {
		id,
		quote: payload.quote,
		character: payload.character,
	};
}
