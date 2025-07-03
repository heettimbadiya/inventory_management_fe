import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LeadsNewEditForm from '../leads-new-edit-form.jsx';


// ----------------------------------------------------------------------

export default function LeadsCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Lead"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Leads',
            href: paths.dashboard.leads.root,
          },
          { name: 'New Client' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LeadsNewEditForm />
    </Container>
  );
}
