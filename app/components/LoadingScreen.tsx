// components/LoadingScreen.tsx
'use client'

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_FACTS = [
  {
    topic: "Fun Fact",
    content: "A day on Venus is longer than its year!",
    color: "bg-purple-500"
  },
  {
    topic: "Did you know?",
    content: "Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs!",
    color: "bg-amber-500"
  },
  {
    topic: "Random Fact",
    content: "Bananas are berries, but strawberries aren't!",
    color: "bg-green-500"
  },
  {
    topic: "Interesting",
    content: "Octopuses have three hearts and blue blood!",
    color: "bg-blue-500"
  },
  {
    topic: "Quick Fact",
    content: "The first oranges weren't orange - they were green!",
    color: "bg-orange-500"
  }
];

export default function LoadingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LOADING_FACTS.length);
    }, 3000); // Change fact every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="text-white/60 text-center mb-12">
        <h2 className="text-2xl mb-2">Creating your custom feed...</h2>
        <p>Meanwhile, enjoy these random facts</p>
      </div>

      <div className="w-full max-w-md h-[200px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 ${LOADING_FACTS[currentIndex].color} rounded-2xl p-8 flex flex-col justify-center`}
          >
            <div className="bg-white/20 text-white px-3 py-1 rounded-full w-fit text-sm mb-4">
              {LOADING_FACTS[currentIndex].topic}
            </div>
            <div className="text-white text-xl">
              {LOADING_FACTS[currentIndex].content}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mt-8">
        {LOADING_FACTS.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-white scale-100' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}