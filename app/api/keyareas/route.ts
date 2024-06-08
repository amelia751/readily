// import { NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import KeyArea from '@/models/KeyArea';
// import connect from '@/utils/db';

// // POST request to create a new key area
// export const POST = async (request) => {
//   await connect();

//   const { areaName } = await request.json();

//   try {
//     const newKeyArea = new KeyArea({
//       areaID: uuidv4(), // Generate UUID for areaID
//       areaName,
//       chapters: [],
//     });

//     const savedKeyArea = await newKeyArea.save();

//     return new NextResponse(JSON.stringify(savedKeyArea), {
//       status: 201,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ message: 'Error creating key area', error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// };

// // GET request to fetch all key areas
// export const GET = async () => {
//   await connect();

//   try {
//     const keyAreas = await KeyArea.find({});
//     return new NextResponse(JSON.stringify(keyAreas), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ message: 'Error fetching key areas', error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// };

// // PATCH request to update an existing key area
// export const PATCH = async (request) => {
//   await connect();

//   const { areaID, areaName } = await request.json();

//   try {
//     const updatedKeyArea = await KeyArea.findOneAndUpdate(
//       { areaID },
//       { areaName },
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
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ message: 'Error updating key area', error: error.message }), {
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

// // POST request to create a new key area in a roadmap
// export const POST = async (request) => {
//   await connect();

//   const { mapID, areaName } = await request.json();

//   try {
//     const newKeyArea = {
//       areaID: uuidv4(), // Generate UUID for areaID
//       mapID,
//       areaName,
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

//     return NextResponse.json(updatedRoadmap, {
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

//   const { areaID, mapID, areaName } = await request.json();

//   try {
//     const roadmap = await Roadmap.findOneAndUpdate(
//       { mapID: mapID, "keyAreas.areaID": areaID },
//       {
//         $set: {
//           "keyAreas.$.areaName": areaName,
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


import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import Roadmap from '@/models/Roadmap';
import connect from '@/utils/db';

// POST request to create a new key area in a roadmap
export const POST = async (request) => {
  await connect();

  const { mapID, areaName, areaDescription } = await request.json();

  try {
    const newKeyArea = {
      areaID: uuidv4(), // Generate UUID for areaID
      mapID,
      areaName,
      areaDescription,
      chapters: [],
    };

    const updatedRoadmap = await Roadmap.findOneAndUpdate(
      { mapID: mapID },
      { $push: { keyAreas: newKeyArea } },
      { new: true } // Return the updated document
    );

    if (!updatedRoadmap) {
      return NextResponse.json({ message: 'Roadmap not found' }, {
        status: 404,
      });
    }

    return NextResponse.json(newKeyArea, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating key area', error: error.message }, {
      status: 500,
    });
  }
};

// GET request to fetch all key areas for a specific roadmap
export const GET = async (request) => {
  await connect();

  const { mapID } = await request.json();

  try {
    const roadmap = await Roadmap.findOne({ mapID: mapID });
    if (!roadmap) {
      return NextResponse.json({ message: 'Roadmap not found' }, {
        status: 404,
      });
    }
    return NextResponse.json(roadmap.keyAreas, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching key areas', error: error.message }, {
      status: 500,
    });
  }
};

