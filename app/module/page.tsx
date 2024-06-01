"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

function ModuleForm() {
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [modules, setModules] = useState<any[]>([]);
  const [editingModule, setEditingModule] = useState<any | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch("/api/modules");
        const data = await response.json();
        setModules(data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchModules();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        const newModule = await response.json();
        setModules((prevModules) => [...prevModules, newModule]);
        formRef.current?.reset();
        setIsCreateDialogOpen(false);
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

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        const updatedModule = await response.json();
        setModules((prevModules) =>
          prevModules.map((mod) => (mod.moduleID === updatedModule.moduleID ? updatedModule : mod))
        );
        formRef.current?.reset();
        setEditingModule(null);
        setIsEditDialogOpen(false);
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

  const handleEdit = (module: any) => {
    setEditingModule(module);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen rounded-lg shadow-2xl">
      <div className="bg-white w-full h-fit mx-auto p-8 space-y-8 rounded-xl shadow items-center justify-center text-center">
        <div className="bg-white container mx-auto p-4 h-fit flex flex-col items-center justify-center text-center space-y-4">
          <h1 className="text-4xl text-center font-semibold mb-3">Modules</h1>
          <ul className="w-full space-y-4">
            {modules.map((module) => (
              <li key={module.moduleID} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">{module.moduleName}</h2>
                <p><strong>Type:</strong> {module.moduleType}</p>
                <p><strong>Objective:</strong> {module.moduleObjective}</p>
                <p><strong>Content:</strong> {module.moduleContent}</p>
                <p><strong>Resources:</strong> {module.moduleResources}</p>
                <p><strong>Criteria:</strong> {module.moduleCriteria}</p>
                <p><strong>Score:</strong> {module.moduleScore}</p>
                <Button onClick={() => handleEdit(module)}>Edit</Button>
              </li>
            ))}
          </ul>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Create New Module</Button>
            </DialogTrigger>
            <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
            <ScrollArea className="max-h-[80vh] p-6">
              <DialogHeader>
                <DialogTitle>Create a New Module</DialogTitle>
                <DialogDescription>Fill out the form below to create a new module.</DialogDescription>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleCreateSubmit} className="space-y-4">
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
          <Dialog open={isEditDialogOpen} onOpenChange={() => setIsEditDialogOpen(false)}>
            <DialogTrigger asChild>
              <Button className="mt-4">Edit Module</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
            <ScrollArea className="max-h-[80vh] p-6">
              <DialogHeader>
                <DialogTitle>Edit Module</DialogTitle>
                <DialogDescription>Fill out the form below to edit the module.</DialogDescription>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleEditSubmit} className="space-y-4">
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

export default ModuleForm;



// "use client"
// import { useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';

// // DnD
// import {
//   DndContext,
//   DragEndEvent,
//   DragOverlay,
//   DragStartEvent,
//   KeyboardSensor,
//   PointerSensor,
//   UniqueIdentifier,
//   closestCorners,
//   useSensor,
//   useSensors,
//   useDroppable,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   arrayMove,
//   sortableKeyboardCoordinates,
// } from '@dnd-kit/sortable';

// // Components
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import Module from '@/components/Module';
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

// type ChapterType = 'Skill' | 'Knowledge';

// type DNDType = {
//   id: UniqueIdentifier;
//   title: string;
//   type: ChapterType;
//   modules: {
//     id: UniqueIdentifier;
//     title: string;
//   }[];
// };

// export default function Roadmap() {
//   const [chapters, setChapters] = useState<DNDType[]>([]);
//   const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
//   const [currentChapterId, setCurrentChapterId] = useState<UniqueIdentifier>();
//   const [chapterName, setChapterName] = useState('');
//   const [chapterType, setChapterType] = useState<ChapterType>('Skill');
//   const [moduleName, setModuleName] = useState('');
//   const [showAddChapterModal, setShowAddChapterModal] = useState(false);
//   const [showAddModuleModal, setShowAddModuleModal] = useState(false);

//   const onAddChapter = () => {
//     if (!chapterName) return;
//     const id = `chapter-${uuidv4()}`;
//     setChapters([
//       ...chapters,
//       {
//         id,
//         title: chapterName,
//         type: chapterType,
//         modules: [],
//       },
//     ]);
//     setChapterName('');
//     setChapterType('Skill');
//     setShowAddChapterModal(false);
//   };

//   const onAddModule = () => {
//     if (!moduleName) return;
//     const id = `module-${uuidv4()}`;
//     const chapter = chapters.find((chapter) => chapter.id === currentChapterId);
//     if (!chapter) return;
//     chapter.modules.push({
//       id,
//       title: moduleName,
//     });
//     setChapters([...chapters]);
//     setModuleName('');
//     setShowAddModuleModal(false);
//   };

//   // Find the value of the modules
//   function findValueOfModules(id: UniqueIdentifier | undefined, type: string) {
//     if (type === 'chapter') {
//       return chapters.find((chapter) => chapter.id === id);
//     }
//     if (type === 'module') {
//       return chapters.find((chapter) =>
//         chapter.modules.find((module) => module.id === id),
//       );
//     }
//   }

//   const findModuleTitle = (id: UniqueIdentifier | undefined) => {
//     const chapter = findValueOfModules(id, 'module');
//     if (!chapter) return '';
//     const module = chapter.modules.find((module) => module.id === id);
//     if (!module) return '';
//     return module.title;
//   };

//   const findChapterTitle = (id: UniqueIdentifier | undefined) => {
//     const chapter = findValueOfModules(id, 'chapter');
//     if (!chapter) return '';
//     return `${chapter.title} (${chapter.type})`;
//   };

//   const findChapterModules = (id: UniqueIdentifier | undefined) => {
//     const chapter = findValueOfModules(id, 'chapter');
//     if (!chapter) return [];
//     return chapter.modules;
//   };

//   // DND Handlers
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     }),
//   );

