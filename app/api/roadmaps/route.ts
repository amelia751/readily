// import { NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import Roadmap from '@/models/Roadmap';
// import connect from '@/utils/db';

// // POST request to create a new roadmap
// export const POST = async (request) => {
//   await connect();

//   const { mapName, useCase, published } = await request.json();

//   try {
//     const newRoadmap = new Roadmap({
//       mapID: uuidv4(), // Generate UUID for mapID
//       mapName,
//       useCase,
//       keyAreas: [],
//       published,
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


// import { NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import Roadmap from '@/models/Roadmap';
// import connect from '@/utils/db';

// export const POST = async (request) => {
//   await connect();

//   const { mapName, useCase, published, creator } = await request.json();

//   try {
//     const newRoadmap = new Roadmap({
//       mapID: uuidv4(), 
//       mapName,
//       useCase,
//       keyAreas: [],
//       published,
//       creator, 
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

import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import Roadmap from '@/models/Roadmap';
import connect from '@/utils/db';

export const POST = async (request) => {
  await connect();

  const { mapName, useCase, published, creator } = await request.json();

  console.log('Request received with data:', { mapName, useCase, published, creator });

  try {
    const newRoadmap = new Roadmap({
      mapID: uuidv4(), 
      mapName,
      useCase,
      keyAreas: [],
      published,
      creator, 
    });

    console.log('New Roadmap object created:', newRoadmap);

    const savedRoadmap = await newRoadmap.save();

    console.log('Roadmap successfully saved:', savedRoadmap);

    return NextResponse.json(savedRoadmap, {
      status: 201,
    });
  } catch (error) {
    console.error('Error creating roadmap:', error.message);
    return NextResponse.json({ message: 'Error creating roadmap', error: error.message }, {
      status: 500,
    });
  }
};

export const GET = async () => {
  await connect();

  try {
    const roadmaps = await Roadmap.find({});
    return NextResponse.json(roadmaps, {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching roadmaps:', error.message);
    return NextResponse.json({ message: 'Error fetching roadmaps', error: error.message }, {
      status: 500,
    });
  }
};
