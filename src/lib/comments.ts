import { HfInference } from "@huggingface/inference";
import { GeneratedRecipe } from '@/types/recipe';

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

export async function generateRandomComments(recipe: GeneratedRecipe): Promise<{ user: string, content: string; createdAt: Date }[]> {
  const commentCount = Math.floor(Math.random() * 5) + 3; // Random number between 3 and 7
  const comments = [];

  const commentPrompt = `Generate ${commentCount} unique, engaging, and mostly positive comments for a recipe titled "${recipe.title}" with the following blog . The comments should be relevant to the recipe and reflect different aspects such as taste, ease of preparation, or personal experiences. Each comment should be concise, about 1-2 sentences long. Format the output as a JSON array of this format:
  {
    "content": "Comment content",
    "name": "Random name",
  }`;

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

  const generatedComments: {content: string, name: string}[] = await parseJSON(cleanedCommentJson);

  const currentDate = new Date();
  for (const comment of generatedComments) {
    const randomDaysAgo = Math.floor(Math.random() * 3) + 5; // Random number between 5 and 7
    const commentDate = new Date(currentDate.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
    comments.push({
      user: comment.name,
      content: comment.content,
      createdAt: commentDate
    });
  }

  return comments;
}
