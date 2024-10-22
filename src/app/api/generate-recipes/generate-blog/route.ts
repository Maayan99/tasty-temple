import { NextResponse } from 'next/server';
import { HfInference } from "@huggingface/inference";

const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

async function parseJSON(content: string, retryCount: number = 0): Promise<any> {
  try {
    return JSON.parse(content);
  } catch (error: any) {
    if (retryCount >= 2) {
      throw error;
    }

    console.log("Failed parseJSON with retry ", retryCount, " on error: ", error.message);

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
  console.log("Received request at generate-blog");
  const { recipe } = await request.json();

  console.log("Received recipe: ", recipe);

  try {
    const blogPrompt = `Create a detailed, engaging, and SEO-optimized blog post for the following recipe:

    Title: ${recipe.title}
    Description: ${recipe.description}
    Cooking Time: ${recipe.cookingTime} minutes
    Difficulty: ${recipe.difficulty}
    Servings: ${recipe.servings}
    Ingredients: ${JSON.stringify(recipe.ingredients)}
    Instructions: ${JSON.stringify(recipe.instructions)}
    Main Image Prompt: ${recipe.imagePrompt}

    Please follow these guidelines:
    1. Write a blog post of about 400-600 words.
    2. Include an engaging introduction that hooks the reader.
    3. Discuss the origin or history of the dish, if relevant.
    4. Explain why this recipe is special or worth trying.
    5. Provide tips for ingredient selection or preparation.
    6. Suggest variations or substitutions for dietary restrictions.
    7. Offer serving suggestions or pairing recommendations.
    8. Include personal anecdotes or stories related to the recipe.
    9. Use headings and subheadings to structure the content (use # for main headings and ## for subheadings).
    10. Incorporate relevant keywords naturally throughout the text for SEO.
    11. Conclude with a call-to-action encouraging readers to try the recipe.
    12. Use '<<IMAGE X>>' placeholders where X is the image number (1, 2, 3, etc.) to indicate where images should be placed.
    13. Generate 3-5 image prompts for AI image generation, along with SEO-optimized alt text for each image.
    14. Do not include any external links or phrases like '[Insert Link]' in the blog content.
    15. Ensure that image prompts are not part of the blog content itself.
    16. Use '\n' for line breaks and ensure there are at least 8 paragraphs in the blog content.
    17. Follow the structure and style of the example blog post provided, maintaining a similar tone and level of detail.

    Format the output as a JSON object with the following structure:
    {
      "blogContent": "Full blog post content with headings and image placeholders",
      "blogSummary": "A 35-word summary of the blog post",
      "blogImagePrompts": [
        { "prompt": "Detailed image generation prompt", "altText": "SEO-optimized alt text for the image" }
      ]
    }

    <CRITICAL> Respond with a valid JSON object with the exact fields and structure described. Your response will be programmatically analyzed, so this is super important </CRITICAL>

    If you do not respond with the correct format, your response will be useless to me. Please make sure to respond correctly.
    `;

    let blogContent = '';
    console.log("Making huggingface request for blog generation");
    for await (const chunk of inference.chatCompletionStream({
      model: 'meta-llama/Llama-3.1-70B-Instruct',
      messages: [{ role: 'user', content: blogPrompt }],
      max_tokens: 9000,
    })) {
      blogContent += chunk.choices[0]?.delta?.content || '';
    }

    console.log("Received uncleaned blog resp from huggingface: ", blogContent);

    const cleanedBlogJson = blogContent.substring(
      blogContent.indexOf('{'),
      blogContent.lastIndexOf('}') + 1
    );

    console.log("Received full blog resp from huggingface: ", cleanedBlogJson);

    const generatedBlog = await parseJSON(cleanedBlogJson);

    console.log("Generated blog keys: ", Object.keys(generatedBlog));

    const response = NextResponse.json({
      message: 'Blog content generated',
      generatedBlog
    }, { status: 200 });

    // Add headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch(error: any) {
    console.error('Error generating blog content:', error);
    return NextResponse.json({ error: 'Failed to generate blog content' }, { status: 500 });
  }
}
