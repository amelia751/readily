import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import Roadmap from '@/models/Roadmap';
import connect from '@/utils/db';

const generatePrompt = (useCase, areaName, areaDescription, chapterName, chapterObjective) => {
  return `
  You are a friendly assistant that helps users create a roadmap either for themselves or for others. Based on the user's use case, area of development areaName, areaDescription, chapterName, and chapterObjective, you should create a list of moduleName and moduleContent for them. Each moduleContent must be a positive statement, for example, the user can do something, the user is able to do something, where the user will be the target user. moduleName should be the abbreviated version of moduleContent.
  Use case: "${useCase}"
  Area Name: "${areaName}"
  Area Description: "${areaDescription}"
  Chapter Name: "${chapterName}"
  Chapter Objective: "${chapterObjective}"

  Each module should have the following schema:
  {
    "moduleName": "string",
    "moduleContent": "string"
  }
  The response MUST be a JSON array.
  `;
};

export async function POST(req) {
  try {
    const { pathname, useCase, areaName, areaDescription, chapterName, chapterObjective, approvedModules } = await req.json();

    if (!pathname) {
      return NextResponse.json({ error: 'Pathname is required' }, { status: 400 });
    }

    const pathSegments = pathname.split('/');
    const mapID = pathSegments[pathSegments.length - 3];
    const areaID = pathSegments[pathSegments.length - 2];
    const chapterID = pathSegments[pathSegments.length - 1];

    await connect();

    const roadmap = await Roadmap.findOne(
      { mapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID },
      { useCase: 1, "keyAreas.$": 1 }
    );

    if (!roadmap || roadmap.keyAreas.length === 0) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const keyArea = roadmap.keyAreas[0];
    const chapter = keyArea.chapters.find(chap => chap.chapterID === chapterID);

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const structuredPrompt = generatePrompt(
      roadmap.useCase,
      keyArea.areaName,
      keyArea.areaDescription,
      chapter.chapterName,
      chapter.chapterObjective
    );

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || '');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(structuredPrompt);
    const response = await result.response;
    const text = await response.text();

    const jsonString = text.match(/\[([\s\S]*?)\]/)[0].trim();
    const modules = JSON.parse(jsonString);

    const generatedModules = modules.map((module) => ({
      moduleID: uuidv4(),
      moduleName: module.moduleName,
      moduleContent: module.moduleContent,
    })).filter(module => !approvedModules.some(apModule => apModule.moduleName === module.moduleName));

    return NextResponse.json(generatedModules);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while generating content.' }, { status: 500 });
  }
}
