import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const searchParams = request.nextUrl.searchParams;
    const chapter = searchParams.get('chapter');

    if (chapter) {
      // Get specific chapter with its data items
      const chapterData = db
        .prepare('SELECT * FROM chapters WHERE chapter = ?')
        .get(chapter) as any;

      if (!chapterData) {
        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
      }

      const items = db
        .prepare('SELECT * FROM data_items WHERE chapter_id = ? ORDER BY id')
        .all(chapterData.id) as any[];

      return NextResponse.json({
        chapter: chapterData.chapter,
        title: chapterData.title,
        data: items.map((item) => ({
          id: item.id,
          page: item.page,
          paragraph: item.paragraph,
          type: item.type,
          context: item.context,
          value: item.value,
          source: item.source,
          status: item.status,
          comment: item.comment,
          comments: item.comments,
          liens: item.liens,
        })),
      });
    } else {
      // Get all chapters
      const chapters = db.prepare('SELECT chapter, title FROM chapters ORDER BY id').all() as any[];
      return NextResponse.json(chapters);
    }
  } catch (error: any) {
    console.error('Error fetching thesis data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

