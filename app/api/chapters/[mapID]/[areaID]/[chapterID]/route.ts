import { NextRequest, NextResponse } from 'next/server';
import Roadmap from '@/models/Roadmap';
import connect from '@/utils/db';

// GET request to fetch a specific chapter
export async function GET(req: NextRequest, { params }: { params: { chapterID: string } }) {
  await connect();

  const { chapterID } = params;

  try {
    const roadmap = await Roadmap.findOne({ "keyAreas.chapters.chapterID": chapterID }, { "keyAreas.$": 1 });

    if (!roadmap) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    const keyArea = roadmap.keyAreas.find(area => area.chapters.some(chap => chap.chapterID === chapterID));
    const chapter = keyArea?.chapters.find(chap => chap.chapterID === chapterID);

    if (!chapter) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json(chapter, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching chapter', error: error.message }, { status: 500 });
  }
}


// PATCH request to update a specific chapter
export async function PATCH(req: NextRequest, { params }: { params: { chapterID: string } }) {
  await connect();

  const { chapterID } = params;
  const { chapterName, chapterObjective } = await req.json();

  try {
    const roadmap = await Roadmap.findOneAndUpdate(
      { "keyAreas.chapters.chapterID": chapterID },
      {
        $set: {
          "keyAreas.$[area].chapters.$[chapter].chapterName": chapterName,
          "keyAreas.$[area].chapters.$[chapter].chapterObjective": chapterObjective,
        }
      },
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

    const keyArea = roadmap.keyAreas.find(area => area.chapters.some(chap => chap.chapterID === chapterID));
    const updatedChapter = keyArea?.chapters.find(chap => chap.chapterID === chapterID);

    return NextResponse.json(updatedChapter, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating chapter', error: error.message }, { status: 500 });
  }
}



// DELETE request to delete a specific chapter
export async function DELETE(req: NextRequest, { params }: { params: { chapterID: string } }) {
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
    return NextResponse.json({ message: 'Error deleting chapter', error: error.message }, { status: 500 });
  }
}
