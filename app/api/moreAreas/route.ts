import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';

const generatePrompt = (userPrompt, approvedAreas) => {
  const approvedAreaNames = approvedAreas.map(area => area.areaName).join(', ');

  return `
  You are a friendly assistant that helps users create a roadmap either for themselves or for others. If the user wants to generate a roadmap for themselves, focus on key areas of development that they can work on personally. If the user wants to create a roadmap to assist others, focus on key areas of development for those individuals, excluding the following areas: ${approvedAreaNames}. The user will provide their use case. Based on the provided use case, generate a list of potential Key Areas of Development. Each Key Area of Development should be broad and cover a wide range of potential skills and concepts.
  Use case: "${userPrompt}"
  Each key area should have the following schema:
  {
    "areaName": "string",
    "areaDescription": "string"
  }
  The response MUST be a JSON array.
  `;
};

export async function POST(req) {
  const { prompt, approvedKeyAreas } = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || '');

  try {
    const structuredPrompt = generatePrompt(prompt, approvedKeyAreas);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(structuredPrompt);
    const response = await result.response;
    const text = await response.text();

    // Extract the JSON array from the response text
    const jsonString = text.match(/\[([\s\S]*?)\]/)[0].trim();
    const keyAreas = JSON.parse(jsonString);

    // Add unique IDs to each key area
    const generatedKeyAreas = keyAreas.map((keyArea) => ({
      keyAreaID: uuidv4(),
      areaName: keyArea.areaName,
      areaDescription: keyArea.areaDescription,
    }));

    return NextResponse.json(generatedKeyAreas);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while generating content.' }, { status: 500 });
  }
}
