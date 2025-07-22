  import React from 'react';
import { Card, CardContent, Typography, Button, Box, Avatar, Chip, Stack, Divider } from '@mui/material';
import { Icon } from '@iconify/react';

const ActivityCard = ({ activities, onGoToProjects, sx = {} }) => (
  <Card sx={{
    borderRadius: 0,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    height: '400px',
    background: 'white',
    ...sx
  }}>
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Activity
        </Typography>
        <Button size="small" variant="text" sx={{ fontSize: 12, textTransform: 'none' }}>?</Button>
      </Stack>

      {activities.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Icon icon="mdi:calendar-clock-outline" width={48} height={48} color="#bdbdbd" />
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Follow client activities—messages, meetings, files, payments and more.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button size="small" variant="text" sx={{ fontSize: 12, textTransform: 'none', color: '#1976d2' }}>
              Create project
            </Button>
          </Box>
          <Box>
            <Button size="small" variant="text" sx={{ fontSize: 12, textTransform: 'none', color: '#1976d2' }}>
              Learn about your activity feed
            </Button>
          </Box>
        </Box>
      ) : (
        <Stack spacing={2}>
          {activities.map((activity, idx) => (
            <Box key={idx}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                  sx={{
                    bgcolor: '#f5f5f5',
                    color: '#666',
                    width: 36,
                    height: 36,
                    fontSize: '0.875rem',
                    mt: 0.5
                  }}
                >
                  <Icon icon="mdi:briefcase" width={18} height={18} />
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {activity.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {activity.contact}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {activity.time}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={activity.type}
                      size="small"
                      sx={{
                        bgcolor: '#f5f5f5',
                        color: '#666',
                        fontSize: '0.7rem',
                        height: 20
                      }}
                    />
                    <Chip
                      label={activity.stage}
                      size="small"
                      sx={{
                        bgcolor: '#f5f5f5',
                        color: '#666',
                        fontSize: '0.7rem',
                        height: 20
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
              {idx < activities.length - 1 && <Divider sx={{ mt: 2 }} />}
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
        onClick={onGoToProjects}
      >
        Go to active projects
      </Button>
    </CardContent>
  </Card>
);

export default ActivityCard;
