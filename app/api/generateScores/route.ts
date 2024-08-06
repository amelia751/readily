import { NextResponse } from 'next/server'; 
import { GoogleGenerativeAI } from '@google/generative-ai'; 

// Function to generate a prompt for the AI model based on the user's description, objectives, and optional follow-up answers
const generateScoresPrompt = (
  description: string,
  objectives: string[],
  followUpAnswers: string[] = []
): string => {
  // Prepare follow-up answers text if any are provided
  const followUpText = followUpAnswers.length > 0 ? `
  Follow-Up Answers:
  ${followUpAnswers.map((answer, index) => `"${index + 1}. ${answer}"`).join('\n')}
  ` : '';

  // Return the structured prompt
  return `
  You are an assistant that helps generate scores for given objectives based on the user's description.
  
  User's Description:
  "${description}"
  
  Objectives:
  ${objectives.map((obj, index) => `"${index + 1}. ${obj}"`).join('\n')}
  
  ${followUpText}

  For each objective, generate a score between 1 and 5 based on the user's description. If you need more information, ask specific questions. Limit follow-up questions to a maximum of 1 round.
  
  The response MUST be a JSON object with the following schema:
  {
    "scores": {
      "${objectives[0]}": integer,
      "${objectives[1]}": integer,
      ...
    },
    "questions": ["string"] // Optional: If you need more information, include specific questions
  }
  `;
};

// Define the structure of the request body
interface RequestBody {
  description: string;
  objectives: string[];
  followUpAnswers?: string[];
  round?: number;
}

// Define the structure of the response data
interface ResponseData {
  scores: Record<string, number>;
  questions?: string[];
}

// POST request handler to generate scores based on the user's description, objectives, and optional follow-up answers
export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse the request body
    const {
      description,
      objectives,
      followUpAnswers = [],
      round = 1
    }: RequestBody = await req.json();

    if (!description || !objectives) {
      return NextResponse.json({ error: 'Description and objectives are required' }, { status: 400 }); 
    }

    const structuredPrompt = generateScoresPrompt(description, objectives, followUpAnswers); // Generate the structured prompt

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || ''); // Initialize the AI model with the API key

    // Configure the generation settings for the AI model
    const generationConfig = {
      temperature: 0.1,
      topP: 0.9
    };

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro', generationConfig }); // Get the generative model
    const result = await model.generateContent(structuredPrompt); // Generate content using the AI model
    const response = await result.response; // Get the response from the AI model
    const text = await response.text(); // Extract the response text

    // Ensure the text is in a valid JSON format
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);

    let data: ResponseData;
    try {
      data = JSON.parse(jsonString); // Parse the JSON string to get the response data
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError); 
      return NextResponse.json({ error: 'An error occurred while parsing the generated module name.' }, { status: 500 }); 
    }

    // If there are additional questions and it's the first round, return the questions
    if (data.questions && data.questions.length > 0 && round === 1) {
      return NextResponse.json({ questions: data.questions, round: round + 1 });
    }

    // Return scores after the first round or if there are no more questions
    return NextResponse.json(data);
  } catch (error) {
    console.error(error); // Log any errors
    return NextResponse.json({ error: 'An error occurred while generating scores.' }, { status: 500 }); 
  }
}

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
