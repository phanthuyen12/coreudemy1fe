import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { mailController } from '@/config/config';
import PageMetaData from '@/admin/components/PageTitle';
import IconifyIcon from '@/admin/components/wrappers/IconifyIcon';

const MailDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mail, setMail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load mail detail
  const loadMailDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mailController.getById(id);
      
      if (response.success) {
        setMail(response.data);
      } else {
        setError(response.message || 'Failed to load mail details');
      }
    } catch (error) {
      console.error('Error loading mail detail:', error);
      setError('Error loading mail details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadMailDetail();
    }
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <PageMetaData title="Chi tiết Mail" />
        <div className="page-content">
          <div className="container-fluid">
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-2">Đang tải chi tiết mail...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageMetaData title="Lỗi" />
        <div className="page-content">
          <div className="container-fluid">
            <Alert variant="danger">
              <Alert.Heading>Lỗi</Alert.Heading>
              <p>{error}</p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button variant="outline-danger" onClick={() => navigate('/admin/page/mails')}>
                  Quay lại danh sách
                </Button>
              </div>
            </Alert>
          </div>
        </div>
      </>
    );
  }

  if (!mail) {
    return (
      <>
        <PageMetaData title="Mail không tồn tại" />
        <div className="page-content">
          <div className="container-fluid">
            <Alert variant="warning">
              <Alert.Heading>Mail không tồn tại</Alert.Heading>
              <p>Mail bạn đang tìm kiếm không tồn tại.</p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button variant="outline-warning" onClick={() => navigate('/admin/page/mails')}>
                  Quay lại danh sách
                </Button>
              </div>
            </Alert>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMetaData title="Chi tiết Mail" />
      
      <div className="page-content">
        <div className="container-fluid">
          {/* Page Title */}
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0">Chi tiết Mail</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link to="/admin">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/admin/page/mails">Mails</Link>
                    </li>
                    <li className="breadcrumb-item active">Mail #{mail.id}</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <Row>
            <Col lg={8}>
              {/* Mail Information */}
              <Card className="mb-4">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Thông tin Mail</h5>
                    <Badge bg="primary">#{mail.id}</Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col md={6}>
                      <label className="form-label fw-semibold">Họ và tên</label>
                      <p className="text-muted">{mail.firstName} {mail.lastName}</p>
                    </Col>
                    <Col md={6}>
                      <label className="form-label fw-semibold">Email</label>
                      <p className="text-muted">
                        <a href={`mailto:${mail.email}`} className="text-decoration-none">
                          {mail.email}
                        </a>
                      </p>
                    </Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col md={12}>
                      <label className="form-label fw-semibold">Nội dung</label>
                      <div className="border rounded p-3 bg-light">
                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                          {mail.content}
                        </p>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <label className="form-label fw-semibold">Ngày tạo</label>
                      <p className="text-muted">{formatDate(mail.createdAt)}</p>
                    </Col>
                    <Col md={6}>
                      <label className="form-label fw-semibold">Ngày cập nhật</label>
                      <p className="text-muted">{formatDate(mail.updatedAt)}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Actions */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="card-title mb-0">Thao tác</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Button 
                      variant="outline-primary" 
                      onClick={() => navigate('/admin/page/mails')}
                    >
                      <IconifyIcon icon="mdi:arrow-left" className="me-1" />
                      Quay lại danh sách
                    </Button>
                    
                    <Button 
                      variant="outline-info" 
                      href={`mailto:${mail.email}`}
                    >
                      <IconifyIcon icon="mdi:email-reply" className="me-1" />
                      Trả lời email
                    </Button>
                    
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => window.print()}
                    >
                      <IconifyIcon icon="mdi:printer" className="me-1" />
                      In
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Quick Info */}
              <Card>
                <Card.Header>
                  <h5 className="card-title mb-0">Thông tin nhanh</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Mail ID:</span>
                    <span className="fw-medium">#{mail.id}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Họ tên:</span>
                    <span className="fw-medium">{mail.firstName} {mail.lastName}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Email:</span>
                    <span className="fw-medium text-truncate" style={{ maxWidth: '150px' }}>
                      {mail.email}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Ngày tạo:</span>
                    <span className="fw-medium">{formatDate(mail.createdAt)}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default MailDetailPage;



