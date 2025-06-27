import { Helmet } from 'react-helmet-async';
import { ServiceCreateView } from '../../../sections/service/view';

// ----------------------------------------------------------------------

export default function ServiceCreatePage() {

  return (
    <>
      <Helmet>
        <title> Dashboard: Service Create</title>
      </Helmet>

      <ServiceCreateView />
    </>
  );
}
