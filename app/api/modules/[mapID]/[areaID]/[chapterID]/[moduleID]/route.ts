import { NextRequest, NextResponse } from 'next/server';
import Roadmap from '@/models/Roadmap';
import connect from '@/utils/db';

export async function GET(req: NextRequest, { params }: { params: { mapID: string, areaID: string, chapterID: string, moduleID: string } }) {
  await connect();

  const { mapID, areaID, chapterID, moduleID } = params;

  try {
    const roadmap = await Roadmap.findOne(
      { mapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID, "keyAreas.chapters.modules.moduleID": moduleID },
      { "keyAreas.$": 1 }
    );

    if (!roadmap) {
      return NextResponse.json({ message: 'Module not found' }, { status: 404 });
    }

    const keyArea = roadmap.keyAreas.find(area => area.areaID === areaID);
    const chapter = keyArea?.chapters.find(chap => chap.chapterID === chapterID);
    const module = chapter?.modules.find(mod => mod.moduleID === moduleID);

    return NextResponse.json(module, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching module', error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { mapID: string, areaID: string, chapterID: string, moduleID: string } }) {
  await connect();

  const { mapID, areaID, chapterID, moduleID } = params;
  const { moduleName, moduleContent } = await req.json();

  try {
    const roadmap = await Roadmap.findOneAndUpdate(
      { mapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID, "keyAreas.chapters.modules.moduleID": moduleID },
      { $set: { "keyAreas.$[area].chapters.$[chapter].modules.$[module].moduleName": moduleName, "keyAreas.$[area].chapters.$[chapter].modules.$[module].moduleContent": moduleContent } },
      { new: true, arrayFilters: [{ "area.areaID": areaID }, { "chapter.chapterID": chapterID }, { "module.moduleID": moduleID }] }
    );

    if (!roadmap) {
      return NextResponse.json({ message: 'Module not found' }, { status: 404 });
    }

    const keyArea = roadmap.keyAreas.find(area => area.areaID === areaID);
    const chapter = keyArea?.chapters.find(chap => chap.chapterID === chapterID);
    const updatedModule = chapter?.modules.find(mod => mod.moduleID === moduleID);

    return NextResponse.json(updatedModule, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating module', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { mapID: string, areaID: string, chapterID: string, moduleID: string } }) {
  await connect();

  const { mapID, areaID, chapterID, moduleID } = params;

  try {
    const roadmap = await Roadmap.findOneAndUpdate(
      { mapID, "keyAreas.areaID": areaID, "keyAreas.chapters.chapterID": chapterID },
      { $pull: { "keyAreas.$[area].chapters.$[chapter].modules": { moduleID: moduleID } } },
      { new: true, arrayFilters: [{ "area.areaID": areaID }, { "chapter.chapterID": chapterID }] }
    );

    if (!roadmap) {
      return NextResponse.json({ message: 'Module not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Module deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting module', error: error.message }, { status: 500 });
  }
}
