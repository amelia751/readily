import { NextResponse } from 'next/server'; 
import { GoogleGenerativeAI } from '@google/generative-ai'; 

// Function to remove backticks from a string
const removeTicks = (str: string): string => {
  return str.replace(/`/g, '');
};

// Function to generate a prompt for the AI model based on the module content
const generateModuleNamePrompt = (moduleContent: string): string => {
  return `
  You are a friendly assistant that helps generate a concise name for the given activity content.
  
  Given the following activity content:
  "${moduleContent}"
  
  For moduleName, generate one concise name for the activity. 
  For moduleTime, generate the number of minutes you estimate the activity to take. moduleTime should be a number in minutes.
  
  The response MUST be a JSON object with the following schema:
  {
    "moduleName": "string",
    "moduleTime": "integer"
  }
  `;
};

// Interface for the structure of the response from the AI model
interface ModuleResponse {
  moduleName: string;
  moduleTime: number;
}

// POST request handler to generate a module name and time based on the module content
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { moduleContent }: { moduleContent: string } = await req.json(); // Parse the request body to get the module content

    if (!moduleContent) {
      return NextResponse.json({ error: 'Module content is required' }, { status: 400 }); 
    }

    const structuredPrompt = generateModuleNamePrompt(moduleContent); // Generate the structured prompt

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || ''); // Initialize the AI model with the API key

    const generationConfig = {
      temperature: 0.1, 
      topP: 0.9 
    };

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro', generationConfig }); // Get the generative model
    const result = await model.generateContent(structuredPrompt); // Generate content using the AI model
    const response = await result.response; // Get the response from the AI model
    const oldText = await response.text(); // Extract the response text
    const text = removeTicks(oldText); // Remove backticks from the response text

    // Extract the JSON object from the generated text
    let moduleName: string;
    let moduleTime: number;
    try {
      const match = text.match(/\{([\s\S]*?)\}/);
      if (!match) throw new Error('No JSON object found in response'); 
      const jsonString = match[0].trim(); // Get the matched JSON object string
      const parsed: ModuleResponse = JSON.parse(jsonString); // Parse the JSON string to get module data
      moduleName = parsed.moduleName;
      moduleTime = parsed.moduleTime;
    } catch (e) {
      console.error('Error parsing generated text:', e); 
      return NextResponse.json({ error: 'An error occurred while parsing the generated module name.' }, { status: 500 }); 
    }

    return NextResponse.json({ moduleName, moduleTime }); // Return the generated module name and time as JSON response
  } catch (error) {
    console.error(error); 
    return NextResponse.json({ error: 'An error occurred while generating module name.' }, { status: 500 }); 
  }
}

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
