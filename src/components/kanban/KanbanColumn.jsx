import React from 'react';
import KanbanCard from './KanbanCard';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const STAGE_COLORS = {
  Inquiry: '#e3f2fd',
  'Questionnaire Sent': '#fff3e0',
  'Follow Up': '#fce4ec',
  'Brochure sent': '#e8f5e9',
  Consult: '#ede7f6',
  'Proposal Sent': '#f3e5f5',
  'Proposal Signed': '#f9fbe7',
  'Retainer Paid': '#e0f2f1',
  Planning: '#fbe9e7',
  Completed: '#f1f8e9',
  Archived: '#eceff1',
};

export default function KanbanColumn({ stage, contacts, isProject, contactsList, mutateProject }) {
  return (
    <Droppable droppableId={stage}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            minWidth: 320,
            flex: 1,
            background: STAGE_COLORS[stage] || '#f4f6f8',
            borderRadius: 12,
            padding: 12,
            transition: 'background 0.2s',
            boxShadow: snapshot.isDraggingOver ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>{stage}</h2>
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
                      margin: '12px 0',
                      opacity: snapshot.isDragging ? 0.7 : 1,
                    }}
                  >
                    <KanbanCard contact={contact} isProject contactsList={contactsList} mutateProject={mutateProject} />
                  </div>
                )}
              </Draggable>
            ) : null
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
} 