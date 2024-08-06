import { NextRequest, NextResponse } from 'next/server'; 
import { v4 as uuidv4 } from 'uuid'; 
import Roadmap from '@/models/Roadmap'; 
import connect from '@/utils/db'; 
import { Roadmap as RoadmapType, KeyArea, Chapter, Module } from '@/types/Roadmap'; 

// Type guard to check if an error has a message property
function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
}

// POST request handler to create a new chapter
export const POST = async (request: NextRequest) => {
  await connect(); 

  const { mapID, areaID, chapterName, chapterObjective }: { mapID: string; areaID: string; chapterName: string; chapterObjective: string } = await request.json(); // Parse the request body

  try {
    const newChapter: Chapter = {
      chapterID: uuidv4(), // Generate a unique ID for the chapter
      areaID, // Add areaID
      chapterName,
      chapterObjective,
      chapterScore: null, // Automatically set the chapter score to null
      modules: [], // Automatically set the modules to an empty array
    };

    // Find the roadmap and update it by adding the new chapter to the specified key area
    const updatedRoadmap: RoadmapType | null = await Roadmap.findOneAndUpdate(
      { mapID: mapID, "keyAreas.areaID": areaID },
      { $push: { "keyAreas.$.chapters": newChapter } },
      { new: true } 
    );

    if (!updatedRoadmap) {
      return NextResponse.json({ message: 'Key area not found' }, { status: 404 }); 
    }

    return NextResponse.json(newChapter, { status: 201 }); 
  } catch (error) {
    const errorMessage = isErrorWithMessage(error) ? error.message : 'An unknown error occurred'; 
    return NextResponse.json({ message: 'Error creating chapter', error: errorMessage }, { status: 500 }); 
  }
};

// GET request handler to fetch chapters
export const GET = async (request: NextRequest) => {
  await connect(); 

  const { mapID, areaID }: { mapID: string; areaID: string } = await request.json(); // Parse the request body

  try {
    // Find the roadmap and retrieve the specified key area
    const roadmap: RoadmapType | null = await Roadmap.findOne({ mapID: mapID, "keyAreas.areaID": areaID }, { "keyAreas.$": 1 });

    if (!roadmap) {
      return NextResponse.json({ message: 'Key area not found' }, { status: 404 }); // Return a 404 response if the key area is not found
    }

    const keyArea = roadmap.keyAreas[0]; // Extract the key area from the roadmap
    return NextResponse.json(keyArea.chapters, { status: 200 }); 
  } catch (error) {
    const errorMessage = isErrorWithMessage(error) ? error.message : 'An unknown error occurred'; 
    return NextResponse.json({ message: 'Error fetching chapters', error: errorMessage }, { status: 500 }); 
  }
};

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
