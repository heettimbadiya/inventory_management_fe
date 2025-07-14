import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ContactNewEditForm from '../contact-new-edit-form';
import { useGetContactById } from '../../../api/contact';

export default function ContactEditView({ id }) {
  const settings = useSettingsContext();
  const { contact, contactLoading } = useGetContactById(id);
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
      <ContactNewEditForm contact={contact} loading={contactLoading} />
    </Container>
  );
}

ContactEditView.propTypes = {
  id: PropTypes.string,
};
