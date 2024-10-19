import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { recipeId: string } }) {
  const recipeId = parseInt(params.recipeId);

  try {
    const comments = await prisma.comment.findMany({
      where: { recipeId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { recipeId: string } }) {
  const recipeId = parseInt(params.recipeId);
  const { content, username } = await request.json();

  try {
    // Check if user has posted more than 2 comments in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentComments = await prisma.comment.count({
      where: {
        recipeId,
        user: username,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentComments >= 2) {
      return NextResponse.json({ message: 'You can only post 2 comments per hour' }, { status: 429 });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        user: username,
        recipe: { connect: { id: recipeId } },
      },
    });

    return NextResponse.json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
