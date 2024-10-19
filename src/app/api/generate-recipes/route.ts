import { NextResponse } from 'next/server';
import { HfInference } from "@huggingface/inference";
import { PrismaClient } from '@prisma/client';

const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);
const prisma = new PrismaClient();

interface RecipeIdea {
  title: string;
  description: string;
}

interface GeneratedRecipe {
  title: string;
  description: string;
  cookingTime: number;
  difficulty: string;
  servings: number;
  ingredients: { name: string; quantity: number; unit: string }[];
  instructions: string[];
  nutrition: { [key: string]: number };
  imagePrompt: string;
  imageAltText: string;
}

export async function POST(request: Request) {
  const { direction } = await request.json();
  const log: string[] = [];

  try {
    // Generate 3 recipe ideas
    log.push('Generating recipe ideas...');
    const ideasPrompt = `Generate 3 unique and creative recipe ideas ${direction ? `based on the following direction: ${direction}` : ''}. Each recipe should be innovative, delicious, and suitable for a food blog. Include a catchy title and a brief, appetizing description for each. Ensure diversity in cuisines, cooking methods, and ingredients. Format the output as a JSON array of objects with 'title' and 'description' fields. ${Math.random().toString(36).substring(7)}`;
    const ideasResponse = await inference.textGeneration({
      model: 'meta-llama/Llama-3.1-70B-Instruct',
      inputs: ideasPrompt,
      parameters: { max_new_tokens: 500 },
    });
    const cleanedIdeasJson = ideasResponse.generated_text.substring(
      ideasResponse.generated_text.indexOf('['),
      ideasResponse.generated_text.lastIndexOf(']') + 1
    );
    const recipeIdeas: RecipeIdea[] = JSON.parse(cleanedIdeasJson);
    log.push(`Generated ${recipeIdeas.length} recipe ideas.`);

    // Generate full recipes for each idea
    for (const idea of recipeIdeas) {
      log.push(`Generating full recipe for: ${idea.title}`);
      const recipePrompt = `Create a detailed, professional-quality recipe for "${idea.title}" based on this description: "${idea.description}". The recipe should be suitable for a high-quality food blog. Include precise measurements, clear instructions, and consider dietary variations or substitutions where appropriate. Format the output as a JSON object with the following structure:
      {
        "title": "Recipe Title",
        "description": "Engaging and appetizing description",
        "cookingTime": 30, // Total time in minutes
        "difficulty": "Easy|Medium|Hard",
        "servings": 4,
        "ingredients": [
          { "name": "Ingredient", "quantity": 1, "unit": "cup" }
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
        "imageAltText": "Descriptive alt text for the recipe image"
      }
      Ensure all fields are filled with appropriate, realistic values. ${Math.random().toString(36).substring(7)}`;

      const recipeResponse = await inference.textGeneration({
        model: 'meta-llama/Llama-3.1-70B-Instruct',
        inputs: recipePrompt,
        parameters: { max_new_tokens: 2000 },
      });

      const cleanedRecipeJson = recipeResponse.generated_text.substring(
        recipeResponse.generated_text.indexOf('{'),
        recipeResponse.generated_text.lastIndexOf('}') + 1
      );
      const generatedRecipe: GeneratedRecipe = JSON.parse(cleanedRecipeJson);

      // Save the recipe to the database
      log.push(`Saving recipe to database: ${generatedRecipe.title}`);
      await prisma.recipe.create({
        data: {
          title: generatedRecipe.title,
          description: generatedRecipe.description,
          cookingTime: generatedRecipe.cookingTime,
          difficulty: generatedRecipe.difficulty,
          servings: generatedRecipe.servings,
          imageUrl: '', // We'll update this later when we implement image generation
          instructions: generatedRecipe.instructions.join('\n'),
          nutrition: JSON.stringify(generatedRecipe.nutrition),
          ingredients: {
            create: generatedRecipe.ingredients.map(ing => ({
              quantity: ing.quantity,
              ingredient: {
                connectOrCreate: {
                  where: { name: ing.name },
                  create: { name: ing.name, unit: ing.unit },
                },
              },
            })),
          },
        },
      });
      log.push(`Recipe saved successfully: ${generatedRecipe.title}`);
    }

    return NextResponse.json({ message: 'Recipes generated and saved successfully', log }, { status: 200 });
  } catch (error) {
    console.error('Error generating recipes:', error);
    return NextResponse.json({ message: 'Error generating recipes', log }, { status: 500 });
  }
}
