import { NextRequest, NextResponse } from 'next/server';
import Roadmap from '@/models/Roadmap';
import connect from '@/utils/db';

export async function GET(req: NextRequest, { params }: { params: { mapID: string } }) {
  await connect();

  const { mapID } = params; 
  try {
    const roadmap = await Roadmap.findOne({ mapID });

    if (!roadmap) {
      return NextResponse.json({ message: 'Roadmap not found' }, { status: 404 });
    }

    return NextResponse.json(roadmap, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching roadmap', error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { mapID: string } }) {
  await connect();

  const { mapID } = params; 
  const { mapName, useCase, keyAreas, published } = await req.json();

  try {
    const updatedRoadmap = await Roadmap.findOneAndUpdate(
      { mapID },
      { mapName, useCase, keyAreas, published },
      { new: true } 
    );

    if (!updatedRoadmap) {
      return NextResponse.json({ message: 'Roadmap not found' }, { status: 404 });
    }

    return NextResponse.json(updatedRoadmap, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating roadmap', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { mapID: string } }) {
  await connect();

  const { mapID } = params; 

  try {
    const deletedRoadmap = await Roadmap.findOneAndDelete({ mapID });

    if (!deletedRoadmap) {
      return NextResponse.json({ message: 'Roadmap not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Roadmap deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting roadmap', error: error.message }, { status: 500 });
  }
}

