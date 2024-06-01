import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import Roadmap from '@/models/Roadmap';
import connect from '@/utils/db';

// POST request to create a new roadmap
export const POST = async (request) => {
  await connect();

  const { useCase, published } = await request.json();

  try {
    const newRoadmap = new Roadmap({
      mapID: uuidv4(), // Generate UUID for mapID
      useCase,
      keyAreas: [],
      published,
    });

    const savedRoadmap = await newRoadmap.save();

    return NextResponse.json(savedRoadmap, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating roadmap', error: error.message }, {
      status: 500,
    });
  }
};

// GET request to fetch all roadmaps
export const GET = async () => {
  await connect();

  try {
    const roadmaps = await Roadmap.find({});
    return NextResponse.json(roadmaps, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching roadmaps', error: error.message }, {
      status: 500,
    });
  }
};

// PATCH request to update an existing roadmap
export const PATCH = async (request) => {
  await connect();

  const { mapID, useCase, keyAreas, published } = await request.json();

  try {
    const updatedRoadmap = await Roadmap.findOneAndUpdate(
      { mapID },
      { useCase, keyAreas, published },
      { new: true } // Return the updated document
    );

    if (!updatedRoadmap) {
      return NextResponse.json({ message: 'Roadmap not found' }, {
        status: 404,
      });
    }

    return NextResponse.json(updatedRoadmap, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating roadmap', error: error.message }, {
      status: 500,
    });
  }
};

// import { NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import Roadmap from '@/models/Roadmap';
// import connect from '@/utils/db';

// // POST request to create a new roadmap
// export const POST = async (request) => {
//   await connect();

//   const { useCase, published, creator } = await request.json();

//   try {
//     const newRoadmap = new Roadmap({
//       mapID: uuidv4(), // Generate UUID for mapID
//       useCase,
//       keyAreas: [],
//       published,
//       creator, // Include creator email
//     });

//     const savedRoadmap = await newRoadmap.save();

//     return NextResponse.json(savedRoadmap, {
//       status: 201,
//     });
//   } catch (error) {
//     return NextResponse.json({ message: 'Error creating roadmap', error: error.message }, {
//       status: 500,
//     });
//   }
// };

// // GET request to fetch all roadmaps
// export const GET = async () => {
//   await connect();

//   try {
//     const roadmaps = await Roadmap.find({});
//     return NextResponse.json(roadmaps, {
//       status: 200,
//     });
//   } catch (error) {
//     return NextResponse.json({ message: 'Error fetching roadmaps', error: error.message }, {
//       status: 500,
//     });
//   }
// };

// // PATCH request to update an existing roadmap
// export const PATCH = async (request) => {
//   await connect();

//   const { mapID, useCase, keyAreas, published } = await request.json();

//   try {
//     const updatedRoadmap = await Roadmap.findOneAndUpdate(
//       { mapID },
//       { useCase, keyAreas, published },
//       { new: true } // Return the updated document
//     );

//     if (!updatedRoadmap) {
//       return NextResponse.json({ message: 'Roadmap not found' }, {
//         status: 404,
//       });
//     }

//     return NextResponse.json(updatedRoadmap, {
//       status: 200,
//     });
//   } catch (error) {
//     return NextResponse.json({ message: 'Error updating roadmap', error: error.message }, {
//       status: 500,
//     });
//   }
// };
