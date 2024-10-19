"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRecipes } from '@/hooks/useRecipes';

const Hero: React.FC = () => {
  const { recipes, isLoading, error } = useRecipes(3, 'trending');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading trending recipes</div>;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-[80vh] overflow-hidden"
    >
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="h-full"
      >
        {recipes.map((recipe) => (
          <SwiperSlide key={recipe.id}>
            <div className="relative h-full">
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                layout="fill"
                objectFit="cover"
                quality={100}
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
                  <motion.h2 
                    className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {recipe.title}
                  </motion.h2>
                  <motion.p
                    className="text-lg md:text-xl mb-6 max-w-2xl drop-shadow-md"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {recipe.description}
                  </motion.p>
                  <Link href={`/recipe/${recipe.slug}`}>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold cursor-pointer transition-colors duration-300 hover:bg-indigo-700"
                    >
                      View Recipe
                    </motion.span>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.section>
  );
};

export default Hero;
