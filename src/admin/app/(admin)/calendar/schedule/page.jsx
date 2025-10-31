import { lazy, Suspense } from 'react';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
const CalendarPage = lazy(() => import('./components/CalendarPage'));
const Schedule = () => {
  return <>
      <PageBreadcrumb title="Schedule" subName="Calendar" />
      <PageMetaData title="Schedule" />

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <Row>
                <Suspense>
                  <CalendarPage />
                </Suspense>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>;
};
export default Schedule;