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
import { clientsController } from "@/config/config";

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
const initialClientData = {
  id: null,
  clientName_vn: "Đang tải...",
  clientName_en: "Loading...",
  logo: null,
  address: "N/A",
  email: "N/A",
  phone: "N/A",
  createDate: null,
  updateDate: null,
  isShow: false,
  status: "Active",
};

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(initialClientData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(initialClientData);

  // Tải dữ liệu client
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const response = await clientsController.getById(id);
        setClientData(response);
        setEditData(response);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu khách hàng:", error);
        alert("Không thể tải dữ liệu khách hàng");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClientData();
    }
  }, [id]);

  // Xử lý cập nhật thông tin client
  const handleUpdateClient = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await clientsController.update(id, editData);
      setClientData(editData);
      setShowEditModal(false);
      alert("Cập nhật thông tin khách hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật khách hàng:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin khách hàng");
    } finally {
      setSaving(false);
    }
  };

  // Xử lý thay đổi dữ liệu trong form chỉnh sửa
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setEditData({ 
        ...editData, 
        [name]: files[0] || null 
      });
    } else {
      setEditData({ 
        ...editData, 
        [name]: type === 'checkbox' ? checked : value 
      });
    }
  };

  // Xử lý bật/tắt hiển thị client
  const handleToggleShow = async () => {
    try {
      const response = await clientsController.toggle(id);
      setClientData(response);
      setEditData(response);
      alert("Cập nhật trạng thái hiển thị thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hiển thị:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái hiển thị");
    }
  };

  // Xử lý bật/tắt trạng thái active/inactive
  const handleToggleStatus = async () => {
    try {
      const response = await clientsController.toggleShowActive(id);
      setClientData(response);
      setEditData(response);
      alert("Cập nhật trạng thái hoạt động thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hoạt động:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái hoạt động");
    }
  };

  // Dữ liệu thống kê
  const statsData = useMemo(() => [
    {
      icon: "mdi:account",
      label: "Khách hàng",
      value: clientData.clientName_vn || "N/A",
      color: "primary",
    },
    {
      icon: "mdi:check-circle",
      label: "Trạng thái",
      value: clientData.status === 'Active' ? "Hoạt động" : "Ngừng",
      color: clientData.status === 'Active' ? "success" : "warning",
    },
    {
      icon: "mdi:eye",
      label: "Hiển thị",
      value: clientData.isShow ? "Hiển thị" : "Ẩn",
      color: clientData.isShow ? "info" : "secondary",
    },
    {
      icon: "mdi:calendar",
      label: "Ngày tạo",
      value: formatDate(clientData.createDate) || "N/A",
      color: "secondary",
    },
  ], [clientData]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <PageMetaData title={`Chi tiết khách hàng - ${clientData.clientName_vn}`} />

      {/* Header với thông tin cơ bản */}
      <Card className="mb-4">
        <CardBody>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <div className="avatar-lg me-3">
                  {clientData.logo ? (
                    <Image
                      src={`${apiUrlNoApi}${clientData.logo}`}
                      roundedCircle
                      width={60}
                      height={60}
                      className="object-fit-cover"
                    />
                  ) : (
                    <span className="avatar-title bg-primary-subtle text-primary rounded-circle">
                      <IconifyIcon icon="mdi:account" className="fs-24" />
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="mb-1">{clientData.clientName_vn}</h4>
                  <p className="text-muted mb-0">{clientData.clientName_en}</p>
                  <div className="d-flex gap-2 mt-1">
                    <Badge 
                      bg={clientData.status === 'Active' ? "success-subtle" : "warning-subtle"} 
                      className={clientData.status === 'Active' ? "text-success" : "text-warning"} 
                    >
                      {clientData.status === 'Active' ? "Hoạt động" : "Ngừng"}
                    </Badge>
                    <Badge 
                      bg={clientData.isShow ? "info-subtle" : "secondary-subtle"} 
                      className={clientData.isShow ? "text-info" : "text-secondary"} 
                    >
                      {clientData.isShow ? "Hiển thị" : "Ẩn"}
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
                variant={clientData.isShow ? "danger" : "outline-info"}
                className="me-2"
                onClick={handleToggleShow}
              >
                <IconifyIcon icon={clientData.isShow ? "mdi:eye-off" : "mdi:eye"} className="me-1" />
                {clientData.isShow ? "Ẩn" : "Hiện"}
              </Button>
              <Button
                variant={clientData.status === 'Active' ? "warning" : "outline-success"}
                onClick={handleToggleStatus}
              >
                <IconifyIcon icon={clientData.status === 'Active' ? "mdi:pause" : "mdi:play"} className="me-1" />
                {clientData.status === 'Active' ? "Ngừng" : "Kích hoạt"}
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
                        <td>#{clientData.id}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Tên khách hàng (VN):</td>
                        <td>{clientData.clientName_vn}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Tên khách hàng (EN):</td>
                        <td>{clientData.clientName_en}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Email:</td>
                        <td>{clientData.email}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Số điện thoại:</td>
                        <td>{clientData.phone}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <h5>Trạng thái & Thời gian</h5>
                  <Table responsive className="table-borderless">
                    <tbody>
                      <tr>
                        <td className="fw-semibold">Trạng thái:</td>
                        <td>
                          <Badge bg={clientData.status === 'Active' ? "success" : "warning"}>
                            {clientData.status === 'Active' ? "Hoạt động" : "Ngừng"}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Hiển thị:</td>
                        <td>
                          <Badge bg={clientData.isShow ? "info" : "secondary"}>
                            {clientData.isShow ? "Hiển thị" : "Ẩn"}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Ngày tạo:</td>
                        <td>{formatDate(clientData.createDate, true)}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Cập nhật lần cuối:</td>
                        <td>{formatDate(clientData.updateDate, true)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="logo" title="Logo">
              <Row>
                <Col md={12}>
                  <h5>Logo khách hàng</h5>
                  {clientData.logo ? (
                    <Card className="border">
                      <CardBody className="text-center">
                        <Image
                          src={`${apiUrlNoApi}${clientData.logo}`}
                          fluid
                          className="rounded"
                          style={{ maxHeight: "400px" }}
                        />
                        <p className="mt-3 text-muted">
                          <strong>Đường dẫn:</strong> {clientData.logo}
                        </p>
                      </CardBody>
                    </Card>
                  ) : (
                    <Card className="border">
                      <CardBody className="text-center text-muted">
                        <IconifyIcon icon="mdi:image-outline" className="fs-48 mb-2" />
                        <p>Chưa có logo khách hàng</p>
                      </CardBody>
                    </Card>
                  )}
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="contact" title="Thông tin liên hệ">
              <Row>
                <Col md={12}>
                  <h5>Thông tin liên hệ</h5>
                  <Card className="border">
                    <CardBody>
                      <Row>
                        <Col md={6}>
                          <p><strong>Email:</strong> {clientData.email}</p>
                          <p><strong>Số điện thoại:</strong> {clientData.phone}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Địa chỉ:</strong></p>
                          <p className="text-muted">{clientData.address}</p>
                        </Col>
                      </Row>
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
          <Modal.Title>Chỉnh sửa thông tin khách hàng</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateClient}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên khách hàng (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="clientName_vn"
                    value={editData.clientName_vn}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên khách hàng (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="clientName_en"
                    value={editData.clientName_en}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Logo</Form.Label>
                  <Form.Control
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">
                    Chọn file hình ảnh mới để thay thế logo hiện tại
                  </Form.Text>
                  {clientData.logo && (
                    <div className="mt-2">
                      <small className="text-muted">Logo hiện tại:</small>
                      <br />
                      <Image
                        src={`${apiUrlNoApi}${clientData.logo}`}
                        width={100}
                        height={100}
                        className="rounded object-fit-cover"
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={editData.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="address"
                    value={editData.address}
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
                    label="Hiển thị khách hàng"
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

export default ClientDetailPage;
