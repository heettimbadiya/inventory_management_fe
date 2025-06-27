import { Helmet } from 'react-helmet-async';
import { RentalListView } from '../../../sections/rental/view';


// ----------------------------------------------------------------------

export default function RentalListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Rental List</title>
      </Helmet>

      <RentalListView />
    </>
  );
}
