import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import EstimateNewEditForm from '../estimate-new-edit-form.jsx';


// ----------------------------------------------------------------------

export default function EstimateCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new event"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Event',
            href: paths.dashboard.event.root,
          },
          { name: 'New Event' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <EstimateNewEditForm />
    </Container>
  );
}
