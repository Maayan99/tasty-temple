import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">Tasty Temple</h3>
            <p className="text-gray-400">Discover delicious recipes and culinary inspiration.</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition duration-300">Home</Link></li>
              <li><Link href="/recipes" className="text-gray-400 hover:text-white transition duration-300">Recipes</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white transition duration-300">Categories</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition duration-300">About</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Facebook</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Instagram</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Twitter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Pinterest</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest recipes and cooking tips.</p>
            <form className="flex">
              <input type="email" placeholder="Your email" className="bg-gray-700 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition duration-300">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; 2024 Tasty Temple. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
