import { NextResponse } from 'next/server'; 
import { GoogleGenerativeAI } from '@google/generative-ai'; 
import { v4 as uuidv4 } from 'uuid'; 

interface KeyArea {
  areaName: string;
  areaDescription: string;
}

interface GeneratedKeyArea extends KeyArea {
  keyAreaID: string; 
}

const generatePrompt = (userPrompt: string): string => {
  return `
  You are a friendly assistant that helps users create a roadmap either for themselves or for others. If the user wants to generate a roadmap for themselves, focus on key areas of development that they can work on personally. If the user wants to create a roadmap to assist others, focus on key areas of development for those individuals. The user will provide their use case. Based on the provided use case, generate a list of potential Key Areas of Development. Each Key Area of Development should be broad and cover a wide range of potential skills and concepts.
  Use case: "${userPrompt}"
  Each key area should have the following schema:
  {
    "areaName": "string",
    "areaDescription": "string"
  }
  The response MUST be a JSON array.
  `;
};

// POST request handler to generate key areas based on the user's prompt
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { prompt }: { prompt: string } = await req.json(); 
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || ''); 

    const structuredPrompt = generatePrompt(prompt); // Generate the structured prompt
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // Get the generative model
    const result = await model.generateContent(structuredPrompt); // Generate content using the AI model
    const response = await result.response; // Get the response from the AI model
    const text = await response.text(); // Extract the response text

    // Extract the JSON array from the response text
    const match = text.match(/\[([\s\S]*?)\]/);
    if (!match) throw new Error('No JSON array found in response'); 
    const jsonString = match[0].trim(); // Get the matched JSON array string
    const keyAreas: KeyArea[] = JSON.parse(jsonString); // Parse the JSON string to get key areas

    // Add unique IDs to each key area
    const generatedKeyAreas: GeneratedKeyArea[] = keyAreas.map((keyArea) => ({
      keyAreaID: uuidv4(),
      areaName: keyArea.areaName,
      areaDescription: keyArea.areaDescription,
    }));

    return NextResponse.json(generatedKeyAreas); // Return the generated key areas as JSON response
  } catch (error) {
    console.error(error); 
    return NextResponse.json({ error: 'An error occurred while generating content.' }, { status: 500 }); 
  }
}

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
