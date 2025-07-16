import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import InvoiceNewEditForm from '../invoice-new-edit-form';
import { useGetInvoiceById, useGetInvoices } from 'src/api/invoice';

export default function InvoiceEditView({ id }) {
  const settings = useSettingsContext();
  const { invoice, invoiceLoading } = useGetInvoiceById(id);
  const { mutate } = useGetInvoices();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Invoice"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Invoice', href: paths.dashboard.invoice.root },
          { name: 'Edit Invoice' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {!invoiceLoading && invoice && <InvoiceNewEditForm currentInvoice={invoice} mutate={mutate} />}
    </Container>
  );
}

InvoiceEditView.propTypes = {
  id: PropTypes.string,
};
