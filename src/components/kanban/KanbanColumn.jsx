import React from 'react';
import KanbanCard from './KanbanCard';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function KanbanColumn({ stage, contacts, isProject, contactsList, mutateProject, columnHeight }) {
  // Calculate minHeight: 0 if no projects, else (projects * 90px + 32px for header/padding)
  const isEmpty = contacts.length === 0;
  return (
    <Droppable droppableId={stage}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.droppableProps}
          elevation={3}
          sx={{
            minWidth: 320,
            maxWidth: 350,
            p: 2,
            bgcolor: '#fff',
            borderRadius: 2,
            transition: 'box-shadow 0.2s',
            boxShadow: snapshot.isDraggingOver ? '0 0 0 2px #c7d2fe' : '0 2px 6px rgba(0,0,0,0.04)',
            ...(isEmpty
              ? { height: '100px', minHeight: 'auto', flex: 'auto' }
              : { height: 'auto' }),
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            {stage}
          </Typography>
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {contacts.map((contact, idx) =>
              isProject && contact && contact._id ? (
                <Draggable key={contact._id} draggableId={contact._id.toString()} index={idx}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        marginBottom: 16,
                        opacity: snapshot.isDragging ? 0.75 : 1,
                      }}
                    >
                      <KanbanCard
                        contact={contact}
                        isProject
                        contactsList={contactsList}
                        mutateProject={mutateProject}
                        compact
                      />
                    </div>
                  )}
                </Draggable>
              ) : null
            )}
            {provided.placeholder}
          </div>
        </Paper>
      )}
    </Droppable>
  );
}
