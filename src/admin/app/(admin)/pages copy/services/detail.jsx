import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiUrlNoApi } from "@/config/config";
import {
  Card,
  CardBody,
  Col,
  Row,
  Button,
  Badge,
  Image,
  Form,
  Tabs,
  Tab,
  Spinner,
  Table,
  Modal,
} from "react-bootstrap";

import PageMetaData from "@/admin/components/PageTitle";
import IconifyIcon from "@/admin/components/wrappers/IconifyIcon";
import { servicesController } from "@/config/config";

// Hàm định dạng ngày/thời gian
const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return "N/A";
  const options = includeTime
    ? {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    : { year: "numeric", month: "2-digit", day: "2-digit" };
  try {
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  } catch (error) {
    return "N/A";
  }
};

// Component cho các thẻ thống kê
const StatCard = ({ icon, label, value, color }) => (
  <Col md={6} lg={3}>
    <Card className="shadow-sm border-0 h-100">
      <CardBody className="py-3">
        <div className="d-flex align-items-center">
          <div className="avatar-sm flex-shrink-0">
            <span
              className={`avatar-title bg-${color}-subtle text-${color} rounded-circle`}
              style={{ width: "45px", height: "45px" }}
            >
              <IconifyIcon icon={icon} className="fs-20" />
            </span>
          </div>
          <div className="ms-3 flex-grow-1">
            <p className="text-muted mb-1 text-truncate">{label}</p>
            <h5 className="mb-0 fw-bold">{value}</h5>
          </div>
        </div>
      </CardBody>
    </Card>
  </Col>
);

