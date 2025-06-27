import { Helmet } from 'react-helmet-async';
import EventListView from '../../../sections/event/view/event-list-view';


// ----------------------------------------------------------------------

export default function EventListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Event List</title>
      </Helmet>

      <EventListView />
    </>
  );
}
