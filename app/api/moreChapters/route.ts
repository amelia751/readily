import { NextRequest, NextResponse } from 'next/server'; 
import { GoogleGenerativeAI } from '@google/generative-ai'; 
import { v4 as uuidv4 } from 'uuid'; 

interface Chapter {
  chapterName: string;
  chapterObjective: string;
}

interface RequestBody {
  useCase: string;
  areaName: string;
  areaDescription: string;
  approvedChapters: Chapter[];
}

// Function to generate a prompt for the AI model based on the user's input and approved chapters
const generatePrompt = (
  useCase: string,
  areaName: string,
  areaDescription: string,
  approvedChapters: Chapter[]
): string => {
  const approvedChapterNames = approvedChapters.map(chapter => chapter.chapterName).join(', '); // Concatenate approved chapter names

  return `
  You are a friendly assistant that helps users create a roadmap for the subject of the Use Case given. Based on the user's use case, area of development areaName, and areaDescription, you should create a list of chapterObjective and chapterName for them. Each Objective must be a positive statement, for example, the subject can do something, the subject is able to do something, where the subject is the subject of the use case. chapterName should be the shorter version of chapterObjective.
  Do not include the following chapters: ${approvedChapterNames}
  Use case: "${useCase}"
  Area Name: "${areaName}"
  Area Description: "${areaDescription}"

  Each chapter should have the following schema:
  {
    "chapterName": "string",
    "chapterObjective": "string"
  }
  The response MUST be a JSON array.
  `;
};

// POST request handler to generate chapters based on the user's input
export async function POST(req: NextRequest): Promise<NextResponse> {
  const { useCase, areaName, areaDescription, approvedChapters }: RequestBody = await req.json(); // Parse the request body to get useCase, areaName, areaDescription, and approvedChapters
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || ''); // Initialize the AI model with the API key

  try {
    const structuredPrompt = generatePrompt(useCase, areaName, areaDescription, approvedChapters); // Generate the structured prompt
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Get the generative model
    const result = await model.generateContent(structuredPrompt); // Generate content using the AI model
    const response = await result.response; // Get the response from the AI model
    const text = await response.text(); // Extract the response text

    // Extract the JSON array from the response text
    const match = text.match(/\[([\s\S]*?)\]/);
    if (!match) throw new Error('No JSON array found in response'); // Throw an error if no JSON array is found
    const jsonString = match[0].trim(); // Get the matched JSON array string
    const chapters: Chapter[] = JSON.parse(jsonString); // Parse the JSON string to get chapters

    // Add unique IDs to each chapter
    const generatedChapters = chapters.map((chapter) => ({
      chapterID: uuidv4(),
      chapterName: chapter.chapterName,
      chapterObjective: chapter.chapterObjective,
    }));

    return NextResponse.json(generatedChapters); // Return the generated chapters as JSON response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    console.error(errorMessage); 
    return NextResponse.json({ error: 'An error occurred while generating content.', details: errorMessage }, { status: 500 }); 
  }
}
