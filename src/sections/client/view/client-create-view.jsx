import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ClientNewEditForm from '../client-new-edit-form';


// ----------------------------------------------------------------------

export default function ClientCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new expense"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Client',
            href: paths.dashboard.client.root,
          },
          { name: 'New Client' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ClientNewEditForm />
    </Container>
  );
}
