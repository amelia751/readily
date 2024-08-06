import { NextRequest, NextResponse } from 'next/server'; 
import { GoogleGenerativeAI } from '@google/generative-ai'; 
import Therapy from '@/models/Therapy'; 
import connect from '@/utils/db'; 

const apiKey = process.env.GOOGLE_GENERATIVE_AI_KEY;

if (!apiKey) {
  throw new Error('API key is not defined in environment variables'); // Throw an error if the API key is not defined
}

// Initialize the Google Generative AI model
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: "You are a friendly assistant that helps users succeed in carrying out their personalized therapy by answering them any questions they may have regarding the therapy."
});

interface ChatHistory {
  role: string;
  content: string;
}

interface RequestBody {
  message: string;
  history?: ChatHistory[];
  mapID: string;
}

interface TherapyDocument {
  mapID: string;
  [key: string]: any; 
}

// Type guard to check if an error has a message property
function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
}

const formatHistory = (history: ChatHistory[]) => {
  return history.map(chat => ({
    role: chat.role,
    parts: [{ text: chat.content }],
  }));
};

// POST request handler to handle chat messages
export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json(); // Parse the request body
  const { message, history, mapID } = body;

  try {
    await connect(); 
    const therapy: TherapyDocument | null = await Therapy.findOne({ mapID }); // Fetch the therapy document by mapID

    if (!therapy) {
      return NextResponse.json({ error: 'Therapy not found' }, { status: 404 }); 
    }

    // If there is no chat history, start a new chat, otherwise continue the existing chat
    if (!history || history.length === 0) {
      return startChat(message, therapy);
    } else {
      return continueChat(message, history, therapy);
    }
  } catch (error) {
    console.error('Error fetching therapy:', error); 
    const errorMessage = isErrorWithMessage(error) ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error fetching therapy information', error: errorMessage }, { status: 500 }); // Return a 500 response with the error message
  }
}

// Function to start a new chat session
async function startChat(message: string, therapy: TherapyDocument) {
  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 10000,
    },
  });

  try {
    const result = await chat.sendMessage(`${message}\n\nTherapy Details: ${JSON.stringify(therapy)}`); // Send the initial message along with therapy details
    const responseTxt = result.response.text(); 
    const newHistory = [
      { role: 'user', content: message },
      { role: 'model', content: responseTxt },
    ];
    return NextResponse.json({
      response: responseTxt,
      history: newHistory,
    }, { status: 201 }); 
  } catch (error) {
    console.error('Error calling Gemini AI API:', error); 
    const errorMessage = isErrorWithMessage(error) ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error calling Gemini AI API', error: errorMessage }, { status: 500 }); 
  }
}

// Function to continue an existing chat session
async function continueChat(message: string, history: ChatHistory[], therapy: TherapyDocument) {
  const formattedHistory = formatHistory(history); 

  const chat = model.startChat({
    history: formattedHistory,
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  try {
    const result = await chat.sendMessage(`${message}\n\nTherapy Details: ${JSON.stringify(therapy)}`); 
    const responseTxt = result.response.text(); 
    const newHistory = [
      ...history,
      { role: 'user', content: message },
      { role: 'model', content: responseTxt },
    ];
    return NextResponse.json({ response: responseTxt, history: newHistory }, { status: 201 }); 
  } catch (error) {
    console.error('Error calling Gemini AI API:', error); 
    const errorMessage = isErrorWithMessage(error) ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error calling Gemini AI API', error: errorMessage }, { status: 500 });
  }
}

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

