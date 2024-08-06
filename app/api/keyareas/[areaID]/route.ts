import { NextRequest, NextResponse } from 'next/server'; 
import Roadmap from '@/models/Roadmap'; 
import connect from '@/utils/db'; 

// GET request handler to fetch a key area by its areaID
export async function GET(req: NextRequest, { params }: { params: { areaID: string } }): Promise<NextResponse> {
  await connect(); 

  const { areaID } = params; // Extract areaID from the request parameters

  try {
    // Find the roadmap containing the key area with the specified areaID
    const roadmap = await Roadmap.findOne({ "keyAreas.areaID": areaID }, { "keyAreas.$": 1 });

    if (!roadmap || roadmap.keyAreas.length === 0) {
      return NextResponse.json({ message: 'Key area not found' }, { status: 404 }); 
    }

    return NextResponse.json(roadmap.keyAreas[0], { status: 200 }); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    return NextResponse.json({ message: 'Error fetching key area', error: errorMessage }, { status: 500 }); 
  }
}

// PATCH request handler to update a key area by its areaID
export async function PATCH(req: NextRequest, { params }: { params: { areaID: string } }): Promise<NextResponse> {
  await connect(); // Connect to the database

  const { areaID } = params; // Extract areaID from the request parameters
  const { areaName, areaDescription } = await req.json(); // Parse the request body to get areaName and areaDescription

  try {
    // Find the roadmap containing the key area with the specified areaID and update the key area's name and description
    const roadmap = await Roadmap.findOneAndUpdate(
      { "keyAreas.areaID": areaID },
      {
        $set: {
          "keyAreas.$.areaName": areaName,
          "keyAreas.$.areaDescription": areaDescription,
        }
      },
      { new: true } // Return the updated document
    );

    if (!roadmap) {
      return NextResponse.json({ message: 'Key area not found' }, { status: 404 }); 
    }

    // Find the updated key area in the roadmap
    const updatedKeyArea = roadmap.keyAreas.find((area: { areaID: string }) => area.areaID === areaID);

    return NextResponse.json(updatedKeyArea, { status: 200 }); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    return NextResponse.json({ message: 'Error updating key area', error: errorMessage }, { status: 500 }); 
  }
}

// DELETE request handler to delete a key area by its areaID
export async function DELETE(req: NextRequest, { params }: { params: { areaID: string } }): Promise<NextResponse> {
  await connect(); 

  const { areaID } = params; // Extract areaID from the request parameters

  try {
    // Find the roadmap containing the key area with the specified areaID and remove the key area
    const roadmap = await Roadmap.findOneAndUpdate(
      { "keyAreas.areaID": areaID },
      { $pull: { keyAreas: { areaID: areaID } } },
      { new: true } // Return the updated document
    );

    if (!roadmap) {
      return NextResponse.json({ message: 'Key area not found' }, { status: 404 }); 
    }

    return NextResponse.json({ message: 'Key area deleted successfully' }, { status: 200 }); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    return NextResponse.json({ message: 'Error deleting key area', error: errorMessage }, { status: 500 }); 
  }
}
