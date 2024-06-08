// "use client";
// import * as React from 'react';
// import { useState, useEffect } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Label } from '@/components/ui/label';
// import { FaEdit, FaTrash } from 'react-icons/fa';

// const RoadmapComponent = () => {
//   const [roadmaps, setRoadmaps] = useState([]);
//   const [useCase, setUseCase] = useState('');
//   const [visibility, setVisibility] = useState('private');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [generatedName, setGeneratedName] = useState('');
//   const [step, setStep] = useState(1); // 1 for input, 2 for confirmation
//   const [dialogOpen, setDialogOpen] = useState(false); // Control dialog state
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
  
//   const router = useRouter();

//   useEffect(() => {
//     const fetchRoadmaps = async () => {
//       try {
//         const res = await fetch('/api/roadmaps');
//         const data = await res.json();
//         setRoadmaps(data);
//       } catch (error) {
//         console.error('Error fetching roadmaps:', error);
//       }
//     };

//     fetchRoadmaps();
//   }, []);

//   const handleGenerateName = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch('/api/generateMaps', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt: useCase }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         setGeneratedName(data.mapName);
//         setStep(2); // Move to confirmation step
//       } else {
//         setError(data.error || 'An error occurred while generating the map name.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while generating the map name.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproveName = async () => {
//     setLoading(true);
//     const published = visibility === 'public';

//     try {
//       const res = await fetch('/api/roadmaps', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           mapName: generatedName,
//           useCase,
//           keyAreas: [],
//           published,
//         }),
//       });

//       if (res.ok) {
//         const newRoadmap = await res.json();
//         setRoadmaps([...roadmaps, newRoadmap]);
//         setUseCase('');
//         setVisibility('private');
//         setGeneratedName('');
//         setStep(1); // Reset to input step
//         setDialogOpen(false); // Close the dialog
//       } else {
//         const data = await res.json();
//         setError(data.message || 'An error occurred while creating the roadmap.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while creating the roadmap.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRegenerateName = () => {
//     setStep(1); // Reset to input step
//     setGeneratedName('');
//   };

//   const handleDelete = async (mapID: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/roadmaps/${mapID}`, {
//         method: 'DELETE',
//       });

//       if (res.ok) {
//         setRoadmaps(roadmaps.filter((roadmap) => roadmap.mapID !== mapID));
//       } else {
//         const data = await res.json();
//         setError(data.message || 'An error occurred while deleting the roadmap.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while deleting the roadmap.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (roadmap: any) => {
//     setEditData(roadmap);
//     setEditDialogOpen(true);
//   };

//   const handleSaveEdit = async () => {
//     if (!editData) return;

//     setLoading(true);
//     const { mapID, mapName, useCase, visibility } = editData;
//     const published = visibility === 'public';

//     try {
//       const res = await fetch(`/api/roadmaps/${mapID}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ mapName, useCase, published }),
//       });

