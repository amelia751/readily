import { NextResponse } from 'next/server'; 
import { GoogleGenerativeAI } from '@google/generative-ai'; 

interface MapData {
  mapName: string;
}

// Function to generate a prompt for the AI model based on the user's input
const generatePrompt = (userPrompt: string): string => {
  return `
  You are a friendly assistant that helps users create a roadmap either for themselves or for others. The user will provide their use case. Based on the provided use case, generate a name for the roadmap. The roadmap name should be concise and relevant to the use case.
  Use case: "${userPrompt}"
  The response MUST be a JSON object with the following schema:
  {
    "mapName": "string"
  }
  `;
};

// POST request handler to generate a roadmap name based on the user's input
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { prompt }: { prompt: string } = await req.json(); // Parse the request body to get the user prompt
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || ''); // Initialize the AI model with the API key

    const structuredPrompt = generatePrompt(prompt); // Generate the structured prompt
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // Get the generative model
    const result = await model.generateContent(structuredPrompt); // Generate content using the AI model
    const response = await result.response; // Get the response from the AI model
    const text = await response.text(); // Extract the response text

    // Extract the JSON object from the response text
    const match = text.match(/\{([\s\S]*?)\}/);
    if (!match) throw new Error('No JSON object found in response'); 
    const jsonString = match[0].trim(); // Get the matched JSON object string
    const mapData: MapData = JSON.parse(jsonString); // Parse the JSON string to get map data

    return NextResponse.json({ mapName: mapData.mapName }); // Return the map name as JSON response
  } catch (error) {
    console.error(error); 
    return NextResponse.json({ error: 'An error occurred while generating the map name.' }, { status: 500 }); 
  }
}

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
