import { NextResponse } from 'next/server';
import { uploadToB2 } from '@/lib/b2';
import slugify from 'slugify';

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

export async function POST(request: Request) {
  console.log("Received request at generate-images route");
  const { generatedRecipe } = await request.json();

  console.log("Generated Recipe received at image route: ", generatedRecipe);

  try {
    // Generate main recipe image
    const mainImageBlob = await generateImage(generatedRecipe.imagePrompt);
    const mainImageBuffer = Buffer.from(await mainImageBlob.arrayBuffer());
    
    // Upload main image to B2
    console.log("Slugifying main image: ", generatedRecipe.title)
    const mainImageKey = `recipes/${slugify(generatedRecipe.title, { lower: true, strict: true })}-main-${Date.now()}.png`;
    const mainImageUrl = await uploadToB2(mainImageBuffer, mainImageKey);
    console.log("Main image url: ", mainImageUrl);

    // Generate and upload blog images
    const blogImages = [];
    if (generatedRecipe.blogImagePrompts) {
      for (let i = 0; i < generatedRecipe.blogImagePrompts.length; i++) {
        const imagePrompt = generatedRecipe.blogImagePrompts[i];
        const blogImageBlob = await generateImage(imagePrompt.prompt);
        const blogImageBuffer = Buffer.from(await blogImageBlob.arrayBuffer());

        console.log("Slugifying blog image ", i, generatedRecipe.title)
        const blogImageKey = `recipes/${slugify(generatedRecipe.title, { lower: true, strict: true })}-blog-${i + 1}-${Date.now()}.png`;
        const blogImageUrl = await uploadToB2(blogImageBuffer, blogImageKey);

        blogImages.push({
          imageUrl: blogImageUrl,
          altText: imagePrompt.altText
        });
      }
    }

    // Call the next step in the process
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-recipes/save-recipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generatedRecipe, mainImageUrl, blogImages }),
    });

    console.log('Successfully called save-recipe');

    return NextResponse.json({ message: 'Images generated and uploaded' }, { status: 200 });
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json({
      message: 'Error generating images',
      error: (error as Error).message,
    }, { status: 500 });
  }
}
