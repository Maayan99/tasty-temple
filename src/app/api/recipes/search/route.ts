import { NextResponse } from 'next/server';
import { searchRecipes } from '@/lib/recipes';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('term') || '';
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    const recipes = await searchRecipes(searchTerm, limit);
    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
    return NextResponse.json({ error: 'Failed to search recipes' }, { status: 500 });
  }
}
