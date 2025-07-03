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
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import { TextField, Autocomplete } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import axiosInstance from '../../utils/axios.js';
import { DatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

const EVENT_STATUS = ['Planned', 'Confirmed', 'Completed', 'Cancelled']

const EstimateSchema = Yup.object().shape({
  clientId: Yup.object().required('Client is required'),
  status: Yup.string().required('Status is required'),
  tax: Yup.number().min(0, 'Tax must be positive').required('Tax is required'),
  items: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Item name is required'),
      description: Yup.string(),
      quantity: Yup.number().min(1).required('Quantity is required'),
      unitPrice: Yup.number().min(0).required('Unit price is required'),
    })
  ).min(1, 'At least one item is required'),
});


export default function EstimateNewEditForm({ estimateId }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();
  const [clients, setClients] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableRentals, setAvailableRentals] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);


  const isEdit = Boolean(estimateId);

  const methods = useForm({
    resolver: yupResolver(EstimateSchema),
    defaultValues: {
      clientId: '',
      status: 'Draft',
      tax: 0,
      items: [],
    }

  });

  const {
    reset,
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { fields: serviceFields, append: appendService, remove: removeService, replace: replaceServices } = useFieldArray({
    control,
    name: 'services',
  });

  const { fields: rentalFields, append: appendRental, remove: removeRental, replace: replaceRentals } = useFieldArray({
    control,
    name: 'rentals',
  });

  const watchedServices = watch('services');
  const watchedRentals = watch('rentals');

  // Calculate total cost
  const totalServiceCost = watchedServices?.reduce((sum, service) => sum + (Number(service.cost) || 0), 0) || 0;
  const totalRentalCost = watchedRentals?.reduce((sum, rental) => sum + (Number(rental.cost) * Number(rental.quantity) || 0), 0) || 0;
  const totalCost = totalServiceCost + totalRentalCost;

  // Fetch clients, services, and rentals
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, servicesRes, rentalsRes] = await Promise.all([
          axiosInstance.get('/api/client'),
          axiosInstance.get('/api/service'),
          axiosInstance.get('/api/rental'),
        ]);

        setClients(clientsRes.data.data || []);
        setAvailableServices(servicesRes.data.data || []);
        setAvailableRentals(rentalsRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);
  const toggleItemExpand = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Fetch event data for edit mode
  useEffect(() => {
    const fetchEvent = async () => {
      if (!isEdit) return;

      try {
        const response = await axiosInstance.get(`/api/event/${estimateId}`);
        const { data } = response.data;

        reset({
          eventTitle: data.eventTitle || '',
          clientId: data.clientId || '',
          eventDate: data.eventDate ? new Date(data.eventDate) : null,
          location: data.location || '',
          status: data.status || '',
          teamNotes: data.teamNotes || '',
          services: data.services || [],
          rentals: data.rentals || [],
        });
      } catch (error) {
        console.error('Failed to fetch event:', error);
        enqueueSnackbar('Failed to load event data', { variant: 'error' });
      }
    };

    fetchEvent();
  }, [estimateId, isEdit, reset, enqueueSnackbar]);

  const handleServiceAdd = (selectedService) => {
    if (!selectedService) return;

    const existingIndex = watchedServices.findIndex(s => s.name === selectedService.name);
    if (existingIndex >= 0) {
      enqueueSnackbar('Service already added', { variant: 'warning' });
      return;
    }

    appendService({
      name: selectedService.name,
      description: selectedService.description,
      cost: selectedService.cost,
    });
  };

  const handleRentalAdd = (selectedRental) => {
    if (!selectedRental) return;

    const existingIndex = watchedRentals.findIndex(r => r.item === selectedRental.item);
    if (existingIndex >= 0) {
      enqueueSnackbar('Rental item already added', { variant: 'warning' });
      return;
    }

    appendRental({
      item: selectedRental.item,
      quantity: selectedRental.quantity,
      cost: selectedRental.cost,
    });
  };


  const onSubmit = handleSubmit(async (formData) => {
    try {
      const payload = {
        ...formData,
        eventDate: formData.eventDate ? formData.eventDate.toISOString().split('T')[0] : null,
        services: formData.services,
        rentals: formData.rentals,
      };

      if (isEdit) {
        await axiosInstance.put(`/api/event/${estimateId}`, payload);
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
    <Card sx={{ mb: 3 }}>
      {!mdUp && <CardHeader title="Basic Information" />}
      <Stack spacing={3} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <RHFTextField
              name="eventTitle"
              label="Event Title"
              placeholder="Enter event title"
            />
          </Grid>
          <Grid xs={12} md={6}>
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
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="eventDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Event Date"
                  value={field.value}
                  onChange={(newValue) => field.onChange(newValue)}
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
          </Grid>
          <Grid xs={12} md={6}>
            <RHFTextField
              name="location"
              label="Location"
              placeholder="Enter event location"
            />
          </Grid>
          <Grid xs={12} md={6}>
            <RHFAutocomplete
              name="status"
              label="Status"
              placeholder="Select status"
              fullWidth
              options={EVENT_STATUS}
              getOptionLabel={(option) => option}
            />
          </Grid>
        </Grid>
        <RHFTextField
          name="teamNotes"
          label="Team Notes"
          multiline
          rows={2}
          placeholder="Enter team notes"
        />
      </Stack>
    </Card>
  );

  const renderServices = (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Iconify icon="solar:settings-bold" width={20} />
            Services
            <Chip
              label={serviceFields.length}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        }
        subheader="Select and customize services"
      />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Autocomplete
          size="small"
          options={availableServices}
          getOptionLabel={(option) => `${option.name} - ₹${option.cost.toLocaleString()}`}
          renderOption={(props, option) => (
            <li {...props}>
              <Box>
                <Typography variant="subtitle2">{option.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.description} - ₹{option.cost.toLocaleString()}
                </Typography>
              </Box>
            </li>
          )}
          onChange={(event, value) => {
            if (value) {
              handleServiceAdd(value);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add Service"
              placeholder="Search and select a service"
            />
          )}
          value={null}
        />

        {expandedItems.map((field, index) => (
          <Paper
            key={field.id}
            variant="outlined"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onClick={() => toggleItemExpand(index)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  label={watchedServices[index]?.name || 'Service'}
                  color="primary"
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  ₹{(watchedServices[index]?.cost || 0).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeService(index);
                  }}
                >
                  <Iconify icon="mingcute:close-line" width={16} />
                </IconButton>
                <IconButton size="small">
                  <Iconify
                    icon={expandedItems[index] ? 'eva:arrow-up-fill' : 'eva:arrow-down-fill'}
                    width={16}
                  />
                </IconButton>
              </Box>
            </Box>
            <Collapse in={expandedItems[index]}>
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <RHFTextField
                      name={`services.${index}.name`}
                      label="Service Name"
                      size="small"
                      disabled
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <RHFTextField
                      name={`services.${index}.cost`}
                      label="Cost"
                      type="number"
                      size="small"
                      placeholder="Enter cost"
                      InputProps={{
                        startAdornment: '₹',
                      }}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <RHFTextField
                      name={`services.${index}.description`}
                      label="Description"
                      size="small"
                      disabled
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Paper>
        ))}

        {serviceFields.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
            <Iconify icon="solar:settings-linear" width={32} sx={{ mb: 1, opacity: 0.5 }} />
            <Typography variant="body2">No services selected</Typography>
          </Box>
        )}
      </Stack>
    </Card>
  );

  // const renderRentals = (
  //   <Card sx={{ mb: 3 }}>
  //     <CardHeader
  //       title={
  //         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
  //           <Iconify icon="solar:box-bold" width={20} />
  //           Rentals
  //           <Chip
  //             label={rentalFields.length}
  //             size="small"
  //             color="secondary"
  //             variant="outlined"
  //           />
  //         </Box>
  //       }
  //       subheader="Select and customize rental items"
  //     />
  //     <Stack spacing={2} sx={{ p: 3 }}>
  //       <Autocomplete
  //         size="small"
  //         options={availableRentals}
  //         getOptionLabel={(option) => `${option.item} (Qty: ${option.quantity}) - ₹${option.cost.toLocaleString()}`}
  //         renderOption={(props, option) => (
  //           <li {...props}>
  //             <Box>
  //               <Typography variant="subtitle2">{option.item}</Typography>
  //               <Typography variant="caption" color="text.secondary">
  //                 Default Qty: {option.quantity} - ₹{option.cost.toLocaleString()}
  //               </Typography>
  //             </Box>
  //           </li>
  //         )}
  //         onChange={(event, value) => {
  //           if (value) {
  //             handleRentalAdd(value);
  //           }
  //         }}
  //         renderInput={(params) => (
  //           <TextField
  //             {...params}
  //             label="Add Rental Item"
  //             placeholder="Search and select a rental item"
  //           />
  //         )}
  //         value={null}
  //       />
  //
  //       {rentalFields.map((field, index) => (
  //         <Paper
  //           key={field.id}
  //           variant="outlined"
  //           sx={{
  //             border: '1px solid',
  //             borderColor: 'divider',
  //             borderRadius: 2,
  //             overflow: 'hidden'
  //           }}
  //         >
  //           <Box
  //             sx={{
  //               p: 2,
  //               bgcolor: 'grey.50',
  //               cursor: 'pointer',
  //               display: 'flex',
  //               alignItems: 'center',
  //               justifyContent: 'space-between'
  //             }}
  //             onClick={() => toggleRentalExpand(index)}
  //           >
  //             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
  //               <Chip
  //                 label={watchedRentals[index]?.item || 'Rental'}
  //                 color="secondary"
  //                 size="small"
  //               />
  //               <Typography variant="body2" color="text.secondary">
  //                 Qty: {watchedRentals[index]?.quantity || 0} × ₹{(watchedRentals[index]?.cost || 0).toLocaleString()}
  //               </Typography>
  //               <Typography variant="body2" color="primary.main" fontWeight="medium">
  //                 = ₹{((watchedRentals[index]?.cost || 0) * (watchedRentals[index]?.quantity || 0)).toLocaleString()}
  //               </Typography>
  //             </Box>
  //             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  //               <IconButton
  //                 size="small"
  //                 color="error"
  //                 onClick={(e) => {
  //                   e.stopPropagation();
  //                   removeRental(index);
  //                 }}
  //               >
  //                 <Iconify icon="mingcute:close-line" width={16} />
  //               </IconButton>
  //               <IconButton size="small">
  //                 <Iconify
  //                   icon={expandedRentals[index] ? 'eva:arrow-up-fill' : 'eva:arrow-down-fill'}
  //                   width={16}
  //                 />
  //               </IconButton>
  //             </Box>
  //           </Box>
  //           <Collapse in={expandedRentals[index]}>
  //             <Box sx={{ p: 2 }}>
  //               <Grid container spacing={2}>
  //                 <Grid xs={12}>
  //                   <RHFTextField
  //                     name={`rentals.${index}.item`}
  //                     label="Item Name"
  //                     size="small"
  //                     disabled
  //                   />
  //                 </Grid>
  //                 <Grid xs={6}>
  //                   <RHFTextField
  //                     name={`rentals.${index}.quantity`}
  //                     label="Quantity"
  //                     type="number"
  //                     size="small"
  //                     placeholder="Enter quantity"
  //                   />
  //                 </Grid>
  //                 <Grid xs={6}>
  //                   <RHFTextField
  //                     name={`rentals.${index}.cost`}
  //                     label="Cost per Item"
  //                     type="number"
  //                     size="small"
  //                     placeholder="Enter cost"
  //                     InputProps={{
  //                       startAdornment: '₹',
  //                     }}
  //                   />
  //                 </Grid>
  //               </Grid>
  //             </Box>
  //           </Collapse>
  //         </Paper>
  //       ))}
  //
  //       {rentalFields.length === 0 && (
  //         <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
  //           <Iconify icon="solar:box-linear" width={32} sx={{ mb: 1, opacity: 0.5 }} />
  //           <Typography variant="body2">No rental items selected</Typography>
  //         </Box>
  //       )}
  //     </Stack>
  //   </Card>
  // );

  const renderSummary = (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 2
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Iconify icon="solar:calculator-bold" width={20} />
        Cost Summary
      </Typography>
      <Stack spacing={1.5}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Services ({serviceFields.length}):</Typography>
          <Typography variant="body1" fontWeight="medium">₹{totalServiceCost.toLocaleString()}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Rentals ({rentalFields.length}):</Typography>
          <Typography variant="body1" fontWeight="medium">₹{totalRentalCost.toLocaleString()}</Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Total Cost:</Typography>
          <Typography variant="h5" fontWeight="bold">₹{totalCost.toLocaleString()}</Typography>
        </Box>
      </Stack>
    </Paper>
  );

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {isEdit ? 'Edit Event' : 'Create Event'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Enter event details, select services, and rental items
            </Typography>
            {renderSummary}
          </Box>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        {renderBasicDetails}
        {renderServices}
        {/*{renderRentals}*/}
        {!mdUp && renderSummary}

        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 3, justifyContent: 'flex-end' }}
        >
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isSubmitting}
            startIcon={<Iconify icon="eva:arrow-back-fill" />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={<Iconify icon="eva:save-fill" />}
          >
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
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

EstimateNewEditForm.propTypes = {
  estimateId: PropTypes.string,
};
