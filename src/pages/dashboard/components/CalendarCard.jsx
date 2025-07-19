import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  ButtonBase,
  Avatar,
  Chip,
  Divider,
  Button,
  IconButton
} from '@mui/material';
import { Icon } from '@iconify/react';

const CalendarCard = ({ onMeeting, projects = [], sx = {} }) => {
  // Get today's date for calendar display
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.toLocaleDateString('en-US', { month: 'short' });

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        height: '100%',
        background: 'white',
        ...sx,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#212121' }}>
            Calendar
          </Typography>
          <IconButton 
            size="small" 
            sx={{ 
              color: '#666',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            <Icon icon="mdi:plus" width={16} height={16} />
          </IconButton>
        </Stack>

        {/* Calendar Icon with Date */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ 
            position: 'relative', 
            display: 'inline-block',
            mb: 2
          }}>
            <Icon icon="mdi:calendar" width={64} height={64} color="#1976d2" />
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: '#1976d2',
                lineHeight: 1,
                mb: 0.5
              }}>
                {currentDay}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: '#1976d2',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}>
                {currentMonth}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Upcoming Events */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            color: '#212121',
            mb: 2
          }}>
            Upcoming Events
          </Typography>
          
          {projects.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Icon icon="mdi:calendar-blank-outline" width={40} height={40} color="#bdbdbd" />
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                No scheduled events
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Your calendar is clear today
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {projects.slice(0, 3).map((project, idx) => (
                <Box key={idx}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: '#1976d2',
                      mt: 1.5,
                      flexShrink: 0
                    }} />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ color: '#212121', mb: 0.5 }}
                      >
                        {project.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 0.5 }}
                      >
                        {project.contact?.fullName || 'No contact'}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 1 }}
                      >
                        {formatDateRange(project.startTime, project.endTime)}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip 
                          label={project.type} 
                          size="small" 
                          sx={{ 
                            bgcolor: '#e3f2fd',
                            color: '#1976d2',
                            fontSize: '0.7rem',
                            height: 20,
                            fontWeight: 500
                          }} 
                        />
                        <Chip 
                          label={project.stage} 
                          size="small" 
                          sx={{ 
                            bgcolor: getStageColor(project.stage).bg,
                            color: getStageColor(project.stage).text,
                            fontSize: '0.7rem',
                            height: 20,
                            fontWeight: 500
                          }} 
                        />
                      </Stack>
                    </Box>
                  </Stack>
                  {idx < Math.min(projects.length, 3) - 1 && (
                    <Divider sx={{ mt: 2, borderColor: '#f0f0f0' }} />
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {/* Quick Actions */}
        <Stack spacing={1}>
          <Button 
            variant="outlined" 
            fullWidth 
            startIcon={<Icon icon="mdi:calendar-plus" width={16} height={16} />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: '#1976d2',
              color: '#1976d2',
              '&:hover': {
                bgcolor: '#e3f2fd',
                borderColor: '#1565c0'
              }
            }}
            onClick={onMeeting}
          >
            Schedule Meeting
          </Button>
          <Button 
            variant="text" 
            fullWidth 
            sx={{ 
              textTransform: 'none',
              color: '#666',
              fontSize: '0.875rem',
              '&:hover': {
                bgcolor: '#f5f5f5'
              }
            }}
          >
            View Full Calendar
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Helper: format time range
const formatDateRange = (startTime, endTime) => {
  if (!startTime) return 'No time set';
  
  try {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : null;
    
    const startStr = start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    if (!end) return startStr;
    
    const endStr = end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${startStr} - ${endStr}`;
  } catch (error) {
    return 'Invalid date';
  }
};

// Helper: get stage color
const getStageColor = (stage) => {
  switch (stage) {
    case 'Retainer Paid':
      return { bg: '#e8f5e8', text: '#2e7d32' };
    case 'Questionnaire Sent':
      return { bg: '#fff3e0', text: '#ed6c02' };
    case 'Proposal Sent':
      return { bg: '#f3e5f5', text: '#9c27b0' };
    case 'Completed':
      return { bg: '#e8f5e8', text: '#2e7d32' };
    default:
      return { bg: '#f5f5f5', text: '#666' };
  }
};

export default CalendarCard;
