// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";

// function ChapterModuleForm() {
//   const [error, setError] = useState<string>("");
//   const [uploading, setUploading] = useState<boolean>(false);
//   const [roadmaps, setRoadmaps] = useState<any[]>([]);
//   const [keyAreas, setKeyAreas] = useState<any[]>([]);
//   const [currentRoadmapId, setCurrentRoadmapId] = useState<string | null>(null);
//   const [currentAreaId, setCurrentAreaId] = useState<string | null>(null);
//   const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
//   const [editingModule, setEditingModule] = useState<any | null>(null);
//   const [editingChapter, setEditingChapter] = useState<any | null>(null);
//   const [isCreateRoadmapDialogOpen, setIsCreateRoadmapDialogOpen] = useState<boolean>(false);
//   const [isCreateKeyAreaDialogOpen, setIsCreateKeyAreaDialogOpen] = useState<boolean>(false);
//   const [isCreateChapterDialogOpen, setIsCreateChapterDialogOpen] = useState<boolean>(false);
//   const [isCreateModuleDialogOpen, setIsCreateModuleDialogOpen] = useState<boolean>(false);
//   const [isEditModuleDialogOpen, setIsEditModuleDialogOpen] = useState<boolean>(false);
//   const [isEditChapterDialogOpen, setIsEditChapterDialogOpen] = useState<boolean>(false);
//   const formRef = useRef<HTMLFormElement>(null);
//   const router = useRouter();
//   const { data: session } = useSession();

//   useEffect(() => {
//     const fetchRoadmaps = async () => {
//       try {
//         const response = await fetch("/api/roadmaps");
//         const data = await response.json();
//         setRoadmaps(data);
//       } catch (error) {
//         console.error("Error fetching roadmaps:", error);
//       }
//     };

//     fetchRoadmaps();
//   }, []);

//   const handleCreateRoadmapSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setUploading(true);
//     setError("");

//     const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
//     const useCase = formDataSubmit.get("useCase") as string;
//     const published = formDataSubmit.get("published") === "true";

//     try {
//       const response = await fetch("/api/roadmaps", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           useCase,
//           published,
//         }),
//       });

//       if (response.ok) {
//         setError("");
//         const newRoadmap = await response.json();
//         setRoadmaps((prevRoadmaps) => [...prevRoadmaps, newRoadmap]);
//         formRef.current?.reset();
//         setIsCreateRoadmapDialogOpen(false);
//       } else {
//         const responseData = await response.json();
//         setError(responseData.message || "Error creating roadmap.");
//       }
//     } catch (error) {
//       console.error(error);
//       setError("Error, try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleCreateKeyAreaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setUploading(true);
//     setError("");

//     const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
//     const areaName = formDataSubmit.get("areaName") as string;

//     try {
//       const response = await fetch("/api/keyareas", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           roadmapID: currentRoadmapId,
//           areaName,
//         }),
//       });

//       if (response.ok) {
//         setError("");
//         const updatedRoadmap = await response.json();
//         setRoadmaps((prevRoadmaps) =>
//           prevRoadmaps.map((roadmap) => (roadmap.mapID === updatedRoadmap.mapID ? updatedRoadmap : roadmap))
//         );
//         formRef.current?.reset();
//         setIsCreateKeyAreaDialogOpen(false);
//       } else {
//         const responseData = await response.json();
//         setError(responseData.message || "Error creating key area.");
//       }
//     } catch (error) {
//       console.error(error);
//       setError("Error, try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleCreateChapterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setUploading(true);
//     setError("");

//     const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
//     const chapterName = formDataSubmit.get("chapterName") as string;
//     const objective = formDataSubmit.get("objective") as string;
//     const score = formDataSubmit.get("score") ? parseInt(formDataSubmit.get("score") as string, 10) : null;

//     try {
//       const response = await fetch("/api/chapters", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           roadmapID: currentRoadmapId,
//           areaID: currentAreaId,
//           chapterName,
//           objective,
//           score,
//         }),
//       });

