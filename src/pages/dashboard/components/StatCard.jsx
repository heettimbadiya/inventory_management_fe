import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip, Divider, Stack } from '@mui/material';
import Iconify from 'src/components/iconify';

const StatCard = ({ label, value, tooltip, valuePrefix, showDivider, sx = {} }) => (
  <Box sx={{ display: 'flex', alignItems: 'stretch', height: 1 }}>
    <Card sx={{ flex: 1, boxShadow: 'none', borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...sx }}>
      <CardContent sx={{ p: 3, textAlign: 'left', '&:last-child': { pb: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          <Tooltip title={tooltip || label} arrow>
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', ml: 0.5 }}>
              <Iconify icon="eva:info-outline" width={16} sx={{ color: 'text.disabled' }} />
            </Box>
          </Tooltip>
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
          {valuePrefix}{value}
        </Typography>
      </CardContent>
    </Card>
    {showDivider && (
      <Divider orientation="vertical" flexItem sx={{ mx: 0, my: 2, borderColor: 'divider' }} />
    )}
  </Box>
);

export default StatCard; 