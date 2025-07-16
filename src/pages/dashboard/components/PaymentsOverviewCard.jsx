import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const PaymentsOverviewCard = ({ title, message, onCheckInvoices, sx = {} }) => (
  <Card sx={sx}>
    <CardContent>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>{title}</Typography>
      <Typography variant="body2">{message}</Typography>
      <Button size="small" sx={{ mt: 1 }} onClick={onCheckInvoices}>Check invoices</Button>
    </CardContent>
  </Card>
);

export default PaymentsOverviewCard; 