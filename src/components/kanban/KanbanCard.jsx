import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { updateProject } from 'src/api/project';

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

export default function KanbanCard({ contact, isProject, contactsList = [], mutateProject }) {
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(contact.contact || null);
  const [loading, setLoading] = useState(false);

  const handleEditContact = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSave = async () => {
    if (!selectedContact || !selectedContact._id) return;
    setLoading(true);
    try {
      await updateProject(contact._id, { ...contact, contact: selectedContact._id });
      if (mutateProject) mutateProject();
      setOpen(false);
    } catch (e) {
      alert('Failed to update contact');
    } finally {
      setLoading(false);
    }
  };

  if (isProject) {
    return (
      <>
        <Card
          variant="outlined"
          sx={{
            borderLeft: `6px solid ${STAGE_COLORS[contact.stage] || '#1976d2'}`,
            mb: 2,
            p: 2,
            boxShadow: 2,
            borderRadius: 2,
            background: '#fff',
            position: 'relative',
          }}
        >
          <Typography variant="h6" sx={{ mb: 0.5 }}>{contact.name} <Chip label={contact.type} size="small" sx={{ ml: 1 }} /></Typography>
          <Typography variant="body2" color="text.secondary">Lead Source: {contact.leadSource}</Typography>
          <Typography variant="body2" color="text.secondary">Timezone: {contact.timezone}</Typography>
          <Typography variant="body2" color="text.secondary">Stage: <Chip label={contact.stage} size="small" sx={{ ml: 0.5, bgcolor: STAGE_COLORS[contact.stage] || '#1976d2', color: '#fff' }} /></Typography>
          <Typography variant="body2" color="text.secondary">Start: {contact.startDate ? new Date(contact.startDate).toLocaleDateString() : '-'}</Typography>
          <Typography variant="body2" color="text.secondary">End: {contact.endDate ? new Date(contact.endDate).toLocaleDateString() : '-'}</Typography>
          {contact.contact && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>Contact Info:</Typography>
              <Typography variant="body2">Name: {contact.contact.fullName}</Typography>
              <Typography variant="body2">Email: {contact.contact.email}</Typography>
              <Typography variant="body2">Phone: {contact.contact.contact}</Typography>
              <Typography variant="body2">Status: {contact.contact.status}</Typography>
            </>
          )}
          <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={handleEditContact}>Edit Contact</Button>
        </Card>
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
            <Button onClick={handleSave} variant="contained" disabled={loading || !selectedContact || !selectedContact._id}>{loading ? 'Saving...' : 'Save'}</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
  // fallback for non-project cards
  return (
    <Card variant="outlined" sx={{ mb: 2, p: 2, boxShadow: 2, borderRadius: 2, background: '#fff' }}>
      <Typography variant="h6">{contact.name}</Typography>
      <Typography variant="body2">{contact.email}</Typography>
      <Typography variant="body2">{contact.phone}</Typography>
    </Card>
  );
} 