// app/api/facts/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In your api/facts/route.ts
const getTopicSpecificPrompt = (topic: string) => {
  switch(topic) {
    case 'coding':
      return `
        Focus on beginner-friendly programming concepts and fun facts. 
        - Explain concepts in simple terms
        - Include interesting facts about popular programming languages
        - Share cool things beginners can create
        - Highlight fun aspects of coding
        - Avoid complex technical jargon`;
    case 'anime':
      return `
        Focus on interesting behind-the-scenes facts about:
        - Animation production process ELI5
        - Recommend Animes to watch
        - Cultural impact and global influence
        - Fun facts on Popular series
        - Creative processes`;
    default:
      return '';
  }
};

// app/api/facts/route.ts
export async function POST(request: Request) {
    try {
      const { topics, factsPerTopic = 10 } = await request.json();
      console.log('Received request:', { topics, factsPerTopic });
  
      // Main prompt stays focused on engaging content for general audience
const prompt = `For each of the following topics: ${topics.join(', ')}, generate exactly ${factsPerTopic} interesting and verified facts.

Requirements:
- Each fact should be 1-2 sentences long
- Facts should be engaging and surprising
- Ensure facts are accurate and verified
- Each topic must have exactly ${factsPerTopic} facts
- Facts should be diverse within each topic

Special topic instructions:
${topics.map((topic: string) => {
  const specificPrompt = getTopicSpecificPrompt(topic);
  return specificPrompt ? `For ${topic}: ${specificPrompt}\n` : '';
}).join('')}

Return the response as a JSON array with this exact structure:
{
  "facts": [
    {"topic": "topic name", "content": "fact content"},
    ...
  ]
}

Ensure there are exactly ${factsPerTopic} facts for EACH topic.`;
  
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        response_format: { type: "json_object" },
      });
  
      const response = completion.choices[0].message.content;
      //console.log('OpenAI response:', response);
  
      if (!response) {
        throw new Error('No response from OpenAI');
      }
  
      const parsedResponse = JSON.parse(response);
      //console.log('Parsed response:', parsedResponse);
  
      // Ensure the response has the correct structure
      if (!parsedResponse || !parsedResponse.facts) {
        throw new Error('Invalid response format from OpenAI');
      }
  
      return NextResponse.json(parsedResponse);
  
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch facts', details: (error as Error).message },
        { status: 500 }
      );
    }
  }