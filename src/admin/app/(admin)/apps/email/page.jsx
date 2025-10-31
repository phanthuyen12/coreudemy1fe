import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import { EmailProvider } from '@/admin/context/useEmailContext';
import { Row } from 'react-bootstrap';
import EmailView from './components/EmailView';
const Email = () => {
  return <>
      <PageBreadcrumb subName="Email" title="Inbox" />
      <PageMetaData title="Inbox" />
      <Row className="g-1 mb-3">
        <EmailProvider>
          <EmailView />
        </EmailProvider>
      </Row>
    </>;
};
export default Email;