// import { NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import Module from '@/models/Module';
// import connect from '@/utils/db';

// // POST request to create a new module
// export const POST = async (request: Request) => {
//   await connect();

//   const { moduleName, moduleType, moduleObjective, moduleContent, moduleResources, moduleCriteria, moduleScore } = await request.json();

//   try {
//     const newModule = new Module({
//       moduleID: uuidv4(), // Generate UUID for moduleID
//       moduleName,
//       moduleType,
//       moduleObjective,
//       moduleContent,
//       moduleResources,
//       moduleCriteria,
//       moduleScore,
//     });

//     const savedModule = await newModule.save();

//     return new NextResponse(JSON.stringify(savedModule), {
//       status: 201,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ message: 'Error creating module', error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// };

// // GET request to fetch all modules
// export const GET = async () => {
//   await connect();

//   try {
//     const modules = await Module.find({});
//     return new NextResponse(JSON.stringify(modules), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ message: 'Error fetching modules', error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// };

// // PATCH request to update an existing module
// export const PATCH = async (request: Request) => {
//   await connect();

//   const { moduleID, moduleName, moduleType, moduleObjective, moduleContent, moduleResources, moduleCriteria, moduleScore } = await request.json();

//   try {
//     const updatedModule = await Module.findOneAndUpdate(
//       { moduleID },
//       { moduleName, moduleType, moduleObjective, moduleContent, moduleResources, moduleCriteria, moduleScore },
//       { new: true } // Return the updated document
//     );

//     if (!updatedModule) {
//       return new NextResponse(JSON.stringify({ message: 'Module not found' }), {
//         status: 404,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//     }

//     return new NextResponse(JSON.stringify(updatedModule), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ message: 'Error updating module', error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// };


import { NextRequest, NextResponse } from 'next/server';
import Roadmap from '@/models/Roadmap';
import connect from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const { mapID, areaID, chapterID, moduleName, moduleContent } = await req.json();
  await connect();

  try {
    const roadmap = await Roadmap.findOneAndUpdate(
      { mapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID },
      { $push: { "keyAreas.$[area].chapters.$[chapter].modules": { moduleID: uuidv4(), moduleName, moduleContent } } },
      { new: true, arrayFilters: [{ "area.areaID": areaID }, { "chapter.chapterID": chapterID }] }
    );

    if (!roadmap) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    const keyArea = roadmap.keyAreas.find(area => area.areaID === areaID);
    const chapter = keyArea?.chapters.find(chap => chap.chapterID === chapterID);
    const newModule = chapter?.modules.find(module => module.moduleName === moduleName);

    return NextResponse.json(newModule, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating module', error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mapID = searchParams.get('mapID');
  const areaID = searchParams.get('areaID');
  const chapterID = searchParams.get('chapterID');
  await connect();

  try {
    const roadmap = await Roadmap.findOne(
      { mapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID },
      { "keyAreas.$": 1 }
    );

    if (!roadmap || roadmap.keyAreas.length === 0) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    const keyArea = roadmap.keyAreas[0];
    const chapter = keyArea.chapters.find(chap => chap.chapterID === chapterID);

    if (!chapter) {
      return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json(chapter.modules, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching modules', error: error.message }, { status: 500 });
  }
}






