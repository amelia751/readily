// "use client";

// import React, { useState, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { FaEdit, FaTrash, FaRegThumbsUp } from 'react-icons/fa';
// import { LoadingSpinner } from '@/components/ui/spinner';
// import Sidebar from '@/components/Sidebar';

// const TestGenerate = () => {
//   const [prompt, setPrompt] = useState<string>('');
//   const [keyAreas, setKeyAreas] = useState<any[] | null>(null);
//   const [approvedKeyAreas, setApprovedKeyAreas] = useState<any[]>([]);
//   const [error, setError] = useState<string>('');
//   const [editIndex, setEditIndex] = useState<number | null>(null);
//   const [editArea, setEditArea] = useState({ areaName: '', areaDescription: '' });
//   const [loading, setLoading] = useState<boolean>(false);
//   const [isCreateKeyAreaDialogOpen, setIsCreateKeyAreaDialogOpen] = useState<boolean>(false);
//   const formRef = useRef<HTMLFormElement>(null);

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('/api/generateAreas', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt, approvedKeyAreas }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setKeyAreas(data);
//       } else {
//         setError(data.error || 'An error occurred while generating content.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while generating content.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (index: number) => {
//     const keyAreaID = approvedKeyAreas[index].keyAreaID;
//     try {
//       const res = await fetch(`/api/keyAreas/${keyAreaID}`, {
//         method: 'DELETE',
//       });
//       if (res.ok) {
//         setApprovedKeyAreas(prevApprovedKeyAreas => prevApprovedKeyAreas.filter((_, i) => i !== index));
//       } else {
//         setError('An error occurred while deleting the key area.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while deleting the key area.');
//     }
//   };

//   const handleEdit = (index: number) => {
//     setEditIndex(index);
//     setEditArea(approvedKeyAreas[index]);
//   };

//   const handleSave = async () => {
//     const keyAreaID = editArea.keyAreaID;
//     try {
//       const res = await fetch(`/api/keyAreas/${keyAreaID}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(editArea),
//       });
//       if (res.ok) {
//         setApprovedKeyAreas(prevApprovedKeyAreas => prevApprovedKeyAreas.map((area, i) => (i === editIndex ? editArea : area)));
//         setEditIndex(null);
//         setEditArea({ areaName: '', areaDescription: '' });
//       } else {
//         setError('An error occurred while saving the key area.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while saving the key area.');
//     }
//   };

//   const handleApprove = (index: number) => {
//     const approvedArea = keyAreas[index];
//     setApprovedKeyAreas(prevApproved => [...prevApproved, approvedArea]);
//     setKeyAreas(prevKeyAreas => prevKeyAreas.filter((_, i) => i !== index));
//   };

//   const handleCreateKeyAreaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setLoading(true);
//     setError("");

//     const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
//     const areaName = formDataSubmit.get("areaName") as string;
//     const areaDescription = formDataSubmit.get("areaDescription") as string;

//     try {
//       const newKeyArea = {
//         keyAreaID: Date.now().toString(),
//         areaName,
//         areaDescription
//       };
//       setApprovedKeyAreas([...approvedKeyAreas, newKeyArea]);
//       formRef.current?.reset();
//       setIsCreateKeyAreaDialogOpen(false);
//     } catch (error) {
//       console.error(error);
//       setError("Error, try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>;
//   }

