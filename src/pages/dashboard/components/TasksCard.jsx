import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const TasksCard = ({ tasks, onGoToTasks, sx = {} }) => (
  <Card sx={sx}>
    <CardContent>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Tasks</Typography>
      {tasks.length === 0 ? (
        <Typography>No new tasks.</Typography>
      ) : (
        tasks.map((task, idx) => (
          <Box key={idx} sx={{ mb: 1 }}>
            <Typography variant="body2">{task.title}</Typography>
            <Typography variant="caption" color="text.secondary">{task.status}</Typography>
          </Box>
        ))
      )}
      <Button size="small" sx={{ mt: 1 }} onClick={onGoToTasks}>Go to tasks</Button>
    </CardContent>
  </Card>
);

export default TasksCard; 