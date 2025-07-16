import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const NotesCard = ({ title, message, onAddNote, sx = {} }) => (
  <Card sx={sx}>
    <CardContent>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>{title}</Typography>
      <Typography variant="body2">{message}</Typography>
      <Button size="small" sx={{ mt: 1 }} onClick={onAddNote}>New note</Button>
    </CardContent>
  </Card>
);

export default NotesCard; 