import React from 'react'
import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { createInvoice, updateInvoice, useGetInvoices } from 'src/api/invoice';
import { useBoolean } from 'src/hooks/use-boolean';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import InvoiceNewEditDetails from './invoice-new-edit-details';
import InvoiceNewEditStatusDate from './invoice-new-edit-status-date';
import { Box, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const InvoiceSchema = Yup.object().shape({
  projectId: Yup.object().required('Project is required'),
  contactId: Yup.object().required('Contact is required'),
  items: Yup.array()
    .of(
      Yup.object().shape({
        description: Yup.string(),
        title: Yup.string(),
        quantity: Yup.number().required('Quantity is required').min(1, 'Min 1'),
        unitPrice: Yup.number().required('Unit price is required').min(0, 'Min 0'),
        total: Yup.number().required('Total is required').min(0, 'Min 0'),
      })
    )
    .min(1, 'At least one item is required'),
  totalAmount: Yup.number().required('Total amount is required').min(0, 'Min 0'),
  status: Yup.string().oneOf(['Unpaid', 'Paid', 'Overdue']).required('Status is required'),
  issueDate: Yup.date().required('Issue date is required'),
  dueDate: Yup.date().required('Due date is required'),
  notes: Yup.string(),
  paymentDate: Yup.date().nullable(),
});

export default function InvoiceNewEditForm({ currentInvoice }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const loadingSave = useBoolean();
  const isEdit = Boolean(currentInvoice && currentInvoice._id);

  const defaultValues = useMemo(
    () => ({
      projectId: currentInvoice?.projectId || null,
      contactId: currentInvoice?.contactId || null,
      items:
        currentInvoice?.items?.length > 0
          ? currentInvoice.items
          : [
              {
                title: '',
                description: '',
                quantity: 1,
                unitPrice: 0,
                total: 0,
              },
            ],
      totalAmount: currentInvoice?.totalAmount || 0,
      status: currentInvoice?.status || 'Unpaid',
      issueDate: currentInvoice?.issueDate ? new Date(currentInvoice.issueDate) : new Date(),
      dueDate: currentInvoice?.dueDate ? new Date(currentInvoice.dueDate) : null,
      notes: currentInvoice?.notes || '',
      paymentDate: currentInvoice?.paymentDate ? new Date(currentInvoice.paymentDate) : null,
    }),
    [currentInvoice]
  );

  const methods = useForm({
    resolver: yupResolver(InvoiceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // Calculate totalAmount on items change
  const items = watch('items');
  React.useEffect(() => {
    const total = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);
    setValue('totalAmount', total);
    // Update each item's total
    items.forEach((item, idx) => {
      const newTotal = Number(item.quantity) * Number(item.unitPrice);
      if (item.total !== newTotal) setValue(`items.${idx}.total`, newTotal);
    });
  }, [items, setValue]);

  // Handle form submit
  const onSubmit = handleSubmit(async (formData) => {
    loadingSave.onTrue();
    console.log(formData,'formData');
    try {
      const payload = {
        ...formData,
        projectId: formData.projectId._id || formData.projectId.id || formData.projectId,
        contactId: formData.contactId._id || formData.contactId.id || formData.contactId,
        items: formData.items.map((item) => ({
          description: item.description,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          total: Number(item.total),
        })),
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        paymentDate: formData.paymentDate || null,
      };

      if (isEdit) {
        await updateInvoice(currentInvoice._id, payload);
        enqueueSnackbar('Invoice updated successfully!', { variant: 'success' });
      } else {
        await createInvoice(payload);
        enqueueSnackbar('Invoice created successfully!', { variant: 'success' });
      }
      loadingSave.onFalse();
      router.push(paths.dashboard.invoice.root);
    } catch (error) {
      enqueueSnackbar('Failed to save invoice', { variant: 'error' });
      loadingSave.onFalse();
    }
  });

  // UI: keep your existing UI, but update the fields and validation
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card>
        {/* The rest of your existing UI (status, dates, items, etc.) */}
        <InvoiceNewEditStatusDate />
        <InvoiceNewEditDetails
          fields={fields}
          append={append}
          remove={remove}
          control={control}
          errors={methods.formState.errors}
        />
        {/* Notes and Payment Date fields */}
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={12} md={3}>
            <RHFTextField
              name="notes"
              label="Notes"
              placeholder="Add notes (optional)"
              multiline
              minRows={2}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Controller
              name="paymentDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Payment Date"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                      size: 'small',
                    },
                  }}
                />
              )}
            />
          </Grid>
          </Grid>
        {/* Notes, paymentDate, etc. can be added here as per your UI */}
        <Box sx={{ display:'flex',justifyContent: 'flex-end', p: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={loadingSave.value || isSubmitting}>
            {isEdit ? 'Update Invoice' : 'Create Invoice'}
          </LoadingButton>
        </Box>
      </Card>
    </FormProvider>
  );
}

InvoiceNewEditForm.propTypes = {
  currentInvoice: PropTypes.object,
};
