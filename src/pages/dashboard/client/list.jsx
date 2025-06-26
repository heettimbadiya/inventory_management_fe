import { Helmet } from 'react-helmet-async';
import { ClientListView } from '../../../sections/client/view';


// ----------------------------------------------------------------------

export default function ClientListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Client List</title>
      </Helmet>

      <ClientListView />
    </>
  );
}
