import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connect from '@/utils/db';
import Therapy from '@/models/Therapy';

const generateTherapyOrderPrompt = (roadmap: any) => {
  const objectives = roadmap.keyAreas.flatMap((area: any) => area.chapters.map((chapter: any) => ({
    chapterID: chapter.chapterID,
    chapterName: chapter.chapterName,
    chapterObjective: chapter.chapterObjective,
    chapterScore: chapter.chapterScore || 0,
    modules: chapter.modules.map((module: any) => ({
      moduleID: module.moduleID,
      moduleName: module.moduleName,
      moduleContent: module.moduleContent,
      moduleTime: module.moduleTime,
      moduleScore: module.moduleScore || 0
    }))
  })));

  return `
    You are an assistant that helps determine the order and selection of chapters and modules for therapy based on their scores.

    Roadmap: "${roadmap.mapName}"

    Objectives and Scores:
    ${objectives.map((obj: any, index: any) => `Chapter ${index + 1} - "${obj.chapterName}" (Objective: ${obj.chapterObjective}, Score: ${obj.chapterScore})\nModules:\n${obj.modules.map((mod: any, modIndex: any) => `Module ${modIndex + 1}: "${mod.moduleName}" (Score: ${mod.moduleScore}, Content: ${mod.moduleContent})`).join('\n')}`).join('\n\n')}

    Please determine the order of chapters and modules to focus on for therapy. The lower the score, the more modules should be selected from that chapter. Avoid using chapters with a score of 5. Use chapters with a score of 4 moderately. Use more chapters with a score of 2 or 3. Render all the modules for chapters with score of 1.

    The response MUST be a JSON object with the following schema:
    {
      "suggestedChapters": [
        {
          "chapterName": string,
          "modules": [
            {
              "moduleName": string
            }
          ]
        }
      ]
    }
  `;
};

export async function POST(req: any) {
  await connect();

  try {
    const { roadmap }: any = await req.json();

    if (!roadmap) {
      return NextResponse.json({ error: 'Roadmap is required' }, { status: 400 });
    }

    const structuredPrompt = generateTherapyOrderPrompt(roadmap);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || '');

    const generationConfig = {
      temperature: 0.1,
      topP: 0.9
    };

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro', generationConfig });
    const result = await model.generateContent(structuredPrompt);
    const response = await result.response;
    const text = await response.text();

    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    
    let data: any;
    try {
      data = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      const correctedJsonString = jsonString.replace(/,\s*]/g, ']'); // Remove trailing commas before closing brackets
      try {
        data = JSON.parse(correctedJsonString);
      } catch (secondParseError) {
        console.error('Error parsing corrected JSON:', secondParseError);
        return NextResponse.json({ error: 'An error occurred while parsing the generated order.' }, { status: 500 });
      }
    }

    const suggestedChapters = data.suggestedChapters;

    const filteredRoadmap = {
      mapID: roadmap.mapID,
      mapName: roadmap.mapName,
      useCase: roadmap.useCase,
      creator: roadmap.creator, 
      keyAreas: roadmap.keyAreas.map((area: any) => ({
        ...area,
        chapters: area.chapters.filter((chapter: any) => 
          suggestedChapters.some((suggested: any) => suggested.chapterName === chapter.chapterName)
        ).map((chapter: any) => ({
          ...chapter,
          modules: chapter.modules.filter((module: any) =>
            suggestedChapters
              .find((suggested: any) => suggested.chapterName === chapter.chapterName)
              .modules.some((suggestedModule: any) => suggestedModule.moduleName === module.moduleName)
          ).map((module: any) => ({
            ...module,
            moduleProgress: null // Add moduleProgress as null
          }))
        }))
      }))
    };

    const newTherapy = new Therapy(filteredRoadmap);
    const savedTherapy = await newTherapy.save();

    return NextResponse.json(savedTherapy, {
      status: 201,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while generating the therapy order.' }, { status: 500 });
  }
}

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';



