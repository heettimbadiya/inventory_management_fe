import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  ButtonBase,
} from '@mui/material';
import { Icon } from '@iconify/react';

const CalendarCard = ({ onMeeting, projects = [], sx = {} }) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      p: 2,
      ...sx,
    }}
  >
    <CardContent sx={{  p: 1 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Calender</Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        {projects.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No meetings
          </Typography>
        ) : (
          projects.map((project, idx) => (
            <Box key={idx}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ color: '#212121' }}
              >
                {project.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '12px' }}
              >
                {formatDateRange(project.startTime, project.endTime)}
              </Typography>
            </Box>
          ))
        )}
      </Stack>

      {/* Meeting Link */}
      <ButtonBase
        onClick={onMeeting}
        sx={{
          mt: 3,
          color: '#1a73e8',
          fontWeight: 500,
          fontSize: '14px',
          borderRadius: 1,
          '&:hover': {
            textDecoration: 'underline',
            backgroundColor: 'transparent',
          },
        }}
      >
        Meeting
      </ButtonBase>
    </CardContent>
  </Card>
);

// Helper: format time range
const formatDateRange = (start, end) => {
  const startFormatted = start ? new Date(start).toLocaleString() : '';
  const endFormatted = end ? new Date(end).toLocaleString() : '';
  return `${startFormatted}${end ? ` - ${endFormatted}` : ''}`;
};

export default CalendarCard;
