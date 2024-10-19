import { NextResponse } from 'next/server';
import { updateRecipe, deleteRecipeById } from '@/lib/recipes';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const data = await request.json();

  try {
    const updatedRecipe = await updateRecipe(id, data);
    return NextResponse.json(updatedRecipe);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
    await deleteRecipeById(id);
    return NextResponse.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}