// Dữ liệu mẫu ban đầu
const initialServiceData = {
  id: null,
  serviceName_vn: "Đang tải...",
  serviceName_en: "Loading...",
  serviceImage: null,
  description_vn: "N/A",
  description_en: "N/A",
  createDate: null,
  updateDate: null,
  isShow: false,
  status: "Active",
};

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState(initialServiceData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(initialServiceData);

  // Tải dữ liệu service
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const response = await servicesController.getById(id);
        setServiceData(response);
        setEditData(response);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dịch vụ:", error);
        alert("Không thể tải dữ liệu dịch vụ");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceData();
    }
  }, [id]);

  // Xử lý cập nhật thông tin service
  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await servicesController.update(id, editData);
      setServiceData(editData);
      setShowEditModal(false);
      alert("Cập nhật thông tin dịch vụ thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật dịch vụ:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin dịch vụ");
    } finally {
      setSaving(false);
    }
  };

  // Xử lý thay đổi dữ liệu trong form chỉnh sửa
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData({ 
      ...editData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // Xử lý xóa service
  const handleDeleteService = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
      try {
        await servicesController.remove(id);
        alert("Xóa dịch vụ thành công!");
        navigate("/page/services?module=admin");
      } catch (error) {
        console.error("Lỗi khi xóa dịch vụ:", error);
        alert("Có lỗi xảy ra khi xóa dịch vụ");
      }
    }
  };

  // Xử lý bật/tắt hiển thị service
  const handleToggleShow = async () => {
    try {
      const response = await servicesController.toggle(id);
      setServiceData(response);
      setEditData(response);
      alert("Cập nhật trạng thái hiển thị thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hiển thị:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái hiển thị");
    }
  };

  // Dữ liệu thống kê
  const statsData = useMemo(() => [
    {
      icon: "mdi:cog",
      label: "Dịch vụ",
      value: serviceData.serviceName_vn || "N/A",
      color: "primary",
    },
    {
      icon: "mdi:check-circle",
      label: "Trạng thái",
      value: serviceData.status === 'Active' ? "Hoạt động" : "Ngừng",
      color: serviceData.status === 'Active' ? "success" : "warning",
    },
    {
      icon: "mdi:eye",
      label: "Hiển thị",
      value: serviceData.isShow ? "Hiển thị" : "Ẩn",
      color: serviceData.isShow ? "info" : "secondary",
    },
    {
      icon: "mdi:calendar",
      label: "Ngày tạo",
      value: formatDate(serviceData.createDate) || "N/A",
      color: "secondary",
    },
  ], [serviceData]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <PageMetaData title={`Chi tiết dịch vụ - ${serviceData.serviceName_vn}`} />

      {/* Header với thông tin cơ bản */}
      <Card className="mb-4">
        <CardBody>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <div className="avatar-lg me-3">
                  {serviceData.serviceImage ? (
                    <Image
                      src={`${apiUrlNoApi}${serviceData.serviceImage}`}
                      roundedCircle
                      width={60}
                      height={60}
                      className="object-fit-cover"
                    />
                  ) : (
                    <span className="avatar-title bg-primary-subtle text-primary rounded-circle">
                      <IconifyIcon icon="mdi:cog" className="fs-24" />
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="mb-1">{serviceData.serviceName_vn}</h4>
                  <p className="text-muted mb-0">{serviceData.serviceName_en}</p>
                  <div className="d-flex gap-2 mt-1">
                    <Badge 
                      bg={serviceData.status === 'Active' ? "success-subtle" : "warning-subtle"} 
                      className={serviceData.status === 'Active' ? "text-success" : "text-warning"} 
                    >
                      {serviceData.status === 'Active' ? "Hoạt động" : "Ngừng"}
                    </Badge>
                    <Badge 
                      bg={serviceData.isShow ? "info-subtle" : "secondary-subtle"} 
                      className={serviceData.isShow ? "text-info" : "text-secondary"} 
                    >
                      {serviceData.isShow ? "Hiển thị" : "Ẩn"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={() => setShowEditModal(true)}
              >
                <IconifyIcon icon="mdi:pencil" className="me-1" />
                Chỉnh sửa
              </Button>
              <Button
                variant={serviceData.isShow ? "danger" : "outline-info"}
                className="me-2"
                onClick={handleToggleShow}
              >
                <IconifyIcon icon={serviceData.isShow ? "mdi:eye-off" : "mdi:eye"} className="me-1" />
                {serviceData.isShow ? "Ẩn" : "Hiện"}
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteService}
              >
                <IconifyIcon icon="mdi:delete-outline" className="me-1" />
                Xóa
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Thống kê */}
      <Row className="g-3 mb-4">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </Row>

      {/* Tabs */}
      <Card>
        <CardBody>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="overview" title="Tổng quan">
              <Row>
                <Col md={6}>
                  <h5>Thông tin cơ bản</h5>
                  <Table responsive className="table-borderless">
                    <tbody>
                      <tr>
                        <td className="fw-semibold">ID:</td>
                        <td>#{serviceData.id}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Tên dịch vụ (VN):</td>
                        <td>{serviceData.serviceName_vn}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Tên dịch vụ (EN):</td>
                        <td>{serviceData.serviceName_en}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Trạng thái:</td>
                        <td>
                          <Badge bg={serviceData.status === 'Active' ? "success" : "warning"}>
                            {serviceData.status === 'Active' ? "Hoạt động" : "Ngừng"}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Hiển thị:</td>
                        <td>
                          <Badge bg={serviceData.isShow ? "info" : "secondary"}>
                            {serviceData.isShow ? "Hiển thị" : "Ẩn"}
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <h5>Thông tin thời gian</h5>
                  <Table responsive className="table-borderless">
                    <tbody>
                      <tr>
                        <td className="fw-semibold">Ngày tạo:</td>
                        <td>{formatDate(serviceData.createDate, true)}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Cập nhật lần cuối:</td>
                        <td>{formatDate(serviceData.updateDate, true)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="image" title="Hình ảnh">
              <Row>
                <Col md={12}>
                  <h5>Hình ảnh dịch vụ</h5>
                  {serviceData.serviceImage ? (
                    <Card className="border">
                      <CardBody className="text-center">
                        <Image
                          src={`${apiUrlNoApi}${serviceData.serviceImage}`}
                          fluid
                          className="rounded"
                          style={{ maxHeight: "400px" }}
                        />
                        <p className="mt-3 text-muted">
                          <strong>Đường dẫn:</strong> {serviceData.serviceImage}
                        </p>
                      </CardBody>
                    </Card>
                  ) : (
                    <Card className="border">
                      <CardBody className="text-center text-muted">
                        <IconifyIcon icon="mdi:image-outline" className="fs-48 mb-2" />
                        <p>Chưa có hình ảnh dịch vụ</p>
                      </CardBody>
                    </Card>
                  )}
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="description" title="Mô tả">
              <Row>
                <Col md={6}>
                  <h5>Mô tả (Tiếng Việt)</h5>
                  <Card className="border">
                    <CardBody>
                      <p className="mb-0">{serviceData.description_vn}</p>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <h5>Mô tả (Tiếng Anh)</h5>
                  <Card className="border">
                    <CardBody>
                      <p className="mb-0">{serviceData.description_en}</p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      {/* Modal chỉnh sửa */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa thông tin dịch vụ</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateService}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên dịch vụ (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="serviceName_vn"
                    value={editData.serviceName_vn}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên dịch vụ (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="serviceName_en"
                    value={editData.serviceName_en}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Đường dẫn hình ảnh</Form.Label>
                  <Form.Control
                    type="text"
                    name="serviceImage"
                    value={editData.serviceImage}
                    onChange={handleInputChange}
                    placeholder="/path/to/image.jpg"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description_vn"
                    value={editData.description_vn}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description_en"
                    value={editData.description_en}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    name="status"
                    value={editData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Ngừng hoạt động</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isShow"
                    label="Hiển thị dịch vụ"
                    checked={editData.isShow}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(false)}
            >
              Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ServiceDetailPage;

