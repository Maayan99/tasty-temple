import { NextResponse } from 'next/server';
import { HfInference } from "@huggingface/inference";

const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

async function parseJSON(content: string, retryCount: number = 0): Promise<any> {
  try {
    return JSON.parse(content);
  } catch (error) {
    if (retryCount >= 2) {
      throw error;
    }

    const errorMessage = (error as Error).message;
    const match = errorMessage.match(/position (\d+)/);
    const position = match ? parseInt(match[1]) : null;

    const fixPrompt = `The following JSON has an error ${position ? `at position ${position}` : ''}. Please fix and rewrite the entire JSON correctly:\n\n${content}`;

    let fixedContent = '';
    for await (const chunk of inference.chatCompletionStream({
      model: 'meta-llama/Llama-3.1-70B-Instruct',
      messages: [{ role: 'user', content: fixPrompt }],
      max_tokens: 7000,
    })) {
      fixedContent += chunk.choices[0]?.delta?.content || '';
    }

    const cleanedFixedContent = fixedContent.substring(
      fixedContent.indexOf('{'),
      fixedContent.lastIndexOf('}') + 1
    );

    return parseJSON(cleanedFixedContent, retryCount + 1);
  }
}

export async function POST(request: Request) {
  const { direction, selectedCuisines, innovationLevel } = await request.json();

  try {
    // Generate 3 recipe ideas
    let ideasPrompt = `Generate 1 unique and creative recipe idea`;
    
    if (direction) {
      ideasPrompt += ` based on the following direction: ${direction}`;
    }
    
    if (selectedCuisines && selectedCuisines.length > 0) {
      ideasPrompt += ` The recipe should incorporate elements from the following cuisines: ${selectedCuisines.join(', ')}.`;
    }
    
    if (innovationLevel !== undefined) {
      if (innovationLevel < 30) {
        ideasPrompt += ` The recipe should be relatively classic and traditional.`;
      } else if (innovationLevel > 70) {
        ideasPrompt += ` The recipe should be highly innovative and incorporate unexpected twists.`;
      } else {
        ideasPrompt += ` The recipe should balance traditional elements with some innovative touches.`;
      }
    }
    
    ideasPrompt += ` Each recipe should be innovative, delicious, and suitable for a food blog. Include a catchy title and a brief, appetizing description for each. Ensure diversity in cooking methods and ingredients. Format the output as a JSON array of objects with 'title' and 'description' fields.`;
    
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

    const recipeIdeas = await parseJSON(cleanedIdeasJson);

    console.log('Recipe ideas generated', recipeIdeas);

    const response = NextResponse.json({ message: 'Recipe ideas generated', recipeIdeas }, { status: 200 });

    // Add headers to prevent caching for error responses too
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error generating recipe ideas:', error);
    const response = NextResponse.json({
      message: 'Error generating recipe ideas',
      error: (error as Error).message,
    }, { status: 500 });

    // Add headers to prevent caching for error responses too
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  }
}
