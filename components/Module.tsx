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
import LoadingBar from './LoadingBar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RoadmapBreadcrumb } from './RoadmapBreadcrumb';

interface Module {
  moduleID: string;
  moduleName: string;
  moduleContent: string;
  moduleTime: number; 
}

const Module = () => {
  const [modules, setModules] = useState<string | null>(null);
  const [generatedModuleName, setGeneratedModuleName] = useState<string | null>(null);
  const [generatedModuleTime, setGeneratedModuleTime] = useState<number | null>(null); 
  const [approvedModules, setApprovedModules] = useState<Module[]>([]);
  const [useCase, setUseCase] = useState<string>('');
  const [areaName, setAreaName] = useState<string>('');
  const [areaDescription, setAreaDescription] = useState<string>('');
  const [chapterName, setChapterName] = useState<string>('');
  const [chapterObjective, setChapterObjective] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editModule, setEditModule] = useState<Module>({ moduleID: '', moduleName: '', moduleContent: '', moduleTime: 0 }); // Changed to number
  const [loading, setLoading] = useState<boolean>(false);
  const [isCreateModuleDialogOpen, setIsCreateModuleDialogOpen] = useState<boolean>(false);
  const [isGenerateModuleDialogOpen, setIsGenerateModuleDialogOpen] = useState<boolean>(false);
  const [isGenerateModuleNameDialogOpen, setIsGenerateModuleNameDialogOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!pathname) return;

      const pathSegments = pathname.split('/');
      const mapID = pathSegments[pathSegments.length - 3];
      const areaID = pathSegments[pathSegments.length - 2];
      const chapterID = pathSegments[pathSegments.length - 1];

      if (!mapID || !areaID || !chapterID) {
        setLoading(false);
        return;
      }

      try {
        const resChapter = await fetch(`/api/chapters/${mapID}/${areaID}`);
        const chapterData = await resChapter.json();

        const resModule = await fetch(`/api/modules?mapID=${mapID}&areaID=${areaID}&chapterID=${chapterID}`);
        const moduleData = await resModule.json();

        if (resChapter.ok && resModule.ok) {
          setUseCase(chapterData.useCase);
          setAreaName(chapterData.areaName);
          setAreaDescription(chapterData.areaDescription);

          const chapter = chapterData.chapters.find((chap: any) => chap.chapterID === chapterID);
          setChapterName(chapter?.chapterName || '');
          setChapterObjective(chapter?.chapterObjective || '');

          setApprovedModules(moduleData || []);
        } else {
          setError(chapterData.error || 'An error occurred while fetching details.');
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [pathname]);

  const handleGenerate = async () => {
    setLoading(true);
    setProgress(0); 
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 500); 

    try {
      const res = await fetch(approvedModules.length ? '/api/moreModules' : '/api/generateModules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pathname: window.location.pathname,
          useCase,
          areaName,
          areaDescription,
          chapterName,
          chapterObjective,
          approvedModules,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setModules(data.text); 
        if (window.innerWidth >= 768) {
          setGeneratedModuleName(null);
          setGeneratedModuleTime(null);
        } else {
          setIsGenerateModuleDialogOpen(true);
        }
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

  const handleGenerateModuleName = async () => {
    if (!modules) {
      setError('No module to approve.');
      return;
    }

    const moduleContent = modules;
    setLoading(true);

    try {
      const resName = await fetch('/api/generateModuleName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moduleContent }),
      });

      const dataName = await resName.json();

      if (!resName.ok) {
        setError('An error occurred while generating the module name.');
        return;
      }

      setGeneratedModuleName(dataName.moduleName);
      setGeneratedModuleTime(dataName.moduleTime); 
      setIsGenerateModuleNameDialogOpen(true); 
    } catch (error) {
      console.error(error);
      setError('An error occurred while generating the module name.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!generatedModuleName || !modules || generatedModuleTime === null) {
      setError('No module or module name to approve.');
      return;
    }

    const moduleName = generatedModuleName;
    const moduleContent = modules;
    const moduleTime = generatedModuleTime; 
    const pathSegments = pathname.split('/');
    const mapID = pathSegments[pathSegments.length - 3];
    const areaID = pathSegments[pathSegments.length - 2];
    const chapterID = pathSegments[pathSegments.length - 1];

    setLoading(true);

    try {
      const res = await fetch('/api/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mapID,
          areaID,
          chapterID,
          moduleName,
          moduleContent,
          moduleTime,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setApprovedModules((prevApproved) => [...prevApproved, data]);
        setModules(null);
        setGeneratedModuleName(null);
        setGeneratedModuleTime(null); 
        setIsGenerateModuleDialogOpen(false);
        setIsGenerateModuleNameDialogOpen(false);
      } else {
        setError('An error occurred while approving the module.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while approving the module.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index: number) => {
    const moduleID = approvedModules[index].moduleID;
    const pathSegments = pathname.split('/');
    const mapID = pathSegments[pathSegments.length - 3];
    const areaID = pathSegments[pathSegments.length - 2];
    const chapterID = pathSegments[pathSegments.length - 1];

    try {
      const res = await fetch(`/api/modules/${mapID}/${areaID}/${chapterID}/${moduleID}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setApprovedModules((prevApprovedModules) => prevApprovedModules.filter((_, i) => i !== index));
      } else {
        setError('An error occurred while deleting the module.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while deleting the module.');
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditModule(approvedModules[index]);
  };

  const handleSave = async () => {
    const { moduleID, moduleName, moduleContent, moduleTime } = editModule; // Include moduleTime
    const pathSegments = pathname.split('/');
    const mapID = pathSegments[pathSegments.length - 3];
    const areaID = pathSegments[pathSegments.length - 2];
    const chapterID = pathSegments[pathSegments.length - 1];

    try {
      const res = await fetch(`/api/modules/${mapID}/${areaID}/${chapterID}/${moduleID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moduleName, moduleContent, moduleTime }), 
      });
      if (res.ok) {
        setApprovedModules((prevApprovedModules) => prevApprovedModules.map((module, i) => (i === editIndex ? editModule : module)));
        setEditIndex(null);
        setEditModule({ moduleID: '', moduleName: '', moduleContent: '', moduleTime: 0 }); 
      } else {
        setError('An error occurred while saving the module.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while saving the module.');
    }
  };

  const handleCreateModuleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
    const moduleName = formDataSubmit.get('moduleName') as string;
    const moduleContent = formDataSubmit.get('moduleContent') as string;
    const moduleTime = parseInt(formDataSubmit.get('moduleTime') as string); 
    const pathSegments = pathname.split('/');
    const mapID = pathSegments[pathSegments.length - 3];
    const areaID = pathSegments[pathSegments.length - 2];
    const chapterID = pathSegments[pathSegments.length - 1];

    try {
      const res = await fetch('/api/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mapID,
          areaID,
          chapterID,
          moduleName,
          moduleContent,
          moduleTime, 
        }),
      });

      if (res.ok) {
        const newModule = await res.json();
        setApprovedModules([...approvedModules, newModule]);
        formRef.current?.reset();
        setIsCreateModuleDialogOpen(false);
      } else {
        setError('An error occurred while creating the module.');
      }
    } catch (error) {
      console.error(error);
      setError('Error, try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:space-x-5 justify-center items-between">
      <div className="mt-4 md:w-1/2 h-screen border-l-2 border-dashed border-[#FEAC1C]">
        <div className="z-100 ml-4">
          <RoadmapBreadcrumb />

          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-normal text-[#FE9900] uppercase">Approved Modules</h2>
          <Dialog open={isCreateModuleDialogOpen} onOpenChange={setIsCreateModuleDialogOpen}>
            <DialogTrigger asChild>
              <div className="flex justify-start items-center space-x-2 text-[#FE9900]">
                <div className="text-4xl rounded-full w-12 h-12 flex justify-center items-center border-2 border-dashed border-[#FE9900] pb-1">+</div>
                <div className="uppercase text-xl">Create New Module</div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-normal text-[#FE9900] text-xl">Create a New Module</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">Fill out the form below to create a new module.</DialogDescription>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleCreateModuleSubmit} className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col justify-center items-start gap-4 text-right">
                    <Label className="font-semibold text-[#FE9900] text-right" htmlFor="moduleName">
                      Module Name
                    </Label>
                    <Input id="moduleName" name="moduleName" className="col-span-3 mb-4 rounded-xl border-2 border-[#FE9900] font-normal" required />
                  </div>
                  <div className="flex flex-col justify-center items-start gap-4 text-right">
                    <Label htmlFor="moduleContent" className="font-semibold text-[#FE9900] text-right">
                      Module Content
                    </Label>
                    <Textarea id="moduleContent" name="moduleContent" className="col-span-3 mb-4 rounded-xl border-2 border-[#FE9900] font-normal" required />
                  </div>
                  <div className="flex flex-col justify-center items-start gap-4 text-right">
                    <Label htmlFor="moduleTime" className="font-semibold text-[#FE9900] text-right">
                      Module Time (minutes)
                    </Label>
                    <Input id="moduleTime" name="moduleTime" type="number" className="col-span-3 mb-4 rounded-xl border-2 border-[#FE9900] font-normal" required />
                  </div>
                </div>
                <DialogFooter>
                  <Button className='bg-gradient-to-r from-[#FF7A01] to-[#FE9900] rounded-lg hover:from-black hover:to-black hover:text-[#FE9900]' type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                  </Button>
                </DialogFooter>
                <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isGenerateModuleDialogOpen} onOpenChange={setIsGenerateModuleDialogOpen}>
            <DialogTrigger asChild>
              <div className="md:hidden mt-4 flex justify-start items-center space-x-2 text-[#FE9900]">
                <div className="text-4xl rounded-full w-12 h-12 flex justify-center items-center border-2 border-dashed border-[#FE9900] pb-1">
                  <Sparkles />
                </div>
                <div className="uppercase text-xl">Generate Module</div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-sm max-h-screen">
              <DialogHeader>
                <DialogTitle className="font-light text-xl text-[#FE9900]">Generate Modules</DialogTitle>
              </DialogHeader>
              <div className="space-y-0">
                <div className="grid gap-4 py-2">
                  <div className="flex flex-col items-center gap-4">
                    <Input
                      id="chapterName"
                      value={chapterName}
                      onChange={(e) => setChapterName(e.target.value)}
                      className="text-xs col-span-3 mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
                      required
                    />
                    <Textarea
                      id="chapterObjective"
                      value={chapterObjective}
                      onChange={(e) => setChapterObjective(e.target.value)}
                      className="text-xs col-span-3 mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
                      required
                    />
                  </div>
                </div>
                <DialogFooter className="flex justify-center items-center">
                  <Button
                    onClick={handleGenerate}
                    className="text-sm w-3/5 rounded-3xl bg-gradient-to-r from-[#FF7A01] to-[#FE9900] hover:from-black hover:to-black hover:text-[#FE9900]"
                  >
                    {approvedModules.length ? 'Generate More Modules' : 'Generate Modules'} <Sparkles className="ml-2" size="icon" />
                  </Button>
                </DialogFooter>
                {loading && (
                  <div className="flex justify-center items-center mt-8 md:mt-52">
                    <LoadingBar progress={progress} />
                  </div>
                )}
                <ScrollArea className="h-2/3 p-4">
                  {modules && !loading && (
                    <div className="mt-4">
                      <div className="border-2 border-solid border-[#FE9900] p-4 rounded-3xl shadow-md mb-4 relative cursor-pointer">
                        <div className="flex justify-between items-center space-x-4 mb-3">
                          <div className="top-0 right-0 flex space-x-2">
                            <Button
                              className="bg-[#FE9900] text-white h-7 w-7 hover:bg-black hover:text-[#FE9900]"
                              variant="outline"
                              size="icon"
                              onClick={handleGenerateModuleName}
                            >
                              <FaRegThumbsUp />
                            </Button>
                          </div>
                        </div>
                        <ReactMarkdown className="font-light text-sm md:text-base whitespace-normal prose prose-sm sm:prose" remarkPlugins={[remarkGfm]}>
                          {modules}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isGenerateModuleNameDialogOpen} onOpenChange={setIsGenerateModuleNameDialogOpen}>
            <DialogTrigger asChild>
              <div className="hidden"></div>
            </DialogTrigger>
            <DialogContent className="max-w-sm max-h-screen">
              <DialogHeader>
                <DialogTitle className="font-light text-xl text-[#FE9900]">Approve Module Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 py-2">
                  <div className="flex flex-col items-center gap-4">
                    <Label htmlFor="generatedModuleName" className="text-right">
                      Module Name
                    </Label>
                    <Input
                      id="generatedModuleName"
                      value={generatedModuleName || ''}
                      onChange={(e) => setGeneratedModuleName(e.target.value)}
                      className="text-xs col-span-3 mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
                    />
                    <Label htmlFor="generatedModuleTime" className="text-right">
                      Module Time (minutes)
                    </Label>
                    <Input
                      id="generatedModuleTime"
                      value={generatedModuleTime !== null ? generatedModuleTime.toString() : ''}
                      onChange={(e) => setGeneratedModuleTime(parseInt(e.target.value))}
                      type="number"
                      className="text-xs col-span-3 mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
                    />
                  </div>
                </div>
                <DialogFooter className="flex justify-center items-center">
                  <Button
                    onClick={handleApprove}
                    className="text-sm w-2/5 rounded-3xl bg-gradient-to-r from-[#FF7A01] to-[#FE9900] hover:from-black hover:to-black hover:text-[#FE9900]"
                  >
                    Approve <FaRegThumbsUp className="h-4" size="icon" />
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="h-5/6 p-4 ">
          {approvedModules.length > 0 ? (
            <Accordion type="single" collapsible className="w-full mt-4">
              {approvedModules.map((module, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="decoration-[#FEB800] border-2 border-solid border-[#FE9900] p-4 rounded-3xl shadow-md mb-4 cursor-pointer  space-x-4">
                    <div className='flex items-center justify-start space-x-4'>
                      <h2 className="text-left text-xl font-normal text-[#D67A00]">{module.moduleName}</h2>
                      <div className=" flex justify-end space-x-2 items-center">
                        <Button
                          className="bg-[#FE9900] text-white h-7 w-7 hover:bg-black hover:text-[#FE9900]"
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(index);
                          }}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          className="bg-[#FE9900] text-white h-7 w-7 hover:bg-black hover:text-[#FE9900]"
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(index);
                          }}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="font-light text-sm md:text-base whitespace-normal prose prose-sm sm:prose border-2 border-solid border-[#FE9900] p-4 rounded-3xl shadow-md mb-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {module.moduleContent}
                    </ReactMarkdown>
                    <p className="text-gray-600 text-sm">Estimated Time: {module.moduleTime} minutes</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="w-full h-1/2 flex flex-col justify-end items-center text-center text-xl text-[#FE9900] mt-4">
              <img src='/missing.png' alt='missing' className='h-24'></img>
              <h2 className='w-1/2'>There are currently no chapters in this area. Please create or generate one. </h2>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="hidden md:block mt-4 md:w-1/2 h-[450px] md:h-screen border-l-2 border-dashed border-[#FEAC1C]">
        <ScrollArea className="h-[450px] md:h-screen p-4">
          <Input
            id="chapterName"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            className="text-xs col-span-3 mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
            required
          />
          <Textarea
            id="chapterObjective"
            value={chapterObjective}
            onChange={(e) => setChapterObjective(e.target.value)}
            className="text-xs col-span-3 mb-4 rounded-xl border-2 border-[#FE9900] font-normal"
            required
          />
          <div className="flex space-x-4">
            <Button
              onClick={handleGenerate}
              className="text-sm w-2/5 rounded-3xl bg-gradient-to-r from-[#FF7A01] to-[#FE9900] hover:from-black hover:to-black hover:text-[#FE9900]"
            >
              {approvedModules.length ? 'Generate More Modules' : 'Generate Modules'} <Sparkles className="ml-2" size="icon" />
            </Button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center mt-8 md:mt-52">
              <LoadingBar progress={progress} />
            </div>
          ) : (
            modules && (
              <div className="mt-4">
                <div className="border-2 border-solid border-[#FE9900] p-4 rounded-3xl shadow-md mb-4 relative cursor-pointer">
                  <div className="flex justify-between items-center space-x-4 mb-3">
                    <h2 className="text-xl font-normal text-[#D67A00]">{generatedModuleName}</h2>
                    <div className="top-0 right-0 flex space-x-2">
                      <Button
                        className="bg-[#FE9900] text-white h-7 w-7 hover:bg-black hover:text-[#FE9900]"
                        variant="outline"
                        size="icon"
                        onClick={handleGenerateModuleName}
                      >
                        <FaRegThumbsUp />
                      </Button>
                    </div>
                  </div>
                  <ReactMarkdown className="whitespace-normal prose prose-sm sm:prose font-light text-sm md:text-base" remarkPlugins={[remarkGfm]}>
                    {modules}
                  </ReactMarkdown>
                </div>
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
                  <DialogTitle className="font-normal text-[#FE9900] text-xl">Edit Module</DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">Make changes to the module here. Click save when you&apos;re done.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col justify-center items-start gap-4">
                    <Label htmlFor="moduleName" className="font-semibold text-[#FE9900] text-right">
                      Module Name
                    </Label>
                    <Input
                      id="moduleName"
                      value={editModule.moduleName}
                      onChange={(e) => setEditModule({ ...editModule, moduleName: e.target.value })}
                      className="col-span-3 mb-4 rounded-xl border-2 border-[#FE9900]"
                    />
                  </div>
                  <div className="flex flex-col justify-center items-start gap-4">
                    <Label htmlFor="moduleContent" className="font-semibold text-[#FE9900] text-right">
                      Module Content
                    </Label>
                    <Textarea
                      id="moduleContent"
                      value={editModule.moduleContent}
                      onChange={(e) => setEditModule({ ...editModule, moduleContent: e.target.value })}
                      className="col-span-3 mb-4 rounded-xl border-2 border-[#FE9900]"
                    />
                  </div>
                  <div className="flex flex-col justify-center items-start gap-4">
                    <Label htmlFor="moduleTime" className="font-semibold text-[#FE9900] text-right">
                      Module Time in minutes
                    </Label>
                    <Input
                      id="moduleTime"
                      value={editModule.moduleTime.toString()} 
                      onChange={(e) => setEditModule({ ...editModule, moduleTime: parseInt(e.target.value) })}
                      className="col-span-3 mb-4 rounded-xl border-2 border-[#FE9900]"
                      type="number"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button className='bg-gradient-to-r from-[#FF7A01] to-[#FE9900] rounded-lg hover:from-black hover:to-black hover:text-[#FE9900]' type="button" onClick={handleSave}>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Module;
