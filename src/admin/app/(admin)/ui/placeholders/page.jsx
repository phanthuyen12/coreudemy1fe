import { Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import UIExamplesList from '@/admin/components/UIExamplesList';
import AllPlaceholders from './components/AllPlaceholders';
const PLaceholders = () => {
  return <>
      <PageBreadcrumb subName="Base UI" title="Placeholder" />
      <PageMetaData title="Placeholder" />

      <Row>
        <Col xl={9}>
          <AllPlaceholders />
        </Col>
        <Col xl={3}>
          <UIExamplesList examples={[{
          link: '#default',
          label: 'Overview'
        }, {
          link: '#how-works',
          label: 'How it works'
        }, {
          link: '#width',
          label: 'Width'
        }, {
          link: '#color',
          label: 'Color'
        }]} />
        </Col>
      </Row>
    </>;
};
export default PLaceholders;