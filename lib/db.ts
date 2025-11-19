import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'thesis.db');
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database connection
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (db) {
    return db;
  }

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chapter TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS data_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chapter_id INTEGER NOT NULL,
      page TEXT NOT NULL,
      paragraph TEXT NOT NULL,
      type TEXT NOT NULL,
      context TEXT NOT NULL,
      value TEXT NOT NULL,
      source TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      comment TEXT DEFAULT '',
      comments TEXT DEFAULT '',
      liens TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
      UNIQUE(chapter_id, page, paragraph, context)
    );

    CREATE INDEX IF NOT EXISTS idx_chapter_id ON data_items(chapter_id);
    CREATE INDEX IF NOT EXISTS idx_status ON data_items(status);
  `);

  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