//       if (response.ok) {
//         setError("");
//         const updatedRoadmap = await response.json();
//         setRoadmaps((prevRoadmaps) =>
//           prevRoadmaps.map((roadmap) => (roadmap.mapID === updatedRoadmap.mapID ? updatedRoadmap : roadmap))
//         );
//         formRef.current?.reset();
//         setIsCreateChapterDialogOpen(false);
//       } else {
//         const responseData = await response.json();
//         setError(responseData.message || "Error creating chapter.");
//       }
//     } catch (error) {
//       console.error(error);
//       setError("Error, try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleEditChapterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setUploading(true);
//     setError("");

//     const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
//     const chapterName = formDataSubmit.get("chapterName") as string;
//     const objective = formDataSubmit.get("objective") as string;
//     const score = formDataSubmit.get("score") ? parseInt(formDataSubmit.get("score") as string, 10) : null;

//     try {
//       const response = await fetch("/api/chapters", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           chapterID: editingChapter?.chapterID,
//           areaID: currentAreaId,
//           roadmapID: currentRoadmapId,
//           chapterName,
//           objective,
//           score,
//         }),
//       });

//       if (response.ok) {
//         setError("");
//         const updatedRoadmap = await response.json();
//         setRoadmaps((prevRoadmaps) =>
//           prevRoadmaps.map((roadmap) => (roadmap.mapID === updatedRoadmap.mapID ? updatedRoadmap : roadmap))
//         );
//         formRef.current?.reset();
//         setEditingChapter(null);
//         setIsEditChapterDialogOpen(false);
//       } else {
//         const responseData = await response.json();
//         setError(responseData.message || "Error updating chapter.");
//       }
//     } catch (error) {
//       console.error(error);
//       setError("Error, try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleCreateModuleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setUploading(true);
//     setError("");

//     const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
//     const moduleName = formDataSubmit.get("moduleName") as string;
//     const moduleType = formDataSubmit.get("moduleType") as string;
//     const moduleObjective = formDataSubmit.get("moduleObjective") as string;
//     const moduleContent = formDataSubmit.get("moduleContent") as string;
//     const moduleResources = formDataSubmit.get("moduleResources") as string;
//     const moduleCriteria = formDataSubmit.get("moduleCriteria") as string;
//     const moduleScore = formDataSubmit.get("moduleScore") ? parseInt(formDataSubmit.get("moduleScore") as string, 10) : null;

//     try {
//       const response = await fetch("/api/modules", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           roadmapID: currentRoadmapId,
//           areaID: currentAreaId,
//           chapterID: currentChapterId,
//           moduleName,
//           moduleType,
//           moduleObjective,
//           moduleContent,
//           moduleResources,
//           moduleCriteria,
//           moduleScore,
//         }),
//       });

//       if (response.ok) {
//         setError("");
//         const updatedRoadmap = await response.json();
//         setRoadmaps((prevRoadmaps) =>
//           prevRoadmaps.map((roadmap) => (roadmap.mapID === updatedRoadmap.mapID ? updatedRoadmap : roadmap))
//         );
//         formRef.current?.reset();
//         setIsCreateModuleDialogOpen(false);
//       } else {
//         const responseData = await response.json();
//         setError(responseData.message || "Error creating module.");
//       }
//     } catch (error) {
//       console.error(error);
//       setError("Error, try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleEditModuleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setUploading(true);
//     setError("");

//     const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
//     const moduleName = formDataSubmit.get("moduleName") as string;
//     const moduleType = formDataSubmit.get("moduleType") as string;
//     const moduleObjective = formDataSubmit.get("moduleObjective") as string;
//     const moduleContent = formDataSubmit.get("moduleContent") as string;
//     const moduleResources = formDataSubmit.get("moduleResources") as string;
//     const moduleCriteria = formDataSubmit.get("moduleCriteria") as string;
//     const moduleScore = formDataSubmit.get("moduleScore") ? parseInt(formDataSubmit.get("moduleScore") as string, 10) : null;

//     try {
//       const response = await fetch("/api/modules", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           moduleID: editingModule?.moduleID,
//           roadmapID: currentRoadmapId,
//           areaID: currentAreaId,
//           chapterID: currentChapterId,
//           moduleName,
//           moduleType,
//           moduleObjective,
//           moduleContent,
//           moduleResources,
//           moduleCriteria,
//           moduleScore,
//         }),
//       });

