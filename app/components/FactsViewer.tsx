// components/FactsViewer.tsx
'use client'

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Fact } from '../types';

interface FactsViewerProps {
  facts: Fact[];
  onExit: () => void;
}

export default function FactsViewer({ facts, onExit }: FactsViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
    touchEnd.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.touches[0].clientY;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distance = touchStart.current - touchEnd.current;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe && currentIndex < facts.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
    if (isDownSwipe && currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && currentIndex < facts.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        setDirection(-1);
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'ArrowDown' && currentIndex < facts.length - 1) {
        setDirection(1);
        setCurrentIndex(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, facts.length]);

  const getProgressDots = () => {
    // If we're at the start, show first 3
    if (currentIndex === 0) {
      return [0, 1, 2];
    }
    // If we're at the end, show last 3
    if (currentIndex === facts.length - 1) {
      return [facts.length - 3, facts.length - 2, facts.length - 1];
    }
    // Otherwise show one before and one after current
    return [currentIndex - 1, currentIndex, currentIndex + 1];
  };

  return (
    <div 
      className="fixed inset-0 overflow-hidden touch-pan-y"
      onWheel={handleWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Exit Button */}
      <button 
        onClick={onExit}
        className="fixed top-4 left-4 z-20 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      {/* Progress Dots */}
      {/* <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-2">
        {facts.map((_, idx) => (
          <div 
            key={idx}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-white scale-150' : 'bg-white/50'
            }`}
          />
        ))}
      </div> */}
       <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-2">
        {facts.length > 0 && getProgressDots().map((dotIndex) => (
          <div 
            key={dotIndex}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              dotIndex === currentIndex ? 'bg-white scale-150' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      <div className="relative h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div 
            key={currentIndex}
            custom={direction}
            initial={{ y: direction > 0 ? "100%" : "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: direction > 0 ? "-100%" : "100%" }}
            transition={{ 
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`absolute inset-0 ${facts[currentIndex].topicColor}`}
          >
            <div className="flex items-center justify-center h-full p-6">
              <div className="max-w-lg">
                <div className="mb-4 bg-white/20 px-3 py-1 rounded-full text-white text-sm inline-block">
                  {facts[currentIndex].topic}
                </div>

                <div className="text-white text-2xl sm:text-3xl font-medium leading-relaxed">
                  {facts[currentIndex].content}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}