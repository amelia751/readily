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

// type DNDType = {
//   id: UniqueIdentifier;
//   title: string;
//   modules: {
//     id: UniqueIdentifier;
//     title: string;
//   }[];
// };

// export default function Home() {
//   const [chapters, setChapters] = useState<DNDType[]>([]);
//   const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
//   const [currentChapterId, setCurrentChapterId] = useState<UniqueIdentifier>();
//   const [chapterName, setChapterName] = useState('');
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
//         modules: [],
//       },
//     ]);
//     setChapterName('');
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
//     return chapter.title;
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
//                       <CardTitle>{chapter.title}</CardTitle>
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

