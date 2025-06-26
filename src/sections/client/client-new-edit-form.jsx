import React, { useEffect } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
import { paths } from 'src/routes/paths';
import { HOST_API } from '../../config-global';
import axiosInstance from '../../utils/axios.js';

// ----------------------------------------------------------------------

const EXPENSE_TYPES = ['Individual', 'Company', 'Agency'];

const ExpenseSchema = Yup.object().shape({
  clientName: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  phoneNumber: Yup.string()
    .matches(/^[0-9]\d{9}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  type: Yup.string().required('Type is required'),
});

export default function ClientNewEditForm({ clientId }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();

  const isEdit = Boolean(clientId);

  const methods = useForm({
    resolver: yupResolver(ExpenseSchema),
    defaultValues: {
      clientName: '',
      email: '',
      address: '',
      phoneNumber: '',
      type: '',
      notes: '',
    },
  });

  const {
    reset,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  // Fetch client data for edit mode
  useEffect(() => {
    const fetchExpense = async () => {
      if (!isEdit) return;

      try {

        // Otherwise, fetch from API
        const response = await axiosInstance.get(`/api/client/${clientId}`);
        const { data } = response.data;

        reset({
          clientName:data.clientName || '',
          email:data.email || '',
          address:data.address || '',
          phoneNumber:data.phoneNumber || '',
          type:data.type || '',
          notes:data.notes || '',
        });
      } catch (error) {
        console.error('Failed to fetch client:', error);
        enqueueSnackbar('Failed to load client data', { variant: 'error' });
      }
    };

    fetchExpense();
  }, [clientId, isEdit, reset, enqueueSnackbar]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const payload = {
        ...formData,
      };

      if (isEdit) {
        // Update existing client
        await axiosInstance.put(`/api/client/${clientId}`, payload);
        enqueueSnackbar('Client updated successfully!', { variant: 'success' });
      } else {
        // Create new client
        await axiosInstance.post(`/api/client`, payload);
        enqueueSnackbar('Client created successfully!', { variant: 'success' });
      }

      preview.onFalse();
      router.push(paths.dashboard.client.list);
    } catch (error) {
      console.error('Failed to save client:', error);
      enqueueSnackbar(
        isEdit ? 'Failed to update client' : 'Failed to create client',
        { variant: 'error' }
      );
    }
  });

  const handleCancel = () => {
    router.push(paths.dashboard.client.list);
  };

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {isEdit ? 'Edit Client' : 'Create Client'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Enter client type, description, amount, and date
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && (
            <CardHeader title={isEdit ? 'Edit Client' : 'Create Client'} />
          )}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="clientName"
              label="Client Name"
              placeholder="Enter client name"
            />

            <RHFTextField
              name="email"
              label="Client Email"
              placeholder="Enter client email"
            />
            <RHFTextField
              name="phoneNumber"
              label="Phone Number"
              placeholder="Enter client contact"
            />

            <RHFAutocomplete
              name="type"
              label="Type"
              placeholder="Choose an type"
              fullWidth
              options={EXPENSE_TYPES}
              getOptionLabel={(option) => option}
            />

            <RHFTextField
              name="notes"
              label="Note"
              placeholder="Enter client note"
            />

            <RHFTextField
              name="address"
              label="Address"
              multiline
              rows={3}
              placeholder="Enter client address"
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
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEdit ? 'Update Client' : 'Create Client'}
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

ClientNewEditForm.propTypes = {
  clientId: PropTypes.string,
};
