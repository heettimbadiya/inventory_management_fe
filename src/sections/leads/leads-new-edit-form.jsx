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
import { Autocomplete, TextField } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
import { paths } from 'src/routes/paths';
import { HOST_API } from '../../config-global';
import axiosInstance from '../../utils/axios.js';
import Chip from '@mui/material/Chip';

// ----------------------------------------------------------------------

const LEAD_STAGE = ['Lead', 'Opportunity', 'Client'];

const ExpenseSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),

  phone: Yup.string()
    .matches(/^[0-9]\d{9}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  tags: Yup.array().required('Tags is required'),
  source: Yup.string().required('Source is required'),
  stage: Yup.string().required('Stage is required'),
});

export default function LeadsNewEditForm({ leadId }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();

  const isEdit = Boolean(leadId);

  const methods = useForm({
    resolver: yupResolver(ExpenseSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      tags: [],
      notes: '',
      stage: '',
      source:''
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
        const response = await axiosInstance.get(`/api/leads/${leadId}`);
        const { data } = response;

        reset({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          tags: data.tags || '',
          notes: data.notes || '',
          stage: data.stage || '',
          source: data.source || '',
        });
      } catch (error) {
        console.error('Failed to fetch lead:', error);
        enqueueSnackbar('Failed to load lead data', { variant: 'error' });
      }
    };

    fetchExpense();
  }, [leadId, isEdit, reset, enqueueSnackbar]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const payload = {
        ...formData,
      };

      if (isEdit) {
        // Update existing client
        await axiosInstance.put(`/api/leads/${leadId}`, payload);
        enqueueSnackbar('lead updated successfully!', { variant: 'success' });
      } else {
        // Create new client
        await axiosInstance.post(`/api/leads`, payload);
        enqueueSnackbar('Lead created successfully!', { variant: 'success' });
      }

      preview.onFalse();
      router.push(paths.dashboard.leads.list);
    } catch (error) {
      console.error('Failed to save lead:', error);
      enqueueSnackbar(isEdit ? 'Failed to update lead' : 'Failed to create lead', {
        variant: 'error',
      });
    }
  });

  const handleCancel = () => {
    router.push(paths.dashboard.leads.list);
  };

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {isEdit ? 'Edit lead' : 'Create lead'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Enter Lead name,Tags,stage and notes
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title={isEdit ? 'Edit Client' : 'Create Client'} />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Name" placeholder="Name" />
            <RHFTextField name="email" label="Email" placeholder="Email" />
            <RHFTextField name="phone" label="Phone Number" placeholder="Enter contact" />{' '}
            <RHFTextField name="source" label="Source" placeholder="Enter contact" />
            <Controller
              name="tags"
              control={control}
              defaultValue={[]}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]} // No options
                  value={value}
                  onChange={(event, newValue) => {
                    const uniqueValues = Array.from(new Set(newValue));
                    onChange(uniqueValues);
                  }}
                  PopperComponent={() => null} // <<< Hides the dropdown entirely
                  renderTags={(selected, getTagProps) =>
                    selected.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        label={option}
                        size="small"
                        color="info"
                        variant="soft"
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="+ Tags"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )}
            />
            <RHFAutocomplete
              name="stage"
              label="Stage"
              placeholder="Choose an stage"
              fullWidth
              options={LEAD_STAGE}
              getOptionLabel={(option) => option}
            />
            <RHFTextField name="notes" label="Notes" multiline rows={3} placeholder="Enter notes" />
          </Stack>
        </Card>

        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting} disabled={isSubmitting}>
            {isEdit ? 'Update Lead' : 'Create Lead'}
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

LeadsNewEditForm.propTypes = {
  leadId: PropTypes.string,
};
