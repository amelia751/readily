import { NextRequest, NextResponse } from 'next/server'; 
import { v4 as uuidv4 } from 'uuid'; 
import Roadmap from '@/models/Roadmap'; 
import connect from '@/utils/db'; 

// POST request handler to create a new key area in a roadmap
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  await connect(); 

  // Parse the request body to get mapID, areaName, and areaDescription
  const { mapID, areaName, areaDescription }: { mapID: string; areaName: string; areaDescription: string } = await request.json();

  try {
    // Generate a new areaID for the key area
    const newAreaID = uuidv4();

    // Create a new key area object
    const newKeyArea = {
      areaID: newAreaID,
      mapID,
      areaName,
      areaDescription,
      chapters: [], // Ensure chapters is an empty array
    };

    // Update the roadmap with the new key area
    const updatedRoadmap = await Roadmap.findOneAndUpdate(
      { mapID: mapID },
      { $push: { keyAreas: newKeyArea } },
      { new: true } // Return the updated document
    );

    if (!updatedRoadmap) {
      return NextResponse.json({ message: 'Roadmap not found' }, {
        status: 404,
      }); 
    }

    return NextResponse.json(newKeyArea, {
      status: 201,
    }); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    return NextResponse.json({ message: 'Error creating key area', error: errorMessage }, {
      status: 500,
    }); 
  }
};

// GET request handler to fetch key areas of a roadmap by mapID
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  await connect(); // Connect to the database

  // Parse the request body to get mapID
  const { mapID }: { mapID: string } = await request.json();

  try {
    // Find the roadmap by mapID
    const roadmap = await Roadmap.findOne({ mapID: mapID });
    if (!roadmap) {
      return NextResponse.json({ message: 'Roadmap not found' }, {
        status: 404,
      }); 
    }
    return NextResponse.json(roadmap.keyAreas, {
      status: 200,
    }); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    return NextResponse.json({ message: 'Error fetching key areas', error: errorMessage }, {
      status: 500,
    }); 
  }
};
