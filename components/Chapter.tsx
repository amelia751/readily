// "use client";
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

// const Chapter = () => {
//   const [useCase, setUseCase] = useState<string>('');
//   const [areaName, setAreaName] = useState<string>('');
//   const [areaDescription, setAreaDescription] = useState<string>('');
//   const [chapters, setChapters] = useState<any[] | null>(null);
//   const [approvedChapters, setApprovedChapters] = useState<any[]>([]);
//   const [error, setError] = useState<string>('');
//   const [editIndex, setEditIndex] = useState<number | null>(null);
//   const [editChapter, setEditChapter] = useState({ chapterID: '', chapterName: '', chapterObjective: '' });
//   const [loading, setLoading] = useState<boolean>(true);
//   const [isCreateChapterDialogOpen, setIsCreateChapterDialogOpen] = useState<boolean>(false);
//   const formRef = useRef<HTMLFormElement>(null);

//   const pathname = usePathname();

//   useEffect(() => {
//     const fetchChapterDetails = async () => {
//       if (!pathname) return;

//       const pathSegments = pathname.split('/');
//       const mapID = pathSegments[pathSegments.length - 2];
//       const areaID = pathSegments[pathSegments.length - 1];

//       if (!mapID || !areaID) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch(`/api/chapters/${mapID}/${areaID}`);
//         const data = await res.json();
//         if (res.ok) {
//           setUseCase(data.useCase);
//           setAreaName(data.areaName);
//           setAreaDescription(data.areaDescription);
//           setApprovedChapters(data.chapters || []);
//         } else {
//           setError(data.error || 'An error occurred while fetching chapter details.');
//         }
//       } catch (error) {
//         console.error(error);
//         setError('An error occurred while fetching chapter details.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChapterDetails();
//   }, [pathname]);

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('/api/generateChapters', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ useCase, areaName, areaDescription }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setChapters(data);
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
//       const res = await fetch('/api/moreChapters', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ useCase, areaName, areaDescription, approvedChapters }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setChapters(data);
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
//     const chapterID = approvedChapters[index].chapterID;
//     const pathSegments = pathname.split('/');
//     const mapID = pathSegments[pathSegments.length - 2];
//     const areaID = pathSegments[pathSegments.length - 1];
  
//     try {
//       const res = await fetch(`/api/chapters/${mapID}/${areaID}/${chapterID}`, {
//         method: 'DELETE',
//       });
//       if (res.ok) {
//         setApprovedChapters(prevApprovedChapters => prevApprovedChapters.filter((_, i) => i !== index));
//       } else {
//         setError('An error occurred while deleting the chapter.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while deleting the chapter.');
//     }
//   };
  

//   const handleEdit = (index: number) => {
//     setEditIndex(index);
//     setEditChapter(approvedChapters[index]);
//   };

//   const handleSave = async () => {
//     const { chapterID, chapterName, chapterObjective } = editChapter;
//     const pathSegments = pathname.split('/');
//     const mapID = pathSegments[pathSegments.length - 2];
//     const areaID = pathSegments[pathSegments.length - 1];
  
//     try {
//       const res = await fetch(`/api/chapters/${mapID}/${areaID}/${chapterID}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ chapterName, chapterObjective }),
//       });
//       if (res.ok) {
//         setApprovedChapters(prevApprovedChapters => prevApprovedChapters.map((chapter, i) => (i === editIndex ? editChapter : chapter)));
//         setEditIndex(null);
//         setEditChapter({ chapterID: '', chapterName: '', chapterObjective: '' });
//       } else {
//         setError('An error occurred while saving the chapter.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while saving the chapter.');
//     }
//   };
  

//   const handleApprove = async (index: number) => {
//     const approvedChapter = chapters[index];
//     const pathSegments = pathname.split('/');
//     const mapID = pathSegments[pathSegments.length - 2];
//     const areaID = pathSegments[pathSegments.length - 1];
//     setLoading(true);
//     try {
//       const res = await fetch('/api/chapters', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           mapID,
//           areaID,
//           chapterName: approvedChapter.chapterName,
//           chapterObjective: approvedChapter.chapterObjective,
//         }),
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setApprovedChapters(prevApproved => [...prevApproved, data]);
//         setChapters(prevChapters => prevChapters.filter((_, i) => i !== index));
//       } else {
//         setError('An error occurred while approving the chapter.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while approving the chapter.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateChapterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setLoading(true);
//     setError("");

//     const formDataSubmit = new FormData(formRef.current as HTMLFormElement);
//     const chapterName = formDataSubmit.get("chapterName") as string;
//     const chapterObjective = formDataSubmit.get("chapterObjective") as string;
//     const pathSegments = pathname.split('/');
//     const mapID = pathSegments[pathSegments.length - 2];
//     const areaID = pathSegments[pathSegments.length - 1];

