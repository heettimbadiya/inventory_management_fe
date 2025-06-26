import { Helmet } from 'react-helmet-async';
import { ClientCreateView } from '../../../sections/client/view';

// ----------------------------------------------------------------------

export default function ClientCreatePage() {

  return (
    <>
      <Helmet>
        <title> Dashboard: Client Create</title>
      </Helmet>

      <ClientCreateView />
    </>
  );
}
