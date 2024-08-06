import { NextRequest, NextResponse } from 'next/server'; 
import Therapy from '@/models/Therapy'; 
import connect from '@/utils/db'; 

interface Params {
  mapID: string;
}

// GET request handler to fetch therapy details by mapID
export async function GET(req: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
  const { mapID } = params; 

  try {
    await connect(); 
    const therapy = await Therapy.findOne({ mapID }); // Find the therapy document by its mapID

    if (!therapy) {
      return NextResponse.json({ error: 'Therapy not found' }, { status: 404 }); 
    }

    return NextResponse.json(therapy); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    console.error(errorMessage);
    return NextResponse.json({ error: 'An error occurred while fetching the therapy.', details: errorMessage }, { status: 500 }); 
  }
}

// DELETE request handler to delete therapy details by mapID
export async function DELETE(req: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
  const { mapID } = params; // Extract mapID from the request parameters

  try {
    await connect(); 
    const therapy = await Therapy.findOneAndDelete({ mapID }); // Find the therapy document by its mapID and delete it

    if (!therapy) {
      return NextResponse.json({ error: 'Therapy not found' }, { status: 404 }); 
    }

    return NextResponse.json({ message: 'Therapy deleted successfully' }, { status: 200 }); 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'; 
    console.error(errorMessage);
    return NextResponse.json({ error: 'An error occurred while deleting the therapy.', details: errorMessage }, { status: 500 }); 
  }
}

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
