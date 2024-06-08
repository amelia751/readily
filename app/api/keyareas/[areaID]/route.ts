import { NextRequest, NextResponse } from 'next/server';
import Roadmap from '@/models/Roadmap';
import connect from '@/utils/db';

// GET request to fetch a specific key area
export async function GET(req: NextRequest, { params }: { params: { areaID: string } }) {
  await connect();

  const { areaID } = params; // Accessing the dynamic route parameter

  try {
    const roadmap = await Roadmap.findOne({ "keyAreas.areaID": areaID }, { "keyAreas.$": 1 });

    if (!roadmap || roadmap.keyAreas.length === 0) {
      return NextResponse.json({ message: 'Key area not found' }, { status: 404 });
    }

    return NextResponse.json(roadmap.keyAreas[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching key area', error: error.message }, { status: 500 });
  }
}

// PATCH request to update a specific key area
export async function PATCH(req: NextRequest, { params }: { params: { areaID: string } }) {
  await connect();

  const { areaID } = params; // Accessing the dynamic route parameter
  const { areaName, areaDescription } = await req.json();

  try {
    const roadmap = await Roadmap.findOneAndUpdate(
      { "keyAreas.areaID": areaID },
      {
        $set: {
          "keyAreas.$.areaName": areaName,
          "keyAreas.$.areaDescription": areaDescription,
        }
      },
      { new: true }
    );

    if (!roadmap) {
      return NextResponse.json({ message: 'Key area not found' }, { status: 404 });
    }

    const updatedKeyArea = roadmap.keyAreas.find(area => area.areaID === areaID);

    return NextResponse.json(updatedKeyArea, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating key area', error: error.message }, { status: 500 });
  }
}

// DELETE request to delete a specific key area
export async function DELETE(req: NextRequest, { params }: { params: { areaID: string } }) {
  await connect();

  const { areaID } = params; // Accessing the dynamic route parameter

  try {
    const roadmap = await Roadmap.findOneAndUpdate(
      { "keyAreas.areaID": areaID },
      { $pull: { keyAreas: { areaID: areaID } } },
      { new: true }
    );

    if (!roadmap) {
      return NextResponse.json({ message: 'Key area not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Key area deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting key area', error: error.message }, { status: 500 });
  }
}
