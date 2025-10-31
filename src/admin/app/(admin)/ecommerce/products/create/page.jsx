import { Card, CardBody, Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import CreateProductForms from './components/CreateProductForms';
import PageMetaData from '@/admin/components/PageTitle';
const CreateProduct = () => {
  return <>
      <PageBreadcrumb title="Create Product" subName="Ecommerce" />
      <PageMetaData title="Create Product" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <CreateProductForms />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>;
};
export default CreateProduct;