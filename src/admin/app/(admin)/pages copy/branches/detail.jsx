import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { validateImageQuality, validateImageDimensions, validateFormData, showValidationErrors } from "@/utils/imageValidation";
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
  ListGroup,
  Spinner,
  Table,
  Modal,
} from "react-bootstrap";

import PageMetaData from "@/admin/components/PageTitle";
import IconifyIcon from "@/admin/components/wrappers/IconifyIcon";
import { branchController, apiUrlNoApi } from "@/config/config";

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
const initialBranchData = {
  id: null,
  companyName_vn: "Đang tải...",
  companyName_en: "Loading...",
  shortName: "...",
  address_vn: "N/A",
  address_en: "N/A",
  phone: "N/A",
  email: "N/A",
  businessLicenseImage: null,
  aboutUs_vn: "N/A",
  aboutUs_en: "N/A",
  philosophy_vn: "N/A",
  philosophy_en: "N/A",
  slogan_vn: "N/A",
  slogan_en: "N/A",
  googleMap: "N/A",
  facebook: "N/A",
  instagram: "N/A",
  youtube: "N/A",
  isHeadOfice: false,
    createdAt: null,
    updatedAt: null,
    createdDate: null,
    updatedDate: null,
  whatWeDo_vn: "N/A",
  whatWeDo_en: "N/A",
  ourImpact_vn: "N/A",
  ourImpact_en: "N/A",
  coreValue_vn: "N/A",
  coreValue_en: "N/A",
};

const BranchDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branchData, setBranchData] = useState(initialBranchData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(initialBranchData);
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  // Tải dữ liệu chi nhánh
  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        setLoading(true);
        const response = await branchController.getById(id);
        setBranchData({
          ...response,
          createdDate: response.createdAt,
          updatedDate: response.updatedAt,
        });
        setEditData({
          ...response,
          createdDate: response.createdAt,
          updatedDate: response.updatedAt,
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu chi nhánh:", error);
        alert("Không thể tải dữ liệu chi nhánh");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBranchData();
    }
  }, [id]);

  // Xử lý cập nhật thông tin chi nhánh
  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Validate required fields
      const requiredFields = ['companyName_vn', 'companyName_en', 'address_vn', 'address_en', 'phone', 'email'];
      const formValidation = validateFormData(editData, requiredFields);
      
      if (!formValidation.isValid) {
        showValidationErrors(formValidation.errors);
        return;
      }
      
      // Tạo object chứa tất cả dữ liệu
      const submitData = { ...editData };
      
      // Thêm các file image
      // Thêm file image nếu có
      if (editImage) {
        submitData.businessLicenseImage = editImage;
      }
      
      console.log('Detail Update data:', submitData);
      
      await branchController.updateBranch(id, submitData);
      setBranchData(editData);
      setShowEditModal(false);
      alert("Cập nhật thông tin chi nhánh thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật chi nhánh:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin chi nhánh");
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

  // Xử lý upload file
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image quality
      const qualityValidation = validateImageQuality(file);
      if (!qualityValidation.isValid) {
        showValidationErrors(qualityValidation.errors);
        e.target.value = ''; // Clear input
        return;
      }

      // Validate image dimensions
      const dimensionValidation = await validateImageDimensions(file);
      if (!dimensionValidation.isValid) {
        showValidationErrors(dimensionValidation.errors);
        e.target.value = ''; // Clear input
        return;
      }

      setEditImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý xóa chi nhánh
  const handleDeleteBranch = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chi nhánh này?")) {
      try {
        await branchController.deleteBranch(id);
        alert("Xóa chi nhánh thành công!");
        navigate("/page/branches?module=admin");
      } catch (error) {
        console.error("Lỗi khi xóa chi nhánh:", error);
        alert("Có lỗi xảy ra khi xóa chi nhánh");
      }
    }
  };

  // Dữ liệu thống kê
  const statsData = useMemo(() => [
    {
      icon: "mdi:office-building",
      label: "Tổng chi nhánh",
      value: "1",
      color: "primary",
    },
    {
      icon: "mdi:check-circle",
      label: "Trạng thái",
      value: "Hoạt động",
      color: "success",
    },
    {
      icon: "mdi:phone",
      label: "Liên hệ",
      value: branchData.phone || "N/A",
      color: "info",
    },
    {
      icon: "mdi:email",
      label: "Email",
      value: branchData.email ? "Có" : "Không",
      color: "warning",
    },
  ], [branchData]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <PageMetaData title={`Chi tiết chi nhánh - ${branchData.companyName_vn}`} />

      {/* Header với thông tin cơ bản */}
      <Card className="mb-4">
        <CardBody>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <div className="avatar-lg me-3">
                  <span className="avatar-title bg-primary-subtle text-primary rounded-circle">
                    <IconifyIcon icon="mdi:office-building" className="fs-24" />
                  </span>
                </div>
                <div>
                  <h4 className="mb-1">{branchData.companyName_vn}</h4>
                  <p className="text-muted mb-0">{branchData.companyName_en}</p>
                  <Badge bg="info-subtle" className="text-info mt-1">
                    {branchData.shortName}
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
                variant="danger"
                onClick={handleDeleteBranch}
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
                        <td>#{branchData.id}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Tên công ty (VN):</td>
                        <td>{branchData.companyName_vn}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Tên công ty (EN):</td>
                        <td>{branchData.companyName_en}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Tên ngắn:</td>
                        <td>
                          <Badge bg="info-subtle" className="text-info">
                            {branchData.shortName}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Số điện thoại:</td>
                        <td>{branchData.phone}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Email:</td>
                        <td>{branchData.email}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Loại chi nhánh:</td>
                        <td>
                          {branchData.isHeadOfice ? (
                            <Badge bg="success" className="fs-6">
                              <IconifyIcon icon="mdi:crown" className="me-1" />
                              Trụ sở chính
                            </Badge>
                          ) : (
                            <Badge bg="info" className="fs-6">
                              <IconifyIcon icon="mdi:store" className="me-1" />
                              Chi nhánh phụ
                            </Badge>
                          )}
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
                        <td>{formatDate(branchData.createdDate, true)}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">Cập nhật lần cuối:</td>
                        <td>{formatDate(branchData.updatedDate, true)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="address" title="Địa chỉ">
              <Row>
                <Col md={6}>
                  <h5>Địa chỉ (Tiếng Việt)</h5>
                  <Card className="border">
                    <CardBody>
                      <p className="mb-0">{branchData.address_vn}</p>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <h5>Địa chỉ (Tiếng Anh)</h5>
                  <Card className="border">
                    <CardBody>
                      <p className="mb-0">{branchData.address_en}</p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="about" title="Giới thiệu">
              <Row>
                <Col md={6}>
                  <h5>Giới thiệu (Tiếng Việt)</h5>
                  <Card className="border">
                    <CardBody>
                      <p className="mb-0">{branchData.aboutUs_vn}</p>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <h5>Giới thiệu (Tiếng Anh)</h5>
                  <Card className="border">
                    <CardBody>
                      <p className="mb-0">{branchData.aboutUs_en}</p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="philosophy" title="Triết lý">
              <Row>
                <Col md={6}>
                  <h5>Triết lý (Tiếng Việt)</h5>
                  <Card className="border">
                    <CardBody>
                      <p className="mb-0">{branchData.philosophy_vn}</p>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <h5>Triết lý (Tiếng Anh)</h5>
                  <Card className="border">
                    <CardBody>
                      <p className="mb-0">{branchData.philosophy_en}</p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="slogan" title="Slogan">
              <Row>
                <Col md={6}>
                  <h5>Slogan (Tiếng Việt)</h5>
                  <Card className="border">
                    <CardBody>
                      <p className="mb-0">{branchData.slogan_vn}</p>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <h5>Slogan (Tiếng Anh)</h5>
                  <Card className="border">
                    <CardBody>
                      <p className="mb-0">{branchData.slogan_en}</p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="social" title="Mạng xã hội">
              <Row>
                <Col md={6}>
                  <h5>Google Map</h5>
                  <Card className="border">
                    <CardBody>
                      {branchData.googleMap && branchData.googleMap !== "N/A" ? (
                        <a href={branchData.googleMap} target="_blank" rel="noopener noreferrer" className="text-primary">
                          Xem trên Google Map
                        </a>
                      ) : (
                        <p className="mb-0 text-muted">Chưa có link</p>
                      )}
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <h5>Facebook</h5>
                  <Card className="border">
                    <CardBody>
                      {branchData.facebook && branchData.facebook !== "N/A" ? (
                        <a href={branchData.facebook} target="_blank" rel="noopener noreferrer" className="text-primary">
                          Truy cập Facebook
                        </a>
                      ) : (
                        <p className="mb-0 text-muted">Chưa có link</p>
                      )}
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <h5>Instagram</h5>
                  <Card className="border">
                    <CardBody>
                      {branchData.instagram && branchData.instagram !== "N/A" ? (
                        <a href={branchData.instagram} target="_blank" rel="noopener noreferrer" className="text-primary">
                          Truy cập Instagram
                        </a>
                      ) : (
                        <p className="mb-0 text-muted">Chưa có link</p>
                      )}
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <h5>YouTube</h5>
                  <Card className="border">
                    <CardBody>
                      {branchData.youtube && branchData.youtube !== "N/A" ? (
                        <a href={branchData.youtube} target="_blank" rel="noopener noreferrer" className="text-primary">
                          Truy cập YouTube
                        </a>
                      ) : (
                        <p className="mb-0 text-muted">Chưa có link</p>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="documents" title="Tài liệu">
              <Row>
                <Col md={12}>
                  <h5>Giấy phép kinh doanh</h5>
                  {branchData.businessLicenseImage ? (
                    <Card className="border">
                      <CardBody>
                        <Image
                          src={`${apiUrlNoApi}${branchData.businessLicenseImage}`}
                          fluid
                          className="rounded"
                          style={{ maxHeight: "400px" }}
                        />
                      </CardBody>
                    </Card>
                  ) : (
                    <Card className="border">
                      <CardBody className="text-center text-muted">
                        <IconifyIcon icon="mdi:file-image-outline" className="fs-48 mb-2" />
                        <p>Chưa có hình ảnh giấy phép kinh doanh</p>
                      </CardBody>
                    </Card>
                  )}
                </Col>
              </Row>
            </Tab>

            {/* What We Do - VN/EN show */}
            <Tab eventKey="whatWeDo" title="Chúng tôi làm gì">
              <Row className="g-3 mb-4">
                <Col md={6}><Card className="border"><CardBody>
                  <h5>Chúng tôi làm gì (What We Do) - Tiếng Việt</h5>
                  <p className="mb-0">{branchData.whatWeDo_vn}</p>
                </CardBody></Card></Col>
                <Col md={6}><Card className="border"><CardBody>
                  <h5>What We Do - English</h5>
                  <p className="mb-0">{branchData.whatWeDo_en}</p>
                </CardBody></Card></Col>
              </Row>
            </Tab>

            {/* Our Impact - VN/EN show */}
            <Tab eventKey="ourImpact" title="Tác động của chúng tôi">
              <Row className="g-3 mb-4">
                <Col md={6}><Card className="border"><CardBody>
                  <h5>Tác động của chúng tôi (Our Impact) - Tiếng Việt</h5>
                  <p className="mb-0">{branchData.ourImpact_vn}</p>
                </CardBody></Card></Col>
                <Col md={6}><Card className="border"><CardBody>
                  <h5>Our Impact - English</h5>
                  <p className="mb-0">{branchData.ourImpact_en}</p>
                </CardBody></Card></Col>
              </Row>
            </Tab>

            {/* Core Value - VN/EN show */}
            <Tab eventKey="coreValue" title="Giá trị cốt lõi">
              <Row className="g-3 mb-4">
                <Col md={6}><Card className="border"><CardBody>
                  <h5>Giá trị cốt lõi (Core Value) - Tiếng Việt</h5>
                  <p className="mb-0">{branchData.coreValue_vn}</p>
                </CardBody></Card></Col>
                <Col md={6}><Card className="border"><CardBody>
                  <h5>Core Value - English</h5>
                  <p className="mb-0">{branchData.coreValue_en}</p>
                </CardBody></Card></Col>
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
          <Modal.Title>Chỉnh sửa thông tin chi nhánh</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateBranch}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên công ty (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName_vn"
                    value={editData.companyName_vn}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên công ty (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName_en"
                    value={editData.companyName_en}
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
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Địa chỉ (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address_vn"
                    value={editData.address_vn}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Địa chỉ (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address_en"
                    value={editData.address_en}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Giới thiệu (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="aboutUs_vn"
                    value={editData.aboutUs_vn}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Giới thiệu (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="aboutUs_en"
                    value={editData.aboutUs_en}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Triết lý (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="philosophy_vn"
                    value={editData.philosophy_vn}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Triết lý (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="philosophy_en"
                    value={editData.philosophy_en}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Slogan (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="slogan_vn"
                    value={editData.slogan_vn}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Slogan (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="slogan_en"
                    value={editData.slogan_en}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Google Map Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="googleMap"
                    value={editData.googleMap}
                    onChange={handleInputChange}
                    placeholder="https://maps.google.com/..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Facebook</Form.Label>
                  <Form.Control
                    type="url"
                    name="facebook"
                    value={editData.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Instagram</Form.Label>
                  <Form.Control
                    type="url"
                    name="instagram"
                    value={editData.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>YouTube</Form.Label>
                  <Form.Control
                    type="url"
                    name="youtube"
                    value={editData.youtube}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isHeadOfice"
                    checked={editData.isHeadOfice}
                    onChange={handleInputChange}
                    label="Đây là trụ sở chính"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Giấy phép kinh doanh</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-2"
                  />
                  {editImagePreview && (
                    <div className="mt-2">
                      <p className="text-muted mb-1">Hình ảnh mới:</p>
                      <img
                        src={editImagePreview}
                        alt="Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                        className="rounded border"
                      />
                    </div>
                  )}
                  {branchData.businessLicenseImage && !editImagePreview && (
                    <div className="mt-2">
                      <p className="text-muted mb-1">Hình ảnh hiện tại:</p>
                      <img
                        src={`${apiUrlNoApi}${branchData.businessLicenseImage}`}
                        alt="Current License"
                        style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                        className="rounded border"
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={12}><Form.Group>
                <Form.Label>Chúng tôi làm gì (What We Do) - Tiếng Việt</Form.Label>
                <Form.Control as="textarea" rows={3} name="whatWeDo_vn" value={editData.whatWeDo_vn} onChange={handleInputChange}/>
              </Form.Group></Col>
              <Col md={12}><Form.Group>
                <Form.Label>What We Do - English</Form.Label>
                <Form.Control as="textarea" rows={3} name="whatWeDo_en" value={editData.whatWeDo_en} onChange={handleInputChange}/>
              </Form.Group></Col>
              <Col md={12}><Form.Group>
                <Form.Label>Tác động của chúng tôi (Our Impact) - Tiếng Việt</Form.Label>
                <Form.Control as="textarea" rows={3} name="ourImpact_vn" value={editData.ourImpact_vn} onChange={handleInputChange}/>
              </Form.Group></Col>
              <Col md={12}><Form.Group>
                <Form.Label>Our Impact - English</Form.Label>
                <Form.Control as="textarea" rows={3} name="ourImpact_en" value={editData.ourImpact_en} onChange={handleInputChange}/>
              </Form.Group></Col>
              <Col md={12}><Form.Group>
                <Form.Label>Giá trị cốt lõi (Core Value) - Tiếng Việt</Form.Label>
                <Form.Control as="textarea" rows={3} name="coreValue_vn" value={editData.coreValue_vn} onChange={handleInputChange}/>
              </Form.Group></Col>
              <Col md={12}><Form.Group>
                <Form.Label>Core Value - English</Form.Label>
                <Form.Control as="textarea" rows={3} name="coreValue_en" value={editData.coreValue_en} onChange={handleInputChange}/>
              </Form.Group></Col>
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

export default BranchDetailPage;
