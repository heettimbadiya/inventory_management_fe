import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { RHFSelect } from '../../components/hook-form/rhf-select';
import React from 'react';
import { useGetProject } from '../../api/project';
import { useGetContact } from '../../api/contact';

// ----------------------------------------------------------------------

export default function InvoiceNewEditStatusDate() {
  const { control, watch } = useFormContext();
  const { projects } = useGetProject();
  const { contact: contacts } = useGetContact();
  const values = watch();

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >

      <RHFAutocomplete
        name="projectId"
        label="Project"
        placeholder="Select project"
        fullWidth
        options={projects}
        getOptionLabel={(option) => option?.name || ''}
        isOptionEqualToValue={(option, value) => option._id === value._id}
      />

      <RHFAutocomplete
        name="contactId"
        label="Contact"
        placeholder="Select contact"
        fullWidth
        options={contacts}
        getOptionLabel={(option) => option?.fullName || ''}
        isOptionEqualToValue={(option, value) => option._id === value._id}
      />
      <RHFSelect
        fullWidth
        name="status"
        label="Status"
      >
        {['Unpaid', 'Paid', 'Overdue'].map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </RHFSelect>

      <Controller
        name="issueDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label="Issue Date"
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
                size:'small',
              },
            }}
          />
        )}
      />

      <Controller
        name="dueDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label="Due date"
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
                size:'small'
              },
            }}
          />
        )}
      />
    </Stack>
  );
}
