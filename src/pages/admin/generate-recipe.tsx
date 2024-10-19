import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const GenerateRecipe: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [recipe, setRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (err) {
      setError('Error generating recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-2xl font-bold mb-4">Generate Recipe</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt for recipe generation..."
          className="w-full p-2 border rounded-md mb-2"
          rows={4}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          {isLoading ? 'Generating...' : 'Generate Recipe'}
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {recipe && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-100 p-4 rounded-md"
        >
          <h2 className="text-xl font-semibold mb-2">Generated Recipe:</h2>
          <pre className="whitespace-pre-wrap">{recipe}</pre>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GenerateRecipe;

export async function getServerSideProps(context: any) {
  const { req } = context;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const [username, password] = credentials;

  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
}
