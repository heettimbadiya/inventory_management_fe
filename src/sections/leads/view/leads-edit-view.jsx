import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';


import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LeadsNewEditForm from '../leads-new-edit-form.jsx';

// ----------------------------------------------------------------------

export default function LeadsEditView({ id }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Leads',
            href: paths.dashboard.leads.root,
          },
          { name: 'Form' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LeadsNewEditForm leadId={id} />
    </Container>
  );
}

LeadsEditView.propTypes = {
  id: PropTypes.string,
};
