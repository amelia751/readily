"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { RoadmapBreadcrumb } from './RoadmapBreadcrumb';
import { Textarea } from './ui/textarea';
import { Roadmap } from '@/types/Roadmap';


const RoadmapComponent = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [useCase, setUseCase] = useState<string>('');
  const [published, setPublished] = useState<boolean>(false); // Initially set to private
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [generatedName, setGeneratedName] = useState<string>('');
  const [step, setStep] = useState<number>(1); // 1 for input, 2 for confirmation
  const [dialogOpen, setDialogOpen] = useState<boolean>(false); 
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<Roadmap | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteMapID, setDeleteMapID] = useState<string | null>(null);

  const { data: session } = useSession();
  const router = useRouter();

  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    if (session?.user?.email) {
      const fetchRoadmaps = async () => {
        try {
          const res = await fetch(`/api/roadmaps?creator=${session.user.email}`);
          const data = await res.json();
          setRoadmaps(data);
        } catch (error) {
          console.error('Error fetching roadmaps:', error);
        }
      };

      fetchRoadmaps();
    }
  }, [session?.user?.email]);

  const handleGenerateName = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/generateMaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: useCase }),
      });
      const data = await res.json();

      if (res.ok) {
        setGeneratedName(data.mapName);
        setStep(2); // Move to confirmation step
      } else {
        setError(data.error || 'An error occurred while generating the map name.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while generating the map name.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveName = async () => {
    setLoading(true);
    const creator = session?.user?.email;

    try {
      const res = await fetch('/api/roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mapName: generatedName,
          useCase,
          keyAreas: [],
          published,
          creator,
        }),
      });

      if (res.ok) {
        const newRoadmap = await res.json();
        setRoadmaps([...roadmaps, newRoadmap]);
        setUseCase('');
        setPublished(false); // Reset to private
        setGeneratedName('');
        setStep(1); // Reset to input step
        setDialogOpen(false); 
      } else {
        const data = await res.json();
        setError(data.message || 'An error occurred while creating the roadmap.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while creating the roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateName = () => {
    setStep(1); // Reset to input step
    setGeneratedName('');
  };

  const handleDelete = async (mapID: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/roadmaps/${mapID}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setRoadmaps(roadmaps.filter((roadmap) => roadmap.mapID !== mapID));
        setDeleteDialogOpen(false);
      } else {
        const data = await res.json();
        setError(data.message || 'An error occurred while deleting the roadmap.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while deleting the roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (roadmap: Roadmap) => {
    setEditData(roadmap);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editData) return;

    setLoading(true);
    const { mapID, mapName, useCase, published } = editData;

    try {
      const res = await fetch(`/api/roadmaps/${mapID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mapName, useCase, published }),
      });

      if (res.ok) {
        const updatedRoadmap = await res.json();
        setRoadmaps(roadmaps.map((roadmap) => (roadmap.mapID === mapID ? updatedRoadmap : roadmap)));
        setEditDialogOpen(false);
      } else {
        const data = await res.json();
        setError(data.message || 'An error occurred while updating the roadmap.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while updating the roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (mapID: string) => {
    setDeleteMapID(mapID);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="w-full flex flex-col md:space-x-5 justify-center items-between">
      <div className='z-100 ml-4 mt-4'>
        <RoadmapBreadcrumb />
      </div>
      <div className="flex flex-wrap gap-4 p-6">
        <Card className="w-56 h-72 border-[3px] border-[#FEB800] text-[#FE9900] flex flex-col items-center justify-center cursor-pointer">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <CardContent className="flex flex-col items-center justify-center space-y-4 flex-grow text-center">
                <div className="text-4xl rounded-full w-12 h-12 flex justify-center items-center border-2 border-dashed border-[#FE9900] pb-1">+</div>
                <div className="uppercase text-xl">Create Roadmap</div>
              </CardContent>
            </DialogTrigger>
            <DialogContent className='lg:max-w-screen-sm'>
              <DialogHeader>
                <DialogTitle className="font-normal text-[#FE9900] text-xl">Create Roadmap</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">Your journey begins here!</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGenerateName}>
                {step === 1 && (
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label className="font-semibold text-[#FE9900]" htmlFor="useCase">Use Case</Label>
                      <Input className="mb-4 rounded-xl border-2 border-[#FE9900] font-normal" id="useCase" value={useCase} onChange={(e) => setUseCase(e.target.value)} required />
                    </div>
                    <div className="flex flex-col space-y-1.5" >
                      <Label className="font-semibold text-[#FE9900]" htmlFor="published">Visibility</Label>
                      <Select onValueChange={(value) => setPublished(value === 'public')} value={published ? 'public' : 'private'}>
                        <SelectTrigger className="mb-4 rounded-xl border-2 border-[#FE9900] font-normal" id="published">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="private">Private</SelectItem>
                            {isAdmin && <SelectItem value="public">Public</SelectItem>}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {!isAdmin && (
                        <p className="text-sm text-gray-600">For security reasons, only admins can create public roadmaps at this time.</p>
                      )}
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label className="font-semibold text-[#FE9900]" htmlFor="generatedName">Generated Name</Label>
                      <Input className="mb-4 rounded-xl border-2 border-[#FE9900] font-normal" id="generatedName" value={generatedName} readOnly />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  {step === 1 ? (
                    <Button className='bg-gradient-to-r from-[#FF7A01] to-[#FE9900] rounded-lg hover:from-black hover:to-black hover:text-[#FE9900]' type="submit" disabled={loading}>
                      {loading ? 'Generating...' : 'Generate Name'}
                    </Button>
                  ) : (
                    <>
                      <Button className='bg-gradient-to-r from-[#FF7A01] to-[#FE9900] rounded-lg hover:from-black hover:to-black hover:text-[#FE9900]' onClick={handleApproveName} disabled={loading}>
                        {loading ? 'Creating...' : 'Approve'}
                      </Button>
                      <Button onClick={handleRegenerateName} variant="outline" disabled={loading}>
                        {loading ? 'Regenerating...' : 'Regenerate'}
                      </Button>
                    </>
                  )}
                </DialogFooter>
                {error && <p className="text-red-600 mt-2">{error}</p>}
              </form>
            </DialogContent>
          </Dialog>
        </Card>
        {roadmaps.map((roadmap) => (
          <Card
            key={roadmap.mapID}
            className="w-56 h-72 border-[3px] border-[#FEB800] text-[#FE9900] flex flex-col p-4 cursor-pointer"
            onClick={() => router.push(`/roadmap/${roadmap.mapID}`)}
          >
            <CardHeader className="flex p-0 justify-end text-white ">
              <div className="flex space-x-1 items-end justify-end">
                <Button className='bg-[#FE9900] h-7 w-7 hover:bg-black hover:text-[#FE9900]' variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(roadmap); }}>
                  <FaEdit />
                </Button>
                <Button className='bg-[#FE9900] h-7 w-7 hover:bg-black hover:text-[#FE9900]' variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openDeleteDialog(roadmap.mapID); }}>
                  <FaTrash />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-0">
              <div className=" text-[#FE9900] text-center text-lg uppercase">{roadmap.mapName}</div>
              <div className="text-[#FEB800] text-sm text-center">
                {roadmap.published ? 'Public' : 'Private'}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center p-0 mt-4">
            </CardFooter>
          </Card>
        ))}
        {editData && (
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className='lg:max-w-screen-sm'>
              <DialogHeader>
                <DialogTitle className="font-normal text-[#FE9900] text-xl">Edit Roadmap</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">Update the roadmap information.</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label className="font-semibold text-[#FE9900]" htmlFor="editMapName">Map Name</Label>
                    <Input
                      className="mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
                      id="editMapName"
                      value={editData.mapName}
                      onChange={(e) => setEditData({ ...editData, mapName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label className="font-semibold text-[#FE9900]" htmlFor="editUseCase">Use Case</Label>
                    <Input
                      className="mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
                      id="editUseCase"
                      value={editData.useCase}
                      onChange={(e) => setEditData({ ...editData, useCase: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label className="font-semibold text-[#FE9900]" htmlFor="editPublished">Visibility</Label>
                    <Select
                      onValueChange={(value) => setEditData({ ...editData, published: value === 'public' })}
                      value={editData.published ? 'public' : 'private'}
                      disabled={!isAdmin} // Disable select for non-admin users
                    >
                      <SelectTrigger className="mb-4 rounded-xl border-2 border-[#FE9900] font-normal" id="editPublished">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button className='bg-gradient-to-r from-[#FF7A01] to-[#FE9900] rounded-lg hover:from-black hover:to-black hover:text-[#FE9900]' type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </DialogFooter>
                {error && <p className="text-red-600 mt-2">{error}</p>}
              </form>
            </DialogContent>
          </Dialog>
        )}
        {deleteMapID && (
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className='lg:max-w-screen-sm'>
              <DialogHeader>
                <DialogTitle>Are you certain you want to delete this roadmap?</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">Doing so will also erase your therapy progress related to this roadmap.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => setDeleteDialogOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button className='bg-gradient-to-r from-[#FF7A01] to-[#FE9900] rounded-lg hover:from-black hover:to-black hover:text-[#FE9900]' onClick={() => handleDelete(deleteMapID)} variant="destructive">
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default RoadmapComponent;
