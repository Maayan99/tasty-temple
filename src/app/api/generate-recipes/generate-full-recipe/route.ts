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

  try {
    for (const idea of recipeIdeas) {
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
        "blogContent": "Detailed 500-600 words blog post content about the recipe. Use <<IMAGE 1>>, <<IMAGE 2>>, etc. to indicate where images should be placed in the blog content.",
        "blogImagePrompts": [
          { "prompt": "Image prompt 1", "altText": "SEO-optimized alt text for image 1" },
          { "prompt": "Image prompt 2", "altText": "SEO-optimized alt text for image 2" }
        ]
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

      // Call the next step in the process
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-recipes/generate-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generatedRecipe }),
      });

      
      console.log('called generate-images');
    }

    return NextResponse.json({ message: 'Full recipes generated' }, { status: 200 });
  } catch (error) {
    console.error('Error generating full recipes:', error);
    return NextResponse.json({
      message: 'Error generating full recipes',
      error: (error as Error).message,
    }, { status: 500 });
  }
}
