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
      className="relative h-[70vh] overflow-hidden"
    >
      <Swiper
        spaceBetween={30}
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
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center">
                  <motion.h2 
                    className="text-4xl md:text-6xl font-bold text-white mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {recipe.title}
                  </motion.h2>
                  <Link href={`/recipe/${recipe.id}`}>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full text-lg font-semibold cursor-pointer"
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
