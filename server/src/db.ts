import Database from "better-sqlite3";

export const db: Database.Database = new Database("wardrobe.db");

db.exec(` CREATE TABLE IF NOT EXISTS clothing_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '',
    season TEXT NOT NULL DEFAULT 'all'
      CHECK (season IN ('spring', 'summer', 'autumn', 'winter', 'all')),
    favorite INTEGER NOT NULL DEFAULT 0 CHECK (favorite IN (0, 1)),
    image_url TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
  `);
