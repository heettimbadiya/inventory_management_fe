import { Helmet } from 'react-helmet-async';
import EventCreateView from '../../../sections/event/view/event-create-view';

// ----------------------------------------------------------------------

export default function EventCreatePage() {

  return (
    <>
      <Helmet>
        <title> Dashboard: Event Create</title>
      </Helmet>

      <EventCreateView />
    </>
  );
}
