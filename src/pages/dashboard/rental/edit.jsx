import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';
import { RentalEditView } from '../../../sections/rental/view';


// ----------------------------------------------------------------------

export default function RentalEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Rental Edit</title>
      </Helmet>

      <RentalEditView id={`${id}`} />
    </>
  );
}
