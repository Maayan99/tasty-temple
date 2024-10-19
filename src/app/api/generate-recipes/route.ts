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
    const ideasPrompt = `Generate 3 unique and creative recipe ideas ${direction ? `based on the following direction: ${direction}` : ''}. Each recipe should be innovative, delicious, and suitable for a food blog. Include a catchy title and a brief, appetizing description for each. Ensure diversity in cuisines, cooking methods, and ingredients. Format the output as a JSON array of objects with 'title' and 'description' fields.`;
    
    let ideasContent = '';
    for await (const chunk of inference.chatCompletionStream({
      model: 'meta-llama/Llama-3.1-70B-Instruct',
      messages: [{ role: 'user', content: ideasPrompt }],
      max_tokens: 500,
    })) {
      ideasContent += chunk.choices[0]?.delta?.content || '';
    }

    console.log('Raw ideas response:', ideasContent);

    const cleanedIdeasJson = ideasContent.substring(
      ideasContent.indexOf('['),
      ideasContent.lastIndexOf(']') + 1
    );

    console.log('Cleaned ideas JSON:', cleanedIdeasJson);

    let recipeIdeas: RecipeIdea[];
    try {
      recipeIdeas = JSON.parse(cleanedIdeasJson);
    } catch (parseError) {
      console.error('Error parsing ideas JSON:', parseError);
      throw new Error(`Failed to parse ideas JSON: ${(parseError as Error).message}`);
    }
    log.push(`Generated ${recipeIdeas.length} recipe ideas.`);

    // Generate full recipes for each idea
    for (const idea of recipeIdeas) {
      log.push(`Generating full recipe for: ${idea.title}`);
      const recipePrompt = `Create a detailed, professional-quality recipe for "${idea.title}" based on this description: "${idea.description}". The recipe should be suitable for a high-quality food blog. Include precise measurements, clear instructions, and consider dietary variations or substitutions where appropriate. Format the output as a JSON object with the following structure:
      {
        "title": "Recipe Title",
        "description": "Engaging and appetizing description",
        "cookingTime": 30,
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
      Ensure all fields are filled with appropriate, realistic values.`;

      let recipeContent = '';
      for await (const chunk of inference.chatCompletionStream({
        model: 'meta-llama/Llama-3.1-70B-Instruct',
        messages: [{ role: 'user', content: recipePrompt }],
        max_tokens: 2000,
      })) {
        recipeContent += chunk.choices[0]?.delta?.content || '';
      }

      console.log('Raw recipe response:', recipeContent);

      const cleanedRecipeJson = recipeContent.substring(
        recipeContent.indexOf('{'),
        recipeContent.lastIndexOf('}') + 1
      );

      console.log('Cleaned recipe JSON:', cleanedRecipeJson);

      let generatedRecipe: GeneratedRecipe;
      try {
        generatedRecipe = JSON.parse(cleanedRecipeJson);
      } catch (parseError) {
        console.error('Error parsing recipe JSON:', parseError);
        throw new Error(`Failed to parse recipe JSON: ${(parseError as Error).message}`);
      }

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
    return NextResponse.json({
      message: 'Error generating recipes',
      log,
      error: (error as Error).message,
      stack: (error as Error).stack,
      rawError: JSON.stringify(error, Object.getOwnPropertyNames(error))
    }, { status: 500 });
  }
}
