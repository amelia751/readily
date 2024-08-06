"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import LoadingBar from '@/components/LoadingBar';
import RightSidebar from '@/components/RightSidebar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Module {
  moduleID: string;
  moduleName: string;
  moduleContent: string;
  moduleTime: number;
  moduleProgress: string;
}

interface Chapter {
  chapterID: string;
  chapterName: string;
  modules: Module[];
}

interface KeyArea {
  areaID: string;
  areaName: string;
  areaDescription: string;
  chapters: Chapter[];
}

interface Roadmap {
  mapID: string;
  mapName: string;
  keyAreas: KeyArea[];
}

const TherapyPage = () => {
  const { mapID } = useParams();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchTherapyOrder = async () => {
      try {
        setProgress(20);
        const res = await fetch(`/api/therapy/${mapID}`);
        const data: any = await res.json();
        setProgress(50);

        if (res.ok) {
          setRoadmap(data);
          calculateCompletion(data);
        } else if (data.error === 'Therapy not found') {
          setProgress(60);
          const roadmapRes = await fetch(`/api/roadmaps/${mapID}`);
          const roadmapData: any = await roadmapRes.json();
          setProgress(70);

          if (roadmapRes.ok) {
            const genAIResponse = await fetch('/api/generateTherapyOrder', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ roadmap: roadmapData })
            });
            const genAIData: any = await genAIResponse.json();
            setProgress(90);

            if (genAIResponse.ok) {
              setRoadmap(genAIData);
              calculateCompletion(genAIData);
            } else {
              console.error('Error generating therapy order:', genAIData.message);
            }
          } else {
            console.error('Error fetching roadmap:', roadmapData.message);
          }
        } else {
          console.error('Error fetching therapy:', data.message);
        }
      } catch (error) {
        console.error('Error fetching therapy:', error);
      } finally {
        setLoading(false);
        setProgress(100);
      }
    };

    fetchTherapyOrder();
  }, [mapID]);

  const calculateCompletion = (data: Roadmap) => {
    const totalModules = data.keyAreas.reduce((count: number, area: any) =>
      count + area.chapters.reduce((chapterCount: number, chapter: any) =>
        chapterCount + chapter.modules.filter((module: any) => module.moduleProgress !== 'Skip').length, 0), 0);
    const completedModules = data.keyAreas.reduce((count: number, area: any) =>
      count + area.chapters.reduce((chapterCount: number, chapter: any) =>
        chapterCount + chapter.modules.filter((module: any) => module.moduleProgress === 'Done').length, 0), 0);
    const completion = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
    setCompletionPercentage(completion);
  };

  const handleModuleClick = (module: any) => {
    setSelectedModule(module);
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (moduleID: string, newStatus: string) => {
    try {
      const updatedRoadmap = { ...roadmap };
      updatedRoadmap?.keyAreas?.forEach((area: any) => {
        area.chapters.forEach((chapter: any) => {
          chapter.modules.forEach((module: any) => {
            if (module.moduleID === moduleID) {
              module.moduleProgress = newStatus;
            }
          });
        });
      });
      setRoadmap(updatedRoadmap as Roadmap);
      calculateCompletion(updatedRoadmap as Roadmap);

      await fetch(`/api/therapy/modules/${moduleID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleProgress: newStatus })
      });
    } catch (error) {
      console.error('Error updating module status:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingBar progress={progress} />
      </div>
    );
  }

  const getBackgroundColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-gradient-to-r from-[#FF7A01] to-[#ED068A]';
      case 'Skip':
        return 'bg-gradient-to-r from-orange-300 to-orange-200';
      case 'In Progress':
        return 'bg-gradient-to-r from-[#FEB800] to-[#FFF38A]';
      default:
        return 'bg-[#F9AB15]';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-gradient-to-r from-[#FF7A01] to-[#ED068A] text-white';
      case 'Skip':
        return 'bg-gradient-to-r from-orange-300 to-orange-200 text-gray-500';
      case 'In Progress':
        return 'bg-gradient-to-r from-[#FEB800] to-[#FFF38A] text-black';
      default:
        return 'bg-[#F9AB15] text-black';
    }
  };

  return (
    <div className="relative flex">
      <ScrollArea className="h-screen p-4 rounded-lg flex-1 ">
        <div className="text-center text-[#FEB800] min-h-screen p-6 bg-white font-base">
          <h1 className="text-3xl mb-4 uppercase">{roadmap?.mapName}</h1>
          <div className="mb-4 text-center flex justify-center items-center gap-4">
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div className="bg-gradient-to-r from-[#FF7A01] to-[#ED068A] transition-all duration-300 h-full rounded-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>
            <p className="text-xl">{completionPercentage.toFixed(0)}%</p>
          </div>
          <div className="space-y-8">
            {roadmap?.keyAreas.filter((area: any) =>
              area.chapters.some((chapter: any) => chapter.modules.length > 0)
            ).map((area: any) => (
              <div key={area.areaID} className="mb-8">
                {area.chapters.filter((chapter: any) => chapter.modules.length > 0).map((chapter: any) => (
                  <div key={chapter.chapterID} className="mb-4">
                    <div className="bg-[#FE9900] text-white p-4 rounded-xl">
                      <h3 className="text-xl ">{chapter.chapterName}</h3>
                    </div>
                    <div className="flex flex-col items-center space-y-4 bg-white text-[#ED8100] p-4 rounded-b-lg">
                      {chapter.modules.map((module: any) => (
                        <div key={module.moduleID}>
                          <span className="text-lg font-medium">{module.moduleName}</span>
                          <div
                            className={`border-b-8 border-[#ED8100] hover:border-0 relative flex flex-col items-center justify-center w-16 h-16 rounded-full cursor-pointer ${getBackgroundColor(module.moduleProgress)}`}
                            onClick={() => handleModuleClick(module)}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {selectedModule && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="hidden">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent className="lg:max-w-screen-sm h-screen">
                <DialogHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <DialogTitle className='text-xl font-normal text-[#D67A00]'>{selectedModule.moduleName}</DialogTitle>
                      <h2 className='flex gap-2 items-center'>Status: <div className={`text-base font-normal px-2 py-1 rounded ${getStatusColor(selectedModule.moduleProgress)}`}>{selectedModule.moduleProgress || 'Pending'}</div></h2>
                    </div>
                    <Select
                      value={selectedModule.moduleProgress || 'Pending'}
                      onValueChange={(value: string) => handleStatusChange(selectedModule.moduleID, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Update Status</SelectLabel>
                          <SelectItem value="Done">Done</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Skip">Skip</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </DialogHeader>
                <ScrollArea className="h-[450px] md:h-full p-4 rounded-lg">
                  <ReactMarkdown className="whitespace-normal prose prose-sm sm:prose" remarkPlugins={[remarkGfm]}>
                    {selectedModule.moduleContent}
                  </ReactMarkdown>
                  <p className="text-gray-600 text-sm mt-4">Estimated Time: {selectedModule.moduleTime} minutes</p>
                </ScrollArea>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </ScrollArea>
      <Button 
        onClick={() => setIsSidebarVisible(!isSidebarVisible)} 
        className="h-24 gap-2 rounded-3xl flex fixed bottom-6 bg-gradient-to-r from-[#FF7A01] to-[#FE9900] hover:from-black hover:to-black hover:text-[#FE9900] right-8">
        <img src='/happy.png' className='h-20' alt='Happy'></img>
        <h1 className='text-lg'>Chat</h1>
      </Button>
      <RightSidebar mapID={mapID as string} isVisible={isSidebarVisible} toggleVisibility={() => setIsSidebarVisible(!isSidebarVisible)} chatHistory={chatHistory} setChatHistory={setChatHistory} />
    </div>
  );
};

export default TherapyPage;
