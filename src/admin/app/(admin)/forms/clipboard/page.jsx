import { Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import UIExamplesList from '@/admin/components/UIExamplesList';
import AllClipboards from './components/AllClipboards';
const Clipboard = () => {
  return <>
      <PageBreadcrumb subName="Form" title="Clipboard" />
      <PageMetaData title="Clipboard" />

      <Row>
        <Col xl={9}>
          <AllClipboards />
        </Col>
        <Col xl={3}>
          <UIExamplesList examples={[{
          link: '#copy-from-element',
          label: 'Copy text from another element'
        }, {
          link: '#cut-from-element',
          label: 'Cut text from another element'
        }, {
          link: '#copy-from-attribute',
          label: 'Copy text from attribute'
        }]} />
        </Col>
      </Row>
    </>;
};
export default Clipboard;