import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import axios from 'axios';
import { paths } from 'src/routes/paths';
import { HOST_API } from '../../config-global';
import axiosInstance from '../../utils/axios.js';

// ----------------------------------------------------------------------

const EVENT_STATUS = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];

const EventSchema = Yup.object().shape({
  eventTitle: Yup.string().required('Event title is required'),
  clientId: Yup.string().required('Client is required'),
  eventDate: Yup.date().required('Event date is required'),
  location: Yup.string().required('Location is required'),
  status: Yup.string().required('Status is required'),
  teamNotes: Yup.string(),
  services: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Service name is required'),
      description: Yup.string(),
      cost: Yup.number().min(0, 'Cost must be positive').required('Cost is required'),
    })
  ),
  rentals: Yup.array().of(
    Yup.object().shape({
      item: Yup.string().required('Item name is required'),
      quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
      cost: Yup.number().min(0, 'Cost must be positive').required('Cost is required'),
    })
  ),
});

export default function EventNewEditForm({ eventId }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();
  const [clients, setClients] = useState([]);

  const isEdit = Boolean(eventId);

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: {
      eventTitle: '',
      clientId: '',
      eventDate: null,
      location: '',
      status: '',
      teamNotes: '',
      services: [{ name: '', description: '', cost: 0 }],
      rentals: [{ item: '', quantity: 1, cost: 0 }],
    },
  });

  const {
    reset,
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control,
    name: 'services',
  });

  const { fields: rentalFields, append: appendRental, remove: removeRental } = useFieldArray({
    control,
    name: 'rentals',
  });

  const watchedServices = watch('services');
  const watchedRentals = watch('rentals');

  // Calculate total cost
  const totalServiceCost = watchedServices?.reduce((sum, service) => sum + (Number(service.cost) || 0), 0) || 0;
  const totalRentalCost = watchedRentals?.reduce((sum, rental) => sum + (Number(rental.cost) || 0), 0) || 0;
  const totalCost = totalServiceCost + totalRentalCost;

  // Fetch clients for dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axiosInstance.get('/api/clients');
        setClients(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      }
    };
    fetchClients();
  }, []);

  // Fetch event data for edit mode
  useEffect(() => {
    const fetchEvent = async () => {
      if (!isEdit) return;

      try {
        const response = await axiosInstance.get(`/api/event/${eventId}`);
        const { data } = response.data;

        reset({
          eventTitle: data.eventTitle || '',
          clientId: data.clientId || '',
          eventDate: data.eventDate ? new Date(data.eventDate) : null,
          location: data.location || '',
          status: data.status || '',
          teamNotes: data.teamNotes || '',
          services: data.services?.length > 0 ? data.services : [{ name: '', description: '', cost: 0 }],
          rentals: data.rentals?.length > 0 ? data.rentals : [{ item: '', quantity: 1, cost: 0 }],
        });
      } catch (error) {
        console.error('Failed to fetch event:', error);
        enqueueSnackbar('Failed to load event data', { variant: 'error' });
      }
    };

    fetchEvent();
  }, [eventId, isEdit, reset, enqueueSnackbar]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const payload = {
        ...formData,
        eventDate: formData.eventDate ? formData.eventDate.toISOString().split('T')[0] : null,
        services: formData.services.filter(service => service.name.trim() !== ''),
        rentals: formData.rentals.filter(rental => rental.item.trim() !== ''),
      };

      if (isEdit) {
        await axiosInstance.put(`/api/event/${eventId}`, payload);
        enqueueSnackbar('Event updated successfully!', { variant: 'success' });
      } else {
        await axiosInstance.post(`/api/event`, payload);
        enqueueSnackbar('Event created successfully!', { variant: 'success' });
      }

      preview.onFalse();
      router.push(paths.dashboard.event.list);
    } catch (error) {
      console.error('Failed to save event:', error);
      enqueueSnackbar(
        isEdit ? 'Failed to update event' : 'Failed to create event',
        { variant: 'error' }
      );
    }
  });

  const handleCancel = () => {
    router.push(paths.dashboard.event.list);
  };

  const renderBasicDetails = (
    <Card>
      {!mdUp && (
        <CardHeader title="Basic Information" />
      )}
      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField
          name="eventTitle"
          label="Event Title"
          placeholder="Enter event title"
        />

        <RHFAutocomplete
          name="clientId"
          label="Client"
          placeholder="Select client"
          fullWidth
          options={clients}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              const client = clients.find(c => c._id === option);
              return client ? client.clientName : option;
            }
            return option.clientName || '';
          }}
          isOptionEqualToValue={(option, value) => {
            if (typeof option === 'string') return option === value;
            return option._id === value;
          }}
          renderOption={(props, option) => (
            <li {...props} key={option._id}>
              {option.clientName}
            </li>
          )}
        />

        <Controller
          name="eventDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              label="Event Date"
              value={field.value}
              onChange={(newValue) => field.onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          )}
        />

        <RHFTextField
          name="location"
          label="Location"
          placeholder="Enter event location"
        />

        <RHFAutocomplete
          name="status"
          label="Status"
          placeholder="Select status"
          fullWidth
          options={EVENT_STATUS}
          getOptionLabel={(option) => option}
        />

        <RHFTextField
          name="teamNotes"
          label="Team Notes"
          multiline
          rows={3}
          placeholder="Enter team notes"
        />
      </Stack>
    </Card>
  );

  const renderServices = (
    <Card>
      <CardHeader
        title="Services"
        action={
          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => appendService({ name: '', description: '', cost: 0 })}
          >
            Add Service
          </Button>
        }
      />
      <Stack spacing={3} sx={{ p: 3 }}>
        {serviceFields.map((field, index) => (
          <Box key={field.id}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Service {index + 1}</Typography>
              {serviceFields.length > 1 && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeService(index)}
                >
                  <Iconify icon="mingcute:close-line" />
                </IconButton>
              )}
            </Stack>
            <Stack spacing={2}>
              <RHFTextField
                name={`services.${index}.name`}
                label="Service Name"
                placeholder="Enter service name"
              />
              <RHFTextField
                name={`services.${index}.description`}
                label="Description"
                placeholder="Enter service description"
              />
              <RHFTextField
                name={`services.${index}.cost`}
                label="Cost"
                type="number"
                placeholder="Enter cost"
                InputProps={{
                  startAdornment: '₹',
                }}
              />
            </Stack>
            {index < serviceFields.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
      </Stack>
    </Card>
  );

  const renderRentals = (
    <Card>
      <CardHeader
        title="Rentals"
        action={
          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => appendRental({ item: '', quantity: 1, cost: 0 })}
          >
            Add Rental
          </Button>
        }
      />
      <Stack spacing={3} sx={{ p: 3 }}>
        {rentalFields.map((field, index) => (
          <Box key={field.id}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Rental {index + 1}</Typography>
              {rentalFields.length > 1 && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeRental(index)}
                >
                  <Iconify icon="mingcute:close-line" />
                </IconButton>
              )}
            </Stack>
            <Stack spacing={2}>
              <RHFTextField
                name={`rentals.${index}.item`}
                label="Item Name"
                placeholder="Enter item name"
              />
              <RHFTextField
                name={`rentals.${index}.quantity`}
                label="Quantity"
                type="number"
                placeholder="Enter quantity"
              />
              <RHFTextField
                name={`rentals.${index}.cost`}
                label="Cost"
                type="number"
                placeholder="Enter cost"
                InputProps={{
                  startAdornment: '₹',
                }}
              />
            </Stack>
            {index < rentalFields.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
      </Stack>
    </Card>
  );

  const renderSummary = (
    <Card>
      <CardHeader title="Cost Summary" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">Services Total:</Typography>
          <Typography variant="body2">₹{totalServiceCost.toLocaleString()}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">Rentals Total:</Typography>
          <Typography variant="body2">₹{totalRentalCost.toLocaleString()}</Typography>
        </Stack>
        <Divider />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">Total Cost:</Typography>
          <Typography variant="h6" color="primary">₹{totalCost.toLocaleString()}</Typography>
        </Stack>
      </Stack>
    </Card>
  );

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {isEdit ? 'Edit Event' : 'Create Event'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Enter event details, services, and rental information
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Stack spacing={3}>
          {renderBasicDetails}
          {renderServices}
          {renderRentals}
          {renderSummary}
        </Stack>

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
            {isEdit ? 'Update Event' : 'Create Event'}
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

EventNewEditForm.propTypes = {
  eventId: PropTypes.string,
};
