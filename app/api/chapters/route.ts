// import { NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import Chapter from '@/models/Chapter';
// import connect from '@/utils/db';

// // POST request to create a new chapter
// export const POST = async (request) => {
//   await connect();

//   const { chapterName, objective, score } = await request.json();

//   try {
//     const newChapter = new Chapter({
//       chapterID: uuidv4(), // Generate UUID for chapterID
//       chapterName,
//       objective,
//       score,
//       modules: [],
//     });

//     const savedChapter = await newChapter.save();

//     return new NextResponse(JSON.stringify(savedChapter), {
//       status: 201,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ message: 'Error creating chapter', error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// };

// // GET request to fetch all chapters
// export const GET = async () => {
//   await connect();

//   try {
//     const chapters = await Chapter.find({});
//     return new NextResponse(JSON.stringify(chapters), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ message: 'Error fetching chapters', error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// };

// // PATCH request to update an existing chapter or add a module
// export const PATCH = async (request) => {
//   await connect();

//   const { chapterID, chapterName, objective, score, module } = await request.json();

//   try {
//     const updateData = { chapterName, objective, score };
//     if (module) {
//       updateData.$push = { modules: module };
//     }

//     const updatedChapter = await Chapter.findOneAndUpdate(
//       { chapterID },
//       updateData,
//       { new: true } // Return the updated document
//     );

//     if (!updatedChapter) {
//       return new NextResponse(JSON.stringify({ message: 'Chapter not found' }), {
//         status: 404,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//     }

//     return new NextResponse(JSON.stringify(updatedChapter), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ message: 'Error updating chapter', error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// };





// import { NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import KeyArea from '@/models/KeyArea';
// import connect from '@/utils/db';

// // POST request to create a new chapter in a key area
// export const POST = async (request) => {
//   await connect();

//   const { areaID, chapterName, objective, score } = await request.json();

//   try {
//     const newChapter = {
//       chapterID: uuidv4(), // Generate UUID for chapterID
//       areaID,
//       chapterName,
//       objective,
//       score,
//       modules: [],
//     };

//     const updatedKeyArea = await KeyArea.findOneAndUpdate(
//       { areaID },
//       { $push: { chapters: newChapter } },
//       { new: true } // Return the updated document
//     );

//     if (!updatedKeyArea) {
//       return new NextResponse(JSON.stringify({ message: 'Key area not found' }), {
//         status: 404,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//     }

//     return new NextResponse(JSON.stringify(updatedKeyArea), {
//       status: 201,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ message: 'Error creating chapter', error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// };

// // GET request to fetch all chapters for a specific key area
// export const GET = async (request) => {
//   await connect();

//   const { areaID } = await request.json();

//   try {
//     const keyArea = await KeyArea.findOne({ areaID });
//     if (!keyArea) {
//       return new NextResponse(JSON.stringify({ message: 'Key area not found' }), {
//         status: 404,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//     }
//     return new NextResponse(JSON.stringify(keyArea.chapters), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ message: 'Error fetching chapters', error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// };

// // PATCH request to update an existing chapter
// export const PATCH = async (request) => {
//   await connect();

//   const { chapterID, areaID, chapterName, objective, score } = await request.json();

//   try {
//     const keyArea = await KeyArea.findOneAndUpdate(
//       { areaID, "chapters.chapterID": chapterID },
//       {
//         $set: {
//           "chapters.$.chapterName": chapterName,
//           "chapters.$.objective": objective,
//           "chapters.$.score": score,
//         }
//       },
//       { new: true }
//     );

//     if (!keyArea) {
//       return new NextResponse(JSON.stringify({ message: 'Chapter not found' }), {
//         status: 404,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//     }

//     return new NextResponse(JSON.stringify(keyArea), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ message: 'Error updating chapter', error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
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

  const { roadmapID, areaID, chapterName, objective, score } = await request.json();

  try {
    const newChapter = {
      chapterID: uuidv4(), // Generate UUID for chapterID
      roadmapID,
      areaID,
      chapterName,
      objective,
      score,
      modules: [],
    };

    const updatedRoadmap = await Roadmap.findOneAndUpdate(
      { mapID: roadmapID, "keyAreas.areaID": areaID },
      { $push: { "keyAreas.$.chapters": newChapter } },
      { new: true } // Return the updated document
    );

    if (!updatedRoadmap) {
      return new NextResponse(JSON.stringify({ message: 'Key area not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new NextResponse(JSON.stringify(updatedRoadmap), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Error creating chapter', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

// GET request to fetch all chapters for a specific key area
export const GET = async (request) => {
  await connect();

  const { roadmapID, areaID } = await request.json();

  try {
    const roadmap = await Roadmap.findOne({ mapID: roadmapID, "keyAreas.areaID": areaID });
    if (!roadmap) {
      return new NextResponse(JSON.stringify({ message: 'Key area not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    const keyArea = roadmap.keyAreas.find(ka => ka.areaID === areaID);
    return new NextResponse(JSON.stringify(keyArea.chapters), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Error fetching chapters', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

// PATCH request to update an existing chapter
export const PATCH = async (request) => {
  await connect();

  const { chapterID, areaID, roadmapID, chapterName, objective, score } = await request.json();

  try {
    const roadmap = await Roadmap.findOneAndUpdate(
      { mapID: roadmapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID },
      {
        $set: {
          "keyAreas.$.chapters.$[chap].chapterName": chapterName,
          "keyAreas.$.chapters.$[chap].objective": objective,
          "keyAreas.$.chapters.$[chap].score": score,
        }
      },
      {
        arrayFilters: [{ "chap.chapterID": chapterID }],
        new: true
      }
    );

    if (!roadmap) {
      return new NextResponse(JSON.stringify({ message: 'Chapter not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new NextResponse(JSON.stringify(roadmap), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Error updating chapter', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
