import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// On Vercel/serverless, use /tmp for writable storage
// In production, we'll need to use a read-only database initialized at build time
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel 
  ? path.join('/tmp', 'thesis.db')
  : path.join(process.cwd(), 'data', 'thesis.db');
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

  // Initialize database (create if doesn't exist)
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  
  // Check if tables exist by querying chapters
  let needsInit = false;
  try {
    db.prepare('SELECT COUNT(*) FROM chapters').get();
  } catch {
    needsInit = true;
  }

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
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_chapter_id ON data_items(chapter_id);
    CREATE INDEX IF NOT EXISTS idx_status ON data_items(status);
  `);

  // Initialize with data if database is empty and we're on Vercel
  if (needsInit && isVercel) {
    try {
      const dataPath = path.join(process.cwd(), 'data', 'thesis-data.json');
      if (fs.existsSync(dataPath)) {
        const thesisData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        
        const insertChapter = db.prepare('INSERT INTO chapters (chapter, title) VALUES (?, ?)');
        const insertItem = db.prepare(`
          INSERT INTO data_items 
          (chapter_id, page, paragraph, type, context, value, source, status, comment, comments, liens)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const insertMany = db.transaction((chapters: any[]) => {
          for (const chapterData of chapters) {
            const result = insertChapter.run(chapterData.chapter, chapterData.title);
            const chapterId = result.lastInsertRowid;

            for (const item of chapterData.data || []) {
              insertItem.run(
                chapterId,
                String(item.page || ''),
                String(item.paragraph || ''),
                item.type || '',
                item.context || '',
                item.value || '',
                item.source || '',
                item.status || 'pending',
                item.comment || '',
                item.comments || item.comment || '',
                item.liens || ''
              );
            }
          }
        });

        insertMany(thesisData);
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

