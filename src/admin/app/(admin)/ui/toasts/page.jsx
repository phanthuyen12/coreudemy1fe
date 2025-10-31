import { Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import UIExamplesList from '@/admin/components/UIExamplesList';
import AllToasts from './components/AllToasts';
const Toasts = () => {
  return <>
      <PageBreadcrumb subName="Base UI" title="Toasts" />
      <PageMetaData title="Toasts" />

      <Row>
        <Col xl={9}>
          <AllToasts />
        </Col>
        <Col xl={3}>
          <UIExamplesList examples={[{
          link: '#basic_examples',
          label: 'Basic Examples'
        }, {
          link: '#live_example',
          label: 'Live example'
        }, {
          link: '#default_buttons',
          label: 'Staking'
        }, {
          link: '#custom_content',
          label: 'Custom Content'
        }, {
          link: '#transcluent',
          label: 'Transcluent'
        }, {
          link: '#placement',
          label: 'Placement'
        }]} />
        </Col>
      </Row>
    </>;
};
export default Toasts;