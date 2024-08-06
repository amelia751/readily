import { NextRequest, NextResponse } from 'next/server'; 
import { v4 as uuidv4 } from 'uuid'; 
import Roadmap from '@/models/Roadmap'; 
import connect from '@/utils/db'; 

interface RequestBody {
  mapName: string;
  useCase: string;
  published: boolean;
  creator: string;
}

// POST request handler to create a new roadmap
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  await connect(); 

  // Parse the request body to get mapName, useCase, published, and creator
  const { mapName, useCase, published, creator }: RequestBody = await request.json();

  console.log('Request received with data:', { mapName, useCase, published, creator });

  try {
    // Create a new Roadmap object with the parsed data and a generated mapID
    const newRoadmap = new Roadmap({
      mapID: uuidv4(),
      mapName,
      useCase,
      keyAreas: [],
      published,
      creator,
    });

    console.log('New Roadmap object created:', newRoadmap);

    // Save the new Roadmap object to the database
    const savedRoadmap = await newRoadmap.save();

    console.log('Roadmap successfully saved:', savedRoadmap);

    return NextResponse.json(savedRoadmap, {
      status: 201, 
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    console.error('Error creating roadmap:', errorMessage);
    return NextResponse.json({ message: 'Error creating roadmap', error: errorMessage }, {
      status: 500, 
    });
  }
};

// GET request handler to fetch roadmaps based on query parameters
export async function GET(req: NextRequest): Promise<NextResponse> {
  await connect(); 

  // Extract query parameters from the request URL
  const creator = req.nextUrl.searchParams.get('creator');
  const published = req.nextUrl.searchParams.get('published');

  try {
    // Build the query object based on the provided parameters
    const query: { creator?: string; published?: boolean } = {};
    if (creator) query.creator = creator;
    if (published) query.published = true;

    // Find roadmaps based on the query object
    const roadmaps = await Roadmap.find(query);
    return NextResponse.json(roadmaps, { status: 200 }); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    return NextResponse.json({ message: 'Error fetching roadmaps', error: errorMessage }, { status: 500 }); 
  }
}
