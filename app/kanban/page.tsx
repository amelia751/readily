"use client"
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// DnD
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

// Components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Module from '@/components/Module';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type DNDType = {
  id: UniqueIdentifier;
  title: string;
  modules: {
    id: UniqueIdentifier;
    title: string;
  }[];
};

export default function Home() {
  const [skills, setSkills] = useState<DNDType[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentSkillId, setCurrentSkillId] = useState<UniqueIdentifier>();
  const [skillName, setSkillName] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);

  const onAddSkill = () => {
    if (!skillName) return;
    const id = `skill-${uuidv4()}`;
    setSkills([
      ...skills,
      {
        id,
        title: skillName,
        modules: [],
      },
    ]);
    setSkillName('');
    setShowAddSkillModal(false);
  };

  const onAddModule = () => {
    if (!moduleName) return;
    const id = `module-${uuidv4()}`;
    const skill = skills.find((skill) => skill.id === currentSkillId);
    if (!skill) return;
    skill.modules.push({
      id,
      title: moduleName,
    });
    setSkills([...skills]);
    setModuleName('');
    setShowAddModuleModal(false);
  };

  // Find the value of the modules
  function findValueOfModules(id: UniqueIdentifier | undefined, type: string) {
    if (type === 'skill') {
      return skills.find((skill) => skill.id === id);
    }
    if (type === 'module') {
      return skills.find((skill) =>
        skill.modules.find((module) => module.id === id),
      );
    }
  }

  const findModuleTitle = (id: UniqueIdentifier | undefined) => {
    const skill = findValueOfModules(id, 'module');
    if (!skill) return '';
    const module = skill.modules.find((module) => module.id === id);
    if (!module) return '';
    return module.title;
  };

  const findSkillTitle = (id: UniqueIdentifier | undefined) => {
    const skill = findValueOfModules(id, 'skill');
    if (!skill) return '';
    return skill.title;
  };

  const findSkillModules = (id: UniqueIdentifier | undefined) => {
    const skill = findValueOfModules(id, 'skill');
    if (!skill) return [];
    return skill.modules;
  };

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handling module Sorting and moving to different skills
    if (active.id.toString().includes('module')) {
      const activeSkill = findValueOfModules(active.id, 'module');
      const overSkill = findValueOfModules(over.id, 'module') || findValueOfModules(over.id, 'skill');

      if (!activeSkill || !overSkill) return;

      const activeSkillIndex = skills.findIndex(
        (skill) => skill.id === activeSkill.id,
      );
      const overSkillIndex = skills.findIndex(
        (skill) => skill.id === overSkill.id,
      );

      const activeModuleIndex = activeSkill.modules.findIndex(
        (module) => module.id === active.id,
      );

      if (activeSkillIndex === overSkillIndex) {
        let newModules = [...skills];
        newModules[activeSkillIndex].modules = arrayMove(
          newModules[activeSkillIndex].modules,
          activeModuleIndex,
          over.id.toString().includes('module') ? overSkill.modules.findIndex((module) => module.id === over.id) : overSkill.modules.length,
        );
        setSkills(newModules);
      } else {
        let newModules = [...skills];
        const [removedModule] = newModules[activeSkillIndex].modules.splice(
          activeModuleIndex,
          1,
        );
        newModules[overSkillIndex].modules.splice(
          over.id.toString().includes('module') ? overSkill.modules.findIndex((module) => module.id === over.id) : overSkill.modules.length,
          0,
          removedModule,
        );
        setSkills(newModules);
      }
    }

    // Handling Skill Sorting
    if (
      active.id.toString().includes('skill') &&
      over?.id.toString().includes('skill') &&
      active.id !== over.id
    ) {
      const activeSkillIndex = skills.findIndex(
        (skill) => skill.id === active.id,
      );
      const overSkillIndex = skills.findIndex(
        (skill) => skill.id === over.id,
      );
      let newSkills = [...skills];
      newSkills = arrayMove(newSkills, activeSkillIndex, overSkillIndex);
      setSkills(newSkills);
    }
    setActiveId(null);
  };

  return (
    <div className="mx-auto max-w-7xl py-10">
      {/* Add Skill Dialog */}
      <Dialog open={showAddSkillModal} onOpenChange={setShowAddSkillModal}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setShowAddSkillModal(true)}>Add Skill</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                type="text"
                placeholder="Skill Title"
                name="skillname"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={onAddSkill}>Add Skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Add Module Dialog */}
      <Dialog open={showAddModuleModal} onOpenChange={setShowAddModuleModal}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setShowAddModuleModal(true)}>Add Module</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Module</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                type="text"
                placeholder="Module Title"
                name="modulename"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={onAddModule}>Add Module</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="mt-10">
        <div className="grid grid-cols-3 gap-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={skills.map((i) => i.id)}>
              {skills.map((skill) => (
                <DroppableSkill key={skill.id} id={skill.id} modules={skill.modules}>
                  <Card className="w-[350px]">
                    <CardHeader>
                      <CardTitle>{skill.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SortableContext items={skill.modules.map((i) => i.id)}>
                        <div className="flex items-start flex-col gap-y-4">
                          {skill.modules.map((module) => (
                            <Module title={module.title} id={module.id} key={module.id} />
                          ))}
                        </div>
                      </SortableContext>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => {
                        setShowAddModuleModal(true);
                        setCurrentSkillId(skill.id);
                      }}>
                        Add Module
                      </Button>
                    </CardFooter>
                  </Card>
                </DroppableSkill>
              ))}
            </SortableContext>
            <DragOverlay adjustScale={false}>
              {/* Drag Overlay For Module */}
              {activeId && activeId.toString().includes('module') && (
                <Module id={activeId} title={findModuleTitle(activeId)} />
              )}
              {/* Drag Overlay For Skill */}
              {activeId && activeId.toString().includes('skill') && (
                <Card id={activeId.toString()} className="w-[350px]">
                  <CardHeader>
                    <CardTitle>{findSkillTitle(activeId)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {findSkillModules(activeId).map((module) => (
                      <Module key={module.id} title={module.title} id={module.id} />
                    ))}
                  </CardContent>
                </Card>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

interface DroppableSkillProps {
  id: UniqueIdentifier;
  modules: { id: UniqueIdentifier; title: string }[];
  children: React.ReactNode;
}

const DroppableSkill = ({ id, modules, children }: DroppableSkillProps) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  );
};
