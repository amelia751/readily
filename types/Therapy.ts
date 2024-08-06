export interface Module {
    moduleID: string;
    chapterID: string;
    moduleName?: string;
    moduleContent?: string;
    moduleTime?: number;
    moduleScore?: number;
    moduleProgress?: string;
  }
  
  export interface Chapter {
    areaID: string;
    chapterID: string;
    chapterName?: string;
    chapterObjective?: string;
    chapterScore?: number;
    modules: Module[];
  }
  
  export interface KeyArea {
    mapID: string;
    areaID: string;
    areaName?: string;
    areaDescription?: string;
    chapters: Chapter[];
  }
  
  export interface Therapy {
    mapID: string;
    mapName?: string;
    useCase?: string;
    keyAreas: KeyArea[];
    published?: boolean;
    creator?: string;
  }
  