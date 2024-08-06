import { NextRequest, NextResponse } from 'next/server';
import Roadmap from '@/models/Roadmap'; 
import connect from '@/utils/db'; 
import { Roadmap as RoadmapType, KeyArea, Chapter, Module } from '@/types/Roadmap'; 

interface Params {
  params: {
    chapterID: string; 
  };
}

// Type guard to check if an error has a message property
function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
}

// Handler function for GET requests to fetch a chapter by its ID
export async function GET(req: NextRequest, { params }: Params) {
  await connect(); 

  const { chapterID } = params;

  try {
    const roadmap = await Roadmap.findOne({ "keyAreas.chapters.chapterID": chapterID }, { "keyAreas.$": 1 });

    if (!roadmap) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    const keyArea = roadmap.keyAreas.find((area: KeyArea) => area.chapters.some((chap: Chapter) => chap.chapterID === chapterID));
    const chapter = keyArea?.chapters.find((chap: Chapter) => chap.chapterID === chapterID);

    if (!chapter) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json(chapter, { status: 200 });
  } catch (error) {
    const errorMessage = isErrorWithMessage(error) ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error fetching chapter', error: errorMessage }, { status: 500 });
  }
}

// Handler function for PATCH requests to update a chapter by its ID
export async function PATCH(req: NextRequest, { params }: Params) {
  await connect(); 

  const { chapterID } = params;
  const { chapterName, chapterObjective, chapterScore }: Partial<Chapter> = await req.json();

  try {
    const updateFields: { [key: string]: any } = {};
    if (chapterName !== undefined) updateFields["keyAreas.$[area].chapters.$[chapter].chapterName"] = chapterName;
    if (chapterObjective !== undefined) updateFields["keyAreas.$[area].chapters.$[chapter].chapterObjective"] = chapterObjective;
    if (chapterScore !== undefined) updateFields["keyAreas.$[area].chapters.$[chapter].chapterScore"] = chapterScore;

    const roadmap = await Roadmap.findOneAndUpdate(
      { "keyAreas.chapters.chapterID": chapterID },
      { $set: updateFields },
      {
        arrayFilters: [
          { "area.chapters.chapterID": chapterID },
          { "chapter.chapterID": chapterID }
        ],
        new: true
      }
    );

    if (!roadmap) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    const keyArea = roadmap.keyAreas.find((area: KeyArea) => area.chapters.some((chap: Chapter) => chap.chapterID === chapterID));
    const updatedChapter = keyArea?.chapters.find((chap: Chapter) => chap.chapterID === chapterID);

    return NextResponse.json(updatedChapter, { status: 200 });
  } catch (error) {
    const errorMessage = isErrorWithMessage(error) ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error updating chapter', error: errorMessage }, { status: 500 });
  }
}

// Handler function for DELETE requests to delete a chapter by its ID
export async function DELETE(req: NextRequest, { params }: Params) {
  await connect();

  const { chapterID } = params;

  try {
    const roadmap = await Roadmap.findOneAndUpdate(
      { "keyAreas.chapters.chapterID": chapterID },
      { $pull: { "keyAreas.$.chapters": { chapterID: chapterID } } },
      { new: true }
    );

    if (!roadmap) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Chapter deleted successfully' }, { status: 200 });
  } catch (error) {
    const errorMessage = isErrorWithMessage(error) ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error deleting chapter', error: errorMessage }, { status: 500 });
  }
}

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
