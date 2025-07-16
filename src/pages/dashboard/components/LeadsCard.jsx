import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const LeadsCard = ({ leads, onGoToInquiries, sx = {} }) => (
  <Card sx={sx}>
    <CardContent>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Leads</Typography>
      {leads.length === 0 ? (
        <Typography>No leads</Typography>
      ) : (
        leads.map((lead, idx) => (
          <Box key={idx} sx={{ mb: 1 }}>
            <Typography variant="body2">{lead.name}</Typography>
            <Typography variant="caption" color="text.secondary">{lead.time}</Typography>
          </Box>
        ))
      )}
      <Button size="small" sx={{ mt: 1 }} onClick={onGoToInquiries}>Go to inquiries</Button>
    </CardContent>
  </Card>
);

export default LeadsCard;
