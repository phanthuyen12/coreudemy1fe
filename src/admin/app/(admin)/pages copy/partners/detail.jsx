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
import { partnersController } from "@/config/config";

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
const initialPartnerData = {
  id: null,
  fullName_vn: "Đang tải...",
  fullName_en: "Loading...",
  shortName: "N/A",
  images: null,
  level_vn: "N/A",
  level_en: "N/A",
  description_vn: "N/A",
  description_en: "N/A",
  createDate: null,
  updateDate: null,
  isShow: false,
};

const PartnerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partnerData, setPartnerData] = useState(initialPartnerData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(initialPartnerData);

  // Tải dữ liệu partner
  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        setLoading(true);
        const response = await partnersController.getById(id);
        setPartnerData(response);
        setEditData(response);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu đối tác:", error);
        alert("Không thể tải dữ liệu đối tác");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPartnerData();
    }
  }, [id]);

  // Xử lý cập nhật thông tin partner
  const handleUpdatePartner = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await partnersController.update(id, editData);
      setPartnerData(editData);
      setShowEditModal(false);
      alert("Cập nhật thông tin đối tác thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật đối tác:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin đối tác");
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

  // Xử lý xóa partner (soft delete)
  const handleDeletePartner = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đối tác này?")) {
      try {
        await partnersController.remove(id);
        alert("Xóa đối tác thành công!");
        navigate("/page/partners?module=admin");
      } catch (error) {
        console.error("Lỗi khi xóa đối tác:", error);
        alert("Có lỗi xảy ra khi xóa đối tác");
      }
    }
  };

  // Xử lý bật/tắt hiển thị partner
  const handleToggleShow = async () => {
    try {
      const response = await partnersController.toggle(id);
      setPartnerData(response);
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
      icon: "mdi:handshake",
      label: "Đối tác",
      value: partnerData.fullName_vn || "N/A",
      color: "primary",
    },
    {
      icon: "mdi:account-tie",
      label: "Chức vụ",
      value: partnerData.level_vn || "N/A",
      color: "info",
    },
    {
      icon: "mdi:eye",
      label: "Hiển thị",
      value: partnerData.isShow ? "Hiển thị" : "Ẩn",
      color: partnerData.isShow ? "success" : "warning",
    },
    {
      icon: "mdi:calendar",
      label: "Ngày tạo",
      value: formatDate(partnerData.createDate) || "N/A",
      color: "secondary",
    },
  ], [partnerData]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <PageMetaData title={`Chi tiết đối tác - ${partnerData.fullName_vn}`} />

      {/* Header với thông tin cơ bản */}
      <Card className="mb-4">
        <CardBody>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <div className="avatar-lg me-3">
                  {partnerData.images ? (
                    <Image
                      src={`${apiUrlNoApi}${partnerData.images}`}
                      roundedCircle
                      width={60}
                      height={60}
                      className="object-fit-cover"
                    />
                  ) : (
                    <span className="avatar-title bg-primary-subtle text-primary rounded-circle">
                      <IconifyIcon icon="mdi:handshake" className="fs-24" />
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="mb-1">{partnerData.fullName_vn}</h4>
                  <p className="text-muted mb-0">{partnerData.fullName_en}</p>
                  <div className="d-flex gap-2 mt-1">
                    <Badge bg="info-subtle" className="text-info">
                      {partnerData.shortName}
                    </Badge>
                    <Badge 
                      bg={partnerData.isShow ? "success-subtle" : "warning-subtle"} 
                      className={partnerData.isShow ? "text-success" : "text-warning"} 
                    >
                      {partnerData.isShow ? "Hiển thị" : "Ẩn"}
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
                variant={partnerData.isShow ? "warning" : "outline-success"}
                className="me-2"
                onClick={handleToggleShow}
              >
                <IconifyIcon icon={partnerData.isShow ? "mdi:eye-off" : "mdi:eye"} className="me-1" />
                {partnerData.isShow ? "Ẩn" : "Hiện"}
              </Button>
              <Button
                variant="danger"
                onClick={handleDeletePartner}
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
                        <td>#{partnerData.id}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Tên đối tác (VN):</td>
                        <td>{partnerData.fullName_vn}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Tên đối tác (EN):</td>
                        <td>{partnerData.fullName_en}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Tên ngắn:</td>
                        <td>
                          <Badge bg="info-subtle" className="text-info">
                            {partnerData.shortName}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Hiển thị:</td>
                        <td>
                          <Badge bg={partnerData.isShow ? "success" : "warning"}>
                            {partnerData.isShow ? "Hiển thị" : "Ẩn"}
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
                        <td>{formatDate(partnerData.createDate, true)}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Cập nhật lần cuối:</td>
                        <td>{formatDate(partnerData.updateDate, true)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="image" title="Hình ảnh">
              <Row>
                <Col md={12}>
                  <h5>Hình ảnh đối tác</h5>
                  {partnerData.images ? (
                    <Card className="border">
                      <CardBody className="text-center">
                        <Image
                          src={`${apiUrlNoApi}${partnerData.images}`}
                          fluid
                          className="rounded"
                          style={{ maxHeight: "400px" }}
                        />
                        <p className="mt-3 text-muted">
                          <strong>Đường dẫn:</strong> {partnerData.images}
                        </p>
                      </CardBody>
                    </Card>
                  ) : (
                    <Card className="border">
                      <CardBody className="text-center text-muted">
                        <IconifyIcon icon="mdi:image-outline" className="fs-48 mb-2" />
                        <p>Chưa có hình ảnh đối tác</p>
                      </CardBody>
                    </Card>
                  )}
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="position" title="Chức vụ">
              <Row>
                <Col md={6}>
                  <h5>Chức vụ (Tiếng Việt)</h5>
                  <Card className="border">
                    <CardBody>
                      <p className="mb-0">{partnerData.level_vn}</p>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <h5>Chức vụ (Tiếng Anh)</h5>
                  <Card className="border">
                    <CardBody>
                      <p className="mb-0">{partnerData.level_en}</p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="description" title="Mô tả">
              <Row>
                <Col md={6}>
                  <h5>Mô tả (Tiếng Việt)</h5>
                  <Card className="border">
                    <CardBody>
                      <p className="mb-0">{partnerData.description_vn}</p>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <h5>Mô tả (Tiếng Anh)</h5>
                  <Card className="border">
                    <CardBody>
                      <p className="mb-0">{partnerData.description_en}</p>
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
          <Modal.Title>Chỉnh sửa thông tin đối tác</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdatePartner}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên đối tác (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName_vn"
                    value={editData.fullName_vn}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên đối tác (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName_en"
                    value={editData.fullName_en}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên ngắn</Form.Label>
                  <Form.Control
                    type="text"
                    name="shortName"
                    value={editData.shortName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Hình ảnh</Form.Label>
                  <Form.Control
                    type="file"
                    name="images"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">
                    Chọn file hình ảnh mới để thay thế hình hiện tại
                  </Form.Text>
                  {partnerData.images && (
                    <div className="mt-2">
                      <small className="text-muted">Hình hiện tại:</small>
                      <br />
                      <Image
                        src={`${apiUrlNoApi}${partnerData.images}`}
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
                  <Form.Label>Chức vụ (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="level_vn"
                    value={editData.level_vn}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Chức vụ (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="level_en"
                    value={editData.level_en}
                    onChange={handleInputChange}
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
              <Col md={12}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isShow"
                    label="Hiển thị đối tác"
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

export default PartnerDetailPage;
