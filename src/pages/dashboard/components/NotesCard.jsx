import React from 'react';
import { Card, CardContent, Typography, Button, Box, Avatar, Stack, Divider } from '@mui/material';
import { Icon } from '@iconify/react';

const NotesCard = ({ title, notes, onAddNote, sx = {} }) => (
  <Card sx={{
    borderRadius: 0,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    height: '400px',
    overflowY: 'auto',
    overflowX: 'hidden',
    background: 'white',
    ...sx
  }}>
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Stack>

      {(!notes || notes.length === 0) ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Icon icon="mdi:note-text-outline" width={48} height={48} color="#bdbdbd" />
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Keep all your client notes here. Free your mind with notes.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {notes.map((note, idx) => (
            <Box key={idx}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                  sx={{
                    bgcolor: '#f5f5f5',
                    color: '#666',
                    width: 32,
                    height: 32,
                    fontSize: '0.8rem',
                    mt: 0.5
                  }}
                >
                  <Icon icon="mdi:file-document-outline" width={16} height={16} />
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {note.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {note.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {note.time}
                  </Typography>
                </Box>
              </Stack>
              {idx < notes.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Stack>
      )}
      <Button
        variant="text"
        size="small"
        sx={{
          mt: 2,
          textTransform: 'none',
          color: '#1976d2',
          fontSize: 12
        }}
        onClick={onAddNote}
      >
        Show all
      </Button>
    </CardContent>
  </Card>
);

export default NotesCard;
