import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import RentalNewEditForm from '../rental-new-edit-form';


// ----------------------------------------------------------------------

export default function RentalCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new rental"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Rental',
            href: paths.dashboard.rental.root,
          },
          { name: 'New Rental' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RentalNewEditForm />
    </Container>
  );
}