//     try {
//       const res = await fetch('/api/chapters', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           mapID,
//           areaID,
//           chapterName,
//           chapterObjective,
//         }),
//       });

//       if (res.ok) {
//         const newChapter = await res.json();
//         setApprovedChapters([...approvedChapters, newChapter]);
//         formRef.current?.reset();
//         setIsCreateChapterDialogOpen(false);
//       } else {
//         setError('An error occurred while creating the chapter.');
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
//           <h2 className="text-2xl font-semibold">Approved Chapters</h2>
//           <Dialog open={isCreateChapterDialogOpen} onOpenChange={setIsCreateChapterDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="mt-4">Create New Chapter</Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//               <DialogHeader>
//                 <DialogTitle>Create a New Chapter</DialogTitle>
//                 <DialogDescription>Fill out the form below to create a new chapter.</DialogDescription>
//               </DialogHeader>
//               <form ref={formRef} onSubmit={handleCreateChapterSubmit} className="space-y-4">
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="chapterName" className="text-right">
//                       Chapter Name
//                     </Label>
//                     <Input
//                       id="chapterName"
//                       name="chapterName"
//                       className="col-span-3"
//                       required
//                     />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="chapterObjective" className="text-right">
//                       Chapter Objective
//                     </Label>
//                     <Textarea
//                       id="chapterObjective"
//                       name="chapterObjective"
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
//           {approvedChapters.length > 0 && (
//             <div className="mt-4">
//               {approvedChapters.map((chapter, index) => (
//                 <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 relative">
//                   <div className='flex justify-between items-center space-x-4 mb-3'> 
//                     <h2 className="text-xl font-semibold">{chapter.chapterName}</h2>
//                     <div className=" flex space-x-2 top-0 right-0 items-start">
//                       <Button className='bg-transparent border-none hover:bg-white' variant="outline" size="icon" onClick={() => handleEdit(index)}>
//                         <FaEdit />
//                       </Button>
//                       <Button className='bg-transparent border-none hover:bg-white' variant="outline" size="icon" onClick={() => handleDelete(index)}>
//                         <FaTrash />
//                       </Button>
//                   </div>
//                   </div>
//                   <p>{chapter.chapterObjective}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </ScrollArea>
//       </div>

//       <div className='md:w-1/2'>
//         <ScrollArea className="h-[450px] md:h-screen p-4 border border-gray-200 rounded-lg">
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="useCase" className="text-right">
//                 Use Case
//               </Label>
//               <Input
//                 id="useCase"
//                 value={useCase}
//                 onChange={(e) => setUseCase(e.target.value)}
//                 className="col-span-3"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="areaName" className="text-right">
//                 Area Name
//               </Label>
//               <Input
//                 id="areaName"
//                 value={areaName}
//                 onChange={(e) => setAreaName(e.target.value)}
//                 className="col-span-3"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="areaDescription" className="text-right">
//                 Area Description
//               </Label>
//               <Textarea
//                 id="areaDescription"
//                 value={areaDescription}
//                 onChange={(e) => setAreaDescription(e.target.value)}
//                 className="col-span-3"
//                 required
//               />
//             </div>
//           </div>
//           <div className="flex space-x-4">
//             <Button onClick={handleGenerate}>Generate Chapters</Button>
//             <Button onClick={handleGenerateMore}>Generate More</Button>
//           </div>
//           {error && <p className="text-red-600 mt-4">{error}</p>}
//           {loading ? (
//             <div className="flex justify-center items-center mt-8 md:mt-52">
//               <LoadingSpinner />
//             </div>
//           ) : (
//             chapters && (
//               <div className="mt-4">
//                 <h2 className="text-2xl font-semibold">Generated Chapters</h2>
//                 {chapters.map((chapter, index) => (
//                   <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 relative">
//                     <div className='flex justify-between items-center space-x-4 mb-3'> 
//                     <h2 className="text-xl font-semibold">{chapter.chapterName}</h2>
//                     <div className="top-0 right-0 flex space-x-2">
//                       <Button className='bg-transparent border-none hover:bg-white' variant="outline" size="icon" onClick={() => handleApprove(index)}>
//                         <FaRegThumbsUp />
//                       </Button>
//                     </div>
//                     </div>
//                     <p>{chapter.chapterObjective}</p>
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
//                   <DialogTitle>Edit Chapter</DialogTitle>
//                   <DialogDescription>
//                     Make changes to the chapter here. Click save when you're done.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="chapterName" className="text-right">
//                       Chapter Name
//                     </Label>
//                     <Input
//                       id="chapterName"
//                       value={editChapter.chapterName}
//                       onChange={(e) => setEditChapter({ ...editChapter, chapterName: e.target.value })}
//                       className="col-span-3"
//                     />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="chapterObjective" className="text-right">
//                       Chapter Objective
//                     </Label>
//                     <Textarea
//                       id="chapterObjective"
//                       value={editChapter.chapterObjective}
//                       onChange={(e) => setEditChapter({ ...editChapter, chapterObjective: e.target.value })}
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

