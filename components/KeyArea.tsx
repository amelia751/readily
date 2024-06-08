// "use client"
// import React, { useState, useEffect, useRef } from 'react';
// import { usePathname } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { FaEdit, FaTrash, FaRegThumbsUp } from 'react-icons/fa';
// import { LoadingSpinner } from '@/components/ui/spinner';

// const KeyArea = () => {
//   const [prompt, setPrompt] = useState<string>('');
//   const [keyAreas, setKeyAreas] = useState<any[] | null>(null);
//   const [approvedKeyAreas, setApprovedKeyAreas] = useState<any[]>([]);
//   const [error, setError] = useState<string>('');
//   const [editIndex, setEditIndex] = useState<number | null>(null);
//   const [editArea, setEditArea] = useState({ areaID: '', areaName: '', areaDescription: '' });
//   const [loading, setLoading] = useState<boolean>(true);
//   const [isCreateKeyAreaDialogOpen, setIsCreateKeyAreaDialogOpen] = useState<boolean>(false);
//   const formRef = useRef<HTMLFormElement>(null);

//   const pathname = usePathname();

//   useEffect(() => {
//     const fetchRoadmapDetails = async () => {
//       if (!pathname) return;
      
//       const mapID = pathname.split('/').pop();
//       if (!mapID) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch(`/api/roadmaps/${mapID}`);
//         const data = await res.json();
//         if (res.ok) {
//           setPrompt(data.useCase);
//           setApprovedKeyAreas(data.keyAreas || []);
//         } else {
//           setError(data.error || 'An error occurred while fetching roadmap details.');
//         }
//       } catch (error) {
//         console.error(error);
//         setError('An error occurred while fetching roadmap details.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoadmapDetails();
//   }, [pathname]);

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

//   const handleGenerateMore = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('/api/moreAreas', {
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
//         setError(data.error || 'An error occurred while generating more content.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while generating more content.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (index: number) => {
//     const keyAreaID = approvedKeyAreas[index].areaID;
//     try {
//       const res = await fetch(`/api/keyareas/${keyAreaID}`, {
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
//     const { areaID, areaName, areaDescription } = editArea;
//     try {
//       const res = await fetch(`/api/keyareas/${areaID}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ areaName, areaDescription }),
//       });
//       if (res.ok) {
//         setApprovedKeyAreas(prevApprovedKeyAreas => prevApprovedKeyAreas.map((area, i) => (i === editIndex ? editArea : area)));
//         setEditIndex(null);
//         setEditArea({ areaID: '', areaName: '', areaDescription: '' });
//       } else {
//         setError('An error occurred while saving the key area.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while saving the key area.');
//     }
//   };

//   const handleApprove = async (index: number) => {
//     const approvedArea = keyAreas[index];
//     const mapID = pathname.split('/').pop();
//     setLoading(true);
//     try {
//       const res = await fetch('/api/keyareas', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           mapID,
//           areaName: approvedArea.areaName,
//           areaDescription: approvedArea.areaDescription,
//         }),
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setApprovedKeyAreas(prevApproved => [...prevApproved, data]);
//         setKeyAreas(prevKeyAreas => prevKeyAreas.filter((_, i) => i !== index));
//       } else {
//         setError('An error occurred while approving the key area.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while approving the key area.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateKeyAreaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setLoading(true);
//     setError("");

//     const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
//     const areaName = formDataSubmit.get("areaName") as string;
//     const areaDescription = formDataSubmit.get("areaDescription") as string;
//     const mapID = pathname.split('/').pop();

//     try {
//       const res = await fetch('/api/keyareas', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           mapID,
//           areaName,
//           areaDescription,
//         }),
//       });

//       if (res.ok) {
//         const newKeyArea = await res.json();
//         setApprovedKeyAreas([...approvedKeyAreas, newKeyArea]);
//         formRef.current?.reset();
//         setIsCreateKeyAreaDialogOpen(false);
//       } else {
//         setError('An error occurred while creating the key area.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError("Error, try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full flex flex-col md:flex-row md:space-x-5 justify-center items-between">
//       <div className='md:w-1/2'>
//         <ScrollArea className="h-[450px] md:h-screen p-4 border border-gray-200 rounded-lg">
//           <h2 className="text-2xl font-semibold">Approved Areas</h2>
//           <Dialog open={isCreateKeyAreaDialogOpen} onOpenChange={setIsCreateKeyAreaDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="mt-4">Create New Area</Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//               <DialogHeader>
//                 <DialogTitle>Create a New Area</DialogTitle>
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
//                 <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 relative">
//                   <div className='flex justify-between items-center space-x-4 mb-3'> 
//                     <h2 className="text-xl font-semibold">{keyArea.areaName}</h2>
//                     <div className=" flex space-x-2 top-0 right-0 items-start">
//                       <Button className='bg-transparent border-none hover:bg-white' variant="outline" size="icon" onClick={() => handleEdit(index)}>
//                         <FaEdit />
//                       </Button>
//                       <Button className='bg-transparent border-none hover:bg-white' variant="outline" size="icon" onClick={() => handleDelete(index)}>
//                         <FaTrash />
//                       </Button>
//                   </div>
//                   </div>
//                   <p>{keyArea.areaDescription}</p>
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
//           <div className="flex space-x-4">
//             <Button onClick={handleGenerate}>Generate Key Areas of Development</Button>
//             <Button onClick={handleGenerateMore}>Generate More</Button>
//           </div>
//           {error && <p className="text-red-600 mt-4">{error}</p>}
//           {loading ? (
//             <div className="flex justify-center items-center mt-8 md:mt-52">
//               <LoadingSpinner />
//             </div>
//           ) : (
//             keyAreas && (
//               <div className="mt-4">
//                 <h2 className="text-2xl font-semibold">Generated Areas</h2>
//                 {keyAreas.map((keyArea, index) => (
//                   <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 relative">
//                     <div className='flex justify-between items-center space-x-4 mb-3'> 
//                     <h2 className="text-xl font-semibold">{keyArea.areaName}</h2>
//                     <div className="top-0 right-0 flex space-x-2">
//                       <Button className='bg-transparent border-none hover:bg-white' variant="outline" size="icon" onClick={() => handleApprove(index)}>
//                         <FaRegThumbsUp />
//                       </Button>
//                     </div>
//                     </div>
//                     <p>{keyArea.areaDescription}</p>
//                   </div>
//                 ))}
//               </div>
//             )
//           )}
//           {editIndex !== null && (
//             <Dialog open={editIndex !== null} onOpenChange={() => setEditIndex(null)}>
//               <DialogTrigger asChild>
//                 <Button variant="outline">Edit</Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-2xl">
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
//                     <Textarea
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
//   );
// };

