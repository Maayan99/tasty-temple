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
    const ideasPrompt = `Generate 3 unique recipe ideas ${direction ? `based on the following direction: ${direction}` : ''}. Include a title and brief description for each. ${Math.random().toString(36).substring(7)}`;
    const ideasResponse = await inference.textGeneration({
      model: 'meta-llama/Llama-3.1-70B-Instruct',
      inputs: ideasPrompt,
      parameters: { max_new_tokens: 250 },
    });
    const recipeIdeas: RecipeIdea[] = JSON.parse(ideasResponse.generated_text);
    log.push(`Generated ${recipeIdeas.length} recipe ideas.`);

    // Generate full recipes for each idea
    for (const idea of recipeIdeas) {
      log.push(`Generating full recipe for: ${idea.title}`);
      const recipePrompt = `Generate a detailed recipe for "${idea.title}" in the following JSON format:
      {
        "title": "Recipe Title",
        "description": "Brief description",
        "cookingTime": 30,
        "difficulty": "Easy|Medium|Hard",
        "servings": 4,
        "ingredients": [
          { "name": "Ingredient", "quantity": 1, "unit": "cup" }
        ],
        "instructions": [
          "Step 1",
          "Step 2"
        ],
        "nutrition": {
          "calories": 300,
          "protein": 10,
          "carbs": 30,
          "fat": 15
        },
        "imagePrompt": "Prompt for generating an image of this recipe",
        "imageAltText": "Alt text for the recipe image"
      }
      ${Math.random().toString(36).substring(7)}`;

      const recipeResponse = await inference.textGeneration({
        model: 'meta-llama/Llama-3.1-70B-Instruct',
        inputs: recipePrompt,
        parameters: { max_new_tokens: 1000 },
      });

      const generatedRecipe: GeneratedRecipe = JSON.parse(recipeResponse.generated_text);

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
