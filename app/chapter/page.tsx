"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

function ChapterModuleForm() {
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [chapters, setChapters] = useState<any[]>([]);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<any | null>(null);
  const [editingChapter, setEditingChapter] = useState<any | null>(null);
  const [isCreateChapterDialogOpen, setIsCreateChapterDialogOpen] = useState<boolean>(false);
  const [isCreateModuleDialogOpen, setIsCreateModuleDialogOpen] = useState<boolean>(false);
  const [isEditModuleDialogOpen, setIsEditModuleDialogOpen] = useState<boolean>(false);
  const [isEditChapterDialogOpen, setIsEditChapterDialogOpen] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch("/api/chapters");
        const data = await response.json();
        setChapters(data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, []);

  const handleCreateChapterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUploading(true);
    setError("");

    // Prepare form data for submission
    const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
    const chapterName = formDataSubmit.get("chapterName") as string;
    const objective = formDataSubmit.get("objective") as string;
    const score = formDataSubmit.get("score") ? parseInt(formDataSubmit.get("score") as string, 10) : null;

    // Submit the form data
    try {
      const response = await fetch("/api/chapters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapterName,
          objective,
          score,
        }),
      });

      if (response.ok) {
        setError("");
        const newChapter = await response.json();
        setChapters((prevChapters) => [...prevChapters, newChapter]);
        formRef.current?.reset();
        setIsCreateChapterDialogOpen(false);
      } else {
        const responseData = await response.json();
        setError(responseData.message || "Error creating chapter.");
      }
    } catch (error) {
      console.error(error);
      setError("Error, try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleEditChapterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUploading(true);
    setError("");

    // Prepare form data for submission
    const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
    const chapterName = formDataSubmit.get("chapterName") as string;
    const objective = formDataSubmit.get("objective") as string;
    const score = formDataSubmit.get("score") ? parseInt(formDataSubmit.get("score") as string, 10) : null;

    // Submit the form data
    try {
      const response = await fetch("/api/chapters", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapterID: editingChapter?.chapterID,
          chapterName,
          objective,
          score,
        }),
      });

      if (response.ok) {
        setError("");
        const updatedChapter = await response.json();
        setChapters((prevChapters) =>
          prevChapters.map((chapter) => (chapter.chapterID === updatedChapter.chapterID ? updatedChapter : chapter))
        );
        formRef.current?.reset();
        setEditingChapter(null);
        setIsEditChapterDialogOpen(false);
      } else {
        const responseData = await response.json();
        setError(responseData.message || "Error updating chapter.");
      }
    } catch (error) {
      console.error(error);
      setError("Error, try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateModuleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUploading(true);
    setError("");

    // Prepare form data for submission
    const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
    const moduleName = formDataSubmit.get("moduleName") as string;
    const moduleType = formDataSubmit.get("moduleType") as string;
    const moduleObjective = formDataSubmit.get("moduleObjective") as string;
    const moduleContent = formDataSubmit.get("moduleContent") as string;
    const moduleResources = formDataSubmit.get("moduleResources") as string;
    const moduleCriteria = formDataSubmit.get("moduleCriteria") as string;
    const moduleScore = formDataSubmit.get("moduleScore") ? parseInt(formDataSubmit.get("moduleScore") as string, 10) : null;

    // Submit the form data
    try {
      const response = await fetch("/api/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapterID: currentChapterId,
          moduleName,
          moduleType,
          moduleObjective,
          moduleContent,
          moduleResources,
          moduleCriteria,
          moduleScore,
        }),
      });

      if (response.ok) {
        setError("");
        const updatedChapter = await response.json();
        setChapters((prevChapters) =>
          prevChapters.map((chapter) => (chapter.chapterID === updatedChapter.chapterID ? updatedChapter : chapter))
        );
        formRef.current?.reset();
        setIsCreateModuleDialogOpen(false);
      } else {
        const responseData = await response.json();
        setError(responseData.message || "Error creating module.");
      }
    } catch (error) {
      console.error(error);
      setError("Error, try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleEditModuleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUploading(true);
    setError("");

    // Prepare form data for submission
    const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
    const moduleName = formDataSubmit.get("moduleName") as string;
    const moduleType = formDataSubmit.get("moduleType") as string;
    const moduleObjective = formDataSubmit.get("moduleObjective") as string;
    const moduleContent = formDataSubmit.get("moduleContent") as string;
    const moduleResources = formDataSubmit.get("moduleResources") as string;
    const moduleCriteria = formDataSubmit.get("moduleCriteria") as string;
    const moduleScore = formDataSubmit.get("moduleScore") ? parseInt(formDataSubmit.get("moduleScore") as string, 10) : null;

    // Submit the form data
    try {
      const response = await fetch("/api/modules", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleID: editingModule?.moduleID,
          chapterID: currentChapterId,
          moduleName,
          moduleType,
          moduleObjective,
          moduleContent,
          moduleResources,
          moduleCriteria,
          moduleScore,
        }),
      });

      if (response.ok) {
        setError("");
        const updatedChapter = await response.json();
        setChapters((prevChapters) =>
          prevChapters.map((chapter) => (chapter.chapterID === updatedChapter.chapterID ? updatedChapter : chapter))
        );
        formRef.current?.reset();
        setEditingModule(null);
        setIsEditModuleDialogOpen(false);
      } else {
        const responseData = await response.json();
        setError(responseData.message || "Error updating module.");
      }
    } catch (error) {
      console.error(error);
      setError("Error, try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleEditModule = (module: any, chapterID: string) => {
    setEditingModule(module);
    setCurrentChapterId(chapterID);
    setIsEditModuleDialogOpen(true);
  };

  const handleEditChapter = (chapter: any) => {
    setEditingChapter(chapter);
    setIsEditChapterDialogOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen rounded-lg shadow-2xl">
      <div className="bg-white w-full h-fit mx-auto p-8 space-y-8 rounded-xl shadow items-center justify-center text-center">
        <div className="bg-white container mx-auto p-4 h-fit flex flex-col items-center justify-center text-center space-y-4">
          <h1 className="text-4xl text-center font-semibold mb-3">Chapters and Modules</h1>
          <ul className="w-full space-y-4">
            {chapters.map((chapter) => (
              <li key={chapter.chapterID} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">{chapter.chapterName}</h2>
                <p><strong>Objective:</strong> {chapter.objective}</p>
                <p><strong>Score:</strong> {chapter.score}</p>
                <ul className="mt-4">
                  {chapter.modules.map((module) => (
                    <li key={module.moduleID} className="mt-2">
                      <h3 className="text-lg font-semibold">{module.moduleName}</h3>
                      <p><strong>Type:</strong> {module.moduleType}</p>
                      <p><strong>Objective:</strong> {module.moduleObjective}</p>
                      <p><strong>Content:</strong> {module.moduleContent}</p>
                      <p><strong>Resources:</strong> {module.moduleResources}</p>
                      <p><strong>Criteria:</strong> {module.moduleCriteria}</p>
                      <p><strong>Score:</strong> {module.moduleScore}</p>
                      <Button onClick={() => handleEditModule(module, chapter.chapterID)}>Edit Module</Button>
                    </li>
                  ))}
                </ul>
                <Button onClick={() => { setIsCreateModuleDialogOpen(true); setCurrentChapterId(chapter.chapterID); }}>Add Module</Button>
                <Button onClick={() => handleEditChapter(chapter)} className="ml-4">Edit Chapter</Button>
              </li>
            ))}
          </ul>
          <Dialog open={isCreateChapterDialogOpen} onOpenChange={setIsCreateChapterDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Create New Chapter</Button>
            </DialogTrigger>
            <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
              <ScrollArea className="max-h-[80vh] p-6">
                <DialogHeader>
                  <DialogTitle>Create a New Chapter</DialogTitle>
                  <DialogDescription>Fill out the form below to create a new chapter.</DialogDescription>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleCreateChapterSubmit} className="space-y-4">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Chapter Name</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="text"
                      name="chapterName"
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Objective</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="text"
                      name="objective"
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700">Score</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="number"
                      name="score"
                      min={1}
                      max={5}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={uploading}>
                      {uploading ? "Submitting..." : "Submit"}
                    </Button>
                  </DialogFooter>
                  <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditChapterDialogOpen} onOpenChange={setIsEditChapterDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Edit Chapter</Button>
            </DialogTrigger>
            <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
              <ScrollArea className="max-h-[80vh] p-6">
                <DialogHeader>
                  <DialogTitle>Edit Chapter</DialogTitle>
                  <DialogDescription>Fill out the form below to edit the chapter.</DialogDescription>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleEditChapterSubmit} className="space-y-4">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Chapter Name</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="text"
                      name="chapterName"
                      required
                      defaultValue={editingChapter?.chapterName || ""}
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Objective</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="text"
                      name="objective"
                      required
                      defaultValue={editingChapter?.objective || ""}
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700">Score</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="number"
                      name="score"
                      min={1}
                      max={5}
                      defaultValue={editingChapter?.score || ""}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={uploading}>
                      {uploading ? "Submitting..." : "Submit"}
                    </Button>
                  </DialogFooter>
                  <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateModuleDialogOpen} onOpenChange={setIsCreateModuleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Create New Module</Button>
            </DialogTrigger>
            <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
              <ScrollArea className="max-h-[80vh] p-6">
                <DialogHeader>
                  <DialogTitle>Create a New Module</DialogTitle>
                  <DialogDescription>Fill out the form below to create a new module.</DialogDescription>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleCreateModuleSubmit} className="space-y-4">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Module Name</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="text"
                      name="moduleName"
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Module Type</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="text"
                      name="moduleType"
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Module Objective</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="text"
                      name="moduleObjective"
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Module Content</label>
                    <Textarea
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      name="moduleContent"
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Module Resources</label>
                    <Textarea
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      name="moduleResources"
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Module Criteria</label>
                    <Textarea
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      name="moduleCriteria"
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700">Module Score</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="number"
                      name="moduleScore"
                      min={1}
                      max={5}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={uploading}>
                      {uploading ? "Submitting..." : "Submit"}
                    </Button>
                  </DialogFooter>
                  <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditModuleDialogOpen} onOpenChange={() => setIsEditModuleDialogOpen(false)}>
            <DialogTrigger asChild>
              <Button className="mt-4">Edit Module</Button>
            </DialogTrigger>
            <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
              <ScrollArea className="max-h-[80vh] p-6">
                <DialogHeader>
                  <DialogTitle>Edit Module</DialogTitle>
                  <DialogDescription>Fill out the form below to edit the module.</DialogDescription>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleEditModuleSubmit} className="space-y-4">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Module Name</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="text"
                      name="moduleName"
                      required
                      defaultValue={editingModule?.moduleName || ""}
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Module Type</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="text"
                      name="moduleType"
                      required
                      defaultValue={editingModule?.moduleType || ""}
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Module Objective</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="text"
                      name="moduleObjective"
                      required
                      defaultValue={editingModule?.moduleObjective || ""}
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Module Content</label>
                    <Textarea
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      name="moduleContent"
                      required
                      defaultValue={editingModule?.moduleContent || ""}
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Module Resources</label>
                    <Textarea
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      name="moduleResources"
                      required
                      defaultValue={editingModule?.moduleResources || ""}
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Module Criteria</label>
                    <Textarea
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      name="moduleCriteria"
                      required
                      defaultValue={editingModule?.moduleCriteria || ""}
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700">Module Score</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="number"
                      name="moduleScore"
                      min={1}
                      max={5}
                      defaultValue={editingModule?.moduleScore || ""}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={uploading}>
                      {uploading ? "Submitting..." : "Submit"}
                    </Button>
                  </DialogFooter>
                  <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default ChapterModuleForm;
