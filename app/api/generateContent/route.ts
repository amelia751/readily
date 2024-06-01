import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || '');

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while generating content.' }, { status: 500 });
  }
}

// import { NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { v4 as uuidv4 } from 'uuid';

// const generatePrompt = (userPrompt) => {
//   return `
//   Based on the following prompt, generate a module with the following schema:
//   Prompt: "${userPrompt}"
//   Schema:
//   {
//     "moduleName": "string",
//     "moduleType": "string",
//     "moduleObjective": "string",
//     "moduleContent": "string",
//     "moduleResources": "string",
//     "moduleCriteria": "string",
//     "moduleScore": "number"
//   }
//   The response MUST be a JSON object.
//   The module should focus on ONE activity. 
//   The moduleName should be the abbreviated name of that activity.
//   The moduleContent needs to be as specific as possible, including step by step guidelines.
//   For moduleResources, feel free to include any physical materials, links from Youtube, or any potentially useful articles on Google to successfully carrying the module. 
//   For criteria, you should have clear criteria from 1 to 5. 1 suggests failure to carry out to moduleObjective and 5 suggests success in carrying out moduleObjective.
//   `;
// };

// export async function POST(req) {
//   const { prompt } = await req.json();
//   const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || '');

//   try {
//     const structuredPrompt = generatePrompt(prompt);
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//     const result = await model.generateContent(structuredPrompt);
//     const response = await result.response;
//     const text = await response.text();

//     // Extract the JSON object from the response text
//     const jsonString = text.match(/```json([\s\S]*?)```/)[1].trim();
//     const module = JSON.parse(jsonString);

//     // Add the generated module ID
//     const generatedModule = {
//       moduleID: uuidv4(),
//       moduleName: module.moduleName,
//       moduleType: module.moduleType,
//       moduleObjective: module.moduleObjective,
//       moduleContent: module.moduleContent,
//       moduleResources: module.moduleResources,
//       moduleCriteria: module.moduleCriteria,
//       moduleScore: module.moduleScore,
//     };

//     return NextResponse.json(generatedModule);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'An error occurred while generating content.' }, { status: 500 });
//   }
// }
