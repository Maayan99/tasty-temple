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
  console.log("Received request at generate-full-recipe");
  const { recipeIdeas } = await request.json();

  console.log("Received recipe ideas: ", recipeIdeas);

  const generatedRecipes = [];

  for (const idea of recipeIdeas) {
    try {
      const recipePrompt = `Create a detailed, professional-quality recipe in English for "${idea.title}" based on this description: "${idea.description}". The recipe should be suitable for a high-quality food blog. Include precise measurements, clear instructions, and consider dietary variations or substitutions where appropriate. Also, generate a blog post content about this recipe, detailing things to know about the recipe, the creation process, and some of the decisions behind the recipe. The blog content should be focused on increasing SEO visibility. Additionally, provide 3-5 image prompts for generating visuals related to the recipe, along with SEO-optimized alt text for each image. Format the output as a JSON object with the following structure:
      {
        "title": "Recipe Title",
        "description": "Engaging and appetizing description",
        "cookingTime": 30,
        "difficulty": "Easy|Medium|Hard",
        "servings": 4,
        "ingredients": [
          { "name": "Ingredient", "quantity": "1", "unit": "cup" }
        ],
        "instructions": [
          "Detailed step 1",
          "Detailed step 2"
        ],
        "nutrition": {
          "calories": 300,
          "protein": 10,
          "carbs": 30,
          "fat": 15
        },
        "imagePrompt": "Detailed prompt for generating an appetizing image of this recipe",
        "imageAltText": "Descriptive alt text for the recipe image",
        "blogSummary": "Summary of the blog that will accompany this recipe",
        "blogImagePrompts": [
          { "prompt": "Image prompt 1", "altText": "SEO-optimized alt text for image 1" },
          { "prompt": "Image prompt 2", "altText": "SEO-optimized alt text for image 2" }
        ],  
        "blogContent": "Detailed 700-800 words blog post content about the recipe. You must use <<IMAGE 1>>, <<IMAGE 2>>, etc. to indicate where images should be placed in the blog content, and include titles using # in the beggining of a line to indicate title. Use \n for a newline, must include at least 8 paragraphs.",
      }`;

      let recipeContent = '';
      for await (const chunk of inference.chatCompletionStream({
        model: 'meta-llama/Llama-3.1-70B-Instruct',
        messages: [{ role: 'user', content: recipePrompt }],
        max_tokens: 7000,
      })) {
        recipeContent += chunk.choices[0]?.delta?.content || '';
      }

      const cleanedRecipeJson = recipeContent.substring(
        recipeContent.indexOf('{'),
        recipeContent.lastIndexOf('}') + 1
      );

      const generatedRecipe = await parseJSON(cleanedRecipeJson);

      console.log("Generated recipe: ", generatedRecipe);
      console.log("Recipe title: ", (generatedRecipe as any).title);

      generatedRecipes.push(generatedRecipe);
    } catch(error: any) {
      console.error('Error generating full recipes:', error);
      continue;
    }
  }

  const response = NextResponse.json({
    message: 'Full recipes generated',
    generatedRecipes
  }, { status: 200 });

  // Add headers to prevent caching
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}
