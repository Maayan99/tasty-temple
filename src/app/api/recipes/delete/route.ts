import { NextResponse } from 'next/server';
import { deleteRecipeById } from '@/lib/recipes';

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '', 10);

  if (!id) {
    return NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 });
  }

  try {
    await deleteRecipeById(id);
    return NextResponse.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}
