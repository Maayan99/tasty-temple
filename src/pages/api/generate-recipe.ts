import { NextApiRequest, NextApiResponse } from 'next';
import { InferenceClient } from 'huggingface-hub';

const client = new InferenceClient({
  apiKey: process.env.HUGGINGFACE_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    let recipeContent = '';
    for await (const message of client.chatCompletion({
      model: 'meta-llama/Llama-3.1-70B-Instruct',
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 1000,
      stream: true,
    })) {
      recipeContent += message.choices[0].delta.content;
    }

    return res.status(200).json({ recipe: recipeContent });
  } catch (error) {
    console.error('Error generating recipe:', error);
    return res.status(500).json({ message: 'Error generating recipe' });
  }
}
