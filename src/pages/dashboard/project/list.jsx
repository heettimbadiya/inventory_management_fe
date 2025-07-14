import { Helmet } from 'react-helmet-async';
import { ProjectListView } from '../../../sections/project/view';

// ----------------------------------------------------------------------

export default function ProjectListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Project List</title>
      </Helmet>

      <ProjectListView />
    </>
  );
} 