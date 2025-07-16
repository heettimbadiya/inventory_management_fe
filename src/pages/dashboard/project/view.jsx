import { Helmet } from 'react-helmet-async';
import { ProjectView } from '../../../sections/project/view';

// ----------------------------------------------------------------------

export default function ProjectViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Project View</title>
      </Helmet>

      <ProjectView />
    </>
  );
} 