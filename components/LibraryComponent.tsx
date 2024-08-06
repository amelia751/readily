"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Roadmap } from '@/types/Roadmap'; // Import the Roadmap type

const LibraryComponent: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addedRoadmapName, setAddedRoadmapName] = useState<string>('');
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await fetch('/api/roadmaps?published=true');
        const data = await res.json();
        if (res.ok) {
          setRoadmaps(data);
        } else {
          console.error('Error fetching roadmaps:', data.message);
        }
      } catch (error) {
        console.error('Error fetching roadmaps:', error);
      }
    };

    fetchRoadmaps();
  }, []);

  const handleAddRoadmap = async (roadmap: Roadmap) => {
    if (!session?.user?.email) {
      console.error('User email not available');
      return;
    }

    try {
      const res = await fetch('/api/cloneLibrary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mapID: roadmap.mapID, newCreator: session.user.email }),
      });

      if (res.ok) {
        const savedRoadmap = await res.json();
        setAddedRoadmapName(roadmap.mapName || 'Unnamed Roadmap'); // Provide a default value
        setDialogOpen(true);
      } else {
        console.error('Error saving new roadmap:', res.statusText);
      }
    } catch (error) {
      console.error('Error adding roadmap:', error);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 p-6">
      {roadmaps.map((roadmap) => (
        <Card
          key={roadmap.mapID}
          className="pb-4 w-56 h-72 border-[3px] border-[#FEB800] text-[#FE9900] flex flex-col items-center justify-center cursor-pointer">
          <CardHeader className="flex p-0 justify-end">
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center p-0">
            <div className=" text-[#FE9900] text-center text-lg uppercase pb-4">{roadmap.mapName}</div>
            <div className="text-[#FEB800] text-sm text-center">
              {roadmap.useCase}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center p-0 mt-4">
            <Button className='bg-gradient-to-r from-[#FF7A01] to-[#FE9900] rounded-lg hover:from-black hover:to-black hover:text-[#FE9900]' onClick={() => handleAddRoadmap(roadmap)}>
              <p className='mr-1'>Add Roadmap</p><FaArrowRight className="" />
            </Button>
          </CardFooter>
        </Card>
      ))}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Roadmap &quot;{addedRoadmapName}&quot; Added</DialogTitle>
            <DialogDescription className='flex justify-center items-center bg-green-100 text-green-800 p-2 rounded-sm'>
              <FaCheckCircle className="text-green-500 mr-2" size={12} />
              Roadmap successfully added to your collection.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Finish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LibraryComponent;
