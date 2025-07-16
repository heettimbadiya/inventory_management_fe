import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const ActivityCard = ({ activities, onGoToProjects, sx = {} }) => (
  <Card sx={sx}>
    <CardContent>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Activity</Typography>
      {activities.length === 0 ? (
        <Typography>No activity</Typography>
      ) : (
        activities.map((activity, idx) => (
          <Box key={idx} sx={{ mb: 1 }}>
            <Typography variant="body2">{activity.name}</Typography>
            <Typography variant="caption" color="text.secondary">{activity.time}</Typography>
          </Box>
        ))
      )}
      <Button size="small" sx={{ mt: 1 }} onClick={onGoToProjects}>Go to active projects</Button>
    </CardContent>
  </Card>
);

export default ActivityCard; 