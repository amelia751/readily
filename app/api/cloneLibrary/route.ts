import { NextResponse } from 'next/server'; 
import { v4 as uuidv4 } from 'uuid'; 
import Roadmap from '@/models/Roadmap'; 
import connect from '@/utils/db'; 

// Define interfaces for the structures used in the code
interface KeyArea {
  areaID: string;
  mapID: string;
  chapters: Chapter[];
  toObject(): object;
}

interface Chapter {
  chapterID: string;
  areaID: string;
  modules: Module[];
  toObject(): object;
}

interface Module {
  moduleID: string;
  chapterID: string;
  toObject(): object;
}

interface OriginalRoadmap {
  _id?: string; // Optional _id property
  mapID: string;
  creator: any;
  published: boolean;
  keyAreas: KeyArea[];
  toObject(): object;
}

// POST request handler to clone a roadmap
export const POST = async (request: Request) => {
  await connect(); 

  // Parse the request body to get mapID and newCreator
  const { mapID, newCreator } = await request.json();

  try {
    // Fetch the original roadmap details
    const originalRoadmap: OriginalRoadmap | null = await Roadmap.findOne({ mapID });

    if (!originalRoadmap) {
      return NextResponse.json({ message: 'Roadmap not found' }, { status: 404 }); 
    }

    // Generate a new mapID for the cloned roadmap
    const newMapID = uuidv4();

    // Clone the roadmap with filtered key areas and associated new IDs
    const clonedRoadmap = {
      ...originalRoadmap.toObject(),
      mapID: newMapID,
      creator: newCreator,
      published: false, // Set published to false for the cloned roadmap
      keyAreas: originalRoadmap.keyAreas.filter(keyArea => keyArea.chapters.length > 0).map(keyArea => {
        const newAreaID = uuidv4();
        return {
          ...keyArea.toObject(),
          areaID: newAreaID,
          mapID: newMapID, // Set the mapID to the new mapID
          chapters: keyArea.chapters.filter(chapter => chapter.modules.length > 0).map(chapter => {
            const newChapterID = uuidv4();
            return {
              ...chapter.toObject(),
              chapterID: newChapterID,
              areaID: newAreaID, // Associate with the new areaID
              modules: chapter.modules.map(module => ({
                ...module.toObject(),
                moduleID: uuidv4(),
                chapterID: newChapterID, // Associate with the new chapterID
              })),
            };
          }),
        };
      }),
    };

    // Use type assertion to temporarily bypass type checks and remove the original _id to avoid conflicts
    delete (clonedRoadmap as any)._id;

    // Create a new Roadmap instance with the cloned data and save it to the database
    const newRoadmap = new Roadmap(clonedRoadmap);
    const savedRoadmap = await newRoadmap.save();

    return NextResponse.json(savedRoadmap, { status: 201 }); 
  } catch (error) {
    console.error('Error cloning roadmap:', (error as Error).message); 
    return NextResponse.json({ message: 'Error cloning roadmap', error: (error as Error).message }, { status: 500 }); 
  }
};
