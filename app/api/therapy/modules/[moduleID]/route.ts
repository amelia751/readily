import { NextRequest, NextResponse } from 'next/server'; 
import Therapy from '@/models/Therapy'; 
import connect from '@/utils/db'; 

interface Params {
  moduleID: string;
}

interface RequestBody {
  moduleProgress: string;
}

// PATCH request handler to update the progress of a module by its moduleID
export async function PATCH(req: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
  const { moduleID } = params; // Extract moduleID from the request parameters

  try {
    await connect(); 
    const { moduleProgress }: RequestBody = await req.json(); // Parse the request body to get moduleProgress

    // Find the therapy containing the module and update the module progress
    const therapy = await Therapy.findOneAndUpdate(
      { 'keyAreas.chapters.modules.moduleID': moduleID },
      { $set: { 'keyAreas.$[].chapters.$[].modules.$[mod].moduleProgress': moduleProgress } },
      { 
        arrayFilters: [{ 'mod.moduleID': moduleID }], // Apply filter to match the module by moduleID
        new: true 
      }
    );

    if (!therapy) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 }); 
    }

    return NextResponse.json({ message: 'Module progress updated successfully' }, { status: 200 }); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    console.error(errorMessage);
    return NextResponse.json({ error: 'An error occurred while updating the module progress.', details: errorMessage }, { status: 500 }); 
  }
}

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
