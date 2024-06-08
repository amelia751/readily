// import { NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { v4 as uuidv4 } from 'uuid';

// const generatePrompt = (useCase, areaName, areaDescription) => {
//   return `
//   You are a friendly assistant that helps users create a roadmap either for themselves or for others. Based on the user's use case, area of development areaName, and areaDescription, you should create a list of chapterObjective and chapterName for them. Each Objective must be a positive statement, for example, the user can do something, the user is able to do something, where the user will be the target user. chapterName should be the abbreviated version of chapterObjective.
//   Use case: "${useCase}"
//   Area Name: "${areaName}"
//   Area Description: "${areaDescription}"

//   Each chapter should have the following schema:
//   {
//     "chapterName": "string",
//     "chapterObjective": "string"
//   }
//   The response MUST be a JSON array.
//   `;
// };

// export async function POST(req) {
//   const { useCase, areaName, areaDescription } = await req.json();
//   const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || '');

//   try {
//     const structuredPrompt = generatePrompt(useCase, areaName, areaDescription);
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//     const result = await model.generateContent(structuredPrompt);
//     const response = await result.response;
//     const text = await response.text();

//     // Extract the JSON array from the response text
//     const jsonString = text.match(/\[([\s\S]*?)\]/)[0].trim();
//     const chapters = JSON.parse(jsonString);

//     // Add unique IDs to each chapter
//     const generatedChapters = chapters.map((chapter) => ({
//       chapterID: uuidv4(),
//       chapterName: chapter.chapterName,
//       chapterObjective: chapter.chapterObjective,
//     }));

//     return NextResponse.json(generatedChapters);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'An error occurred while generating content.' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';

const generatePrompt = (useCase, areaName, areaDescription) => {
  return `
  You are a friendly assistant that helps users create a roadmap either for themselves or for others. Based on the user's use case, area of development areaName, and areaDescription, you should create a list of chapterObjective and chapterName for them. Each Objective must be a positive statement, for example, the user can do something, the user is able to do something, where the user will be the target user. chapterName should be the abbreviated version of chapterObjective.
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

export async function POST(req) {
  const { useCase, areaName, areaDescription } = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || '');

  try {
    const structuredPrompt = generatePrompt(useCase, areaName, areaDescription);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(structuredPrompt);
    const response = await result.response;
    const text = await response.text();

    // Extract the JSON array from the response text
    const jsonString = text.match(/\[([\s\S]*?)\]/)[0].trim();
    const chapters = JSON.parse(jsonString);

    // Add unique IDs to each chapter
    const generatedChapters = chapters.map((chapter) => ({
      chapterID: uuidv4(),
      chapterName: chapter.chapterName,
      chapterObjective: chapter.chapterObjective,
    }));

    return NextResponse.json(generatedChapters);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while generating content.' }, { status: 500 });
  }
}
