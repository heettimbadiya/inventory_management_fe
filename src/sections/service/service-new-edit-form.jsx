import React, { useEffect } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axiosInstance from '../../utils/axios';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const ServiceSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  cost: Yup.number()
    .typeError('Cost must be a number')
    .required('Cost is required'),
});

export default function ServiceNewEditForm({ serviceId }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();

  const isEdit = Boolean(serviceId);

  const methods = useForm({
    resolver: yupResolver(ServiceSchema),
    defaultValues: {
      name: '',
      description: '',
      cost: '',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Fetch service for edit
  useEffect(() => {
    const fetchService = async () => {
      if (!isEdit) return;

      try {
        const response = await axiosInstance.get(`/api/service/${serviceId}`);
        const { data } = response.data;

        reset({
          name: data.name || '',
          description: data.description || '',
          cost: data.cost || '',
        });
      } catch (error) {
        console.error('Failed to fetch service:', error);
        enqueueSnackbar('Failed to load service data', { variant: 'error' });
      }
    };

    fetchService();
  }, [serviceId, isEdit, reset, enqueueSnackbar]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        cost: Number(formData.cost),
      };

      if (isEdit) {
        await axiosInstance.put(`/api/service/${serviceId}`, payload);
        enqueueSnackbar('Service updated successfully!', { variant: 'success' });
      } else {
        await axiosInstance.post(`/api/service`, payload);
        enqueueSnackbar('Service created successfully!', { variant: 'success' });
      }

      preview.onFalse();
      router.push(paths.dashboard.service.list);
    } catch (error) {
      console.error('Failed to save service:', error);
      enqueueSnackbar(isEdit ? 'Failed to update service' : 'Failed to create service', {
        variant: 'error',
      });
    }
  });

  const handleCancel = () => {
    router.push(paths.dashboard.service.list);
  };

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {isEdit ? 'Edit Service' : 'Create Service'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Enter service name, description, and cost
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title={isEdit ? 'Edit Service' : 'Create Service'} />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="name"
              label="Service Name"
              placeholder="Enter service name"
            />

            <RHFTextField
              name="description"
              label="Service Description"
              placeholder="Enter service description"
              multiline
              rows={3}
            />

            <RHFTextField
              name="cost"
              label="Service Cost"
              placeholder="Enter service cost"
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
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Service' : 'Create Service'}
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

ServiceNewEditForm.propTypes = {
  serviceId: PropTypes.string,
};
