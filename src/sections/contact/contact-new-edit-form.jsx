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
import { Box, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axiosInstance from '../../utils/axios.js';
import { paths } from 'src/routes/paths';

const ContactSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  contact: Yup.string(),
  lastInteraction: Yup.date().nullable(),
  website: Yup.string().url('Invalid URL'),
  organization: Yup.string(),
  jobTitle: Yup.string(),
  addProject: Yup.boolean(),
  mailingEmail: Yup.string().email('Invalid email format'),
  additionalInfo: Yup.string(),
});

export default function ContactNewEditForm({ contactId }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = Boolean(contactId);

  const methods = useForm({
    resolver: yupResolver(ContactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      contact: '',
      lastInteraction: null,
      website: '',
      organization: '',
      jobTitle: '',
      addProject: false,
      mailingEmail: '',
      additionalInfo: '',
    },
  });

  const { reset, handleSubmit, setValue, control, formState: { isSubmitting } } = methods;

  useEffect(() => {
    const fetchContact = async () => {
      if (!isEdit) return;
      try {
        const response = await axiosInstance.get(`/api/contact/${contactId}`);
        const  data  = response.data.contact;
        console.log("Data ",data);
        reset({
          fullName: data.fullName || '',
          email: data.email || '',
          contact: data.contact || '',
          lastInteraction: data.lastInteraction ? new Date(data.lastInteraction) : null,
          website: data.website || '',
          organization: data.organization || '',
          jobTitle: data.jobTitle || '',
          addProject: data.addProject || false,
          mailingEmail: data.mailingEmail || '',
          additionalInfo: data.additionalInfo || '',
        });
      } catch (error) {
        enqueueSnackbar('Failed to load contact data', { variant: 'error' });
      }
    };
    fetchContact();
  }, [contactId, isEdit, reset, enqueueSnackbar]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      if (isEdit) {
        await axiosInstance.put(`/api/contact/${contactId}`, formData);
        enqueueSnackbar('Contact updated successfully!', { variant: 'success' });
      } else {
        await axiosInstance.post(`/api/contact`, formData);
        enqueueSnackbar('Contact created successfully!', { variant: 'success' });
      }
      router.push(paths.dashboard.contact.list);
    } catch (error) {
      enqueueSnackbar(isEdit ? 'Failed to update contact' : 'Failed to create contact', { variant: 'error' });
    }
  });

  const handleCancel = () => {
    router.push(paths.dashboard.contact.list);
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {mdUp && (
          <Grid md={4}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {isEdit ? 'Edit Contact' : 'Create Contact'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Enter contact details
            </Typography>
          </Grid>
        )}
        <Grid xs={12} md={8}>
          <Card>
            {!mdUp && <CardHeader title={isEdit ? 'Edit Contact' : 'Create Contact'} />}
            <Stack spacing={3} sx={{ p: 3 }}>
              <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
                <RHFTextField name="fullName" label="Full Name" placeholder="Add full name" />
                <RHFTextField name="email" label="Email Address" placeholder="Add email address" />
                <RHFTextField name="contact" label="Contact Number" placeholder="Add contact number" />
                <Controller name="lastInteraction" control={control} render={({ field }) => (
                  <DatePicker label="Last Interaction" value={field.value} onChange={field.onChange} renderInput={(params) => <TextField {...params} />} />
                )} />
                <RHFTextField name="website" label="Website" placeholder="Add contact's website" />
                <RHFTextField name="organization" label="Organization" placeholder="Add contact's organization" />
                <RHFTextField name="jobTitle" label="Job Title" placeholder="Add job title or role" />
              </Box>
              <FormControlLabel control={<Controller name="addProject" control={control} render={({ field }) => <Checkbox {...field} checked={field.value} />} />} label="Add to project" />
              <RHFTextField name="mailingEmail" label="Mailing Email" placeholder="Add mailing email" />
              <RHFTextField name="additionalInfo" label="Additional Info (only visible to you)" multiline rows={3} placeholder="Add some noteworthy info." />
            </Stack>
          </Card>
          <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>{isEdit ? 'Update Contact' : 'Create Contact'}</Button>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ContactNewEditForm.propTypes = {
  contactId: PropTypes.string,
};
