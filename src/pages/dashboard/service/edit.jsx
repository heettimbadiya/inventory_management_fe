import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';
import { ServiceEditView } from '../../../sections/service/view';


// ----------------------------------------------------------------------

export default function ServiceEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Service Edit</title>
      </Helmet>

      <ServiceEditView id={`${id}`} />
    </>
  );
}
