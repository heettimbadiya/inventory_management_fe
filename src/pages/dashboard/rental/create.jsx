import { Helmet } from 'react-helmet-async';
import { RentalCreateView } from '../../../sections/rental/view';

// ----------------------------------------------------------------------

export default function RentalCreatePage() {

  return (
    <>
      <Helmet>
        <title> Dashboard: Rental Create</title>
      </Helmet>

      <RentalCreateView />
    </>
  );
}
