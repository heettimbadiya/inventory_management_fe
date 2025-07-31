import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip, Divider, Stack } from '@mui/material';
import Iconify from 'src/components/iconify';

const StatCard = ({ label, value, tooltip, valuePrefix, showDivider, sx = {} }) => (
  <Box sx={{ display: 'flex', alignItems: 'stretch', height: 1}}>
    <Box sx={{
      flex: 1,
      boxShadow: 'none',
      borderRadius: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: 'white',
      // borderRight: '1px solid #e0e0e0',
      ...sx
    }}>
      <CardContent sx={{ p:3,textAlign: 'left', '&:last-child': { pb: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="subtitle2" color="text.dark" sx={{ fontWeight: 400 }}>
            {label}
          </Typography>
          <Tooltip title={tooltip || label} arrow>
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', ml: 0.5 }}>
              <Iconify icon="eva:info-outline" width={16} sx={{ color: 'text.disabled' }} />
            </Box>
          </Tooltip>
        </Stack>
        <Typography variant="h3" sx={{ fontWeight: 100}}>
          {valuePrefix}{value}
        </Typography>
      </CardContent>
    </Box>
    {showDivider && (
      <Divider orientation="vertical" flexItem sx={{ mx: 0, my: 2, borderColor: 'divider' }} />
    )}
  </Box>
);

export default StatCard;
