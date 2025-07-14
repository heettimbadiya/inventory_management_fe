import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ContactNewEditForm from '../contact-new-edit-form';

export default function ContactEditView({ id }) {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Contact"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Contact', href: paths.dashboard.contact.root },
          { name: 'Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ContactNewEditForm contactId={id} />
    </Container>
  );
}

ContactEditView.propTypes = {
  id: PropTypes.string,
}; 