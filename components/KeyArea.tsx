"use client"
import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaEdit, FaTrash, FaRegThumbsUp } from 'react-icons/fa';
import { RoadmapBreadcrumb } from './RoadmapBreadcrumb';
import { Sparkles } from 'lucide-react';
import LoadingBar from './LoadingBar';

const KeyArea: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [keyAreas, setKeyAreas] = useState<any[] | null>(null);
  const [approvedKeyAreas, setApprovedKeyAreas] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editArea, setEditArea] = useState({ areaID: '', areaName: '', areaDescription: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateKeyAreaDialogOpen, setIsCreateKeyAreaDialogOpen] = useState<boolean>(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState<boolean>(false); // Dialog state for Generate Areas
  const [progress, setProgress] = useState<number>(0); // Progress state for loading bar
  const formRef = useRef<HTMLFormElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchRoadmapDetails = async () => {
      if (!pathname) return;

      const mapID = pathname.split('/').pop();
      if (!mapID) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/roadmaps/${mapID}`);
        const data = await res.json();
        if (res.ok) {
          setPrompt(data.useCase);
          setApprovedKeyAreas(data.keyAreas || []);
        } else {
          setError(data.error || 'An error occurred while fetching roadmap details.');
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching roadmap details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapDetails();
  }, [pathname]);

  const handleGenerate = async () => {
    setLoading(true);
    setProgress(0); // Reset progress
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 500); // Simulate progress

    try {
      const res = await fetch(approvedKeyAreas.length ? '/api/moreAreas' : '/api/generateAreas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, approvedKeyAreas }),
      });
      const data = await res.json();
      if (res.ok) {
        setKeyAreas(data);
      } else {
        setError(data.error || 'An error occurred while generating content.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while generating content.');
    } finally {
      clearInterval(interval);
      setProgress(100); // Complete the progress
      setTimeout(() => {
        setLoading(false);
      }, 500); // Small delay to show completion
    }
  };

  const handleDelete = async (index: number) => {
    const keyAreaID = approvedKeyAreas[index].areaID;
    try {
      const res = await fetch(`/api/keyareas/${keyAreaID}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setApprovedKeyAreas(prevApprovedKeyAreas => prevApprovedKeyAreas.filter((_, i) => i !== index));
      } else {
        setError('An error occurred while deleting the key area.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while deleting the key area.');
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditArea(approvedKeyAreas[index]);
  };

  const handleSave = async () => {
    const { areaID, areaName, areaDescription } = editArea;
    try {
      const res = await fetch(`/api/keyareas/${areaID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ areaName, areaDescription }),
      });
      if (res.ok) {
        setApprovedKeyAreas(prevApprovedKeyAreas => prevApprovedKeyAreas.map((area, i) => (i === editIndex ? editArea : area)));
        setEditIndex(null);
        setEditArea({ areaID: '', areaName: '', areaDescription: '' });
      } else {
        setError('An error occurred while saving the key area.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while saving the key area.');
    }
  };

  const handleApprove = async (index: number) => {
    if (!keyAreas) return;

    const approvedArea = keyAreas[index];
    const mapID = pathname.split('/').pop();
    console.log("Approving key area with mapID:", mapID); // Log the mapID to verify
    setLoading(true);
    try {
      const res = await fetch('/api/keyareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mapID,
          areaName: approvedArea.areaName,
          areaDescription: approvedArea.areaDescription,
          chapters: [], // Ensure chapters is an empty array
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setApprovedKeyAreas(prevApproved => [...prevApproved, data]);
        setKeyAreas(prevKeyAreas => prevKeyAreas ? prevKeyAreas.filter((_, i) => i !== index) : null);
      } else {
        const data = await res.json();
        setError(data.error || 'An error occurred while approving the key area.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while approving the key area.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKeyAreaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
    const areaName = formDataSubmit.get("areaName") as string;
    const areaDescription = formDataSubmit.get("areaDescription") as string;
    const mapID = pathname.split('/').pop();
    console.log("Creating key area with mapID:", mapID); // Log the mapID to verify

    try {
      const res = await fetch('/api/keyareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mapID,
          areaName,
          areaDescription,
          chapters: [], // Ensure chapters is an empty array
        }),
      });

      if (res.ok) {
        const newKeyArea = await res.json();
        setApprovedKeyAreas([...approvedKeyAreas, newKeyArea]);
        formRef.current?.reset();
        setIsCreateKeyAreaDialogOpen(false);
      } else {
        const data = await res.json();
        setError(data.error || 'An error occurred while creating the key area.');
      }
    } catch (error) {
      console.error(error);
      setError("Error, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:space-x-5 justify-center items-between">
      <div className='mt-4 md:w-1/2 h-screen border-l-2 border-dashed border-[#FEAC1C]'>
        <div className='z-100 ml-4 '>
          <RoadmapBreadcrumb />
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-normal text-[#FE9900] uppercase">Approved Areas</h2>
          <Dialog open={isCreateKeyAreaDialogOpen} onOpenChange={setIsCreateKeyAreaDialogOpen}>
            <DialogTrigger asChild>
              <div className='flex justify-start items-center space-x-2 text-[#FE9900]'>
                <div className="text-4xl rounded-full w-12 h-12 flex justify-center items-center border-2 border-dashed border-[#FE9900] pb-1">+</div>
                <div className="uppercase text-xl">Create New Area</div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-normal text-[#FE9900] text-xl">Create a New Area</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">Fill out the form below to create a new key area.</DialogDescription>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleCreateKeyAreaSubmit} className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col justify-center items-start gap-4">
                    <Label className="font-semibold text-[#FE9900] text-right" htmlFor="areaName">
                      Area Name
                    </Label>
                    <Input
                      id="areaName"
                      name="areaName"
                      className="col-span-3 mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
                      required
                    />
                  </div>
                  <div className="flex flex-col justify-center items-start gap-4">
                    <Label className="font-semibold text-[#FE9900] text-right" htmlFor="areaDescription">
                      Area Description
                    </Label>
                    <Textarea
                      id="areaDescription"
                      name="areaDescription"
                      className="col-span-3 mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button className='bg-gradient-to-r from-[#FF7A01] to-[#FE9900] rounded-lg hover:from-black hover:to-black hover:text-[#FE9900]' type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </DialogFooter>
                <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <div className='md:hidden mt-4 flex justify-start items-center space-x-2 text-[#FE9900]'>
                <div className="text-4xl rounded-full w-12 h-12 flex justify-center items-center border-2 border-dashed border-[#FE9900] pb-1"><Sparkles /></div>
                <div className="uppercase text-xl">Generate Areas</div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-sm max-h-screen">
              <DialogHeader>
                <DialogTitle className='font-light text-xl text-[#FE9900]'>Generate Areas of Development</DialogTitle>
              </DialogHeader>
              <div className="space-y-0">
                <div className="grid gap-4 py-2">
                  <div className="flex flex-col items-center gap-4">
                    <Input
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="text-xs col-span-3 mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
                    />
                  </div>
                </div>
                <DialogFooter className='flex justify-center items-center'>
                  <Button onClick={handleGenerate} className='text-sm w-3/5 rounded-3xl bg-gradient-to-r from-[#FF7A01] to-[#FE9900] hover:from-black hover:to-black hover:text-[#FE9900]'>
                    {approvedKeyAreas.length ? "Generate More Areas" : "Generate Areas of Development"} <Sparkles className='ml-2' size='icon'/>
                  </Button>
                </DialogFooter>
                {loading && (
                  <div className="flex justify-center items-center">
                    <LoadingBar progress={progress} />
                  </div>
                )}
                <ScrollArea className="h-2/3 p-4 ">
                  {keyAreas && !loading && (
                    <div className="mt-4">
                      {keyAreas.map((keyArea, index) => (
                        <div key={index} className="border-2 border-solid border-[#FE9900] p-4 rounded-3xl shadow-md mb-4 relative cursor-pointer">
                          <div className='flex justify-between items-center space-x-4 mb-3'> 
                            <h2 className="text-xl font-normal text-[#D67A00]">{keyArea.areaName}</h2>
                            <div className="top-0 right-0 flex space-x-2">
                              <Button className='bg-[#FE9900] text-white h-7 w-7 hover:bg-black hover:text-[#FE9900]' variant="outline" size="icon" onClick={() => handleApprove(index)}>
                                <FaRegThumbsUp />
                              </Button>
                            </div>
                          </div>
                          <p className='font-light text-sm md:text-base'>{keyArea.areaDescription}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="h-5/6 p-4 ">
          {approvedKeyAreas.length > 0 ? (
            <div className="mt-4">
              {approvedKeyAreas.map((keyArea, index) => (
                <div
                  key={index}
                  className="border-2 border-solid border-[#FE9900] p-4 rounded-3xl shadow-md mb-4 relative cursor-pointer"
                  onClick={() => router.push(`/roadmap/${pathname.split('/').pop()}/${keyArea.areaID}`)}
                >
                  <div className='flex justify-between items-center space-x-4 mb-3'> 
                    <h2 className="text-xl font-normal text-[#D67A00]">{keyArea.areaName}</h2>
                    <div className=" flex space-x-2 top-0 right-0 items-start">
                      <Button className='bg-[#FE9900] text-white h-7 w-7 hover:bg-black hover:text-[#FE9900]' variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(index); }}>
                        <FaEdit />
                      </Button>
                      <Button className='bg-[#FE9900] text-white h-7 w-7 hover:bg-black hover:text-[#FE9900]' variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(index); }}>
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                  <p className='font-light text-sm md:text-base'>{keyArea.areaDescription}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-1/2 flex flex-col justify-end items-center text-center text-xl text-[#FE9900] mt-4">
              <img src='/missing.png' alt='missing' className='h-24'></img>
              <h2 className='w-1/2'>There are currently no chapters in this area. Please create or generate one. </h2>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className='hidden md:block mt-4 md:w-1/2 h-[450px] md:h-screen border-l-2 border-dashed border-[#FEAC1C]'>
        <ScrollArea className="h-[450px] md:h-screen p-4">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your use case"
            className="mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
          />
          <div className="flex space-x-4">
            <Button onClick={handleGenerate} className='rounded-3xl bg-gradient-to-r from-[#FF7A01] to-[#FE9900] hover:from-black hover:to-black hover:text-[#FE9900]'>
              {approvedKeyAreas.length ? "Generate More Areas" : "Generate Areas of Development"} <Sparkles className='ml-2' size='icon'/>
            </Button>
          </div>
          {error && <p className="text-red-600 mt-4">{error}</p>}
          {loading ? (
            <div className="flex justify-center items-center mt-8 md:mt-52">
              <LoadingBar progress={progress} />
            </div>
          ) : (
            keyAreas && (
              <div className="mt-4">
                {keyAreas.map((keyArea, index) => (
                  <div key={index} className="border-2 border-solid border-[#FE9900] p-4 rounded-3xl shadow-md mb-4 relative cursor-pointer">
                    <div className='flex justify-between items-center space-x-4 mb-3'> 
                      <h2 className="text-xl font-normal text-[#D67A00]">{keyArea.areaName}</h2>
                      <div className="top-0 right-0 flex space-x-2">
                        <Button className='bg-[#FE9900] text-white h-7 w-7 hover:bg-black hover:text-[#FE9900]' variant="outline" size="icon" onClick={() => handleApprove(index)}>
                          <FaRegThumbsUp />
                        </Button>
                      </div>
                    </div>
                    <p className='font-light text-sm md:text-base'>{keyArea.areaDescription}</p>
                  </div>
                ))}
              </div>
            )
          )}
          {editIndex !== null && (
            <Dialog open={editIndex !== null} onOpenChange={() => setEditIndex(null)}>
              <DialogTrigger asChild>
                <Button variant="outline">Edit</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-normal text-[#FE9900] text-xl">Edit Key Area</DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    Make changes to the key area here. Click save when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col justify-center items-start gap-4">
                    <Label className="font-semibold text-[#FE9900] text-right" htmlFor="areaName">
                      Area Name
                    </Label>
                    <Input
                      id="areaName"
                      value={editArea.areaName}
                      onChange={(e) => setEditArea({ ...editArea, areaName: e.target.value })}
                      className="mb-4 rounded-xl border-2 border-[#FE9900]"
                    />
                  </div>
                  <div className="flex flex-col justify-center items-start gap-4">
                    <Label className="font-semibold text-[#FE9900] text-right" htmlFor="areaDescription">
                      Area Description
                    </Label>
                    <Textarea
                      id="areaDescription"
                      value={editArea.areaDescription}
                      onChange={(e) => setEditArea({ ...editArea, areaDescription: e.target.value })}
                      className="mb-4 rounded-xl border-2 border-[#FE9900]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button className='bg-gradient-to-r from-[#FF7A01] to-[#FE9900] rounded-lg hover:from-black hover:to-black hover:text-[#FE9900]' type="button" onClick={handleSave}>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default KeyArea;
