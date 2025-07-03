import { Helmet } from 'react-helmet-async';
import LeadsCreateView from '../../../sections/leads/view/leads-create-view.jsx';

// ----------------------------------------------------------------------

export default function LeadsCreatePage() {

  return (
    <>
      <Helmet>
        <title> Dashboard: Leads Create</title>
      </Helmet>

      <LeadsCreateView />
    </>
  );
}
