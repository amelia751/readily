"use client";
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaEdit, FaTrash, FaRegThumbsUp } from 'react-icons/fa';
import { LoadingSpinner } from '@/components/ui/spinner';

const Module = () => {
  const [modules, setModules] = useState<any[] | null>(null);
  const [approvedModules, setApprovedModules] = useState<any[]>([]);
  const [useCase, setUseCase] = useState<string>('');
  const [areaName, setAreaName] = useState<string>('');
  const [areaDescription, setAreaDescription] = useState<string>('');
  const [chapterName, setChapterName] = useState<string>('');
  const [chapterObjective, setChapterObjective] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editModule, setEditModule] = useState({ moduleID: '', moduleName: '', moduleContent: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateModuleDialogOpen, setIsCreateModuleDialogOpen] = useState<boolean>(false);
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
    try {
      const res = await fetch('/api/generateModules', {
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
          approvedModules 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setModules(data);
      } else {
        setError(data.error || 'An error occurred while generating content.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while generating content.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleGenerateMore = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/moreModules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ useCase, areaName, areaDescription, chapterName, chapterObjective, approvedModules }),
      });
      const data = await res.json();
      if (res.ok) {
        setModules(data);
      } else {
        setError(data.error || 'An error occurred while generating more content.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while generating more content.');
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
        setApprovedModules(prevApprovedModules => prevApprovedModules.filter((_, i) => i !== index));
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
    const { moduleID, moduleName, moduleContent } = editModule;
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
        body: JSON.stringify({ moduleName, moduleContent }),
      });
      if (res.ok) {
        setApprovedModules(prevApprovedModules => prevApprovedModules.map((module, i) => (i === editIndex ? editModule : module)));
        setEditIndex(null);
        setEditModule({ moduleID: '', moduleName: '', moduleContent: '' });
      } else {
        setError('An error occurred while saving the module.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while saving the module.');
    }
  };

  const handleApprove = async (index: number) => {
    const approvedModule = modules[index];
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
          moduleName: approvedModule.moduleName,
          moduleContent: approvedModule.moduleContent,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setApprovedModules(prevApproved => [...prevApproved, data]);
        setModules(prevModules => prevModules.filter((_, i) => i !== index));
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

  const handleCreateModuleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
    const moduleName = formDataSubmit.get("moduleName") as string;
    const moduleContent = formDataSubmit.get("moduleContent") as string;
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
      setError("Error, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:space-x-5 justify-center items-between">
      <div className='md:w-1/2'>
        <ScrollArea className="h-[450px] md:h-screen p-4 border border-gray-200 rounded-lg">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="useCase" className="text-right">
                Use Case
              </Label>
              <Input
                id="useCase"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="areaName" className="text-right">
                Area Name
              </Label>
              <Input
                id="areaName"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="areaDescription" className="text-right">
                Area Description
              </Label>
              <Textarea
                id="areaDescription"
                value={areaDescription}
                onChange={(e) => setAreaDescription(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="chapterName" className="text-right">
                Chapter Name
              </Label>
              <Input
                id="chapterName"
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="chapterObjective" className="text-right">
                Chapter Objective
              </Label>
              <Textarea
                id="chapterObjective"
                value={chapterObjective}
                onChange={(e) => setChapterObjective(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleGenerate}>Generate Modules</Button>
            <Button onClick={handleGenerateMore}>Generate More</Button>
          </div>
          {error && <p className="text-red-600 mt-4">{error}</p>}
          {loading ? (
            <div className="flex justify-center items-center mt-8 md:mt-52">
              <LoadingSpinner />
            </div>
          ) : (
            modules && (
              <div className="mt-4">
                <h2 className="text-2xl font-semibold">Generated Modules</h2>
                {modules.map((module, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 relative">
                    <div className='flex justify-between items-center space-x-4 mb-3'>
                      <h2 className="text-xl font-semibold">{module.moduleName}</h2>
                      <div className="top-0 right-0 flex space-x-2">
                        <Button className='bg-transparent border-none hover:bg-white' variant="outline" size="icon" onClick={() => handleApprove(index)}>
                          <FaRegThumbsUp />
                        </Button>
                      </div>
                    </div>
                    <p>{module.moduleContent}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </ScrollArea>
      </div>

      <div className='md:w-1/2'>
        <ScrollArea className="h-[450px] md:h-screen p-4 border border-gray-200 rounded-lg">
          <h2 className="text-2xl font-semibold">Approved Modules</h2>
          <Dialog open={isCreateModuleDialogOpen} onOpenChange={setIsCreateModuleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Create New Module</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a New Module</DialogTitle>
                <DialogDescription>Fill out the form below to create a new module.</DialogDescription>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleCreateModuleSubmit} className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="moduleName" className="text-right">
                      Module Name
                    </Label>
                    <Input
                      id="moduleName"
                      name="moduleName"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="moduleContent" className="text-right">
                      Module Content
                    </Label>
                    <Textarea
                      id="moduleContent"
                      name="moduleContent"
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </DialogFooter>
                <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
              </form>
            </DialogContent>
          </Dialog>
          {approvedModules.length > 0 && (
            <div className="mt-4">
              {approvedModules.map((module, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 relative">
                  <div className='flex justify-between items-center space-x-4 mb-3'>
                    <h2 className="text-xl font-semibold">{module.moduleName}</h2>
                    <div className=" flex space-x-2 top-0 right-0 items-start">
                      <Button className='bg-transparent border-none hover:bg-white' variant="outline" size="icon" onClick={() => handleEdit(index)}>
                        <FaEdit />
                      </Button>
                      <Button className='bg-transparent border-none hover:bg-white' variant="outline" size="icon" onClick={() => handleDelete(index)}>
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                  <p>{module.moduleContent}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {editIndex !== null && (
        <Dialog open={editIndex !== null} onOpenChange={() => setEditIndex(null)}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Module</DialogTitle>
              <DialogDescription>
                Make changes to the module here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="moduleName" className="text-right">
                  Module Name
                </Label>
                <Input
                  id="moduleName"
                  value={editModule.moduleName}
                  onChange={(e) => setEditModule({ ...editModule, moduleName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="moduleContent" className="text-right">
                  Module Content
                </Label>
                <Textarea
                  id="moduleContent"
                  value={editModule.moduleContent}
                  onChange={(e) => setEditModule({ ...editModule, moduleContent: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Module;
