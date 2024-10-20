import { NextResponse } from 'next/server';
import { uploadToB2 } from '@/lib/b2';
import slugify from 'slugify';
import { PrismaClient } from '@prisma/client';
import { generateRandomComments } from '@/lib/comments';
import { HfInference } from "@huggingface/inference";
import { deleteImageFromB2 } from '@/lib/b2';

const prisma = new PrismaClient();
const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

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

async function rewriteBlogPost(recipe: any): Promise<string> {
  const blogRewritePrompt = `Rewrite and improve the following blog post for a recipe. Make sure to follow these rules:
  1. Use '# ' for main titles and '## ' for subtitles.
  2. Use '<<IMAGE X>>' placeholders where X is the image number (1, 2, 3, etc.) to indicate where images should be placed.
  3. Use '\n' for line breaks.
  4. The content should be engaging, informative, and optimized for SEO.
  5. Include personal anecdotes, cooking tips, and variations of the recipe where appropriate.
  6. Ensure the content is between 700-800 words.

Here's the recipe information:
Title: ${recipe.title}
Description: ${recipe.description}
Ingredients: ${JSON.stringify(recipe.ingredients)}
Instructions: ${recipe.instructions.join('\n')}
Cooking Time: ${recipe.cookingTime} minutes
Difficulty: ${recipe.difficulty}
Servings: ${recipe.servings}

Here's the original blog post:
${recipe.blogContent}

Please rewrite and improve this blog post based on the given information and rules.`;

  let rewrittenContent = '';
  for await (const chunk of inference.chatCompletionStream({
    model: 'meta-llama/Llama-3.1-70B-Instruct',
    messages: [{ role: 'user', content: blogRewritePrompt }],
    max_tokens: 2000,
  })) {
    rewrittenContent += chunk.choices[0]?.delta?.content || '';
  }

  return rewrittenContent;
}

export async function POST(request: Request) {
  console.log("Received request at generate-images route");
  const { generatedRecipes } = await request.json();

  console.log("Generated Recipes received at image route: ", generatedRecipes);

  const photoUrls: string[] = [];

  try {
    const publishedRecipes = [];

    for (const recipe of generatedRecipes) {
      // Generate all images simultaneously
      const imagePromises = [
  generateImage(recipe.imagePrompt),
  ...(Array.isArray(recipe.blogImagePrompts)
    ? recipe.blogImagePrompts.map((prompt: any) => generateImage(prompt.prompt))
    : [])
];


      const generatedImages = await Promise.all(imagePromises);

      // Upload main image to B2
      const mainImageBuffer = Buffer.from(await generatedImages[0].arrayBuffer());
      console.log("Slugifying main image: ", recipe.title);
      const mainImageKey = `recipes/${slugify(recipe.title, { lower: true, strict: true })}-main-${Date.now()}.png`;
      const mainImageUrl = await uploadToB2(mainImageBuffer, mainImageKey);
      photoUrls.push(mainImageUrl);
      console.log("Main image url: ", mainImageUrl);

      // Upload blog images to B2
      const blogImages = [];
      if (recipe.blogImagePrompts) {
        for (let i = 0; i < recipe.blogImagePrompts.length; i++) {
          const blogImageBuffer = Buffer.from(await generatedImages[i + 1].arrayBuffer());
          console.log("Slugifying blog image ", i, recipe.title);
          const blogImageKey = `recipes/${slugify(recipe.title, { lower: true, strict: true })}-blog-${i + 1}-${Date.now()}.png`;
          const blogImageUrl = await uploadToB2(blogImageBuffer, blogImageKey);
          photoUrls.push(blogImageUrl);
          blogImages.push({
            imageUrl: blogImageUrl,
            altText: recipe.blogImagePrompts[i].altText
          });
        }
      }

      // Rewrite the blog post
      const rewrittenBlogContent = await rewriteBlogPost({
        ...recipe,
        blogImages
      });

      // Generate random comments
      let comments: { user: string, content: string; createdAt: Date }[] = [];
      try {
        comments = await generateRandomComments(recipe);
      } catch (e) {
        console.warn("Failed to create comments");
      }

      console.log("About to save: ", recipe.title);
      console.log("About to save: ", recipe.description);
      console.log("About to save: ", recipe.cookingTime);
      console.log("About to save: ", recipe.difficulty);
      console.log("About to save: ", recipe.servings);
      console.log("About to save: ", mainImageUrl);
      console.log("About to save: ", recipe.instructions.join('\n'));
      console.log("About to save: ", recipe.nutrition);
      console.log("About to save: ", rewrittenBlogContent);
      console.log("About to save: ", recipe.ingredients);
      console.log("About to save: ", comments);

      // Save the recipe to the database
      const savedRecipe = await prisma.recipe.create({
        data: {
          title: recipe.title,
          slug: slugify(recipe.title, { lower: true, strict: true }),
          description: recipe.description,
          cookingTime: recipe.cookingTime,
          difficulty: recipe.difficulty,
          servings: recipe.servings,
          imageUrl: mainImageUrl,
          instructions: recipe.instructions.join('\n'),
          nutrition: recipe.nutrition || {},
          blogContent: rewrittenBlogContent,
          blogImages: {
            create: blogImages
          },
          ingredients: {
            create: recipe.ingredients?.map((ing: { name: string; quantity: string; unit: string }) => ({
              quantity: parseInt(ing.quantity) || 1,
              ingredient: {
                connectOrCreate: {
                  where: { name: ing.name },
                  create: { name: ing.name, unit: ing.unit || "" },
                },
              },
            })),
          },
          comments: {
            create: comments
          }
        },
      });

      publishedRecipes.push(savedRecipe);
    }

    const response = NextResponse.json({ message: 'Recipes published successfully', publishedRecipes }, { status: 200 });

    // Add headers to prevent caching for error responses too
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error: any) {
    console.error('Error publishing recipes:', error);
    console.error('Error publishing recipes:', error.message);
    console.error('Error publishing recipes:', error.message.substring(0, 100));
    console.error('Error publishing recipes:', error.message.substring(1000, 2000));
    console.error('Error publishing recipes:', error.message.substring(2000, 3000));
    console.error('Error publishing recipes:', error.message.substring(3000, 4000));
    console.error('Error publishing recipes:', error.message.substring(4000, 5000));
    console.error('Error publishing recipes:', error.message.substring(5000, 6000));
    console.error('Error publishing recipes:', error.message.substring(6000, 7000));
    console.error('Error publishing recipes:', error.message.substring(7000, 8000));
    console.error('Error publishing recipes:', error.message.substring(8000, 9000));
    console.error('Error publishing recipes:', error.message.substring(9000, 10000));
    console.error('Error publishing recipes:', error.message.substring(11000, 12000));
    console.error('Error publishing recipes:', error.message.substring(12000, 13000));
    console.error('Error publishing recipes:', error.message.substring(13000, 14000));
    console.error('Error publishing recipes:', error.message.substring(14000, 15000));
    console.error('Error publishing recipes:', error.message.substring(15000, 16000));
    console.error('Error publishing recipes:', error.message.substring(16000, 17000));

    // Delete blog images from B2
    for (const image of photoUrls) {
      await deleteImageFromB2(image);
    }


    const response = NextResponse.json({
      message: 'Error publishing recipes',
      error: (error as Error).message,
    }, { status: 500 });

    // Add headers to prevent caching for error responses too
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  }
}
