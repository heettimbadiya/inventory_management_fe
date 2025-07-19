import React from 'react';
import { Card, CardContent, Typography, Button, Box, Stack, Tabs, Tab } from '@mui/material';
import { Icon } from '@iconify/react';

const PaymentsOverviewCard = ({ title, message, onCheckInvoices, sx = {} }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
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
            {title}
          </Typography>
          <Button size="small" variant="text" sx={{ fontSize: 12, textTransform: 'none' }}>?</Button>
        </Stack>

        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            mb: 2,
            '& .MuiTab-root': {
              minWidth: 'auto',
              fontSize: '0.75rem',
              textTransform: 'none',
              color: '#666',
              '&.Mui-selected': {
                color: '#1976d2'
              }
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#1976d2'
            }
          }}
        >
          <Tab label="Charged/Processing (0)" />
          <Tab label="Upcoming (0)" />
          <Tab label="Overdue (0)" />
        </Tabs>

        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Icon icon="mdi:receipt" width={48} height={48} color="#bdbdbd" />
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            {message}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button size="small" variant="text" sx={{ fontSize: 12, textTransform: 'none', color: '#1976d2' }}>
              Create invoice
            </Button>
          </Box>
          <Box>
            <Button size="small" variant="text" sx={{ fontSize: 12, textTransform: 'none', color: '#1976d2' }}>
              Payments FAQ
            </Button>
          </Box>
        </Box>

        <Button
          variant="text"
          size="small"
          sx={{
            textTransform: 'none',
            color: '#1976d2',
            fontSize: 12
          }}
          onClick={onCheckInvoices}
        >
          {`Go to payments >`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentsOverviewCard;
