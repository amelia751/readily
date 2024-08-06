import { NextResponse } from 'next/server'; 
import { GoogleGenerativeAI } from '@google/generative-ai'; 
import { v4 as uuidv4 } from 'uuid'; 

// Function to remove backticks from a string
function removeTicks(str: string): string {
  return str.replace(/`/g, '');
}

interface Module {
  moduleContent: string;
}

interface RequestBody {
  pathname: string;
  useCase: string;
  areaName: string;
  areaDescription: string;
  approvedModules: Module[];
}

// Function to generate a prompt for the AI model based on the user's input and approved modules
const generateMoreModulesPrompt = (
  useCase: string,
  areaName: string,
  areaDescription: string,
  approvedModules: Module[]
): string => {
  const approvedModuleContents = approvedModules.map(module => module.moduleContent).join(', '); // Concatenate approved module contents

  return `
  You are a friendly assistant that helps users create additional detailed roadmaps for their specific use case. 
  The use case is "${useCase}". 
  The area of development is "${areaName}", which focuses on "${areaDescription}". 
  The current approved module contents are "${approvedModuleContents}".
  
  Based on this information, create additional detailed modules that include:
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

// POST request handler to generate additional modules based on the user's input
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { pathname, useCase, areaName, areaDescription, approvedModules }: RequestBody = await req.json(); // Parse the request body

    if (!pathname) {
      return NextResponse.json({ error: 'Pathname is required' }, { status: 400 }); 
    }

    // Extract mapID, areaID, and chapterID from the pathname
    const pathSegments = pathname.split('/');
    const mapID = pathSegments[pathSegments.length - 3];
    const areaID = pathSegments[pathSegments.length - 2];
    const chapterID = pathSegments[pathSegments.length - 1];

    // Generate the structured prompt for the AI model
    const structuredPrompt = generateMoreModulesPrompt(
      useCase,
      areaName,
      areaDescription,
      approvedModules
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
    const old_text = await response.text(); // Extract the response text
    const text = removeTicks(old_text); // Remove backticks from the response text

    const moduleID = uuidv4(); // Generate a unique ID for the module

    return NextResponse.json({ text, moduleID }); // Return the generated content and module ID as JSON response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    console.error(errorMessage); 
    return NextResponse.json({ error: 'An error occurred while generating more modules.', details: errorMessage }, { status: 500 }); 
  }
}
