import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Card, Stack, Button, Grid, Typography, Box
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { paths } from 'src/routes/paths';

const RentalSchema = Yup.object().shape({
  item: Yup.string().required('Item is required'),
  quantity: Yup.number().min(1, 'Minimum 1').required('Quantity is required'),
  cost: Yup.number().min(0, 'Cost must be non-negative').required('Cost is required'),
});

export default function RentalNewEditForm({ rentalId }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = Boolean(rentalId);

  const methods = useForm({
    resolver: yupResolver(RentalSchema),
    defaultValues: {
      item: '',
      quantity: 1,
      cost: 0,
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchRental = async () => {
      if (!isEdit) return;
      try {
        const response = await axiosInstance.get(`/api/rental/${rentalId}`);
        const data = response.data.data;
        reset({
          item: data.item || '',
          quantity: data.quantity || 1,
          cost: data.cost || 0,
        });
      } catch (error) {
        enqueueSnackbar('Failed to load rental', { variant: 'error' });
      }
    };
    fetchRental();
  }, [isEdit, rentalId, reset, enqueueSnackbar]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      if (isEdit) {
        await axiosInstance.put(`/api/rental/${rentalId}`, formData);
        enqueueSnackbar('Rental updated', { variant: 'success' });
      } else {
        await axiosInstance.post(`/api/rental`, formData);
        enqueueSnackbar('Rental created', { variant: 'success' });
      }
      router.push(paths.dashboard.event.list);
    } catch (error) {
      enqueueSnackbar('Failed to save rental', { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {isEdit ? 'Edit Rental' : 'Create Rental'}
            </Typography>

            <Stack spacing={3}>
              <RHFTextField
                name="item"
                label="Item"
                placeholder="Enter item name"
              />
              <RHFTextField
                name="quantity"
                label="Quantity"
                type="number"
                placeholder="Enter quantity"
              />
              <RHFTextField
                name="cost"
                label="Cost"
                type="number"
                placeholder="Enter cost"
              />
            </Stack>

            <Stack direction="row" justifyContent="flex-end" spacing={2} mt={4}>
              <Button
                variant="outlined"
                onClick={() => router.push(paths.dashboard.event.list)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isEdit ? 'Update' : 'Create'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

RentalNewEditForm.propTypes = {
  rentalId: PropTypes.string,
};
