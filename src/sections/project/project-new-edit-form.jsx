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
import { Box } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import axiosInstance from '../../utils/axios.js';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import Link from '@mui/material/Link';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

const PROJECT_TYPES = [
  'Wedding',
  'Baby Shower',
  'Corporate',
  'Design',
  'Event',
  'Family',
  'Other',
  'Party',
  'Social',
];

export const PROJECT_STAGES = [
  'Inquiry',
  'Questionnaire Sent',
  'Follow Up',
  'Brochure sent',
  'Consult',
  'Proposal Sent',
  'Proposal Signed',
  'Retainer',
];

const LEAD_SOURCES = [
  'Client Referral',
  'Facebook',
  'Google',
  'Instagram',
  'Other',
  'Personal Website',
  'The Knot',
  'Unknown',
  'Vendor Referral',
  'Yelp',
];

const TIMEZONES = [
  'PDT/PST', 'MDT/MST', 'MST', 'EDT/EST', 'CDT/CST', 'CST', 'HST', 'AKDT/AKST', 'AST', 'ADT/AST', 'NST/NDT'
];

const ProjectSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  type: Yup.string().required('Type is required'),
  stage: Yup.string().required('Stage is required'),
  leadSource: Yup.string(),
  timezone: Yup.string(),
  startDate: Yup.date().nullable(),
  startTime: Yup.string().nullable(),
  endDate: Yup.date().nullable(),
  endTime: Yup.string().nullable(),
});

export default function ProjectNewEditForm({ projectId }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();
  const [showEndDate, setShowEndDate] = useState(false);

  const isEdit = Boolean(projectId);

  const methods = useForm({
    resolver: yupResolver(ProjectSchema),
    defaultValues: {
      name: '',
      type: '',
      stage: '',
      contact: '',
      leadSource: '',
      timezone: '',
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchProject = async () => {
      if (!isEdit) return;
      try {
        const response = await axiosInstance.get(`/api/project/${projectId}`);
        const { data } = response.data;
        reset({
          name: data.name || '',
          type: data.type || '',
          stage: data.stage || '',
          leadSource: data.leadSource || '',
          timezone: data.timezone || '',
          startDate: data.startDate ? new Date(data.startDate) : null,
          startTime: data.startTime || null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          endTime: data.endTime || null,
          // Add other fields as needed
        });
      } catch (error) {
        console.error('Failed to fetch project:', error);
        enqueueSnackbar('Failed to load project data', { variant: 'error' });
      }
    };
    fetchProject();
  }, [projectId, isEdit, reset, enqueueSnackbar]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const payload = {
        ...formData,
      };
      if (isEdit) {
        await axiosInstance.put(`/api/project/${projectId}`, payload);
        enqueueSnackbar('Project updated successfully!', { variant: 'success' });
      } else {
        await axiosInstance.post(`/api/project`, payload);
        enqueueSnackbar('Project created successfully!', { variant: 'success' });
      }
      preview.onFalse();
      router.push(paths.dashboard.project.list);
    } catch (error) {
      console.error('Failed to save project:', error);
      enqueueSnackbar(
        isEdit ? 'Failed to update project' : 'Failed to create project',
        { variant: 'error' }
      );
    }
  });

  const handleCancel = () => {
    router.push(paths.dashboard.project.list);
  };

  // Watch for endDate to toggle add/remove
  const endDate = watch('endDate');

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {isEdit ? 'Edit Project' : 'Create Project'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Enter project details
          </Typography>
        </Grid>
      )}
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && (
            <CardHeader title={isEdit ? 'Edit Project' : 'Create Project'} />
          )}
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
              <RHFTextField
                name="name"
                label="Name"
                placeholder="Enter name"
              />
              <RHFAutocomplete
                name="type"
                label="Type"
                placeholder="Choose a type"
                fullWidth
                options={PROJECT_TYPES}
                getOptionLabel={(option) => option}
              />
              <RHFAutocomplete
                name="leadSource"
                label="Lead source"
                placeholder="Select"
                fullWidth
                options={LEAD_SOURCES}
                getOptionLabel={(option) => option}
              />
              <RHFAutocomplete
                name="stage"
                label="Stage"
                placeholder="Choose a stage"
                fullWidth
                options={PROJECT_STAGES}
                getOptionLabel={(option) => option}
              />
              <RHFAutocomplete
                name="timezone"
                label="Timezone"
                placeholder="Select"
                fullWidth
                options={TIMEZONES}
                getOptionLabel={(option) => option}
              />
            </Box>
            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
              <Controller
                name="startDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Start date"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="startTime"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TimePicker
                    label="Start time"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
              {showEndDate && (
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="End date"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              )}
              {showEndDate && (
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TimePicker
                      label="End time"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              )}
            </Box>
            <Box>
              {!showEndDate ? (
                <Link component="div" sx={{cursor:'pointer'}} variant="body2" onClick={() => setShowEndDate(true)}>
                  + Add end date
                </Link>
              ) : (
                <Link component="button" variant="body2" onClick={() => {
                  setShowEndDate(false);
                  setValue('endDate', null);
                  setValue('endTime', null);
                }}>
                  Remove end time
                </Link>
              )}
            </Box>
          </Stack>
        </Card>
        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting} disabled={isSubmitting}>
            {isEdit ? 'Update Project' : 'Create Project'}
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

ProjectNewEditForm.propTypes = {
  projectId: PropTypes.string,
};
