import { Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import UIExamplesList from '@/admin/components/UIExamplesList';
import AllPolarAreaCharts from './components/AllPolarAreaCharts';
import PageMetaData from '@/admin/components/PageTitle';
const PolarAreaCharts = () => {
  return <>
      <PageBreadcrumb subName="Charts" title="Polar Area Charts" />
      <PageMetaData title="Polar Area Charts" />

      <Row>
        <Col xl={9}>
          <AllPolarAreaCharts />
        </Col>
        <Col xl={3}>
          <UIExamplesList examples={[{
          link: '#basic',
          label: 'Basic Polar Area Chart'
        }, {
          link: '#monochrome',
          label: 'Monochrome Polar Area'
        }]} />
        </Col>
      </Row>
    </>;
};
export default PolarAreaCharts;