//   function handleDragStart(event: DragStartEvent) {
//     const { active } = event;
//     const { id } = active;
//     setActiveId(id);
//   }

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (!over) return;

//     // Handling module Sorting and moving to different chapters
//     if (active.id.toString().includes('module')) {
//       const activeChapter = findValueOfModules(active.id, 'module');
//       const overChapter = findValueOfModules(over.id, 'module') || findValueOfModules(over.id, 'chapter');

//       if (!activeChapter || !overChapter) return;

//       const activeChapterIndex = chapters.findIndex(
//         (chapter) => chapter.id === activeChapter.id,
//       );
//       const overChapterIndex = chapters.findIndex(
//         (chapter) => chapter.id === overChapter.id,
//       );

//       const activeModuleIndex = activeChapter.modules.findIndex(
//         (module) => module.id === active.id,
//       );

//       if (activeChapterIndex === overChapterIndex) {
//         let newModules = [...chapters];
//         newModules[activeChapterIndex].modules = arrayMove(
//           newModules[activeChapterIndex].modules,
//           activeModuleIndex,
//           over.id.toString().includes('module') ? overChapter.modules.findIndex((module) => module.id === over.id) : overChapter.modules.length,
//         );
//         setChapters(newModules);
//       } else {
//         let newModules = [...chapters];
//         const [removedModule] = newModules[activeChapterIndex].modules.splice(
//           activeModuleIndex,
//           1,
//         );
//         newModules[overChapterIndex].modules.splice(
//           over.id.toString().includes('module') ? overChapter.modules.findIndex((module) => module.id === over.id) : overChapter.modules.length,
//           0,
//           removedModule,
//         );
//         setChapters(newModules);
//       }
//     }

//     // Handling Chapter Sorting
//     if (
//       active.id.toString().includes('chapter') &&
//       over?.id.toString().includes('chapter') &&
//       active.id !== over.id
//     ) {
//       const activeChapterIndex = chapters.findIndex(
//         (chapter) => chapter.id === active.id,
//       );
//       const overChapterIndex = chapters.findIndex(
//         (chapter) => chapter.id === over.id,
//       );
//       let newChapters = [...chapters];
//       newChapters = arrayMove(newChapters, activeChapterIndex, overChapterIndex);
//       setChapters(newChapters);
//     }
//     setActiveId(null);
//   };

