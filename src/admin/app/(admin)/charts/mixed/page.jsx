import { Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import UIExamplesList from '@/admin/components/UIExamplesList';
import AllMixedCharts from './components/AllMixedCharts';
const MixedCharts = () => {
  return <>
      <PageBreadcrumb subName="Charts" title="Mixed Charts" />
      <PageMetaData title="Mixed Charts" />

      <Row>
        <Col xl={9}>
          <AllMixedCharts />
        </Col>
        <Col xl={3}>
          <UIExamplesList examples={[{
          link: '#line-column',
          label: 'Line & Column Chart'
        }, {
          link: '#multiple-yaxis',
          label: 'Multiple Y-Axis Chart'
        }, {
          link: '#line-area',
          label: 'Line & Area Chart'
        }, {
          link: '#all',
          label: 'Line, Column & Area Chart'
        }]} />
        </Col>
      </Row>
    </>;
};
export default MixedCharts;