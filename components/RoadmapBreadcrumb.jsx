"use client";
import React, { useEffect, useState } from 'react';
import { ChevronDown, Slash } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import { fetchNames } from '@/utils/fetchNames';

export function RoadmapBreadcrumb() {
  const pathname = usePathname();
  const [names, setNames] = useState({
    mapID: '',
    mapName: '',
    areaID: '',
    areaName: '',
    chapterID: '',
    chapterName: '',
    moduleID: '',
    moduleName: '',
  });

  useEffect(() => {
    const pathSegments = pathname.split('/');
    const mapID = pathSegments[2];
    const areaID = pathSegments[3];
    const chapterID = pathSegments[4];
    const moduleID = pathSegments[5];

    if (mapID) {
      fetchNames(mapID, areaID, chapterID, moduleID).then(data => {
        setNames({
          mapID: data.mapID || '',
          mapName: data.mapName || '',
          areaID: data.areaID || '',
          areaName: data.areaName || '',
          chapterID: data.chapterID || '',
          chapterName: data.chapterName || '',
          moduleID: data.moduleID || '',
          moduleName: data.moduleName || '',
        });
      });
    }
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList className='text-[#FE9900] font-light text-sm'>
        <BreadcrumbItem>
          <BreadcrumbLink href="/roadmap">Home</BreadcrumbLink>
          {names.mapName && <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>}
        </BreadcrumbItem>
        {names.mapName && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/roadmap/${names.mapID}`}>{names.mapName}</BreadcrumbLink>
              {names.areaName && <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>}
            </BreadcrumbItem>
          </>
        )}
        {names.areaName && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/roadmap/${names.mapID}/${names.areaID}`}>{names.areaName}</BreadcrumbLink>
              {names.chapterName && <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>}
            </BreadcrumbItem>
          </>
        )}
        {names.chapterName && (
          <BreadcrumbItem>
            <BreadcrumbLink href={`/roadmap/${names.mapID}/${names.areaID}/${names.chapterID}`}>{names.chapterName}</BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
