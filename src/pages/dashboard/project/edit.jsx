import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
import { ProjectEditView } from '../../../sections/project/view';

// ----------------------------------------------------------------------

export default function ProjectEditPage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Project Edit</title>
      </Helmet>

      <ProjectEditView id={`${id}`} />
    </>
  );
} 