import Container from '@mui/material/Container';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import ProjectNewEditForm from '../project-new-edit-form.jsx';

export function ProjectCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new project"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Project', href: paths.dashboard.project.root },
          { name: 'New Project' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ProjectNewEditForm />
    </Container>
  );
} 