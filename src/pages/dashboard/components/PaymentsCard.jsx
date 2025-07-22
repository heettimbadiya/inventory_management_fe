import React from 'react';
import { Card, CardContent, Typography, Button, Box, Stack } from '@mui/material';
import { Icon } from '@iconify/react';

const PaymentsCard = ({ summary, amount, onGoToPayments, sx = {} }) => (
  <Card sx={{
    borderRadius: 0,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    height: '100%',
    background: 'white',
    ...sx
  }}>
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {summary}
        </Typography>
        {/*<Button size="small" variant="text" sx={{ fontSize: 12, textTransform: 'none' }}>?</Button>*/}
      </Stack>

      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        {amount}
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        July gross payments
      </Typography>

      <Stack spacing={1} sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50' }} />
            <Typography variant="caption">Deposited (0)</Typography>
          </Stack>
          <Typography variant="caption">$0</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff9800' }} />
            <Typography variant="caption">Processing (0)</Typography>
          </Stack>
          <Typography variant="caption">$0</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#9e9e9e' }} />
            <Typography variant="caption">Upcoming (0)</Typography>
          </Stack>
          <Typography variant="caption">$0</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f44336' }} />
            <Typography variant="caption">Overdue (0)</Typography>
          </Stack>
          <Typography variant="caption">$0</Typography>
        </Stack>
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        All existing overdue payments (0) $0
      </Typography>

      <Button
        variant="text"
        size="small"
        sx={{
          textTransform: 'none',
          color: '#1976d2',
          fontSize: 12
        }}
        onClick={onGoToPayments}
      >
        {`Go to payments >`}
      </Button>
    </CardContent>
  </Card>
);

export default PaymentsCard;
