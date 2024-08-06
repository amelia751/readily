export async function fetchNames(mapID, areaID, chapterID, moduleID) {
    try {
      const mapRes = await fetch(`/api/roadmaps/${mapID}`);
      const mapData = await mapRes.json();
    
      const areaRes = areaID ? await fetch(`/api/keyareas/${areaID}`) : null;
      const areaData = areaRes ? await areaRes.json() : { areaName: '' };
    
      const chapterRes = chapterID ? await fetch(`/api/chapters/${mapID}/${areaID}/${chapterID}`) : null;
      const chapterData = chapterRes ? await chapterRes.json() : { chapterName: '' };
    
    //   const moduleRes = moduleID ? await fetch(`/api/modules/${mapID}/${areaID}/${chapterID}/${moduleID}`) : null;
    //   const moduleData = moduleRes ? await moduleRes.json() : { moduleName: '' };
    
      return {
        mapID,
        mapName: mapData.mapName,
        areaID,
        areaName: areaData.areaName,
        chapterID,
        chapterName: chapterData.chapterName,
        moduleID,
        // moduleName: moduleData.moduleName,
      };
    } catch (error) {
      console.error('Error fetching names:', error);
      return {
        mapID,
        mapName: '',
        areaID,
        areaName: '',
        chapterID,
        chapterName: '',
        moduleID,
        // moduleName: '',
      };
    }
  }
  