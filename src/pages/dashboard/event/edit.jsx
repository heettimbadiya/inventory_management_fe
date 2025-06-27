import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';
import EventEditView from '../../../sections/event/view/event-edit-view';


// ----------------------------------------------------------------------

export default function EventEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Event Edit</title>
      </Helmet>

      <EventEditView id={`${id}`} />
    </>
  );
}