// export default KeyArea;


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
import { LoadingSpinner } from '@/components/ui/spinner';

const KeyArea = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [keyAreas, setKeyAreas] = useState<any[] | null>(null);
  const [approvedKeyAreas, setApprovedKeyAreas] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editArea, setEditArea] = useState({ areaID: '', areaName: '', areaDescription: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateKeyAreaDialogOpen, setIsCreateKeyAreaDialogOpen] = useState<boolean>(false);
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
    try {
      const res = await fetch('/api/generateAreas', {
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
      setLoading(false);
    }
  };

  const handleGenerateMore = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/moreAreas', {
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
    const approvedArea = keyAreas[index];
    const mapID = pathname.split('/').pop();
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
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setApprovedKeyAreas(prevApproved => [...prevApproved, data]);
        setKeyAreas(prevKeyAreas => prevKeyAreas.filter((_, i) => i !== index));
      } else {
        setError('An error occurred while approving the key area.');
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
        }),
      });

      if (res.ok) {
        const newKeyArea = await res.json();
        setApprovedKeyAreas([...approvedKeyAreas, newKeyArea]);
        formRef.current?.reset();
        setIsCreateKeyAreaDialogOpen(false);
      } else {
        setError('An error occurred while creating the key area.');
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
          <h2 className="text-2xl font-semibold">Approved Areas</h2>
          <Dialog open={isCreateKeyAreaDialogOpen} onOpenChange={setIsCreateKeyAreaDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Create New Area</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a New Area</DialogTitle>
                <DialogDescription>Fill out the form below to create a new key area.</DialogDescription>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleCreateKeyAreaSubmit} className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="areaName" className="text-right">
                      Area Name
                    </Label>
                    <Input
                      id="areaName"
                      name="areaName"
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
                      name="areaDescription"
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
          {approvedKeyAreas.length > 0 && (
            <div className="mt-4">
              {approvedKeyAreas.map((keyArea, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 relative cursor-pointer"
                  onClick={() => router.push(`/roadmap/${pathname.split('/').pop()}/${keyArea.areaID}`)}
                >
                  <div className='flex justify-between items-center space-x-4 mb-3'> 
                    <h2 className="text-xl font-semibold">{keyArea.areaName}</h2>
                    <div className=" flex space-x-2 top-0 right-0 items-start">
                      <Button className='bg-transparent border-none hover:bg-white' variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(index); }}>
                        <FaEdit />
                      </Button>
                      <Button className='bg-transparent border-none hover:bg-white' variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(index); }}>
                        <FaTrash />
                      </Button>
                  </div>
                  </div>
                  <p>{keyArea.areaDescription}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className='md:w-1/2'>
        <ScrollArea className="h-[450px] md:h-screen p-4 border border-gray-200 rounded-lg">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your use case"
            className="mb-4"
          />
          <div className="flex space-x-4">
            <Button onClick={handleGenerate}>Generate Key Areas of Development</Button>
            <Button onClick={handleGenerateMore}>Generate More</Button>
          </div>
          {error && <p className="text-red-600 mt-4">{error}</p>}
          {loading ? (
            <div className="flex justify-center items-center mt-8 md:mt-52">
              <LoadingSpinner />
            </div>
          ) : (
            keyAreas && (
              <div className="mt-4">
                <h2 className="text-2xl font-semibold">Generated Areas</h2>
                {keyAreas.map((keyArea, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 relative">
                    <div className='flex justify-between items-center space-x-4 mb-3'> 
                    <h2 className="text-xl font-semibold">{keyArea.areaName}</h2>
                    <div className="top-0 right-0 flex space-x-2">
                      <Button className='bg-transparent border-none hover:bg-white' variant="outline" size="icon" onClick={() => handleApprove(index)}>
                        <FaRegThumbsUp />
                      </Button>
                    </div>
                    </div>
                    <p>{keyArea.areaDescription}</p>
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
                  <DialogTitle>Edit Key Area</DialogTitle>
                  <DialogDescription>
                    Make changes to the key area here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="areaName" className="text-right">
                      Area Name
                    </Label>
                    <Input
                      id="areaName"
                      value={editArea.areaName}
                      onChange={(e) => setEditArea({ ...editArea, areaName: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="areaDescription" className="text-right">
                      Area Description
                    </Label>
                    <Textarea
                      id="areaDescription"
                      value={editArea.areaDescription}
                      onChange={(e) => setEditArea({ ...editArea, areaDescription: e.target.value })}
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
        </ScrollArea>
      </div>
    </div>
  );
};

export default KeyArea;
