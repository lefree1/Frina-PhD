import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const db = getDatabase();
    const body = await request.json();

    // Get chapter_id from chapter name
    const chapter = db
      .prepare('SELECT id FROM chapters WHERE chapter = ?')
      .get(body.chapter) as any;

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const insert = db.prepare(`
      INSERT INTO data_items 
      (chapter_id, page, paragraph, type, context, value, source, status, comment, comments, liens)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      chapter.id,
      String(body.page || ''),
      String(body.paragraph || ''),
      body.type || '',
      body.context || '',
      body.value || '',
      body.source || '',
      body.status || 'pending',
      body.comment || '',
      body.comments || '',
      body.liens || ''
    );

    // Get created item
    const newItem = db
      .prepare('SELECT * FROM data_items WHERE id = ?')
      .get(result.lastInsertRowid) as any;

    return NextResponse.json({
      id: newItem.id,
      page: newItem.page,
      paragraph: newItem.paragraph,
      type: newItem.type,
      context: newItem.context,
      value: newItem.value,
      source: newItem.source,
      status: newItem.status,
      comment: newItem.comment,
      comments: newItem.comments,
      liens: newItem.liens,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

