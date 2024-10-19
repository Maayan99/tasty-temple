import { NextResponse } from 'next/server';
import { getFeaturedRecipes } from '@/lib/recipes';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '3', 10);

  try {
    const recipes = await getFeaturedRecipes(limit);
    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Error fetching featured recipes:', error);
    return NextResponse.json({ error: 'Failed to fetch featured recipes' }, { status: 500 });
  }
}
