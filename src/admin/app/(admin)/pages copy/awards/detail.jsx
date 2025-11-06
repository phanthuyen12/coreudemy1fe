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
import { awardsController } from "@/config/config";

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
const initialAwardData = {
  id: null,
  awardName_vn: "Đang tải...",
  awardName_en: "Loading...",
  imageList: null,
  description_vn: "N/A",
  description_en: "N/A",
  createdDate: null,
  updatedDate: null,
  isShow: false,
};

const AwardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [awardData, setAwardData] = useState(initialAwardData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(initialAwardData);

  // Tải dữ liệu award
  useEffect(() => {
    const fetchAwardData = async () => {
      try {
        setLoading(true);
        const response = await awardsController.getById(id);
        setAwardData(response);
        setEditData(response);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu giải thưởng:", error);
        alert("Không thể tải dữ liệu giải thưởng");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAwardData();
    }
  }, [id]);

  // Xử lý cập nhật thông tin award
  const handleUpdateAward = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await awardsController.update(id, editData);
      setAwardData(editData);
      setShowEditModal(false);
      alert("Cập nhật thông tin giải thưởng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật giải thưởng:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin giải thưởng");
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

  // Xử lý xóa award
  const handleDeleteAward = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giải thưởng này?")) {
      try {
        await awardsController.remove(id);
        alert("Xóa giải thưởng thành công!");
        navigate("/page/awards?module=admin");
      } catch (error) {
        console.error("Lỗi khi xóa giải thưởng:", error);
        alert("Có lỗi xảy ra khi xóa giải thưởng");
      }
    }
  };

  // Xử lý bật/tắt hiển thị award
  const handleToggleShow = async () => {
    try {
      const response = await awardsController.toggle(id);
      setAwardData(response);
      setEditData(response);
      alert("Cập nhật trạng thái hiển thị thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  // Dữ liệu thống kê
  const statsData = useMemo(() => [
    {
      icon: "mdi:trophy",
      label: "Giải thưởng",
      value: awardData.awardName_vn || "N/A",
      color: "primary",
    },
    {
      icon: "mdi:eye",
      label: "Trạng thái",
      value: awardData.isShow ? "Hiển thị" : "Ẩn",
      color: awardData.isShow ? "success" : "warning",
    },
    {
      icon: "mdi:calendar",
      label: "Ngày tạo",
      value: formatDate(awardData.createdDate) || "N/A",
      color: "info",
    },
    {
      icon: "mdi:update",
      label: "Cập nhật",
      value: formatDate(awardData.updatedDate) || "N/A",
      color: "secondary",
    },
  ], [awardData]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <PageMetaData title={`Chi tiết giải thưởng - ${awardData.awardName_vn}`} />

      {/* Header với thông tin cơ bản */}
      <Card className="mb-4">
        <CardBody>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <div className="avatar-lg me-3">
                  {awardData.imageList ? (
                    <Image
                      src={`${apiUrlNoApi}${awardData.imageList}`}
                      roundedCircle
                      width={60}
                      height={60}
                      className="object-fit-cover"
                    />
                  ) : (
                    <span className="avatar-title bg-primary-subtle text-primary rounded-circle">
                      <IconifyIcon icon="mdi:trophy" className="fs-24" />
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="mb-1">{awardData.awardName_vn}</h4>
                  <p className="text-muted mb-0">{awardData.awardName_en}</p>
                  <Badge 
                    bg={awardData.isShow ? "success-subtle" : "warning-subtle"} 
                    className={awardData.isShow ? "text-success" : "text-warning"} 
                  >
                    {awardData.isShow ? "Đang hiển thị" : "Đã ẩn"}
                  </Badge>
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
                variant={awardData.isShow ? "warning" : "outline-success"}
                className="me-2"
                onClick={handleToggleShow}
              >
                <IconifyIcon icon={awardData.isShow ? "mdi:eye-off" : "mdi:eye"} className="me-1" />
                {awardData.isShow ? "Ẩn" : "Hiện"}
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteAward}
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
                        <td>#{awardData.id}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Tên giải thưởng (VN):</td>
                        <td>{awardData.awardName_vn}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Tên giải thưởng (EN):</td>
                        <td>{awardData.awardName_en}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Trạng thái:</td>
                        <td>
                          <Badge bg={awardData.isShow ? "success" : "warning"}>
                            {awardData.isShow ? "Hiển thị" : "Ẩn"}
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
                        <td>{formatDate(awardData.createdDate, true)}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Cập nhật lần cuối:</td>
                        <td>{formatDate(awardData.updatedDate, true)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="image" title="Hình ảnh">
              <Row>
                <Col md={12}>
                  <h5>Hình ảnh giải thưởng</h5>
                  {awardData.imageList ? (
                    <Card className="border">
                      <CardBody className="text-center">
                        <Image
                          src={`${apiUrlNoApi}${awardData.imageList}`}
                          fluid
                          className="rounded"
                          style={{ maxHeight: "400px" }}
                        />
                        <p className="mt-3 text-muted">
                          <strong>Đường dẫn:</strong> {awardData.imageList}
                        </p>
                      </CardBody>
                    </Card>
                  ) : (
                    <Card className="border">
                      <CardBody className="text-center text-muted">
                        <IconifyIcon icon="mdi:image-outline" className="fs-48 mb-2" />
                        <p>Chưa có hình ảnh giải thưởng</p>
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
                      <p className="mb-0">{awardData.description_vn}</p>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <h5>Mô tả (Tiếng Anh)</h5>
                  <Card className="border">
                    <CardBody>
                      <p className="mb-0">{awardData.description_en}</p>
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
          <Modal.Title>Chỉnh sửa thông tin giải thưởng</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateAward}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên giải thưởng (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="awardName_vn"
                    value={editData.awardName_vn}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên giải thưởng (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="awardName_en"
                    value={editData.awardName_en}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Đường dẫn hình ảnh</Form.Label>
                  <Form.Control
                    type="text"
                    name="imageList"
                    value={editData.imageList}
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
              <Col md={12}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isShow"
                    label="Hiển thị giải thưởng"
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

export default AwardDetailPage;
