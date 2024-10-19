import { NextResponse } from 'next/server';
import { HfInference } from "@huggingface/inference";

const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

const cuisineTypes = ['Italian', 'Chinese', 'Mexican', 'Indian', 'French', 'Japanese', 'Thai', 'Greek', 'Spanish', 'American'];
const dietaryRestrictions = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Keto', 'Paleo', 'Low-carb', 'Low-fat'];
const cookingMethods = ['Bake', 'Grill', 'Fry', 'Roast', 'Steam', 'Slow cook', 'Pressure cook', 'Sauté', 'Poach', 'Broil'];
const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer', 'Side dish'];

function getRandomItems(array: string[], count: number): string[] {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function GET() {
  try {
    const prompts = [
      `Create a ${getRandomItems(cuisineTypes, 1)[0]} recipe that is ${getRandomItems(dietaryRestrictions, 1)[0]}.`,
      `Develop a ${getRandomItems(mealTypes, 1)[0]} recipe using the ${getRandomItems(cookingMethods, 1)[0]} method.`,
      `Fusion dishes combining ${getRandomItems(cuisineTypes, 2).join(' and ')} cuisines.`,
      `Design a ${getRandomItems(dietaryRestrictions, 1)[0]} recipe for a ${getRandomItems(mealTypes, 1)[0]}.`,
      `Create a seasonal recipe using ${getRandomItems(cookingMethods, 1)[0]} as the main cooking method.`
    ];

    const directionsPrompt = `Generate 5 unique and general recipe idea directions based on the following prompts. For example, "vegan zucchini desserts" is a good direction, but you should give original directions in the same style, but not necessarily related to veganism or zucchini of course. Each idea should be 3-5 words describing the recipe idea direction:\n${prompts.join('\n')}\n\nFormat the output as a JSON array of strings.`;

    let directionsContent = '';
    for await (const chunk of inference.chatCompletionStream({
      model: 'meta-llama/Llama-3.1-70B-Instruct',
      messages: [{ role: 'user', content: directionsPrompt }],
      max_tokens: 500,
    })) {
      directionsContent += chunk.choices[0]?.delta?.content || '';
    }

    const cleanedDirectionsJson = directionsContent.substring(
      directionsContent.indexOf('['),
      directionsContent.lastIndexOf(']') + 1
    );

    const directions = JSON.parse(cleanedDirectionsJson);

    return NextResponse.json({ directions });
  } catch (error) {
    console.error('Error generating directions:', error);
    return NextResponse.json({ error: 'Failed to generate directions' }, { status: 500 });
  }
}
