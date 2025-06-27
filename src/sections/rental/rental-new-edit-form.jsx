import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const RentalSchema = Yup.object().shape({
  item: Yup.string().required('Item is required'),
  quantity: Yup.number()
    .typeError('Quantity must be a number')
    .min(1, 'Minimum 1')
    .required('Quantity is required'),
  cost: Yup.number()
    .typeError('Cost must be a number')
    .min(0, 'Cost must be non-negative')
    .required('Cost is required'),
});

export default function RentalNewEditForm({ rentalId }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();

  const isEdit = Boolean(rentalId);

  const methods = useForm({
    resolver: yupResolver(RentalSchema),
    defaultValues: {
      item: '',
      quantity: '',
      cost: '',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Fetch rental for edit
  useEffect(() => {
    const fetchRental = async () => {
      if (!isEdit) return;

      try {
        const response = await axiosInstance.get(`/api/rental/${rentalId}`);
        const { data } = response.data;

        reset({
          item: data.item || '',
          quantity: data.quantity || '',
          cost: data.cost || '',
        });
      } catch (error) {
        console.error('Failed to fetch rental:', error);
        enqueueSnackbar('Failed to load rental data', { variant: 'error' });
      }
    };

    fetchRental();
  }, [rentalId, isEdit, reset, enqueueSnackbar]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const payload = {
        item: formData.item,
        quantity: Number(formData.quantity),
        cost: Number(formData.cost),
      };

      if (isEdit) {
        await axiosInstance.put(`/api/rental/${rentalId}`, payload);
        enqueueSnackbar('Rental updated successfully!', { variant: 'success' });
      } else {
        await axiosInstance.post(`/api/rental`, payload);
        enqueueSnackbar('Rental created successfully!', { variant: 'success' });
      }

      preview.onFalse();
      router.push(paths.dashboard.rental.list);
    } catch (error) {
      console.error('Failed to save rental:', error);
      enqueueSnackbar(isEdit ? 'Failed to update rental' : 'Failed to create rental', {
        variant: 'error',
      });
    }
  });

  const handleCancel = () => {
    router.push(paths.dashboard.rental.list);
  };

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {isEdit ? 'Edit Rental' : 'Create Rental'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Enter item name, quantity, and cost
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title={isEdit ? 'Edit Rental' : 'Create Rental'} />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="item"
              label="Item Name"
              placeholder="Enter item name"
            />

            <RHFTextField
              name="quantity"
              label="Quantity"
              placeholder="Enter quantity"
              type="number"
            />

            <RHFTextField
              name="cost"
              label="Cost"
              placeholder="Enter cost"
              type="number"
            />
          </Stack>
        </Card>

        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 3, justifyContent: 'flex-end' }}
        >
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Rental' : 'Create Rental'}
          </Button>
        </Stack>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
      </Grid>
    </FormProvider>
  );
}

RentalNewEditForm.propTypes = {
  rentalId: PropTypes.string,
};