//       if (response.ok) {
//         setError("");
//         const updatedRoadmap = await response.json();
//         setRoadmaps((prevRoadmaps) =>
//           prevRoadmaps.map((roadmap) => (roadmap.mapID === updatedRoadmap.mapID ? updatedRoadmap : roadmap))
//         );
//         formRef.current?.reset();
//         setEditingModule(null);
//         setIsEditModuleDialogOpen(false);
//       } else {
//         const responseData = await response.json();
//         setError(responseData.message || "Error updating module.");
//       }
//     } catch (error) {
//       console.error(error);
//       setError("Error, try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleEditModule = (module: any, chapterID: string, areaID: string) => {
//     setEditingModule(module);
//     setCurrentChapterId(chapterID);
//     setCurrentAreaId(areaID);
//     setIsEditModuleDialogOpen(true);
//   };

//   const handleEditChapter = (chapter: any, areaID: string) => {
//     setEditingChapter(chapter);
//     setCurrentAreaId(areaID);
//     setIsEditChapterDialogOpen(true);
//   };

//   const handleCreateChapter = (areaID: string) => {
//     setCurrentAreaId(areaID);
//     setIsCreateChapterDialogOpen(true);
//   };

//   const handleCreateModule = (areaID: string, chapterID: string) => {
//     setCurrentAreaId(areaID);
//     setCurrentChapterId(chapterID);
//     setIsCreateModuleDialogOpen(true);
//   };

