import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const PaymentsCard = ({ summary, amount, onGoToPayments, sx = {} }) => (
  <Card sx={sx}>
    <CardContent>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>{summary}</Typography>
      <Typography variant="h5">{amount}</Typography>
      <Button size="small" sx={{ mt: 1 }} onClick={onGoToPayments}>Go to payments</Button>
    </CardContent>
  </Card>
);

export default PaymentsCard; 