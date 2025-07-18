import React, { useState } from 'react';
import {
  Card, Typography, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Autocomplete
} from '@mui/material';
import { updateProject } from 'src/api/project';
import { useRouter } from 'src/routes/hooks';

const STAGE_COLORS = {
  Inquiry: '#1976d2',
  'Questionnaire Sent': '#ff9800',
  'Follow Up': '#d81b60',
  'Brochure sent': '#43a047',
  Consult: '#7e57c2',
  'Proposal Sent': '#8e24aa',
  'Proposal Signed': '#cddc39',
  'Retainer Paid': '#009688',
  Planning: '#ff7043',
  Completed: '#689f38',
  Archived: '#90a4ae',
};

export default function KanbanCard({ contact, isProject, contactsList = [], mutateProject, compact }) {
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(contact.contact || null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEditContact = (e) => {
    e.stopPropagation();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleSave = async () => {
    if (!selectedContact || !selectedContact._id) return;
    setLoading(true);
    try {
      await updateProject(contact._id, { ...contact, contact: selectedContact._id });
      mutateProject?.();
      setOpen(false);
    } catch {
      alert('Failed to update contact');
    } finally {
      setLoading(false);
    }
  };

  if (isProject && compact) {
    return (
      <Card
        variant="outlined"
        sx={{
          borderLeft: `4px solid ${STAGE_COLORS[contact.stage] || '#1976d2'}`,
          borderRadius: 2,
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          mb: 2,
          cursor: 'pointer',
          transition: 'box-shadow 0.2s',
          '&:hover': { boxShadow: '0 4px 16px rgba(25, 118, 210, 0.12)' },
          p: 1.25,
          pr: 1.5,
        }}
        onClick={() => router.push(`/dashboard/project/${contact._id}/view`)}
      >
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5, lineHeight: 1.2 }}>
          {contact.name}
          <Chip label={contact.type} size="small" sx={{ ml: 1, height: 22, fontSize: 13, px: 0.5 }} />
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25, lineHeight: 1.2 }}>
          Stage:
          <Chip
            label={contact.stage}
            size="small"
            sx={{ ml: 1, bgcolor: STAGE_COLORS[contact.stage], color: '#fff', height: 22, fontSize: 13, px: 0.5 }}
          />
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25, lineHeight: 1.2 }}>
          Contact: {contact.contact?.fullName || '-'}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 0.5, py: 0.5, px: 1.5, fontSize: 13, minHeight: 28, minWidth: 0 }}
          onClick={handleEditContact}
        >
          Edit Contact
        </Button>
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
          <DialogTitle>Edit Project Contact</DialogTitle>
          <DialogContent>
            <Autocomplete
              options={contactsList}
              getOptionLabel={option => option.fullName || ''}
              value={selectedContact}
              onChange={(_, value) => setSelectedContact(value)}
              renderInput={params => <TextField {...params} label="Select Contact" fullWidth />}
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" disabled={loading || !selectedContact}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    );
  }
  // fallback for non-project cards or full details
  return null;
}