//   return (
//     <div className="flex flex-col items-center justify-start min-h-screen rounded-lg shadow-2xl">
//       <div className="bg-white w-full h-fit mx-auto p-8 space-y-8 rounded-xl shadow items-center justify-center text-center">
//         <div className="bg-white container mx-auto p-4 h-fit flex flex-col items-center justify-center text-center space-y-4">
//           <h1 className="text-4xl text-center font-semibold mb-3">Roadmaps, Key Areas, Chapters, and Modules</h1>
//           <ul className="w-full space-y-4">
//             {roadmaps.map((roadmap) => (
//               <li key={roadmap.mapID} className="bg-gray-100 p-4 rounded-lg shadow-md">
//                 <h2 className="text-xl font-semibold">{roadmap.useCase}</h2>
//                 <ul className="mt-4">
//                   {roadmap.keyAreas.map((keyArea) => (
//                     <li key={keyArea.areaID} className="bg-white p-4 rounded-lg shadow-md mb-4">
//                       <h3 className="text-lg font-semibold">{keyArea.areaName}</h3>
//                       <ul className="mt-4">
//                         {keyArea.chapters.map((chapter) => (
//                           <li key={chapter.chapterID} className="bg-white p-4 rounded-lg shadow-md mb-4">
//                             <h4 className="text-md font-semibold">{chapter.chapterName}</h4>
//                             <p><strong>Objective:</strong> {chapter.objective}</p>
//                             <p><strong>Score:</strong> {chapter.score}</p>
//                             <ul className="mt-4">
//                               {chapter.modules.map((module) => (
//                                 <li key={module.moduleID} className="mt-2">
//                                   <h5 className="text-sm font-semibold">{module.moduleName}</h5>
//                                   <p><strong>Type:</strong> {module.moduleType}</p>
//                                   <p><strong>Objective:</strong> {module.moduleObjective}</p>
//                                   <p><strong>Content:</strong> {module.moduleContent}</p>
//                                   <p><strong>Resources:</strong> {module.moduleResources}</p>
//                                   <p><strong>Criteria:</strong> {module.moduleCriteria}</p>
//                                   <p><strong>Score:</strong> {module.moduleScore}</p>
//                                   <Button onClick={() => handleEditModule(module, chapter.chapterID, keyArea.areaID)}>Edit Module</Button>
//                                 </li>
//                               ))}
//                             </ul>
//                             <Button onClick={() => handleCreateModule(keyArea.areaID, chapter.chapterID)}>Add Module</Button>
//                             <Button onClick={() => handleEditChapter(chapter, keyArea.areaID)} className="ml-4">Edit Chapter</Button>
//                           </li>
//                         ))}
//                       </ul>
//                       <Button onClick={() => handleCreateChapter(keyArea.areaID)}>Add Chapter</Button>
//                     </li>
//                   ))}
//                 </ul>
//                 <Button onClick={() => setCurrentRoadmapId(roadmap.mapID) || setIsCreateKeyAreaDialogOpen(true)}>Add Key Area</Button>
//               </li>
//             ))}
//           </ul>
//           <Dialog open={isCreateRoadmapDialogOpen} onOpenChange={setIsCreateRoadmapDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="mt-4">Create New Roadmap</Button>
//             </DialogTrigger>
//             <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
//               <ScrollArea className="max-h-[80vh] p-6">
//                 <DialogHeader>
//                   <DialogTitle>Create a New Roadmap</DialogTitle>
//                   <DialogDescription>Fill out the form below to create a new roadmap.</DialogDescription>
//                 </DialogHeader>
//                 <form ref={formRef} onSubmit={handleCreateRoadmapSubmit} className="space-y-4">
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Use Case</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="text"
//                       name="useCase"
//                       required
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Published</label>
//                     <select
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       name="published"
//                       required
//                     >
//                       <option value="true">True</option>
//                       <option value="false">False</option>
//                     </select>
//                   </div>
//                   <DialogFooter>
//                     <Button type="submit" disabled={uploading}>
//                       {uploading ? "Submitting..." : "Submit"}
//                     </Button>
//                   </DialogFooter>
//                   <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
//                 </form>
//               </ScrollArea>
//             </DialogContent>
//           </Dialog>
//           <Dialog open={isCreateKeyAreaDialogOpen} onOpenChange={setIsCreateKeyAreaDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="mt-4">Create New Key Area</Button>
//             </DialogTrigger>
//             <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
//               <ScrollArea className="max-h-[80vh] p-6">
//                 <DialogHeader>
//                   <DialogTitle>Create a New Key Area</DialogTitle>
//                   <DialogDescription>Fill out the form below to create a new key area.</DialogDescription>
//                 </DialogHeader>
//                 <form ref={formRef} onSubmit={handleCreateKeyAreaSubmit} className="space-y-4">
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Key Area Name</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="text"
//                       name="areaName"
//                       required
//                     />
//                   </div>
//                   <DialogFooter>
//                     <Button type="submit" disabled={uploading}>
//                       {uploading ? "Submitting..." : "Submit"}
//                     </Button>
//                   </DialogFooter>
//                   <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
//                 </form>
//               </ScrollArea>
//             </DialogContent>
//           </Dialog>
//           <Dialog open={isCreateChapterDialogOpen} onOpenChange={setIsCreateChapterDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="mt-4">Create New Chapter</Button>
//             </DialogTrigger>
//             <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
//               <ScrollArea className="max-h-[80vh] p-6">
//                 <DialogHeader>
//                   <DialogTitle>Create a New Chapter</DialogTitle>
//                   <DialogDescription>Fill out the form below to create a new chapter.</DialogDescription>
//                 </DialogHeader>
//                 <form ref={formRef} onSubmit={handleCreateChapterSubmit} className="space-y-4">
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Chapter Name</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="text"
//                       name="chapterName"
//                       required
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Objective</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="text"
//                       name="objective"
//                       required
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700">Score</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="number"
//                       name="score"
//                       min={1}
//                       max={5}
//                     />
//                   </div>
//                   <DialogFooter>
//                     <Button type="submit" disabled={uploading}>
//                       {uploading ? "Submitting..." : "Submit"}
//                     </Button>
//                   </DialogFooter>
//                   <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
//                 </form>
//               </ScrollArea>
//             </DialogContent>
//           </Dialog>
//           <Dialog open={isEditChapterDialogOpen} onOpenChange={setIsEditChapterDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="mt-4">Edit Chapter</Button>
//             </DialogTrigger>
//             <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
//               <ScrollArea className="max-h-[80vh] p-6">
//                 <DialogHeader>
//                   <DialogTitle>Edit Chapter</DialogTitle>
//                   <DialogDescription>Fill out the form below to edit the chapter.</DialogDescription>
//                 </DialogHeader>
//                 <form ref={formRef} onSubmit={handleEditChapterSubmit} className="space-y-4">
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Chapter Name</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="text"
//                       name="chapterName"
//                       required
//                       defaultValue={editingChapter?.chapterName || ""}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Objective</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="text"
//                       name="objective"
//                       required
//                       defaultValue={editingChapter?.objective || ""}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700">Score</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="number"
//                       name="score"
//                       min={1}
//                       max={5}
//                       defaultValue={editingChapter?.score || ""}
//                     />
//                   </div>
//                   <DialogFooter>
//                     <Button type="submit" disabled={uploading}>
//                       {uploading ? "Submitting..." : "Submit"}
//                     </Button>
//                   </DialogFooter>
//                   <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
//                 </form>
//               </ScrollArea>
//             </DialogContent>
//           </Dialog>
//           <Dialog open={isCreateModuleDialogOpen} onOpenChange={setIsCreateModuleDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="mt-4">Create New Module</Button>
//             </DialogTrigger>
//             <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
//               <ScrollArea className="max-h-[80vh] p-6">
//                 <DialogHeader>
//                   <DialogTitle>Create a New Module</DialogTitle>
//                   <DialogDescription>Fill out the form below to create a new module.</DialogDescription>
//                 </DialogHeader>
//                 <form ref={formRef} onSubmit={handleCreateModuleSubmit} className="space-y-4">
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Name</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="text"
//                       name="moduleName"
//                       required
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Type</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="text"
//                       name="moduleType"
//                       required
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Objective</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="text"
//                       name="moduleObjective"
//                       required
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Content</label>
//                     <Textarea
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       name="moduleContent"
//                       required
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Resources</label>
//                     <Textarea
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       name="moduleResources"
//                       required
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Criteria</label>
//                     <Textarea
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       name="moduleCriteria"
//                       required
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700">Module Score</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="number"
//                       name="moduleScore"
//                       min={1}
//                       max={5}
//                     />
//                   </div>
//                   <DialogFooter>
//                     <Button type="submit" disabled={uploading}>
//                       {uploading ? "Submitting..." : "Submit"}
//                     </Button>
//                   </DialogFooter>
//                   <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
//                 </form>
//               </ScrollArea>
//             </DialogContent>
//           </Dialog>
//           <Dialog open={isEditModuleDialogOpen} onOpenChange={setIsEditModuleDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="mt-4">Edit Module</Button>
//             </DialogTrigger>
//             <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
//               <ScrollArea className="max-h-[80vh] p-6">
//                 <DialogHeader>
//                   <DialogTitle>Edit Module</DialogTitle>
//                   <DialogDescription>Fill out the form below to edit the module.</DialogDescription>
//                 </DialogHeader>
//                 <form ref={formRef} onSubmit={handleEditModuleSubmit} className="space-y-4">
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Name</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="text"
//                       name="moduleName"
//                       required
//                       defaultValue={editingModule?.moduleName || ""}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Type</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="text"
//                       name="moduleType"
//                       required
//                       defaultValue={editingModule?.moduleType || ""}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Objective</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="text"
//                       name="moduleObjective"
//                       required
//                       defaultValue={editingModule?.moduleObjective || ""}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Content</label>
//                     <Textarea
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       name="moduleContent"
//                       required
//                       defaultValue={editingModule?.moduleContent || ""}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Resources</label>
//                     <Textarea
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       name="moduleResources"
//                       required
//                       defaultValue={editingModule?.moduleResources || ""}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Criteria</label>
//                     <Textarea
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       name="moduleCriteria"
//                       required
//                       defaultValue={editingModule?.moduleCriteria || ""}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700">Module Score</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="number"
//                       name="moduleScore"
//                       min={1}
//                       max={5}
//                       defaultValue={editingModule?.moduleScore || ""}
//                     />
//                   </div>
//                   <DialogFooter>
//                     <Button type="submit" disabled={uploading}>
//                       {uploading ? "Submitting..." : "Submit"}
//                     </Button>
//                   </DialogFooter>
//                   <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
//                 </form>
//               </ScrollArea>
//             </DialogContent>
//           </Dialog>
//           <Dialog open={isCreateModuleDialogOpen} onOpenChange={setIsCreateModuleDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="mt-4">Create New Module</Button>
//             </DialogTrigger>
//             <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
//               <ScrollArea className="max-h-[80vh] p-6">
//                 <DialogHeader>
//                   <DialogTitle>Create a New Module</DialogTitle>
//                   <DialogDescription>Fill out the form below to create a new module.</DialogDescription>
//                 </DialogHeader>
//                 <form ref={formRef} onSubmit={handleCreateModuleSubmit} className="space-y-4">
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Name</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="text"
//                       name="moduleName"
//                       required
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Type</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="text"
//                       name="moduleType"
//                       required
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Objective</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="text"
//                       name="moduleObjective"
//                       required
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Content</label>
//                     <Textarea
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       name="moduleContent"
//                       required
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Resources</label>
//                     <Textarea
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       name="moduleResources"
//                       required
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700 required">Module Criteria</label>
//                     <Textarea
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       name="moduleCriteria"
//                       required
//                     />
//                   </div>
//                   <div className="text-left">
//                     <label className="block text-sm font-medium text-gray-700">Module Score</label>
//                     <Input
//                       className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
//                       type="number"
//                       name="moduleScore"
//                       min={1}
//                       max={5}
//                     />
//                   </div>
//                   <DialogFooter>
//                     <Button type="submit" disabled={uploading}>
//                       {uploading ? "Submitting..." : "Submit"}
//                     </Button>
//                   </DialogFooter>
//                   <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
//                 </form>
//               </ScrollArea>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChapterModuleForm;


