import { HfInference } from "@huggingface/inference";
import { GeneratedRecipe } from '@/types/recipe';

const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function generateRandomComments(recipe: GeneratedRecipe): Promise<{ content: string; createdAt: Date }[]> {
  const commentCount = Math.floor(Math.random() * 5) + 3; // Random number between 3 and 7
  const comments = [];

  const commentPrompt = `Generate ${commentCount} unique, engaging, and mostly positive comments for a recipe titled "${recipe.title}". The comments should be relevant to the recipe and reflect different aspects such as taste, ease of preparation, or personal experiences. Each comment should be concise, about 1-2 sentences long. Format the output as a JSON array of strings.`;

  let commentContent = '';
  for await (const chunk of inference.chatCompletionStream({
    model: 'meta-llama/Llama-3.1-70B-Instruct',
    messages: [{ role: 'user', content: commentPrompt }],
    max_tokens: 1000,
  })) {
    commentContent += chunk.choices[0]?.delta?.content || '';
  }

  const cleanedCommentJson = commentContent.substring(
    commentContent.indexOf('['),
    commentContent.lastIndexOf(']') + 1
  );

  const generatedComments: string[] = JSON.parse(cleanedCommentJson);

  const currentDate = new Date();
  for (const comment of generatedComments) {
    const randomDaysAgo = Math.floor(Math.random() * 3) + 5; // Random number between 5 and 7
    const commentDate = new Date(currentDate.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
    comments.push({
      content: comment,
      createdAt: commentDate
    });
  }

  return comments;
}
