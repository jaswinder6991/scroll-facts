// lib/api.ts
import { Topic, Fact } from "../types";
// In your page.tsx, update the fetchFactsForTopics function:

export async function fetchFactsForTopics(topics: Topic[]): Promise<Fact[]> {
    try {
      const response = await fetch('/api/facts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topics: topics.map(t => t.id),
          factsPerTopic: 10
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch facts');
      }
  
      const data = await response.json();
      
      // Add data validation
      if (!data || !data.facts || !Array.isArray(data.facts)) {
        console.log('Received data:', data); // For debugging
        throw new Error('Invalid response format from API');
      }
  
      // Transform the API response into our Fact type
      return data.facts.map((fact: Fact, index: number) => ({
        id: `fact-${index}`,
        topic: fact.topic || 'Unknown',
        content: fact.content || 'No content available',
        topicColor: topics.find(t => 
          t.id.toLowerCase() === (fact.topic || '').toLowerCase()
        )?.color || 'bg-gray-900'
      }));
  
    } catch (error) {
      console.error('Error fetching facts:', error);
      // Return empty array or throw error based on your preference
      throw new Error('Failed to fetch facts: ' + (error as Error).message);
    }
  }