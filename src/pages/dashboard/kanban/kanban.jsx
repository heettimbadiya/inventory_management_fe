import React from 'react';
import { useGetProject, updateProject } from 'src/api/project';
import { useGetContact } from 'src/api/contact';
import KanbanColumn from 'src/components/kanban/KanbanColumn';
import { DragDropContext } from 'react-beautiful-dnd';
import { PROJECT_STAGES } from 'src/sections/project/project-new-edit-form.jsx';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Kanban() {
  const { projects, projectLoading, projectError, mutate } = useGetProject();
  const { contact: contacts } = useGetContact();
  const [localProjects, setLocalProjects] = React.useState([]);
  const [filter, setFilter] = React.useState('');

  React.useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);

  const filteredProjects = React.useMemo(() => {
    if (!filter) return localProjects;
    const lower = filter.toLowerCase();
    return localProjects.filter((p) =>
      (p.name && p.name.toLowerCase().includes(lower)) ||
      (p.type && p.type.toLowerCase().includes(lower)) ||
      (p.contact && p.contact.fullName && p.contact.fullName.toLowerCase().includes(lower))
    );
  }, [localProjects, filter]);

  const columns = React.useMemo(() => {
    const grouped = {};
    PROJECT_STAGES.forEach((stage) => {
      grouped[stage] = [];
    });
    filteredProjects.forEach((p) => {
      const stage = p.stage || PROJECT_STAGES[0];
      if (!grouped[stage]) grouped[stage] = [];
      grouped[stage].push(p);
    });
    return grouped;
  }, [filteredProjects]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;
    const project = localProjects.find((p) => p._id.toString() === draggableId);
    if (!project) return;

    const updatedProjects = localProjects.map((p) =>
      p._id === project._id ? { ...p, stage: destination.droppableId } : p
    );
    setLocalProjects(updatedProjects);

    try {
      await updateProject(project._id, { ...project, stage: destination.droppableId });
      mutate();
    } catch (e) {
      setLocalProjects(localProjects);
      alert('Failed to update project stage');
    }
  };

  if (projectLoading) return <Typography>Loading...</Typography>;
  if (projectError) return <Typography>Error loading projects.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>Kanban Board</Typography>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2 }}>
          {PROJECT_STAGES.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              contacts={columns[stage]}
              isProject
              contactsList={contacts}
              mutateProject={mutate}
            />
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
}
