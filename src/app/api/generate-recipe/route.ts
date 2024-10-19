import { NextResponse } from 'next/server';
import { InferenceClient } from 'huggingface-hub';

const client = new InferenceClient({
  apiKey: process.env.HUGGINGFACE_API_KEY,
});

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
  }

  try {
    let recipeContent = '';
    for await (const message of client.chatCompletion({
      model: 'meta-llama/Llama-3.1-70B-Instruct',
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 1000,
      stream: true,
    })) {
      recipeContent += message.choices[0].delta.content;
    }

    return NextResponse.json({ recipe: recipeContent }, { status: 200 });
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json({ message: 'Error generating recipe' }, { status: 500 });
  }
}
