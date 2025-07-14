import { Helmet } from 'react-helmet-async';
import { ContactListView } from '../../../sections/contact/view';

export default function ContactListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Contact List</title>
      </Helmet>
      <ContactListView />
    </>
  );
} 