//       if (res.ok) {
//         const updatedRoadmap = await res.json();
//         setRoadmaps(roadmaps.map((roadmap) => (roadmap.mapID === mapID ? updatedRoadmap : roadmap)));
//         setEditDialogOpen(false);
//       } else {
//         const data = await res.json();
//         setError(data.message || 'An error occurred while updating the roadmap.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while updating the roadmap.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-wrap gap-4 p-6">
//       <Card className="w-60 h-72 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center cursor-pointer">
//         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//           <DialogTrigger asChild>
//             <CardContent className="flex flex-col items-center justify-center flex-grow text-center">
//               <div className="text-4xl text-gray-400">+</div>
//               <div className="text-gray-600">Create Roadmap</div>
//             </CardContent>
//           </DialogTrigger>
//           <DialogContent className='lg:max-w-screen-sm'>
//             <DialogHeader>
//               <DialogTitle>Create Roadmap</DialogTitle>
//               <DialogDescription>Your journey begins here!</DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleGenerateName}>
//               {step === 1 && (
//                 <div className="grid gap-4 py-4">
//                   <div className="flex flex-col space-y-1.5">
//                     <Label htmlFor="useCase">Use Case</Label>
//                     <Input id="useCase" value={useCase} onChange={(e) => setUseCase(e.target.value)} required />
//                   </div>
//                   <div className="flex flex-col space-y-1.5">
//                     <Label htmlFor="visibility">Visibility</Label>
//                     <Select onValueChange={setVisibility} value={visibility}>
//                       <SelectTrigger id="visibility">
//                         <SelectValue placeholder="Select visibility" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectGroup>
//                           <SelectItem value="public">Public</SelectItem>
//                           <SelectItem value="private">Private</SelectItem>
//                         </SelectGroup>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               )}
//               {step === 2 && (
//                 <div className="grid gap-4 py-4">
//                   <div className="flex flex-col space-y-1.5">
//                     <Label htmlFor="generatedName">Generated Name</Label>
//                     <Input id="generatedName" value={generatedName} readOnly />
//                   </div>
//                 </div>
//               )}
//               <DialogFooter>
//                 {step === 1 ? (
//                   <Button type="submit" disabled={loading}>
//                     {loading ? 'Generating...' : 'Generate Name'}
//                   </Button>
//                 ) : (
//                   <>
//                     <Button onClick={handleApproveName} disabled={loading}>
//                       {loading ? 'Creating...' : 'Approve'}
//                     </Button>
//                     <Button onClick={handleRegenerateName} variant="outline" disabled={loading}>
//                       {loading ? 'Regenerating...' : 'Regenerate'}
//                     </Button>
//                   </>
//                 )}
//               </DialogFooter>
//               {error && <p className="text-red-600 mt-2">{error}</p>}
//             </form>
//           </DialogContent>
//         </Dialog>
//       </Card>
//       {roadmaps.map((roadmap) => (
//         <Card
//           key={roadmap.mapID}
//           className="w-60 h-72 bg-white flex flex-col p-4 cursor-pointer"
//           onClick={() => router.push(`/roadmap/${roadmap.mapID}`)}
//         >
//           <CardHeader className="flex p-0 justify-end">
//             <div className="flex space-x-1 items-end justify-end">
//               <Button className='border' variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(roadmap); }}>
//                 <FaEdit />
//               </Button>
//               <Button className='border' variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(roadmap.mapID); }}>
//                 <FaTrash />
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="flex-1 flex flex-col items-center justify-center p-0">
//             <div className="text-black text-center">{roadmap.mapName}</div>
//             <div className="text-gray-600 text-sm text-center">
//               {roadmap.published ? 'Public' : 'Private'}
//             </div>
//           </CardContent>
//           <CardFooter className="flex flex-col items-center p-0 mt-4">
//           </CardFooter>
//         </Card>
//       ))}
//       {editData && (
//         <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//           <DialogContent className='lg:max-w-screen-sm'>
//             <DialogHeader>
//               <DialogTitle>Edit Roadmap</DialogTitle>
//               <DialogDescription>Update the roadmap details.</DialogDescription>
//             </DialogHeader>
//             <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
//               <div className="grid gap-4 py-4">
//                 <div className="flex flex-col space-y-1.5">
//                   <Label htmlFor="editMapName">Map Name</Label>
//                   <Input
//                     id="editMapName"
//                     value={editData.mapName}
//                     onChange={(e) => setEditData({ ...editData, mapName: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <div className="flex flex-col space-y-1.5">
//                   <Label htmlFor="editUseCase">Use Case</Label>
//                   <Input
//                     id="editUseCase"
//                     value={editData.useCase}
//                     onChange={(e) => setEditData({ ...editData, useCase: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <div className="flex flex-col space-y-1.5">
//                   <Label htmlFor="editVisibility">Visibility</Label>
//                   <Select
//                     onValueChange={(value) => setEditData({ ...editData, visibility: value })}
//                     value={editData.visibility}
//                   >
//                     <SelectTrigger id="editVisibility">
//                       <SelectValue placeholder="Select visibility" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         <SelectItem value="public">Public</SelectItem>
//                         <SelectItem value="private">Private</SelectItem>
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button type="submit" disabled={loading}>
//                   {loading ? 'Saving...' : 'Save'}
//                 </Button>
//               </DialogFooter>
//               {error && <p className="text-red-600 mt-2">{error}</p>}
//             </form>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default RoadmapComponent;

"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FaEdit, FaTrash } from 'react-icons/fa';

