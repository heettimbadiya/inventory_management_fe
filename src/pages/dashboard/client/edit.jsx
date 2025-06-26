import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';
import { ClientEditView } from '../../../sections/client/view';


// ----------------------------------------------------------------------

export default function ClientEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Client Edit</title>
      </Helmet>

      <ClientEditView id={`${id}`} />
    </>
  );
}
