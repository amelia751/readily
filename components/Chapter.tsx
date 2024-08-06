"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaEdit, FaTrash, FaRegThumbsUp } from 'react-icons/fa';
import { Sparkles } from 'lucide-react';
import { RoadmapBreadcrumb } from './RoadmapBreadcrumb';
import LoadingBar from './LoadingBar';
import { Chapter } from '@/types/Roadmap'; 

const ChapterComponent: React.FC = () => {
  const [useCase, setUseCase] = useState<string>('');
  const [areaName, setAreaName] = useState<string>('');
  const [areaDescription, setAreaDescription] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [approvedChapters, setApprovedChapters] = useState<Chapter[]>([]);
  const [error, setError] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editChapter, setEditChapter] = useState<Chapter>({ chapterID: '', chapterName: '', chapterObjective: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateChapterDialogOpen, setIsCreateChapterDialogOpen] = useState<boolean>(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState<boolean>(false); // Dialog state for Generate Chapters
  const [progress, setProgress] = useState<number>(0); // Progress state for loading bar
  const formRef = useRef<HTMLFormElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchChapterDetails = async () => {
      if (!pathname) return;

      const pathSegments = pathname.split('/');
      const mapID = pathSegments[pathSegments.length - 2];
      const areaID = pathSegments[pathSegments.length - 1];

      if (!mapID || !areaID) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/chapters/${mapID}/${areaID}`);
        const data = await res.json();
        if (res.ok) {
          setUseCase(data.useCase);
          setAreaName(data.areaName);
          setAreaDescription(data.areaDescription);
          setApprovedChapters(data.chapters || []);
        } else {
          setError(data.error || 'An error occurred while fetching chapter details.');
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching chapter details.');
      } finally {
        setLoading(false);
      }
    };

    fetchChapterDetails();
  }, [pathname]);

  const handleGenerate = async () => {
    setLoading(true);
    setProgress(0); // Reset progress
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 500); // Simulate progress

    const endpoint = approvedChapters.length ? '/api/moreChapters' : '/api/generateChapters';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ useCase, areaName, areaDescription, approvedChapters }),
      });
      const data = await res.json();
      if (res.ok) {
        setChapters(data);
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
    const chapterID = approvedChapters[index].chapterID;
    const pathSegments = pathname.split('/');
    const mapID = pathSegments[pathSegments.length - 2];
    const areaID = pathSegments[pathSegments.length - 1];

    try {
      const res = await fetch(`/api/chapters/${mapID}/${areaID}/${chapterID}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setApprovedChapters(prevApprovedChapters => prevApprovedChapters.filter((_, i) => i !== index));
      } else {
        setError('An error occurred while deleting the chapter.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while deleting the chapter.');
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditChapter(approvedChapters[index]);
  };

  const handleSave = async () => {
    const { chapterID, chapterName, chapterObjective } = editChapter;
    const pathSegments = pathname.split('/');
    const mapID = pathSegments[pathSegments.length - 2];
    const areaID = pathSegments[pathSegments.length - 1];

    try {
      const res = await fetch(`/api/chapters/${mapID}/${areaID}/${chapterID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chapterName, chapterObjective }),
      });
      if (res.ok) {
        setApprovedChapters(prevApprovedChapters => prevApprovedChapters.map((chapter, i) => (i === editIndex ? editChapter : chapter)));
        setEditIndex(null);
        setEditChapter({ chapterID: '', chapterName: '', chapterObjective: '' });
      } else {
        setError('An error occurred while saving the chapter.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while saving the chapter.');
    }
  };

  const handleApprove = async (index: number) => {
    const approvedChapter = chapters ? chapters[index] : null;
    if (!approvedChapter) return;
    
    const pathSegments = pathname.split('/');
    const mapID = pathSegments[pathSegments.length - 2];
    const areaID = pathSegments[pathSegments.length - 1];
    setLoading(true);
    try {
      const res = await fetch('/api/chapters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mapID,
          areaID,
          chapterName: approvedChapter.chapterName,
          chapterObjective: approvedChapter.chapterObjective,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setApprovedChapters(prevApproved => [...prevApproved, data]);
        setChapters(prevChapters => prevChapters ? prevChapters.filter((_, i) => i !== index) : []);
      } else {
        setError('An error occurred while approving the chapter.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while approving the chapter.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChapterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
    const chapterName = formDataSubmit.get("chapterName") as string;
    const chapterObjective = formDataSubmit.get("chapterObjective") as string;
    const pathSegments = pathname.split('/');
    const mapID = pathSegments[pathSegments.length - 2];
    const areaID = pathSegments[pathSegments.length - 1];

    try {
      const res = await fetch('/api/chapters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mapID,
          areaID,
          chapterName,
          chapterObjective,
        }),
      });

      if (res.ok) {
        const newChapter = await res.json();
        setApprovedChapters([...approvedChapters, newChapter]);
        formRef.current?.reset();
        setIsCreateChapterDialogOpen(false);
      } else {
        setError('An error occurred while creating the chapter.');
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
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-normal text-[#FE9900] uppercase">Approved Chapters</h2>
          <Dialog open={isCreateChapterDialogOpen} onOpenChange={setIsCreateChapterDialogOpen}>
            <DialogTrigger asChild>
              <div className='flex justify-start items-center space-x-2 text-[#FE9900]'>
                <div className="text-4xl rounded-full w-12 h-12 flex justify-center items-center border-2 border-dashed border-[#FE9900] pb-1">+</div>
                <div className="uppercase text-xl">Create New Chapter</div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-normal text-[#FE9900] text-xl">Create New Chapter</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">Fill out the form below to create a new chapter.</DialogDescription>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleCreateChapterSubmit} className="space-y-4">
                <div className="grid gap-4 py-4">
                <div className="flex flex-col justify-center items-start gap-4 text-right">
                    <Label className="font-semibold text-[#FE9900]" htmlFor="chapterName">
                      Chapter Name
                    </Label>
                    <Input
                      id="chapterName"
                      name="chapterName"
                      className="col-span-3 mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
                      required
                    />
                  </div>
                  <div className="flex flex-col justify-center items-start gap-4 text-right">
                  <Label className="font-semibold text-[#FE9900]" htmlFor="chapterObjective">
                      Chapter Objective
                    </Label>
                    <Textarea
                      id="chapterObjective"
                      name="chapterObjective"
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
                <div className="uppercase text-xl">Generate Chapters</div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-sm max-h-screen">
              <DialogHeader>
                <DialogTitle className='font-light text-xl text-[#FE9900]'>Generate Chapters</DialogTitle>
              </DialogHeader>
              <div className="space-y-0">
                <div className="grid gap-4 py-2">
                  <div className="flex flex-col items-center gap-1">
                    <Input
                      id="areaName"
                      value={areaName}
                      onChange={(e) => setAreaName(e.target.value)}
                      className="text-xs col-span-3 mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
                      placeholder="Enter the area name"
                    />
                    <Textarea
                      id="areaDescription"
                      value={areaDescription}
                      onChange={(e) => setAreaDescription(e.target.value)}
                      className="text-xs col-span-3 mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
                      placeholder="Enter the area description"
                    />
                  </div>
                </div>
                <DialogFooter className='flex justify-center items-center'>
                  <Button onClick={handleGenerate} className='text-sm w-3/5 rounded-3xl bg-gradient-to-r from-[#FF7A01] to-[#FE9900] hover:from-black hover:to-black hover:text-[#FE9900]'>
                    {approvedChapters.length ? "Generate More Chapters" : "Generate Chapters"} <Sparkles className='ml-2' size='icon'/>
                  </Button>
                </DialogFooter>
                {loading && (
                  <div className="flex justify-center items-center mt-8 md:mt-52">
                    <LoadingBar progress={progress} />
                  </div>
                )}
                <ScrollArea className="h-2/3 p-4 ">
                  {chapters.length > 0 && !loading && (
                    <div className="mt-4">
                      {chapters.map((chapter, index) => (
                        <div key={index} className="border-2 border-solid border-[#FE9900] p-4 rounded-3xl shadow-md mb-4 relative cursor-pointer">
                          <div className='flex justify-between items-center space-x-4 mb-3'> 
                            <h2 className="text-xl font-normal text-[#D67A00]">{chapter.chapterName}</h2>
                            <div className="top-0 right-0 flex space-x-2">
                              <Button className='bg-[#FE9900] text-white h-7 w-7 hover:bg-black hover:text-[#FE9900]' variant="outline" size="icon" onClick={() => handleApprove(index)}>
                                <FaRegThumbsUp />
                              </Button>
                            </div>
                          </div>
                          <p className='font-light text-sm md:text-base'>{chapter.chapterObjective}</p>
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
          {approvedChapters.length > 0 ? (
            <div className="mt-4">
              {approvedChapters.map((chapter, index) => (
                <div
                  key={index}
                  className="border-2 border-solid border-[#FE9900] p-4 rounded-3xl shadow-md mb-4 relative cursor-pointer"
                  onClick={() => router.push(`/roadmap/${pathname.split('/')[2]}/${pathname.split('/')[3]}/${chapter.chapterID}`)}
                >
                  <div className='flex justify-between items-center space-x-4 mb-3'> 
                    <h2 className="text-xl font-normal text-[#D67A00]">{chapter.chapterName}</h2>
                    <div className=" flex space-x-2 top-0 right-0 items-start">
                      <Button className='bg-[#FE9900] text-white h-7 w-7 hover:bg-black hover:text-[#FE9900]' variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(index); }}>
                        <FaEdit />
                      </Button>
                      <Button className='bg-[#FE9900] text-white h-7 w-7 hover:bg-black hover:text-[#FE9900]' variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(index); }}>
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                  <p className='font-light text-sm md:text-base'>{chapter.chapterObjective}</p>
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
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
            placeholder="Enter the area name"
            className="mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
          />
          <Textarea
            value={areaDescription}
            onChange={(e) => setAreaDescription(e.target.value)}
            placeholder="Enter the area description"
            className="mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
          />
          <div className="flex space-x-4">
            <Button onClick={handleGenerate} className='rounded-3xl bg-gradient-to-r from-[#FF7A01] to-[#FE9900] hover:from-black hover:to-black hover:text-[#FE9900]'>
              {approvedChapters.length ? "Generate More Chapters" : "Generate Chapters"} <Sparkles className='ml-2' size='icon'/>
            </Button>
          </div>
          {error && <p className="text-red-600 mt-4">{error}</p>}
          {loading ? (
            <div className="flex justify-center items-center mt-8 md:mt-52">
              <LoadingBar progress={progress} />
            </div>
          ) : (
            chapters.length > 0 && (
              <div className="mt-4">
                {chapters.map((chapter, index) => (
                  <div key={index} className="border-2 border-solid border-[#FE9900] p-4 rounded-3xl shadow-md mb-4 relative cursor-pointer">
                    <div className='flex justify-between items-center space-x-4 mb-3'> 
                      <h2 className="text-xl font-normal text-[#D67A00]">{chapter.chapterName}</h2>
                      <div className="top-0 right-0 flex space-x-2">
                        <Button className='bg-[#FE9900] text-white h-7 w-7 hover:bg-black hover:text-[#FE9900]' variant="outline" size="icon" onClick={() => handleApprove(index)}>
                          <FaRegThumbsUp />
                        </Button>
                      </div>
                    </div>
                    <p className='font-light text-sm md:text-base'>{chapter.chapterObjective}</p>
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
                  <DialogTitle className="font-normal text-[#FE9900] text-xl">Edit Chapter</DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    Make changes to the chapter here. Click save when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="flex flex-col justify-center items-start gap-4">
                <Label htmlFor="chapterName" className="font-semibold text-[#FE9900] text-right">
                      Chapter Name
                    </Label>
                    <Input
                      id="chapterName"
                      value={editChapter.chapterName}
                      onChange={(e) => setEditChapter({ ...editChapter, chapterName: e.target.value })}
                      className="col-span-3 mb-4 rounded-xl border-2 border-[#FE9900]"
                    />
                  </div>
                  <div className="flex flex-col justify-center items-start gap-4">
                    <Label htmlFor="chapterObjective" className="font-semibold text-[#FE9900] text-right">
                      Chapter Objective
                    </Label>
                    <Textarea
                      id="chapterObjective"
                      value={editChapter.chapterObjective}
                      onChange={(e) => setEditChapter({ ...editChapter, chapterObjective: e.target.value })}
                      className="col-span-3 mb-4 rounded-xl border-2 border-[#FE9900]"
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

export default ChapterComponent;