// export default Chapter;

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

const Chapter = () => {
  const [useCase, setUseCase] = useState<string>('');
  const [areaName, setAreaName] = useState<string>('');
  const [areaDescription, setAreaDescription] = useState<string>('');
  const [chapters, setChapters] = useState<any[] | null>(null);
  const [approvedChapters, setApprovedChapters] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editChapter, setEditChapter] = useState({ chapterID: '', chapterName: '', chapterObjective: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateChapterDialogOpen, setIsCreateChapterDialogOpen] = useState<boolean>(false);
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
    try {
      const res = await fetch('/api/generateChapters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ useCase, areaName, areaDescription }),
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
      setLoading(false);
    }
  };

  const handleGenerateMore = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/moreChapters', {
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
    const approvedChapter = chapters[index];
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
        setChapters(prevChapters => prevChapters.filter((_, i) => i !== index));
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
      <div className='md:w-1/2'>
        <ScrollArea className="h-[450px] md:h-screen p-4 border border-gray-200 rounded-lg">
          <h2 className="text-2xl font-semibold">Approved Chapters</h2>
          <Dialog open={isCreateChapterDialogOpen} onOpenChange={setIsCreateChapterDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Create New Chapter</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a New Chapter</DialogTitle>
                <DialogDescription>Fill out the form below to create a new chapter.</DialogDescription>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleCreateChapterSubmit} className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="chapterName" className="text-right">
                      Chapter Name
                    </Label>
                    <Input
                      id="chapterName"
                      name="chapterName"
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
                      name="chapterObjective"
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
          {approvedChapters.length > 0 && (
            <div className="mt-4">
              {approvedChapters.map((chapter, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 relative cursor-pointer"
                  onClick={() => router.push(`/roadmap/${pathname.split('/')[2]}/${pathname.split('/')[3]}/${chapter.chapterID}`)}
                >
                  <div className='flex justify-between items-center space-x-4 mb-3'> 
                    <h2 className="text-xl font-semibold">{chapter.chapterName}</h2>
                    <div className=" flex space-x-2 top-0 right-0 items-start">
                      <Button className='bg-transparent border-none hover:bg-white' variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(index); }}>
                        <FaEdit />
                      </Button>
                      <Button className='bg-transparent border-none hover:bg-white' variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(index); }}>
                        <FaTrash />
                      </Button>
                  </div>
                  </div>
                  <p>{chapter.chapterObjective}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

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
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleGenerate}>Generate Chapters</Button>
            <Button onClick={handleGenerateMore}>Generate More</Button>
          </div>
          {error && <p className="text-red-600 mt-4">{error}</p>}
          {loading ? (
            <div className="flex justify-center items-center mt-8 md:mt-52">
              <LoadingSpinner />
            </div>
          ) : (
            chapters && (
              <div className="mt-4">
                <h2 className="text-2xl font-semibold">Generated Chapters</h2>
                {chapters.map((chapter, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 relative">
                    <div className='flex justify-between items-center space-x-4 mb-3'> 
                    <h2 className="text-xl font-semibold">{chapter.chapterName}</h2>
                    <div className="top-0 right-0 flex space-x-2">
                      <Button className='bg-transparent border-none hover:bg-white' variant="outline" size="icon" onClick={() => handleApprove(index)}>
                        <FaRegThumbsUp />
                      </Button>
                    </div>
                    </div>
                    <p>{chapter.chapterObjective}</p>
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
                  <DialogTitle>Edit Chapter</DialogTitle>
                  <DialogDescription>
                    Make changes to the chapter here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="chapterName" className="text-right">
                      Chapter Name
                    </Label>
                    <Input
                      id="chapterName"
                      value={editChapter.chapterName}
                      onChange={(e) => setEditChapter({ ...editChapter, chapterName: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="chapterObjective" className="text-right">
                      Chapter Objective
                    </Label>
                    <Textarea
                      id="chapterObjective"
                      value={editChapter.chapterObjective}
                      onChange={(e) => setEditChapter({ ...editChapter, chapterObjective: e.target.value })}
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

export default Chapter;
