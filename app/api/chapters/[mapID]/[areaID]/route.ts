import { NextRequest, NextResponse } from 'next/server';
import Roadmap from '@/models/Roadmap'; 
import connect from '@/utils/db'; 

// Type guard to check if an error has a message property
function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
}

// Handler function for GET requests to fetch a key area by its mapID and areaID
export async function GET(req: NextRequest, { params }: { params: { mapID: string, areaID: string } }) {
  await connect(); 

  const { mapID, areaID } = params; // Extract mapID and areaID from the request parameters

  try {
    // Find the roadmap containing the key area with the specified mapID and areaID
    const roadmap = await Roadmap.findOne(
      { mapID, "keyAreas.areaID": areaID },
      { useCase: 1, "keyAreas.$": 1 } // Select only the useCase and the specific key area
    );

    if (!roadmap || roadmap.keyAreas.length === 0) {
      return NextResponse.json({ message: 'Key area not found' }, { status: 404 });
    }

    // Extract the key area from the roadmap
    const keyArea = roadmap.keyAreas[0];

    return NextResponse.json({
      useCase: roadmap.useCase, 
      areaName: keyArea.areaName, 
      areaDescription: keyArea.areaDescription, 
      chapters: keyArea.chapters 
    }, { status: 200 });
  } catch (error) {
    const errorMessage = isErrorWithMessage(error) ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error fetching chapters', error: errorMessage }, { status: 500 });
  }
}
