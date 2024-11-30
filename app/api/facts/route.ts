// app/api/facts/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// app/api/facts/route.ts
export async function POST(request: Request) {
    try {
      const { topics, factsPerTopic = 10 } = await request.json();
      console.log('Received request:', { topics, factsPerTopic });
  
      const prompt = `Generate ${factsPerTopic} interesting, verified facts about each of these topics: ${topics.join(
        ', '
      )}. 
      Format each fact in a concise 1-2 sentences.
      Return the response as a JSON array with this structure:
      { "facts": [{ "topic": "topic name", "content": "the fact" }] }
      Make sure facts are engaging but brief.`;
  
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