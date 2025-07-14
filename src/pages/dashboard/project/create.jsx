import { Helmet } from 'react-helmet-async';
import { ProjectCreateView } from '../../../sections/project/view';

// ----------------------------------------------------------------------

export default function ProjectCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Project Create</title>
      </Helmet>

      <ProjectCreateView />
    </>
  );
} 