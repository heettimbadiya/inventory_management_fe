import { Helmet } from 'react-helmet-async';
import LeadsListView from '../../../sections/leads/view/leads-list-view.jsx';


// ----------------------------------------------------------------------

export default function LeadsListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Leads List</title>
      </Helmet>

      <LeadsListView />
    </>
  );
}
