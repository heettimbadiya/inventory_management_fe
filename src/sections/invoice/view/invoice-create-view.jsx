import Container from '@mui/material/Container';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import InvoiceNewEditForm from '../invoice-new-edit-form';
import { useGetInvoices } from 'src/api/invoice';

export default function InvoiceCreateView() {
  const settings = useSettingsContext();
  const { mutate } = useGetInvoices();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new invoice"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Invoice', href: paths.dashboard.invoice.root },
          { name: 'New Invoice' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <InvoiceNewEditForm mutate={mutate} />
    </Container>
  );
}
