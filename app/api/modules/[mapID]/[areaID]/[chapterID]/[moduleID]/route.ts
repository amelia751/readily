import { NextRequest, NextResponse } from 'next/server'; 
import Roadmap from '@/models/Roadmap'; 
import connect from '@/utils/db'; 
import { Roadmap as RoadmapType, KeyArea, Chapter, Module } from '@/types/Roadmap'; // Import types

interface Params {
  mapID: string;
  areaID: string;
  chapterID: string;
  moduleID: string;
}

// GET request handler to fetch a specific module by its moduleID
export async function GET(req: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
  await connect(); 

  const { mapID, areaID, chapterID, moduleID } = params; // Extract parameters from the request

  try {
    // Find the roadmap containing the module with the specified moduleID
    const roadmap = await Roadmap.findOne(
      { mapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID, "keyAreas.chapters.modules.moduleID": moduleID },
      { "keyAreas.$": 1 }
    ) as RoadmapType | null;

    if (!roadmap) {
      return NextResponse.json({ message: 'Module not found' }, { status: 404 }); 
    }

    // Find the specific module within the roadmap
    const keyArea = roadmap.keyAreas.find((area) => area.areaID === areaID);
    const chapter = keyArea?.chapters.find((chap) => chap.chapterID === chapterID);
    const mod = chapter?.modules.find((m) => m.moduleID === moduleID);

    return NextResponse.json(mod, { status: 200 }); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    return NextResponse.json({ message: 'Error fetching module', error: errorMessage }, { status: 500 }); 
  }
}

// PATCH request handler to update a specific module by its moduleID
export async function PATCH(req: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
  await connect(); 

  const { mapID, areaID, chapterID, moduleID } = params; // Extract parameters from the request
  const { moduleName, moduleContent, moduleTime }: Partial<Module> = await req.json(); // Parse the request body to get module details

  try {
    // Find the roadmap containing the module with the specified moduleID and update its details
    const roadmap = await Roadmap.findOneAndUpdate(
      { mapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID, "keyAreas.chapters.modules.moduleID": moduleID },
      { 
        $set: { 
          "keyAreas.$[area].chapters.$[chapter].modules.$[mod].moduleName": moduleName,
          "keyAreas.$[area].chapters.$[chapter].modules.$[mod].moduleContent": moduleContent,
          "keyAreas.$[area].chapters.$[chapter].modules.$[mod].moduleTime": moduleTime 
        } 
      },
      { new: true, arrayFilters: [{ "area.areaID": areaID }, { "chapter.chapterID": chapterID }, { "mod.moduleID": moduleID }] }
    ) as RoadmapType | null;

    if (!roadmap) {
      return NextResponse.json({ message: 'Module not found' }, { status: 404 }); // Return a 404 response if module is not found
    }

    // Find the updated module within the roadmap
    const keyArea = roadmap.keyAreas.find((area) => area.areaID === areaID);
    const chapter = keyArea?.chapters.find((chap) => chap.chapterID === chapterID);
    const updatedMod = chapter?.modules.find((m) => m.moduleID === moduleID);

    return NextResponse.json(updatedMod, { status: 200 }); // Return the updated module with a 200 status
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; // Handle error messages
    return NextResponse.json({ message: 'Error updating module', error: errorMessage }, { status: 500 }); // Return a 500 response with the error message
  }
}

// DELETE request handler to delete a specific module by its moduleID
export async function DELETE(req: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
  await connect(); 

  const { mapID, areaID, chapterID, moduleID } = params; // Extract parameters from the request

  try {
    // Find the roadmap containing the module with the specified moduleID and remove the module
    const roadmap = await Roadmap.findOneAndUpdate(
      { mapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID },
      { $pull: { "keyAreas.$[area].chapters.$[chapter].modules": { moduleID: moduleID } } },
      { new: true, arrayFilters: [{ "area.areaID": areaID }, { "chapter.chapterID": chapterID }] }
    ) as RoadmapType | null;

    if (!roadmap) {
      return NextResponse.json({ message: 'Module not found' }, { status: 404 }); 
    }

    return NextResponse.json({ message: 'Module deleted successfully' }, { status: 200 }); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    return NextResponse.json({ message: 'Error deleting module', error: errorMessage }, { status: 500 }); 
  }
}

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
