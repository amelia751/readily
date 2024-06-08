// import { NextRequest, NextResponse } from 'next/server';
// import Roadmap from '@/models/Roadmap';
// import connect from '@/utils/db';

// // GET request to fetch chapters based on mapID and areaID
// export async function GET(req: NextRequest, { params }: { params: { mapID: string, areaID: string } }) {
//   await connect();

//   const { mapID, areaID } = params;

//   try {
//     const roadmap = await Roadmap.findOne(
//       { mapID, "keyAreas.areaID": areaID },
//       { "keyAreas.$": 1 }
//     );

//     if (!roadmap || roadmap.keyAreas.length === 0) {
//       return NextResponse.json({ message: 'Key area not found' }, { status: 404 });
//     }

//     const keyArea = roadmap.keyAreas[0];
//     return NextResponse.json({
//       useCase: roadmap.useCase,
//       areaName: keyArea.areaName,
//       areaDescription: keyArea.areaDescription,
//       chapters: keyArea.chapters
//     }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: 'Error fetching chapters', error: error.message }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import Roadmap from '@/models/Roadmap';
import connect from '@/utils/db';

// GET request to fetch chapters based on mapID and areaID
export async function GET(req: NextRequest, { params }: { params: { mapID: string, areaID: string } }) {
  await connect();

  const { mapID, areaID } = params;

  try {
    const roadmap = await Roadmap.findOne(
      { mapID, "keyAreas.areaID": areaID },
      { useCase: 1, "keyAreas.$": 1 }
    );

    if (!roadmap || roadmap.keyAreas.length === 0) {
      return NextResponse.json({ message: 'Key area not found' }, { status: 404 });
    }

    const keyArea = roadmap.keyAreas[0];
    return NextResponse.json({
      useCase: roadmap.useCase,
      areaName: keyArea.areaName,
      areaDescription: keyArea.areaDescription,
      chapters: keyArea.chapters
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching chapters', error: error.message }, { status: 500 });
  }
}
