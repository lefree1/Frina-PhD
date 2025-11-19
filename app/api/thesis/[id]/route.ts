import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDatabase();
    const body = await request.json();
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const update = db.prepare(`
      UPDATE data_items 
      SET 
        page = ?,
        paragraph = ?,
        type = ?,
        context = ?,
        value = ?,
        source = ?,
        status = ?,
        comment = ?,
        comments = ?,
        liens = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = update.run(
      String(body.page || ''),
      String(body.paragraph || ''),
      body.type || '',
      body.context || '',
      body.value || '',
      body.source || '',
      body.status || 'pending',
      body.comment || '',
      body.comments || '',
      body.liens || '',
      id
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Get updated item
    const updatedItem = db.prepare('SELECT * FROM data_items WHERE id = ?').get(id) as any;

    return NextResponse.json({
      id: updatedItem.id,
      page: updatedItem.page,
      paragraph: updatedItem.paragraph,
      type: updatedItem.type,
      context: updatedItem.context,
      value: updatedItem.value,
      source: updatedItem.source,
      status: updatedItem.status,
      comment: updatedItem.comment,
      comments: updatedItem.comments,
      liens: updatedItem.liens,
    });
  } catch (error: any) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDatabase();
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const deleteItem = db.prepare('DELETE FROM data_items WHERE id = ?');
    const result = deleteItem.run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