//   return (
//     <div className="mx-auto max-w-7xl py-10">
//       {/* Add Chapter Dialog */}
//       <Dialog open={showAddChapterModal} onOpenChange={setShowAddChapterModal}>
//         <DialogTrigger asChild>
//           <Button variant="outline" onClick={() => setShowAddChapterModal(true)}>Add Chapter</Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Add Chapter</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Input
//                 type="text"
//                 placeholder="Chapter Title"
//                 name="chaptername"
//                 value={chapterName}
//                 onChange={(e) => setChapterName(e.target.value)}
//               />
//               <Select value={chapterType} onValueChange={(value) => setChapterType(value as ChapterType)}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Select Chapter Type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     <SelectLabel>Chapter Type</SelectLabel>
//                     <SelectItem value="Skill">Skill</SelectItem>
//                     <SelectItem value="Knowledge">Knowledge</SelectItem>
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="submit" onClick={onAddChapter}>Add Chapter</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//       {/* Add Module Dialog */}
//       <Dialog open={showAddModuleModal} onOpenChange={setShowAddModuleModal}>
//         <DialogTrigger asChild>
//           <Button variant="outline" onClick={() => setShowAddModuleModal(true)}>Add Module</Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Add Module</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Input
//                 type="text"
//                 placeholder="Module Title"
//                 name="modulename"
//                 value={moduleName}
//                 onChange={(e) => setModuleName(e.target.value)}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="submit" onClick={onAddModule}>Add Module</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//       <div className="mt-10">
//         <div className="grid grid-cols-3 gap-6">
//           <DndContext
//             sensors={sensors}
//             collisionDetection={closestCorners}
//             onDragStart={handleDragStart}
//             onDragEnd={handleDragEnd}
//           >
//             <SortableContext items={chapters.map((i) => i.id)}>
//               {chapters.map((chapter) => (
//                 <DroppableChapter key={chapter.id} id={chapter.id} modules={chapter.modules}>
//                   <Card className="w-[350px]">
//                     <CardHeader>
//                       <CardTitle>{findChapterTitle(chapter.id)}</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <SortableContext items={chapter.modules.map((i) => i.id)}>
//                         <div className="flex items-start flex-col gap-y-4">
//                           {chapter.modules.map((module) => (
//                             <Module title={module.title} id={module.id} key={module.id} />
//                           ))}
//                         </div>
//                       </SortableContext>
//                     </CardContent>
//                     <CardFooter className="flex justify-between">
//                       <Button variant="outline" onClick={() => {
//                         setShowAddModuleModal(true);
//                         setCurrentChapterId(chapter.id);
//                       }}>
//                         Add Module
//                       </Button>
//                     </CardFooter>
//                   </Card>
//                 </DroppableChapter>
//               ))}
//             </SortableContext>
//             <DragOverlay adjustScale={false}>
//               {/* Drag Overlay For Module */}
//               {activeId && activeId.toString().includes('module') && (
//                 <Module id={activeId} title={findModuleTitle(activeId)} />
//               )}
//               {/* Drag Overlay For Chapter */}
//               {activeId && activeId.toString().includes('chapter') && (
//                 <Card id={activeId.toString()} className="w-[350px]">
//                   <CardHeader>
//                     <CardTitle>{findChapterTitle(activeId)}</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {findChapterModules(activeId).map((module) => (
//                       <Module key={module.id} title={module.title} id={module.id} />
//                     ))}
//                   </CardContent>
//                 </Card>
//               )}
//             </DragOverlay>
//           </DndContext>
//         </div>
//       </div>
//     </div>
//   );
// }

// interface DroppableChapterProps {
//   id: UniqueIdentifier;
//   modules: { id: UniqueIdentifier; title: string }[];
//   children: React.ReactNode;
// }

// const DroppableChapter = ({ id, modules, children }: DroppableChapterProps) => {
//   const { setNodeRef } = useDroppable({
//     id,
//   });

//   return (
//     <div ref={setNodeRef}>
//       {children}
//     </div>
//   );
// };

