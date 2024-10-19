import { NextResponse } from 'next/server';
import { HfInference } from "@huggingface/inference";

const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: Request) {
  const { direction } = await request.json();

  try {
    // Generate 3 recipe ideas
    const ideasPrompt = `Generate 3 unique and creative recipe ideas ${direction ? `based on the following direction: ${direction}` : ''}. Each recipe should be innovative, delicious, and suitable for a food blog. Include a catchy title and a brief, appetizing description for each. Ensure diversity in cuisines, cooking methods, and ingredients. Format the output as a JSON array of objects with 'title' and 'description' fields.`;
    
    let ideasContent = '';
    for await (const chunk of inference.chatCompletionStream({
      model: 'meta-llama/Llama-3.1-70B-Instruct',
      messages: [{ role: 'user', content: ideasPrompt }],
      max_tokens: 500,
    })) {
      ideasContent += chunk.choices[0]?.delta?.content || '';
    }

    const cleanedIdeasJson = ideasContent.substring(
      ideasContent.indexOf('['),
      ideasContent.lastIndexOf(']') + 1
    );

    const recipeIdeas = JSON.parse(cleanedIdeasJson);

    console.log('Recipe ideas generated', recipeIdeas);

    return NextResponse.json({ message: 'Recipe ideas generated', recipeIdeas }, { status: 200 });
  } catch (error) {
    console.error('Error generating recipe ideas:', error);
    return NextResponse.json({
      message: 'Error generating recipe ideas',
      error: (error as Error).message,
    }, { status: 500 });
  }
}
