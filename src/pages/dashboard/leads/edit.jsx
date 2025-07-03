import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';
import LeadsEditView from '../../../sections/leads/view/leads-edit-view.jsx';


// ----------------------------------------------------------------------

export default function LeadsEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Leads Edit</title>
      </Helmet>

      <LeadsEditView id={`${id}`} />
    </>
  );
}
