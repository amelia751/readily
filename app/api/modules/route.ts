import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import Module from '@/models/Module';
import connect from '@/utils/db';

// POST request to create a new module
export const POST = async (request: Request) => {
  await connect();

  const { moduleName, moduleType, moduleObjective, moduleContent, moduleResources, moduleCriteria, moduleScore } = await request.json();

  try {
    const newModule = new Module({
      moduleID: uuidv4(), // Generate UUID for moduleID
      moduleName,
      moduleType,
      moduleObjective,
      moduleContent,
      moduleResources,
      moduleCriteria,
      moduleScore,
    });

    const savedModule = await newModule.save();

    return new NextResponse(JSON.stringify(savedModule), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Error creating module', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

// GET request to fetch all modules
export const GET = async () => {
  await connect();

  try {
    const modules = await Module.find({});
    return new NextResponse(JSON.stringify(modules), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Error fetching modules', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

// PATCH request to update an existing module
export const PATCH = async (request: Request) => {
  await connect();

  const { moduleID, moduleName, moduleType, moduleObjective, moduleContent, moduleResources, moduleCriteria, moduleScore } = await request.json();

  try {
    const updatedModule = await Module.findOneAndUpdate(
      { moduleID },
      { moduleName, moduleType, moduleObjective, moduleContent, moduleResources, moduleCriteria, moduleScore },
      { new: true } // Return the updated document
    );

    if (!updatedModule) {
      return new NextResponse(JSON.stringify({ message: 'Module not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new NextResponse(JSON.stringify(updatedModule), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Error updating module', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};






// import { NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import Chapter from '@/models/Chapter';
// import connect from '@/utils/db';

// // POST request to create a new module
// export const POST = async (request) => {
//   await connect();

//   const { chapterID, moduleName, moduleType, moduleObjective, moduleContent, moduleResources, moduleCriteria, moduleScore } = await request.json();

//   try {
//     const newModule = {
//       moduleID: uuidv4(), // Generate UUID for moduleID
//       chapterID,
//       moduleName,
//       moduleType,
//       moduleObjective,
//       moduleContent,
//       moduleResources,
//       moduleCriteria,
//       moduleScore,
//     };

//     const updatedChapter = await Chapter.findOneAndUpdate(
//       { chapterID },
//       { $push: { modules: newModule } },
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

// // PATCH request to update an existing module
// export const PATCH = async (request) => {
//   await connect();

//   const { moduleID, chapterID, moduleName, moduleType, moduleObjective, moduleContent, moduleResources, moduleCriteria, moduleScore } = await request.json();

//   try {
//     const chapter = await Chapter.findOneAndUpdate(
//       { chapterID, "modules.moduleID": moduleID },
//       { 
//         $set: {
//           "modules.$.moduleName": moduleName,
//           "modules.$.moduleType": moduleType,
//           "modules.$.moduleObjective": moduleObjective,
//           "modules.$.moduleContent": moduleContent,
//           "modules.$.moduleResources": moduleResources,
//           "modules.$.moduleCriteria": moduleCriteria,
//           "modules.$.moduleScore": moduleScore,
//         }
//       },
//       { new: true }
//     );

//     if (!chapter) {
//       return new NextResponse(JSON.stringify({ message: 'Module not found' }), {
//         status: 404,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//     }

//     return new NextResponse(JSON.stringify(chapter), {
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





// import { NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import KeyArea from '@/models/KeyArea';
// import connect from '@/utils/db';

// // POST request to create a new module in a chapter
// export const POST = async (request) => {
//   await connect();

//   const { areaID, chapterID, moduleName, moduleType, moduleObjective, moduleContent, moduleResources, moduleCriteria, moduleScore } = await request.json();

//   try {
//     const newModule = {
//       moduleID: uuidv4(), // Generate UUID for moduleID
//       chapterID,
//       moduleName,
//       moduleType,
//       moduleObjective,
//       moduleContent,
//       moduleResources,
//       moduleCriteria,
//       moduleScore,
//     };

//     const keyArea = await KeyArea.findOneAndUpdate(
//       { areaID, "chapters.chapterID": chapterID },
//       { $push: { "chapters.$.modules": newModule } },
//       { new: true } // Return the updated document
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

// // GET request to fetch all modules for a specific chapter
// export const GET = async (request) => {
//   await connect();

//   const { areaID, chapterID } = await request.json();

//   try {
//     const keyArea = await KeyArea.findOne({ areaID, "chapters.chapterID": chapterID });
//     if (!keyArea) {
//       return new NextResponse(JSON.stringify({ message: 'Chapter not found' }), {
//         status: 404,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//     }
//     const chapter = keyArea.chapters.find(chap => chap.chapterID === chapterID);
//     return new NextResponse(JSON.stringify(chapter.modules), {
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
// export const PATCH = async (request) => {
//   await connect();

//   const { moduleID, chapterID, areaID, moduleName, moduleType, moduleObjective, moduleContent, moduleResources, moduleCriteria, moduleScore } = await request.json();

//   try {
//     const keyArea = await KeyArea.findOneAndUpdate(
//       { areaID, "chapters.chapterID": chapterID, "chapters.modules.moduleID": moduleID },
//       {
//         $set: {
//           "chapters.$.modules.$[mod].moduleName": moduleName,
//           "chapters.$.modules.$[mod].moduleType": moduleType,
//           "chapters.$.modules.$[mod].moduleObjective": moduleObjective,
//           "chapters.$.modules.$[mod].moduleContent": moduleContent,
//           "chapters.$.modules.$[mod].moduleResources": moduleResources,
//           "chapters.$.modules.$[mod].moduleCriteria": moduleCriteria,
//           "chapters.$.modules.$[mod].moduleScore": moduleScore,
//         }
//       },
//       {
//         arrayFilters: [{ "mod.moduleID": moduleID }],
//         new: true
//       }
//     );

//     if (!keyArea) {
//       return new NextResponse(JSON.stringify({ message: 'Module not found' }), {
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
//     return new NextResponse(JSON.stringify({ message: 'Error updating module', error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// };




// import { NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import Roadmap from '@/models/Roadmap';
// import connect from '@/utils/db';

// // POST request to create a new module in a chapter
// export const POST = async (request) => {
//   await connect();

//   const { roadmapID, areaID, chapterID, moduleName, moduleType, moduleObjective, moduleContent, moduleResources, moduleCriteria, moduleScore } = await request.json();

//   try {
//     const newModule = {
//       moduleID: uuidv4(), // Generate UUID for moduleID
//       chapterID,
//       moduleName,
//       moduleType,
//       moduleObjective,
//       moduleContent,
//       moduleResources,
//       moduleCriteria,
//       moduleScore,
//     };

//     const roadmap = await Roadmap.findOneAndUpdate(
//       { mapID: roadmapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID },
//       { $push: { "keyAreas.$.chapters.$[chap].modules": newModule } },
//       {
//         arrayFilters: [{ "chap.chapterID": chapterID }],
//         new: true // Return the updated document
//       }
//     );

//     if (!roadmap) {
//       return new NextResponse(JSON.stringify({ message: 'Chapter not found' }), {
//         status: 404,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//     }

//     return new NextResponse(JSON.stringify(roadmap), {
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

// // GET request to fetch all modules for a specific chapter
// export const GET = async (request) => {
//   await connect();

//   const { roadmapID, areaID, chapterID } = await request.json();

//   try {
//     const roadmap = await Roadmap.findOne({ mapID: roadmapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID });
//     if (!roadmap) {
//       return new NextResponse(JSON.stringify({ message: 'Chapter not found' }), {
//         status: 404,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//     }
//     const keyArea = roadmap.keyAreas.find(ka => ka.areaID === areaID);
//     const chapter = keyArea.chapters.find(chap => chap.chapterID === chapterID);
//     return new NextResponse(JSON.stringify(chapter.modules), {
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
// export const PATCH = async (request) => {
//   await connect();

//   const { moduleID, chapterID, areaID, roadmapID, moduleName, moduleType, moduleObjective, moduleContent, moduleResources, moduleCriteria, moduleScore } = await request.json();

//   try {
//     const roadmap = await Roadmap.findOneAndUpdate(
//       { mapID: roadmapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID, "keyAreas.chapters.modules.moduleID": moduleID },
//       {
//         $set: {
//           "keyAreas.$.chapters.$[chap].modules.$[mod].moduleName": moduleName,
//           "keyAreas.$.chapters.$[chap].modules.$[mod].moduleType": moduleType,
//           "keyAreas.$.chapters.$[chap].modules.$[mod].moduleObjective": moduleObjective,
//           "keyAreas.$.chapters.$[chap].modules.$[mod].moduleContent": moduleContent,
//           "keyAreas.$.chapters.$[chap].modules.$[mod].moduleResources": moduleResources,
//           "keyAreas.$.chapters.$[chap].modules.$[mod].moduleCriteria": moduleCriteria,
//           "keyAreas.$.chapters.$[chap].modules.$[mod].moduleScore": moduleScore,
//         }
//       },
//       {
//         arrayFilters: [{ "chap.chapterID": chapterID }, { "mod.moduleID": moduleID }],
//         new: true
//       }
//     );

//     if (!roadmap) {
//       return new NextResponse(JSON.stringify({ message: 'Module not found' }), {
//         status: 404,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//     }

//     return new NextResponse(JSON.stringify(roadmap), {
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
