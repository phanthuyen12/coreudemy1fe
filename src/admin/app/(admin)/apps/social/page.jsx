import { Row } from 'react-bootstrap';
import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import SocialView from './components/SocialView';
const Social = () => {
  return <>
      <PageBreadcrumb title="Social" subName="Apps" />
      <PageMetaData title="Social" />

      <Row className="justify-content-center">
        <SocialView />
      </Row>
    </>;
};
export default Social;