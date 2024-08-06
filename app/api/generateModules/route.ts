import { NextResponse } from 'next/server'; 
import { GoogleGenerativeAI } from '@google/generative-ai'; 
import { v4 as uuidv4 } from 'uuid'; 
import Roadmap from '@/models/Roadmap'; 
import connect from '@/utils/db'; 

// Function to remove backticks from a string
function removeTicks(str: string): string {
  return str.replace(/`/g, '');
}

// Function to generate a prompt for the AI model based on various inputs
const generatePrompt = (
  useCase: string,
  areaName: string,
  areaDescription: string,
  chapterName: string,
  chapterObjective: string
): string => {
  return `
  You are a friendly assistant that helps users create a detailed roadmap for their specific use case. 
  The use case is "${useCase}". 
  The area of development is "${areaName}". 
  The current chapter is "${chapterName}" with the objective of "${chapterObjective}".
  
  Based primarily on the "${chapterObjective}", create a detailed module that includes:
  - A goal for the chapter.
  - An activity to help achieve the goal.
  - Instructions on how to carry out the activity.
  - Guidance on how to measure progress.
  - A timeline for the activity.
  - A timeframe for achieving the goal.
  
  Please create only one module at a time. Format your response using the following template:
  Goal:
  Activity:
  Instructions:
  Measuring Progress:
  Timeline:
  Timeframe for the goal:
  `;
};

// Define the structure of the request body
interface RequestBody {
  pathname: string;
  useCase: string;
  areaName: string;
  areaDescription: string;
  chapterName: string;
  chapterObjective: string;
  approvedModules: any[];
}

// Define the structure of a chapter
interface Chapter {
  chapterID: string;
  chapterName: string;
  chapterObjective: string;
}

// POST request handler to generate content based on various inputs
export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse the request body
    const {
      pathname,
      useCase,
      areaName,
      areaDescription,
      chapterName,
      chapterObjective,
      approvedModules
    }: RequestBody = await req.json();

    if (!pathname) {
      return NextResponse.json({ error: 'Pathname is required' }, { status: 400 }); 
    }

    // Extract mapID, areaID, and chapterID from the pathname
    const pathSegments = pathname.split('/');
    const mapID = pathSegments[pathSegments.length - 3];
    const areaID = pathSegments[pathSegments.length - 2];
    const chapterID = pathSegments[pathSegments.length - 1];

    await connect(); // Connect to the database

    // Find the roadmap based on mapID, areaID, and chapterID
    const roadmap = await Roadmap.findOne(
      { mapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID },
      { useCase: 1, "keyAreas.$": 1 }
    );

    if (!roadmap || roadmap.keyAreas.length === 0) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 }); 
    }

    // Get the key area and chapter details
    const keyArea = roadmap.keyAreas[0];
    const chapter = keyArea.chapters.find((chap: Chapter) => chap.chapterID === chapterID);

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 }); 
    }

    // Generate the structured prompt for the AI model
    const structuredPrompt = generatePrompt(
      roadmap.useCase,
      keyArea.areaName,
      keyArea.areaDescription,
      chapter.chapterName,
      chapter.chapterObjective
    );

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || ''); // Initialize the AI model with the API key

    // Configure the generation settings for the AI model
    const generationConfig = {
      temperature: 0.1,
      topP: 0.9
    };

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro', generationConfig }); // Get the generative model
    const result = await model.generateContent(structuredPrompt); // Generate content using the AI model
    const response = await result.response; // Get the response from the AI model
    const oldText = await response.text(); // Extract the response text
    const text = removeTicks(oldText); // Remove backticks from the response text
    console.log(text);

    const moduleID = uuidv4(); // Generate a unique ID for the module

    return NextResponse.json({ text, moduleID }); // Return the generated content and module ID as JSON response
  } catch (error) {
    console.error(error); 
    return NextResponse.json({ error: 'An error occurred while generating content.' }, { status: 500 }); 
  }
}

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
