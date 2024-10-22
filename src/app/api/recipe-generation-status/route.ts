import { NextResponse } from 'next/server';

export async function GET() {
  // In a real application, you would fetch the actual status from a database or a state management system
  // For this example, we'll return a mock status
  const mockStatus = ['Generating Ideas', 'Creating Full Recipes', 'Finalizing Recipes'][Math.floor(Math.random() * 3)];

  return NextResponse.json({ status: mockStatus });
}