//   return (
//     <main className='flex w-screen'>
//       <Sidebar />
//     <div className="w-5/6 flex flex-col md:flex-row md:space-x-5 justify-center items-between">
//       <div className='md:w-1/2'>
//         <ScrollArea className="h-[450px] md:h-screen p-4 border border-gray-200 rounded-lg">
//           <h2 className="text-2xl font-semibold">Approved Key Areas</h2>
//             <Dialog open={isCreateKeyAreaDialogOpen} onOpenChange={setIsCreateKeyAreaDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="mt-4">Create New Key Area</Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//               <DialogHeader>
//                 <DialogTitle>Create a New Key Area</DialogTitle>
//                 <DialogDescription>Fill out the form below to create a new key area.</DialogDescription>
//               </DialogHeader>
//               <form ref={formRef} onSubmit={handleCreateKeyAreaSubmit} className="space-y-4">
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="areaName" className="text-right">
//                       Area Name
//                     </Label>
//                     <Input
//                       id="areaName"
//                       name="areaName"
//                       className="col-span-3"
//                       required
//                     />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="areaDescription" className="text-right">
//                       Area Description
//                     </Label>
//                     <Textarea
//                       id="areaDescription"
//                       name="areaDescription"
//                       className="col-span-3"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <DialogFooter>
//                   <Button type="submit" disabled={loading}>
//                     {loading ? "Submitting..." : "Submit"}
//                   </Button>
//                 </DialogFooter>
//                 <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
//               </form>
//             </DialogContent>
//           </Dialog>
//           {approvedKeyAreas.length > 0 && (
//             <div className="mt-4">
//               {approvedKeyAreas.map((keyArea, index) => (
//                 <div key={index} className="bg-green-100 p-4 rounded-lg shadow-md mb-4 relative">
//                   <h2 className="text-xl font-semibold">{keyArea.areaName}</h2>
//                   <p>{keyArea.areaDescription}</p>
//                   <div className="absolute top-4 right-4 flex space-x-2">
//                     <Button variant="outline" size="icon" onClick={() => handleEdit(index)}>
//                       <FaEdit />
//                     </Button>
//                     <Button variant="outline" size="icon" onClick={() => handleDelete(index)}>
//                       <FaTrash />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </ScrollArea>
//       </div>

//       <div className='md:w-1/2'>
//         <ScrollArea className="h-[450px] md:h-screen p-4 border border-gray-200 rounded-lg">
//           <Input
//             type="text"
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//             placeholder="Enter your use case"
//             className="mb-4"
//           />
//           <Button onClick={handleGenerate}>Generate Key Areas of Development</Button>
//           {error && <p className="text-red-600 mt-4">{error}</p>}
//           {keyAreas && (
//             <div className="mt-4">
//               <h2 className="text-2xl font-semibold">Generated Key Areas</h2>
//               {keyAreas.map((keyArea, index) => (
//                 <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 relative">
//                   <h2 className="text-xl font-semibold">{keyArea.areaName}</h2>
//                   <p>{keyArea.areaDescription}</p>
//                   <div className="absolute top-4 right-4 flex space-x-2">
//                     <Button variant="outline" size="icon" onClick={() => handleApprove(index)}>
//                       <FaRegThumbsUp />
//                     </Button>
//                     <Button variant="outline" size="icon" onClick={() => handleEdit(index)}>
//                       <FaEdit />
//                     </Button>
//                     <Button variant="outline" size="icon" onClick={() => handleDelete(index)}>
//                       <FaTrash />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//           {editIndex !== null && (
//             <Dialog open={editIndex !== null} onOpenChange={() => setEditIndex(null)}>
//               <DialogTrigger asChild>
//                 <Button variant="outline">Edit</Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                   <DialogTitle>Edit Key Area</DialogTitle>
//                   <DialogDescription>
//                     Make changes to the key area here. Click save when you're done.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="areaName" className="text-right">
//                       Area Name
//                     </Label>
//                     <Input
//                       id="areaName"
//                       value={editArea.areaName}
//                       onChange={(e) => setEditArea({ ...editArea, areaName: e.target.value })}
//                       className="col-span-3"
//                     />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="areaDescription" className="text-right">
//                       Area Description
//                     </Label>
//                     <Input
//                       id="areaDescription"
//                       value={editArea.areaDescription}
//                       onChange={(e) => setEditArea({ ...editArea, areaDescription: e.target.value })}
//                       className="col-span-3"
//                     />
//                   </div>
//                 </div>
//                 <DialogFooter>
//                   <Button type="button" onClick={handleSave}>Save changes</Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           )}
//         </ScrollArea>
//       </div>
//     </div>
//     </main>
//   );
// };

// export default TestGenerate;


