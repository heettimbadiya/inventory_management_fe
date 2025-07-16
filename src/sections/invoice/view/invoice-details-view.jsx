import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import InvoiceDetails from '../invoice-details';
import { useGetInvoiceById } from 'src/api/invoice';
import CircularProgress from '@mui/material/CircularProgress';

export default function InvoiceDetailsView({ id }) {
  const settings = useSettingsContext();
  const { invoice, invoiceLoading } = useGetInvoiceById(id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={invoice?.invoiceNumber || 'Invoice Details'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Invoice', href: paths.dashboard.invoice.root },
          { name: invoice?.invoiceNumber || 'Details' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {invoiceLoading ? (
        <CircularProgress />
      ) : (
        invoice && <InvoiceDetails invoice={invoice} />
      )}
    </Container>
  );
}

InvoiceDetailsView.propTypes = {
  id: PropTypes.string,
};
