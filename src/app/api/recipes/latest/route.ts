import { NextResponse } from 'next/server';
import { getLatestRecipes } from '@/lib/recipes';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '6', 10);

  try {
    const recipes = await getLatestRecipes(limit);
    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Error fetching latest recipes:', error);
    return NextResponse.json({ error: 'Failed to fetch latest recipes' }, { status: 500 });
  }
}