"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

function ChapterModuleForm() {
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [keyAreas, setKeyAreas] = useState<any[]>([]);
  const [currentRoadmapId, setCurrentRoadmapId] = useState<string | null>(null);
  const [currentAreaId, setCurrentAreaId] = useState<string | null>(null);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<any | null>(null);
  const [editingChapter, setEditingChapter] = useState<any | null>(null);
  const [isCreateRoadmapDialogOpen, setIsCreateRoadmapDialogOpen] = useState<boolean>(false);
  const [isCreateKeyAreaDialogOpen, setIsCreateKeyAreaDialogOpen] = useState<boolean>(false);
  const [isCreateChapterDialogOpen, setIsCreateChapterDialogOpen] = useState<boolean>(false);
  const [isCreateModuleDialogOpen, setIsCreateModuleDialogOpen] = useState<boolean>(false);
  const [isEditModuleDialogOpen, setIsEditModuleDialogOpen] = useState<boolean>(false);
  const [isEditChapterDialogOpen, setIsEditChapterDialogOpen] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await fetch("/api/roadmaps");
        const data = await response.json();
        setRoadmaps(data);
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
      }
    };

    fetchRoadmaps();
  }, []);

  const handleCreateRoadmapSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUploading(true);
    setError("");

    const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
    const useCase = formDataSubmit.get("useCase") as string;
    const published = formDataSubmit.get("published") === "true";
    const email = session?.user?.email;

    try {
      const response = await fetch("/api/roadmaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          useCase,
          published,
          creator: email,
        }),
      });

      if (response.ok) {
        setError("");
        const newRoadmap = await response.json();
        setRoadmaps((prevRoadmaps) => [...prevRoadmaps, newRoadmap]);
        formRef.current?.reset();
        setIsCreateRoadmapDialogOpen(false);
      } else {
        const responseData = await response.json();
        setError(responseData.message || "Error creating roadmap.");
      }
    } catch (error) {
      console.error(error);
      setError("Error, try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateKeyAreaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUploading(true);
    setError("");

    const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
    const areaName = formDataSubmit.get("areaName") as string;

    try {
      const response = await fetch("/api/keyareas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roadmapID: currentRoadmapId,
          areaName,
        }),
      });

      if (response.ok) {
        setError("");
        const updatedRoadmap = await response.json();
        setRoadmaps((prevRoadmaps) =>
          prevRoadmaps.map((roadmap) => (roadmap.mapID === updatedRoadmap.mapID ? updatedRoadmap : roadmap))
        );
        formRef.current?.reset();
        setIsCreateKeyAreaDialogOpen(false);
      } else {
        const responseData = await response.json();
        setError(responseData.message || "Error creating key area.");
      }
    } catch (error) {
      console.error(error);
      setError("Error, try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateChapterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUploading(true);
    setError("");

    const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
    const chapterName = formDataSubmit.get("chapterName") as string;
    const objective = formDataSubmit.get("objective") as string;
    const score = formDataSubmit.get("score") ? parseInt(formDataSubmit.get("score") as string, 10) : null;

    try {
      const response = await fetch("/api/chapters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roadmapID: currentRoadmapId,
          areaID: currentAreaId,
          chapterName,
          objective,
          score,
        }),
      });

      if (response.ok) {
        setError("");
        const updatedRoadmap = await response.json();
        setRoadmaps((prevRoadmaps) =>
          prevRoadmaps.map((roadmap) => (roadmap.mapID === updatedRoadmap.mapID ? updatedRoadmap : roadmap))
        );
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

    const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
    const chapterName = formDataSubmit.get("chapterName") as string;
    const objective = formDataSubmit.get("objective") as string;
    const score = formDataSubmit.get("score") ? parseInt(formDataSubmit.get("score") as string, 10) : null;

    try {
      const response = await fetch("/api/chapters", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapterID: editingChapter?.chapterID,
          areaID: currentAreaId,
          roadmapID: currentRoadmapId,
          chapterName,
          objective,
          score,
        }),
      });

      if (response.ok) {
        setError("");
        const updatedRoadmap = await response.json();
        setRoadmaps((prevRoadmaps) =>
          prevRoadmaps.map((roadmap) => (roadmap.mapID === updatedRoadmap.mapID ? updatedRoadmap : roadmap))
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

    const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
    const moduleName = formDataSubmit.get("moduleName") as string;
    const moduleType = formDataSubmit.get("moduleType") as string;
    const moduleObjective = formDataSubmit.get("moduleObjective") as string;
    const moduleContent = formDataSubmit.get("moduleContent") as string;
    const moduleResources = formDataSubmit.get("moduleResources") as string;
    const moduleCriteria = formDataSubmit.get("moduleCriteria") as string;
    const moduleScore = formDataSubmit.get("moduleScore") ? parseInt(formDataSubmit.get("moduleScore") as string, 10) : null;

    try {
      const response = await fetch("/api/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roadmapID: currentRoadmapId,
          areaID: currentAreaId,
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
        const updatedRoadmap = await response.json();
        setRoadmaps((prevRoadmaps) =>
          prevRoadmaps.map((roadmap) => (roadmap.mapID === updatedRoadmap.mapID ? updatedRoadmap : roadmap))
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

    const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
    const moduleName = formDataSubmit.get("moduleName") as string;
    const moduleType = formDataSubmit.get("moduleType") as string;
    const moduleObjective = formDataSubmit.get("moduleObjective") as string;
    const moduleContent = formDataSubmit.get("moduleContent") as string;
    const moduleResources = formDataSubmit.get("moduleResources") as string;
    const moduleCriteria = formDataSubmit.get("moduleCriteria") as string;
    const moduleScore = formDataSubmit.get("moduleScore") ? parseInt(formDataSubmit.get("moduleScore") as string, 10) : null;

    try {
      const response = await fetch("/api/modules", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleID: editingModule?.moduleID,
          roadmapID: currentRoadmapId,
          areaID: currentAreaId,
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
        const updatedRoadmap = await response.json();
        setRoadmaps((prevRoadmaps) =>
          prevRoadmaps.map((roadmap) => (roadmap.mapID === updatedRoadmap.mapID ? updatedRoadmap : roadmap))
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

  const handleEditModule = (module: any, chapterID: string, areaID: string) => {
    setEditingModule(module);
    setCurrentChapterId(chapterID);
    setCurrentAreaId(areaID);
    setIsEditModuleDialogOpen(true);
  };

  const handleEditChapter = (chapter: any, areaID: string) => {
    setEditingChapter(chapter);
    setCurrentAreaId(areaID);
    setIsEditChapterDialogOpen(true);
  };

  const handleCreateChapter = (areaID: string) => {
    setCurrentAreaId(areaID);
    setIsCreateChapterDialogOpen(true);
  };

  const handleCreateModule = (areaID: string, chapterID: string) => {
    setCurrentAreaId(areaID);
    setCurrentChapterId(chapterID);
    setIsCreateModuleDialogOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen rounded-lg shadow-2xl">
      <div className="bg-white w-full h-fit mx-auto p-8 space-y-8 rounded-xl shadow items-center justify-center text-center">
        <div className="bg-white container mx-auto p-4 h-fit flex flex-col items-center justify-center text-center space-y-4">
          <h1 className="text-4xl text-center font-semibold mb-3">Roadmaps, Key Areas, Chapters, and Modules</h1>
          <ul className="w-full space-y-4">
            {roadmaps.map((roadmap) => (
              <li key={roadmap.mapID} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">{roadmap.useCase}</h2>
                <ul className="mt-4">
                  {roadmap.keyAreas.map((keyArea) => (
                    <li key={keyArea.areaID} className="bg-white p-4 rounded-lg shadow-md mb-4">
                      <h3 className="text-lg font-semibold">{keyArea.areaName}</h3>
                      <ul className="mt-4">
                        {keyArea.chapters.map((chapter) => (
                          <li key={chapter.chapterID} className="bg-white p-4 rounded-lg shadow-md mb-4">
                            <h4 className="text-md font-semibold">{chapter.chapterName}</h4>
                            <p><strong>Objective:</strong> {chapter.objective}</p>
                            <p><strong>Score:</strong> {chapter.score}</p>
                            <ul className="mt-4">
                              {chapter.modules.map((module) => (
                                <li key={module.moduleID} className="mt-2">
                                  <h5 className="text-sm font-semibold">{module.moduleName}</h5>
                                  <p><strong>Type:</strong> {module.moduleType}</p>
                                  <p><strong>Objective:</strong> {module.moduleObjective}</p>
                                  <p><strong>Content:</strong> {module.moduleContent}</p>
                                  <p><strong>Resources:</strong> {module.moduleResources}</p>
                                  <p><strong>Criteria:</strong> {module.moduleCriteria}</p>
                                  <p><strong>Score:</strong> {module.moduleScore}</p>
                                  <Button onClick={() => handleEditModule(module, chapter.chapterID, keyArea.areaID)}>Edit Module</Button>
                                </li>
                              ))}
                            </ul>
                            <Button onClick={() => handleCreateModule(keyArea.areaID, chapter.chapterID)}>Add Module</Button>
                            <Button onClick={() => handleEditChapter(chapter, keyArea.areaID)} className="ml-4">Edit Chapter</Button>
                          </li>
                        ))}
                      </ul>
                      <Button onClick={() => handleCreateChapter(keyArea.areaID)}>Add Chapter</Button>
                    </li>
                  ))}
                </ul>
                <Button onClick={() => { setCurrentRoadmapId(roadmap.mapID); setIsCreateKeyAreaDialogOpen(true); }}>Add Key Area</Button>
              </li>
            ))}
          </ul>
          <Dialog open={isCreateRoadmapDialogOpen} onOpenChange={setIsCreateRoadmapDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Create New Roadmap</Button>
            </DialogTrigger>
            <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
              <ScrollArea className="max-h-[80vh] p-6">
                <DialogHeader>
                  <DialogTitle>Create a New Roadmap</DialogTitle>
                  <DialogDescription>Fill out the form below to create a new roadmap.</DialogDescription>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleCreateRoadmapSubmit} className="space-y-4">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Use Case</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="text"
                      name="useCase"
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Published</label>
                    <select
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      name="published"
                      required
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
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
          <Dialog open={isCreateKeyAreaDialogOpen} onOpenChange={setIsCreateKeyAreaDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Create New Key Area</Button>
            </DialogTrigger>
            <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
              <ScrollArea className="max-h-[80vh] p-6">
                <DialogHeader>
                  <DialogTitle>Create a New Key Area</DialogTitle>
                  <DialogDescription>Fill out the form below to create a new key area.</DialogDescription>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleCreateKeyAreaSubmit} className="space-y-4">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 required">Key Area Name</label>
                    <Input
                      className="w-full px-3 py-2 border border-black text-sm placeholder-gray-500"
                      type="text"
                      name="areaName"
                      required
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
          <Dialog open={isEditModuleDialogOpen} onOpenChange={setIsEditModuleDialogOpen}>
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
