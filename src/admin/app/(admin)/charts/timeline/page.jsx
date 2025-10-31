import AllTimelineCharts from './components/AllTimelineCharts';
import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import UIExamplesList from '@/admin/components/UIExamplesList';
import { Col, Row } from 'react-bootstrap';
const TimelineCharts = () => {
  return <>
      <PageBreadcrumb subName="Charts" title="Timeline Charts" />
      <PageMetaData title="Timeline Charts" />

      <Row>
        <Col xl={9}>
          <AllTimelineCharts />
        </Col>
        <Col xl={3}>
          <UIExamplesList examples={[{
          link: '#basic',
          label: 'Basic Timeline'
        }, {
          link: '#distributed',
          label: 'Distributed Timeline'
        }, {
          link: '#multi-series',
          label: 'Multi Series Timeline'
        }, {
          link: '#advanced',
          label: 'Advanced Timeline'
        }, {
          link: '#group-rows',
          label: 'Multiple Series - Group Rows'
        }]} />
        </Col>
      </Row>
    </>;
};
export default TimelineCharts;