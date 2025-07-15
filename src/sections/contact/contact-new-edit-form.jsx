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
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import axiosInstance from '../../utils/axios.js';
import { paths } from 'src/routes/paths';
import { Autocomplete } from '@mui/material';
import Chip from '@mui/material/Chip';

const STATUS_OPTIONS = ['Lead', 'Contacted', 'Engaged', 'Client', 'Inactive', 'Lost'];

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
  tags: Yup.array().required('Tags are required'),
  status: Yup.string().required('Status is required'),
});

export default function ContactNewEditForm({ contact, loading }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = Boolean(contact && contact._id);

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
      tags: [],
      status: '',
      ...contact,
    },
  });

  const { reset, handleSubmit, setValue, control, formState: { isSubmitting } } = methods;

  useEffect(() => {
    if (contact) {
      reset({
        fullName: contact.fullName || '',
        email: contact.email || '',
        contact: contact.contact || '',
        lastInteraction: contact.lastInteraction ? new Date(contact.lastInteraction) : null,
        website: contact.website || '',
        organization: contact.organization || '',
        jobTitle: contact.jobTitle || '',
        addProject: contact.addProject || false,
        mailingEmail: contact.mailingEmail || '',
        additionalInfo: contact.additionalInfo || '',
        tags: contact.tags || [],
        status: contact.status || '',
      });
    }
  }, [contact, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const payload = {
        ...formData,
      };
      if (isEdit) {
        await axiosInstance.put(`/api/contact/${contact._id}`, payload);
        enqueueSnackbar('Contact updated successfully!', { variant: 'success' });
      } else {
        await axiosInstance.post(`/api/contact`, payload);
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
                  <DatePicker label="Last Interaction"  value={field.value} onChange={field.onChange} renderInput={(params) => <TextField  size="small" {...params} />} />
                )} />
                <RHFTextField name="website" label="Website" placeholder="Add contact's website" />
                <RHFTextField name="organization" label="Organization" placeholder="Add contact's organization" />
                <RHFTextField name="jobTitle" label="Job Title" placeholder="Add job title or role" />
              </Box>
              <FormControlLabel control={<Controller name="addProject" control={control} render={({ field }) => <Checkbox {...field} checked={field.value} />} />} label="Add to project" />
              <RHFTextField name="mailingEmail" label="Mailing Email" placeholder="Add mailing email" />
              <Controller
                name="tags"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={value}
                    size={"small"}
                    onChange={(event, newValue) => {
                      const uniqueValues = Array.from(new Set(newValue));
                      onChange(uniqueValues);
                    }}
                    PopperComponent={() => null}
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
                        size={'small'}
                      />
                    )}
                    sx={{'.css-1gunrla-MuiInputBase-root-MuiOutlinedInput-root':{
                        borderRadius:0.5,
                      },
                      '.css-17ceore-MuiSvgIcon-root':{
                        color:"#131416",
                        height:"22px",
                        width:"22px"
                      },
                      backgroundColor:"#F6F7F8"
                    }}
                  />
                )}
              />
              <RHFAutocomplete
                name="status"
                label="Status"
                placeholder="Select status"
                options={STATUS_OPTIONS}
                getOptionLabel={(option) => option}
                fullWidth
              />
              <RHFTextField name="additionalInfo" label="Notes" multiline rows={3} placeholder="Add some noteworthy info." />
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
  contact: PropTypes.object,
  loading: PropTypes.bool,
};
