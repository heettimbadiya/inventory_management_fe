import React from 'react';
import { Card, CardContent, Typography, Button, Box, Avatar, Chip, Stack, Divider } from '@mui/material';
import { Icon } from '@iconify/react';

const LeadsCard = ({ leads, onGoToInquiries, sx = {} }) => (
  <Card sx={{
    borderRadius: 2,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    height: '100%',
    background: 'white',
    ...sx
  }}>
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Leads
        </Typography>
        {/*<Button size="small" variant="text" sx={{ fontSize: 12, textTransform: 'none' }}>?</Button>*/}
      </Stack>

      {leads.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Icon icon="mdi:account-group-outline" width={48} height={48} color="#bdbdbd" />
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            You've handled everything. Break dance time 🕺
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {leads.map((lead, idx) => (
            <Box key={idx}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: '#f5f5f5',
                    color: '#666',
                    width: 36,
                    height: 36,
                    fontSize: '0.875rem'
                  }}
                >
                  {lead.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {lead.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {lead.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {lead.time}
                  </Typography>
                </Box>
                <Chip
                  label={lead.status}
                  size="small"
                  sx={{
                    bgcolor: '#f5f5f5',
                    color: '#666',
                    fontSize: '0.7rem',
                    height: 20
                  }}
                />
              </Stack>
              {idx < leads.length - 1 && <Divider sx={{ mt: 2 }} />}
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
        onClick={onGoToInquiries}
      >
        Show all
      </Button>
    </CardContent>
  </Card>
);

export default LeadsCard;
