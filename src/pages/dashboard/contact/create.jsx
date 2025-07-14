import { Helmet } from 'react-helmet-async';
import { ContactCreateView } from '../../../sections/contact/view';

export default function ContactCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Contact Create</title>
      </Helmet>
      <ContactCreateView />
    </>
  );
} 