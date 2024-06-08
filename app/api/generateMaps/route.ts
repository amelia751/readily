import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const generatePrompt = (userPrompt) => {
  return `
  You are a friendly assistant that helps users create a roadmap either for themselves or for others. The user will provide their use case. Based on the provided use case, generate a name for the roadmap. The roadmap name should be concise and relevant to the use case.
  Use case: "${userPrompt}"
  The response MUST be a JSON object with the following schema:
  {
    "mapName": "string"
  }
  `;
};

export async function POST(req) {
  const { prompt } = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || '');

  try {
    const structuredPrompt = generatePrompt(prompt);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(structuredPrompt);
    const response = await result.response;
    const text = await response.text();

    // Extract the JSON object from the response text
    const jsonString = text.match(/\{([\s\S]*?)\}/)[0].trim();
    const mapData = JSON.parse(jsonString);

    return NextResponse.json({ mapName: mapData.mapName });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while generating the map name.' }, { status: 500 });
  }
}
