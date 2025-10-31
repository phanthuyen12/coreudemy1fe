import { Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import UIExamplesList from '@/admin/components/UIExamplesList';
import AllNavTabs from './components/AllNavTabs';
import PageMetaData from '@/admin/components/PageTitle';
const Tabs = () => {
  return <>
      <PageBreadcrumb subName="Base UI" title="Nav Tabs" />
      <PageMetaData title="Nav Tabs" />
      <Row>
        <Col xl={9}>
          <AllNavTabs />
        </Col>

        <Col xl={3}>
          <UIExamplesList examples={[{
          link: '#default',
          label: 'Nav Tabs'
        }, {
          link: '#tab-justify',
          label: 'Tabs Justify'
        }, {
          link: '#nav-pills',
          label: 'Nav Pills'
        }, {
          link: '#pills-justify',
          label: 'Pills Justified'
        }, {
          link: '#tab-vertical-left',
          label: 'Tabs Vertical Left'
        }, {
          link: '#tab-vertical-right',
          label: 'Tabs Vertical right'
        }]} />
        </Col>
      </Row>
    </>;
};
export default Tabs;