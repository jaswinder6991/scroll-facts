// app/page.tsx
'use client'

import { useState } from 'react';
import TopicSelection from './components/TopicSelection';
import FactsViewer from './components/FactsViewer';
import { Topic, Fact } from './types';
import { fetchFactsForTopics } from './lib/api';
import LoadingScreen from './components/LoadingScreen';

// Add this shuffle function at the top with your other functions
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTopicSelection = async (selectedTopics: Topic[]) => {
    setIsLoading(true);
    try {
      // This will be your API call to get facts
      const facts = await fetchFactsForTopics(selectedTopics);
      setFacts(shuffleArray(facts));
      //setFacts(facts);
      setTopics(selectedTopics);
    } catch (error) {
      console.error('Failed to fetch facts:', error);
      // You might want to add error handling here
    } finally {
      setIsLoading(false);
    }
  };

  const handleExit = () => {
    setTopics([]);
    setFacts([]);
  };

  if (isLoading) {
    return (
      <LoadingScreen />
    );
  }

  if (topics.length === 0) {
    return <TopicSelection onComplete={handleTopicSelection} />;
  }

  return <FactsViewer facts={facts} onExit={handleExit} />;
}