import { NextRequest, NextResponse } from 'next/server'; 
import Roadmap from '@/models/Roadmap'; 
import connect from '@/utils/db'; 
import { v4 as uuidv4 } from 'uuid'; 
import { Roadmap as RoadmapType, KeyArea, Chapter, Module } from '@/types/Roadmap'; // Import types

// POST request handler to create a new module in a chapter
export async function POST(req: NextRequest): Promise<NextResponse> {
  const { mapID, areaID, chapterID, moduleName, moduleContent, moduleTime }: 
  { mapID: string; areaID: string; chapterID: string; moduleName: string; moduleContent: string; moduleTime: number } = await req.json();
  await connect(); 

  try {
    // Find the roadmap containing the specified chapter and update it with the new module
    const roadmap = await Roadmap.findOneAndUpdate(
      { mapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID },
      { $push: { "keyAreas.$[area].chapters.$[chapter].modules": { moduleID: uuidv4(), moduleName, moduleContent, moduleTime } } },
      { new: true, arrayFilters: [{ "area.areaID": areaID }, { "chapter.chapterID": chapterID }] }
    ) as RoadmapType | null;

    if (!roadmap) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 }); 
    }

    // Find the newly added module within the roadmap
    const keyArea = roadmap.keyAreas.find((area) => area.areaID === areaID);
    const chapter = keyArea?.chapters.find((chap) => chap.chapterID === chapterID);
    const newModule = chapter?.modules.find((module) => module.moduleName === moduleName);

    return NextResponse.json(newModule, { status: 201 }); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    return NextResponse.json({ message: 'Error creating module', error: errorMessage }, { status: 500 }); 
  }
}

// GET request handler to fetch modules of a specific chapter
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url); // Extract search parameters from the request URL
  const mapID = searchParams.get('mapID'); // Get the mapID from the search parameters
  const areaID = searchParams.get('areaID'); // Get the areaID from the search parameters
  const chapterID = searchParams.get('chapterID'); // Get the chapterID from the search parameters
  await connect(); // Connect to the database

  try {
    // Find the roadmap containing the specified chapter
    const roadmap = await Roadmap.findOne(
      { mapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID },
      { "keyAreas.$": 1 }
    ) as RoadmapType | null;

    if (!roadmap || roadmap.keyAreas.length === 0) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 }); 
    }

    // Find the specific chapter within the roadmap
    const keyArea = roadmap.keyAreas[0];
    const chapter = keyArea.chapters.find((chap) => chap.chapterID === chapterID);

    if (!chapter) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 }); 
    }

    return NextResponse.json(chapter.modules, { status: 200 }); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    return NextResponse.json({ message: 'Error fetching modules', error: errorMessage }, { status: 500 }); 
  }
}

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
