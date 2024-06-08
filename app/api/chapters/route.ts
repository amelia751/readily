// import { NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import Roadmap from '@/models/Roadmap';
// import connect from '@/utils/db';

// // POST request to create a new key area in a roadmap
// export const POST = async (request) => {
//   await connect();

//   const { mapID, areaName, areaDescription } = await request.json();

//   try {
//     const newKeyArea = {
//       areaID: uuidv4(), // Generate UUID for areaID
//       mapID,
//       areaName,
//       areaDescription,
//       chapters: [],
//     };

//     const updatedRoadmap = await Roadmap.findOneAndUpdate(
//       { mapID: mapID },
//       { $push: { keyAreas: newKeyArea } },
//       { new: true } // Return the updated document
//     );

//     if (!updatedRoadmap) {
//       return NextResponse.json({ message: 'Roadmap not found' }, {
//         status: 404,
//       });
//     }

//     return NextResponse.json(newKeyArea, {
//       status: 201,
//     });
//   } catch (error) {
//     return NextResponse.json({ message: 'Error creating key area', error: error.message }, {
//       status: 500,
//     });
//   }
// };

// // GET request to fetch all key areas for a specific roadmap
// export const GET = async (request) => {
//   await connect();

//   const { mapID } = await request.json();

//   try {
//     const roadmap = await Roadmap.findOne({ mapID: mapID });
//     if (!roadmap) {
//       return NextResponse.json({ message: 'Roadmap not found' }, {
//         status: 404,
//       });
//     }
//     return NextResponse.json(roadmap.keyAreas, {
//       status: 200,
//     });
//   } catch (error) {
//     return NextResponse.json({ message: 'Error fetching key areas', error: error.message }, {
//       status: 500,
//     });
//   }
// };

// // PATCH request to update an existing key area
// export const PATCH = async (request) => {
//   await connect();

//   const { areaID, mapID, areaName, areaDescription } = await request.json();

//   try {
//     const roadmap = await Roadmap.findOneAndUpdate(
//       { mapID: mapID, "keyAreas.areaID": areaID },
//       {
//         $set: {
//           "keyAreas.$.areaName": areaName,
//           "keyAreas.$.areaDescription": areaDescription,
//         }
//       },
//       { new: true }
//     );

//     if (!roadmap) {
//       return NextResponse.json({ message: 'Key area not found' }, {
//         status: 404,
//       });
//     }

//     return NextResponse.json(roadmap, {
//       status: 200,
//     });
//   } catch (error) {
//     return NextResponse.json({ message: 'Error updating key area', error: error.message }, {
//       status: 500,
//     });
//   }
// };

// // DELETE request to delete a key area
// export const DELETE = async (request) => {
//   await connect();

//   const { areaID } = await request.json();

//   try {
//     const roadmap = await Roadmap.findOneAndUpdate(
//       { "keyAreas.areaID": areaID },
//       { $pull: { keyAreas: { areaID: areaID } } },
//       { new: true }
//     );

//     if (!roadmap) {
//       return NextResponse.json({ message: 'Key area not found' }, {
//         status: 404,
//       });
//     }

//     return NextResponse.json({ message: 'Key area deleted successfully' }, {
//       status: 200,
//     });
//   } catch (error) {
//     return NextResponse.json({ message: 'Error deleting key area', error: error.message }, {
//       status: 500,
//     });
//   }
// };

import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import Roadmap from '@/models/Roadmap';
import connect from '@/utils/db';

// POST request to create a new chapter in a key area
export const POST = async (request) => {
  await connect();

  const { mapID, areaID, chapterName, chapterObjective } = await request.json();

  try {
    const newChapter = {
      chapterID: uuidv4(), // Generate UUID for chapterID
      chapterName,
      chapterObjective,
      chapterScore: null, // Automatically set to null
      modules: [], // Automatically set to an empty array
    };

    const updatedRoadmap = await Roadmap.findOneAndUpdate(
      { mapID: mapID, "keyAreas.areaID": areaID },
      { $push: { "keyAreas.$.chapters": newChapter } },
      { new: true } // Return the updated document
    );

    if (!updatedRoadmap) {
      return NextResponse.json({ message: 'Key area not found' }, {
        status: 404,
      });
    }

    return NextResponse.json(newChapter, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating chapter', error: error.message }, {
      status: 500,
    });
  }
};

// GET request to fetch all chapters for a specific key area
export const GET = async (request) => {
  await connect();

  const { mapID, areaID } = await request.json();

  try {
    const roadmap = await Roadmap.findOne({ mapID: mapID, "keyAreas.areaID": areaID }, { "keyAreas.$": 1 });
    if (!roadmap) {
      return NextResponse.json({ message: 'Key area not found' }, {
        status: 404,
      });
    }
    const keyArea = roadmap.keyAreas[0];
    return NextResponse.json(keyArea.chapters, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching chapters', error: error.message }, {
      status: 500 },
    );
  }
};
