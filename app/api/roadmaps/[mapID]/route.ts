import { NextRequest, NextResponse } from 'next/server'; 
import Roadmap from '@/models/Roadmap'; 
import connect from '@/utils/db'; 

// GET request handler to fetch a roadmap by its mapID
export async function GET(req: NextRequest, { params }: { params: { mapID: string } }): Promise<NextResponse> {
  await connect(); 

  const { mapID } = params; // Extract mapID from the request parameters
  try {
    // Find the roadmap by its mapID
    const roadmap = await Roadmap.findOne({ mapID });

    if (!roadmap) {
      return NextResponse.json({ message: 'Roadmap not found' }, { status: 404 }); 
    }

    return NextResponse.json(roadmap, { status: 200 }); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    return NextResponse.json({ message: 'Error fetching roadmap', error: errorMessage }, { status: 500 }); 
  }
}

// PATCH request handler to update a roadmap by its mapID
export async function PATCH(req: NextRequest, { params }: { params: { mapID: string } }): Promise<NextResponse> {
  await connect(); 

  const { mapID } = params; // Extract mapID from the request parameters
  const { mapName, useCase, keyAreas, published }: 
    { mapName: string; useCase: string; keyAreas: any[]; published: boolean } = await req.json(); // Parse the request body to get mapName, useCase, keyAreas, and published

  try {
    // Find the roadmap by its mapID and update its details
    const updatedRoadmap = await Roadmap.findOneAndUpdate(
      { mapID },
      { mapName, useCase, keyAreas, published },
      { new: true } // Return the updated document
    );

    if (!updatedRoadmap) {
      return NextResponse.json({ message: 'Roadmap not found' }, { status: 404 }); 
    }

    return NextResponse.json(updatedRoadmap, { status: 200 }); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    return NextResponse.json({ message: 'Error updating roadmap', error: errorMessage }, { status: 500 }); 
  }
}

// DELETE request handler to delete a roadmap by its mapID
export async function DELETE(req: NextRequest, { params }: { params: { mapID: string } }): Promise<NextResponse> {
  await connect(); 

  const { mapID } = params; // Extract mapID from the request parameters

  try {
    // Find the roadmap by its mapID and delete it
    const deletedRoadmap = await Roadmap.findOneAndDelete({ mapID });

    if (!deletedRoadmap) {
      return NextResponse.json({ message: 'Roadmap not found' }, { status: 404 }); 
    }

    return NextResponse.json({ message: 'Roadmap deleted successfully' }, { status: 200 }); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting roadmap', error: errorMessage }, { status: 500 }); 
  }
}