const RoadmapComponent = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [useCase, setUseCase] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedName, setGeneratedName] = useState('');
  const [step, setStep] = useState(1); // 1 for input, 2 for confirmation
  const [dialogOpen, setDialogOpen] = useState(false); // Control dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await fetch('/api/roadmaps');
        const data = await res.json();
        setRoadmaps(data);
      } catch (error) {
        console.error('Error fetching roadmaps:', error);
      }
    };

    fetchRoadmaps();
  }, []);

  const handleGenerateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/generateMaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: useCase }),
      });
      const data = await res.json();

      if (res.ok) {
        setGeneratedName(data.mapName);
        setStep(2); // Move to confirmation step
      } else {
        setError(data.error || 'An error occurred while generating the map name.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while generating the map name.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveName = async () => {
    setLoading(true);
    const published = visibility === 'public';
    const creator = session?.user?.email;

    try {
      const res = await fetch('/api/roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mapName: generatedName,
          useCase,
          keyAreas: [],
          published,
          creator,
        }),
      });

      if (res.ok) {
        const newRoadmap = await res.json();
        setRoadmaps([...roadmaps, newRoadmap]);
        setUseCase('');
        setVisibility('private');
        setGeneratedName('');
        setStep(1); // Reset to input step
        setDialogOpen(false); // Close the dialog
      } else {
        const data = await res.json();
        setError(data.message || 'An error occurred while creating the roadmap.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while creating the roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateName = () => {
    setStep(1); // Reset to input step
    setGeneratedName('');
  };

  const handleDelete = async (mapID: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/roadmaps/${mapID}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setRoadmaps(roadmaps.filter((roadmap) => roadmap.mapID !== mapID));
      } else {
        const data = await res.json();
        setError(data.message || 'An error occurred while deleting the roadmap.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while deleting the roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (roadmap: any) => {
    setEditData(roadmap);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editData) return;

    setLoading(true);
    const { mapID, mapName, useCase, visibility } = editData;
    const published = visibility === 'public';

    try {
      const res = await fetch(`/api/roadmaps/${mapID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mapName, useCase, published }),
      });

      if (res.ok) {
        const updatedRoadmap = await res.json();
        setRoadmaps(roadmaps.map((roadmap) => (roadmap.mapID === mapID ? updatedRoadmap : roadmap)));
        setEditDialogOpen(false);
      } else {
        const data = await res.json();
        setError(data.message || 'An error occurred while updating the roadmap.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while updating the roadmap.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 p-6">
      <Card className="w-60 h-72 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center cursor-pointer">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <CardContent className="flex flex-col items-center justify-center flex-grow text-center">
              <div className="text-4xl text-gray-400">+</div>
              <div className="text-gray-600">Create Roadmap</div>
            </CardContent>
          </DialogTrigger>
          <DialogContent className='lg:max-w-screen-sm'>
            <DialogHeader>
              <DialogTitle>Create Roadmap</DialogTitle>
              <DialogDescription>Your journey begins here!</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleGenerateName}>
              {step === 1 && (
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="useCase">Use Case</Label>
                    <Input id="useCase" value={useCase} onChange={(e) => setUseCase(e.target.value)} required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select onValueChange={setVisibility} value={visibility}>
                      <SelectTrigger id="visibility">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="generatedName">Generated Name</Label>
                    <Input id="generatedName" value={generatedName} readOnly />
                  </div>
                </div>
              )}
              <DialogFooter>
                {step === 1 ? (
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Name'}
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleApproveName} disabled={loading}>
                      {loading ? 'Creating...' : 'Approve'}
                    </Button>
                    <Button onClick={handleRegenerateName} variant="outline" disabled={loading}>
                      {loading ? 'Regenerating...' : 'Regenerate'}
                    </Button>
                  </>
                )}
              </DialogFooter>
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </form>
          </DialogContent>
        </Dialog>
      </Card>
      {roadmaps.map((roadmap) => (
        <Card
          key={roadmap.mapID}
          className="w-60 h-72 bg-white flex flex-col p-4 cursor-pointer"
          onClick={() => router.push(`/roadmap/${roadmap.mapID}`)}
        >
          <CardHeader className="flex p-0 justify-end">
            <div className="flex space-x-1 items-end justify-end">
              <Button className='border' variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(roadmap); }}>
                <FaEdit />
              </Button>
              <Button className='border' variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(roadmap.mapID); }}>
                <FaTrash />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center p-0">
            <div className="text-black text-center">{roadmap.mapName}</div>
            <div className="text-gray-600 text-sm text-center">
              {roadmap.published ? 'Public' : 'Private'}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center p-0 mt-4">
          </CardFooter>
        </Card>
      ))}
      {editData && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className='lg:max-w-screen-sm'>
            <DialogHeader>
              <DialogTitle>Edit Roadmap</DialogTitle>
              <DialogDescription>Update the roadmap information.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="editMapName">Map Name</Label>
                  <Input
                    id="editMapName"
                    value={editData.mapName}
                    onChange={(e) => setEditData({ ...editData, mapName: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="editUseCase">Use Case</Label>
                  <Input
                    id="editUseCase"
                    value={editData.useCase}
                    onChange={(e) => setEditData({ ...editData, useCase: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="editVisibility">Visibility</Label>
                  <Select
                    onValueChange={(value) => setEditData({ ...editData, visibility: value })}
                    value={editData.visibility}
                  >
                    <SelectTrigger id="editVisibility">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RoadmapComponent;
