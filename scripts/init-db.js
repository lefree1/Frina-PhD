const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'thesis.db');
const dataPath = path.join(__dirname, '..', 'data', 'thesis-data.json');

// Ensure data directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Remove existing database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE data_items (
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

  CREATE INDEX idx_chapter_id ON data_items(chapter_id);
  CREATE INDEX idx_status ON data_items(status);
`);

// Load data from JSON file
if (fs.existsSync(dataPath)) {
  const thesisData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  const insertChapter = db.prepare('INSERT INTO chapters (chapter, title) VALUES (?, ?)');
  const insertItem = db.prepare(`
    INSERT INTO data_items 
    (chapter_id, page, paragraph, type, context, value, source, status, comment, comments, liens)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((chapters) => {
    for (const chapterData of chapters) {
      const result = insertChapter.run(chapterData.chapter, chapterData.title);
      const chapterId = result.lastInsertRowid;

      for (const item of chapterData.data) {
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
  console.log(`✓ Base de données initialisée avec ${thesisData.length} chapitres`);
} else {
  console.warn(`⚠ Fichier ${dataPath} non trouvé. Base de données créée mais vide.`);
}

db.close();
console.log('✓ Base de données créée avec succès');

