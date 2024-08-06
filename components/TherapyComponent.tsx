"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaArrowRight, FaTrash } from 'react-icons/fa';
import { BsPinAngleFill } from "react-icons/bs";
import { Doughnut } from 'react-chartjs-2';
import LoadingBar from './LoadingBar';
import { ScrollArea } from './ui/scroll-area';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Roadmap {
  mapID: string;
  mapName: string;
  published: boolean;
  completionPercentage: number;
  therapyExists: boolean;
}

const TherapyComponent: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      const fetchRoadmaps = async () => {
        try {
          setProgress(20); 
          const res = await fetch(`/api/roadmaps?creator=${session.user.email}`);
          setProgress(50); 
          const data = await res.json();
          if (res.ok) {
            const roadmapsWithCompletion = await Promise.all(data.map(async (roadmap: Roadmap) => {
              const therapyRes = await fetch(`/api/therapy/${roadmap.mapID}`);
              const therapyData = await therapyRes.json();
              if (therapyRes.ok) {
                const totalModules = therapyData.keyAreas.reduce((count: number, area: any) => 
                  count + area.chapters.reduce((chapterCount: number, chapter: any) => 
                    chapterCount + chapter.modules.filter((module: any) => module.moduleProgress !== 'Skip').length, 0), 0);
                const completedModules = therapyData.keyAreas.reduce((count: number, area: any) => 
                  count + area.chapters.reduce((chapterCount: number, chapter: any) => 
                    chapterCount + chapter.modules.filter((module: any) => module.moduleProgress === 'Done').length, 0), 0);
                const completionPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
                return { ...roadmap, completionPercentage: Math.round(completionPercentage), therapyExists: true };
              }
              return { ...roadmap, therapyExists: false };
            }));
            setRoadmaps(roadmapsWithCompletion);
            setProgress(100); 
          } else {
            console.error('Error fetching roadmaps:', data.message);
            setProgress(0); 
          }
        } catch (error) {
          console.error('Error fetching roadmaps:', error);
          setProgress(0); 
        } finally {
          setLoading(false);
        }
      };

      fetchRoadmaps();
    } else {
      setLoading(false);
    }
  }, [session?.user?.email]);

  const handleDelete = async (mapID: string) => {
    try {
      const deleteRoadmapRes = await fetch(`/api/roadmaps/${mapID}`, {
        method: 'DELETE',
      });

      const deleteTherapyRes = await fetch(`/api/therapy/${mapID}`, {
        method: 'DELETE',
      });

      if (deleteRoadmapRes.ok && deleteTherapyRes.ok) {
        setRoadmaps(roadmaps.filter((roadmap) => roadmap.mapID !== mapID));
      } else {
        console.error('Error deleting roadmap or therapy');
      }
    } catch (error) {
      console.error('Error deleting roadmap or therapy:', error);
    }
  };

  const handleCardClick = (mapID: string, therapyExists: boolean) => {
    if (therapyExists) {
      router.push(`/therapy/${mapID}`);
    } else {
      router.push(`/questionnaire/${mapID}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingBar progress={progress} />
      </div>
    );
  }

  const CenteredTextPlugin = {
    id: 'centeredText',
    beforeDraw: (chart: any) => {
      const { ctx, width, height } = chart;
      ctx.restore();
      const baseSize = 1.75; 
      const fontSize = (height / 150) * baseSize; 
      ctx.font = `300 ${fontSize}rem sans-serif`; 
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FEB800'; 
      const text = `${chart.data.datasets[0].data[0]}%`;
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;
      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  };
  
  ChartJS.register(CenteredTextPlugin);
  
  return (
    <ScrollArea className="h-screen">
    <div className="flex flex-wrap gap-8 p-6"> 
      {roadmaps.length > 0 ? (
        roadmaps.map((roadmap) => {
          const data = {
            datasets: [{
              data: [roadmap.completionPercentage, 100 - roadmap.completionPercentage],
              backgroundColor: ['#FE9900', '#FEB800'],
              borderWidth: 0
            }],
          };

          const options = {
            cutout: '70%',
            plugins: {
              centeredText: {},
              tooltip: {
                callbacks: {
                  label: function (tooltipItem: any) {
                    const dataIndex = tooltipItem.dataIndex;
                    const value = tooltipItem.dataset.data[dataIndex];
                    const label = tooltipItem.chart.data.labels[dataIndex];
                    return `${value}%`;
                  }
                }
              }
            }
          };

          if (roadmap.therapyExists) {
            return (
              <div key={roadmap.mapID} className="flex flex-col items-center relative">
                <Card
                  className="ml-4 w-56 h-72 border-[3px] border-[#FEB800] text-[#FE9900] flex flex-col p-4 cursor-pointer"
                  onClick={() => handleCardClick(roadmap.mapID, roadmap.therapyExists)}
                >
                  {roadmap.completionPercentage === 100 && (
                    <div className="absolute -top-4 -right-8">
                      <img src='/award.png' alt="Award" className="h-20"/>
                    </div>
                  )}
                  <CardHeader className="flex p-0 justify-end text-white">
                    <div className="flex space-x-1 items-end justify-start">
                      <Button className='bg-[#FE9900] h-7 w-7 hover:bg-black hover:text-[#FE9900]' variant="ghost" size="icon">
                        <BsPinAngleFill />
                      </Button>
                      <Button className='bg-[#FE9900] h-7 w-7 hover:bg-black hover:text-[#FE9900]' variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(roadmap.mapID); }}>
                        <FaTrash />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col items-center justify-center p-0">
                    {roadmap.completionPercentage === 100 ? (
                      <img src="/yellow-tick.png" alt="Completed" className="h-44" /> 
                    ) : (
                      <Doughnut data={data} options={options} />
                    )}
                  </CardContent>
                </Card>
                <div className="w-56 mt-2 text-[#FE9900] text-center text-base uppercase break-words">{roadmap.mapName}</div>
                <div className="w-56 text-[#FEB800] text-sm text-center break-words">
                  {roadmap.published ? 'Public' : 'Private'}
                </div>
              </div>
            );
          } else {
            return (
              <div key={roadmap.mapID} className="flex flex-col items-center relative">
                <Card
                  className="ml-4 w-56 h-72 border-[3px] border-[#FEB800] text-[#FE9900] flex flex-col p-4 cursor-pointer"
                  onClick={() => handleCardClick(roadmap.mapID, roadmap.therapyExists)}
                >
                  <div className="absolute -top-4 -right-8">
                    <img src='/danger.png' alt="Danger" className="h-20"/>
                  </div>
                  <CardHeader className="flex p-0 justify-end text-white">
                    <div className="flex space-x-1 items-end justify-start">
                      <Button className='bg-[#FE9900] h-7 w-7 hover:bg-black hover:text-[#FE9900]' variant="ghost" size="icon">
                        <BsPinAngleFill />
                      </Button>
                      <Button className='bg-[#FE9900] h-7 w-7 hover:bg-black hover:text-[#FE9900]' variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(roadmap.mapID); }}>
                        <FaTrash />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col items-center justify-center p-0">
                    <img src='/inactive.png' alt='inactive' className='h-24'></img>
                    <h2 className="mt-2 text-[#FE9900] text-center text-sm">You have not started</h2>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center p-0">
                    <Button className='bg-gradient-to-r from-[#FF7A01] to-[#FE9900] rounded-lg hover:from-black hover:to-black hover:text-[#FE9900]'>
                      <p className='mr-1'>Start Therapy</p>
                      <FaArrowRight className="" />
                    </Button>
                  </CardFooter>
                </Card>
                <div className="w-56 mt-2 text-[#FE9900] text-center text-base uppercase break-words">{roadmap.mapName}</div>
                <div className="w-56 text-[#FEB800] text-sm text-center break-words">
                  {roadmap.published ? 'Public' : 'Private'}
                </div>
              </div>
            );
          }
        })
      ) : (
        <div className="w-full h-screen flex flex-col justify-center items-center text-center text-xl text-[#FE9900] mt-4">
          <img src='/missing.png' alt='missing' className='h-24'></img>
          <h2 className='w-1/2'>You currently have no roadmaps. Please go to Roadmap to create, generate, or add one from our published library.</h2>
          <Button className='mt-4 rounded-full bg-[#FE9900] text-white' onClick={() => router.push('/roadmap')}>Go to Roadmap</Button>
        </div>
      )}
    </div>
    </ScrollArea>
  );
};

export default TherapyComponent;
