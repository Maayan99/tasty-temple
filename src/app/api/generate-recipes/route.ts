import { NextResponse } from 'next/server';
import { HfInference } from "@huggingface/inference";
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import { uploadToB2 } from '@/lib/b2';
import { generateRandomComments } from '@/lib/comments';

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
  ingredients: { name: string; quantity: string; unit: string }[];
  instructions: string[];
  nutrition: { [key: string]: number };
  imagePrompt: string;
  imageAltText: string;
  blogContent: string;
  blogImagePrompts: { prompt: string; altText: string }[];
}

async function generateImage(prompt: string): Promise<Blob> {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    }
  );
  return await response.blob();
}

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
      recipeIdeas = await parseJSON(cleanedIdeasJson);
    } catch (parseError) {
      console.error('Error parsing ideas JSON:', parseError);
      throw new Error(`Failed to parse ideas JSON: ${(parseError as Error).message}`);
    }
    log.push(`Generated ${recipeIdeas.length} recipe ideas.`);

    // Generate full recipes for each idea
    for (const idea of recipeIdeas) {
      log.push(`Generating full recipe for: ${idea.title}`);
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
      }
      <CRITICAL> Make sure to abide by the JSON format specified and provide a valid JSON object, as your response will be programmatically analyzed </CRITICAL>

      If you do not use the correct format, your response will be useless. Make sure that it's a valid JSON object.

      Ensure all fields are filled with appropriate, realistic values, and that ingredient quantities are always numbers and enclosed in a string`;

      let recipeContent = '';
      for await (const chunk of inference.chatCompletionStream({
        model: 'meta-llama/Llama-3.1-70B-Instruct',
        messages: [{ role: 'user', content: recipePrompt }],
        max_tokens: 7000,
      })) {
        recipeContent += chunk.choices[0]?.delta?.content || '';
      }

      console.log('Raw recipe response:', recipeContent);
      console.log('Length of raw recipe content: ', recipeContent.length);

      const cleanedRecipeJson = recipeContent.substring(
        recipeContent.indexOf('{'),
        recipeContent.lastIndexOf('}') + 1
      );

      console.log('Cleaned recipe JSON:', cleanedRecipeJson);
      console.log('Length of cleaned recipe content: ', cleanedRecipeJson.length);

      let generatedRecipe: GeneratedRecipe;
      try {
        generatedRecipe = await parseJSON(cleanedRecipeJson);

        // Generate main recipe image
        log.push(`Generating main image for: ${generatedRecipe.title}`);
        const mainImageBlob = await generateImage(generatedRecipe.imagePrompt);
        const mainImageBuffer = Buffer.from(await mainImageBlob.arrayBuffer());
        
        // Upload main image to B2
        const mainImageKey = `recipes/${slugify(generatedRecipe.title, { lower: true, strict: true })}-main-${Date.now()}.png`;
        const mainImageUrl = await uploadToB2(mainImageBuffer, mainImageKey);
        log.push(`Main image uploaded to B2: ${mainImageUrl}`);

        // Generate and upload blog images
        const blogImages = [];
        for (let i = 0; i < generatedRecipe.blogImagePrompts.length; i++) {
          const imagePrompt = generatedRecipe.blogImagePrompts[i];
          log.push(`Generating blog image ${i + 1} for: ${generatedRecipe.title}`);
          const blogImageBlob = await generateImage(imagePrompt.prompt);
          const blogImageBuffer = Buffer.from(await blogImageBlob.arrayBuffer());
          
          const blogImageKey = `recipes/${slugify(generatedRecipe.title, { lower: true, strict: true })}-blog-${i + 1}-${Date.now()}.png`;
          const blogImageUrl = await uploadToB2(blogImageBuffer, blogImageKey);
          log.push(`Blog image ${i + 1} uploaded to B2: ${blogImageUrl}`);

          blogImages.push({
            imageUrl: blogImageUrl,
            altText: imagePrompt.altText
          });
        }

        // Generate random comments
        const comments = await generateRandomComments(generatedRecipe);

        // Save the recipe to the database
        log.push(`Saving recipe to database: ${generatedRecipe.title}`);
        await prisma.recipe.create({
          data: {
            title: generatedRecipe.title,
            slug: slugify(generatedRecipe.title, { lower: true, strict: true }),
            description: generatedRecipe.description,
            cookingTime: generatedRecipe.cookingTime,
            difficulty: generatedRecipe.difficulty,
            servings: generatedRecipe.servings,
            imageUrl: mainImageUrl,
            instructions: generatedRecipe.instructions.join('\n'),
            nutrition: JSON.stringify(generatedRecipe.nutrition),
            blogContent: generatedRecipe.blogContent,
            blogImages: {
              create: blogImages
            },
            ingredients: {
              create: generatedRecipe.ingredients.map(ing => ({
                quantity: parseFloat(ing.quantity),
                ingredient: {
                  connectOrCreate: {
                    where: { name: ing.name },
                    create: { name: ing.name, unit: ing.unit },
                  },
                },
              })),
            },
            comments: {
              create: comments
            }
          },
        });
        log.push(`Recipe saved successfully: ${generatedRecipe.title}`);
      } catch (parseError) {
        console.error('Error parsing recipe JSON:', parseError);
        log.push(`Error parsing recipe JSON for ${idea.title}: ${(parseError as Error).message}`);
        // Continue to the next recipe instead of throwing an error
        continue;
      }
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
