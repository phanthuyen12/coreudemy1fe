import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Modal, 
  Form, 
  Badge,
  Spinner,
  Alert,
  Image,
  Tab,
  Nav,
  Table
} from "react-bootstrap";
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiToggleLeft, 
  FiToggleRight,
  FiImage,
  FiFolder,
  FiCalendar,
  FiEye,
  FiRefreshCw
} from "react-icons/fi";
import { projectCategoriesController } from "@/config/config";
import { StatCard } from "./components/StatCard/page";

const ProjectCategoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [category, setCategory] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name_vn: "",
    name_en: "",
    status: "Active",
    mainImage: null,
    defaultImage: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });

  // Load category data
  const loadCategory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectCategoriesController.getById(id);
      setCategory(response);
      
      // Set form data for editing
      setFormData({
        name_vn: response.name_vn || "",
        name_en: response.name_en || "",
        status: response.status || "Active",
        mainImage: null,
        defaultImage: null
      });
    } catch (error) {
      console.error("Error loading category:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi tải thông tin danh mục dự án" });
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Load projects by category
  const loadProjects = useCallback(async () => {
    try {
      const response = await projectCategoriesController.getProjectsByCategory(id);
      setProjects(response);
    } catch (error) {
      console.error("Error loading projects:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi tải danh sách dự án" });
    }
  }, [id]);

  // Load data on component mount
  useEffect(() => {
    loadCategory();
    loadProjects();
  }, [loadCategory, loadProjects]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name_vn.trim()) errors.name_vn = "Tên danh mục (VN) là bắt buộc";
    if (!formData.name_en.trim()) errors.name_en = "Tên danh mục (EN) là bắt buộc";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle edit category
  const handleEdit = async () => {
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      const formDataToSend = new FormData();
      formDataToSend.append("name_vn", formData.name_vn);
      formDataToSend.append("name_en", formData.name_en);
      formDataToSend.append("status", formData.status);
      
      if (formData.mainImage) {
        formDataToSend.append("mainImage", formData.mainImage);
      }
      if (formData.defaultImage) {
        formDataToSend.append("defaultImage", formData.defaultImage);
      }

      await projectCategoriesController.update(id, formDataToSend);
      setShowEditModal(false);
      loadCategory();
      setAlertMessage({ type: "success", message: "Cập nhật danh mục dự án thành công!" });
    } catch (error) {
      console.error("Error updating category:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi cập nhật danh mục dự án" });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete category
  const handleDelete = async () => {
    try {
      setSaving(true);
      await projectCategoriesController.toggleStatus(id);
      setShowDeleteModal(false);
      navigate("/page/projectCategories?module=admin");
      setAlertMessage({ type: "success", message: "Xóa danh mục dự án thành công!" });
    } catch (error) {
      console.error("Error deleting category:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi xóa danh mục dự án" });
    } finally {
      setSaving(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async () => {
    try {
      await projectCategoriesController.toggleStatus(id);
      loadCategory();
      setAlertMessage({ type: "success", message: "Cập nhật trạng thái thành công!" });
    } catch (error) {
      console.error("Error toggling status:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi cập nhật trạng thái" });
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="container-fluid">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="text-center">
              <Spinner animation="border" className="mb-3" />
              <p>Đang tải thông tin danh mục dự án...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="page-content">
        <div className="container-fluid">
          <Alert variant="danger">
            Không tìm thấy danh mục dự án với ID: {id}
          </Alert>
          <Button variant="primary" onClick={() => navigate("/page/projectCategories?module=admin")}>
            <FiArrowLeft className="me-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(project => project.status === "Active").length,
    inactiveProjects: projects.filter(project => project.status === "Inactive").length,
    hasImages: !!(category.mainImage || category.defaultImage)
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageMetaData title="Chi tiết Danh mục Dự án" />
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Chi tiết Danh mục Dự án</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <span className="text-muted">Quản lý</span>
                  </li>
                  <li className="breadcrumb-item">
                    <span 
                      className="text-primary cursor-pointer"
                      onClick={() => navigate("/page/projectCategories?module=admin")}
                    >
                      Danh mục Dự án
                    </span>
                  </li>
                  <li className="breadcrumb-item active">{category.name_vn}</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Message */}
        {alertMessage.message && (
          <Alert 
            variant={alertMessage.type} 
            onClose={() => setAlertMessage({ type: "", message: "" })}
            dismissible
            className="mb-4"
          >
            {alertMessage.message}
          </Alert>
        )}

        {/* Header Card */}
        <Row className="mb-4">
          <Col lg={12}>
            <Card>
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={8}>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        {category.mainImage ? (
                          <Image
                            src={`${import.meta.env.VITE_API_URL}${category.mainImage}`}
                            alt={category.name_vn}
                            width={80}
                            height={80}
                            className="rounded"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                            <FiFolder className="text-muted" size={32} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="mb-1">{category.name_vn}</h4>
                        <p className="text-muted mb-2">{category.name_en}</p>
                        <div className="d-flex align-items-center gap-3">
                          <Badge
                            bg={category.status === "Active" ? "success" : "warning"}
                            className="cursor-pointer"
                            onClick={handleToggleStatus}
                          >
                            {category.status === "Active" ? "Hoạt động" : "Ẩn"}
                          </Badge>
                          <span className="text-muted">
                            <FiCalendar className="me-1" />
                            Tạo: {new Date(category.createDate).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex gap-2 justify-content-end">
                      <Button
                        variant="danger"
                        onClick={() => navigate("/page/projectCategories?module=admin")}
                      >
                        <FiArrowLeft className="me-1" />
                        Quay lại
                      </Button>
                      <Button
                        variant="outline-primary"
                        onClick={() => setShowEditModal(true)}
                      >
                        <FiEdit2 className="me-1" />
                        Chỉnh sửa
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <FiTrash2 className="me-1" />
                        Xóa
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col xl={3} md={6}>
            <StatCard
              name="Tổng dự án"
              amount={stats.totalProjects}
              icon="iconamoon:folder"
              variant="primary"
            />
          </Col>
          <Col xl={3} md={6}>
            <StatCard
              name="Dự án hoạt động"
              amount={stats.activeProjects}
              icon="iconamoon:toggle-right"
              variant="success"
            />
          </Col>
          <Col xl={3} md={6}>
            <StatCard
              name="Dự án ẩn"
              amount={stats.inactiveProjects}
              icon="iconamoon:toggle-left"
              variant="warning"
            />
          </Col>
          <Col xl={3} md={6}>
            <StatCard
              name="Có hình ảnh"
              amount={stats.hasImages ? "Có" : "Không"}
              icon="iconamoon:image"
              variant="info"
            />
          </Col>
        </Row>

        {/* Main Content */}
        <Row>
          <Col lg={12}>
            <Card>
              <Card.Body>
                <Nav variant="tabs" className="nav-tabs-custom">
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === "overview"}
                      onClick={() => setActiveTab("overview")}
                    >
                      <FiEye className="me-1" />
                      Tổng quan
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === "images"}
                      onClick={() => setActiveTab("images")}
                    >
                      <FiImage className="me-1" />
                      Hình ảnh
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === "projects"}
                      onClick={() => setActiveTab("projects")}
                    >
                      <FiFolder className="me-1" />
                      Dự án ({projects.length})
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content className="mt-4">
                  {/* Overview Tab */}
                  <Tab.Pane eventKey="overview" active={activeTab === "overview"}>
                    <Row>
                      <Col md={6}>
                        <div className="mb-4">
                          <h5>Thông tin cơ bản</h5>
                          <Table borderless>
                            <tbody>
                              <tr>
                                <td className="fw-medium" width="30%">ID:</td>
                                <td>#{category.id}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Tên (VN):</td>
                                <td>{category.name_vn}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Tên (EN):</td>
                                <td>{category.name_en}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Trạng thái:</td>
                                <td>
                                  <Badge bg={category.status === "Active" ? "success" : "warning"}>
                                    {category.status === "Active" ? "Hoạt động" : "Ẩn"}
                                  </Badge>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-4">
                          <h5>Thời gian</h5>
                          <Table borderless>
                            <tbody>
                              <tr>
                                <td className="fw-medium" width="30%">Ngày tạo:</td>
                                <td>{new Date(category.createDate).toLocaleString("vi-VN")}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Ngày cập nhật:</td>
                                <td>{new Date(category.updateDate).toLocaleString("vi-VN")}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Images Tab */}
                  <Tab.Pane eventKey="images" active={activeTab === "images"}>
                    <Row>
                      <Col md={6}>
                        <div className="mb-4">
                          <h5>Hình ảnh chính</h5>
                          {category.mainImage ? (
                            <div>
                              <Image
                                src={`${import.meta.env.VITE_API_URL}${category.mainImage}`}
                                alt="Main image"
                                fluid
                                className="rounded mb-2"
                                style={{ maxHeight: "300px", objectFit: "cover" }}
                              />
                              <p className="text-muted small">
                                <strong>Đường dẫn:</strong> {category.mainImage}
                              </p>
                            </div>
                          ) : (
                            <div className="text-center py-5 bg-light rounded">
                              <FiImage className="text-muted mb-2" size={48} />
                              <p className="text-muted">Chưa có hình ảnh chính</p>
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-4">
                          <h5>Hình ảnh mặc định</h5>
                          {category.defaultImage ? (
                            <div>
                              <Image
                                src={`${import.meta.env.VITE_API_URL}${category.defaultImage}`}
                                alt="Default image"
                                fluid
                                className="rounded mb-2"
                                style={{ maxHeight: "300px", objectFit: "cover" }}
                              />
                              <p className="text-muted small">
                                <strong>Đường dẫn:</strong> {category.defaultImage}
                              </p>
                            </div>
                          ) : (
                            <div className="text-center py-5 bg-light rounded">
                              <FiImage className="text-muted mb-2" size={48} />
                              <p className="text-muted">Chưa có hình ảnh mặc định</p>
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Projects Tab */}
                  <Tab.Pane eventKey="projects" active={activeTab === "projects"}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5>Danh sách dự án trong danh mục</h5>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={loadProjects}
                      >
                        <FiRefreshCw className="me-1" />
                        Làm mới
                      </Button>
                    </div>
                    
                    {projects.length === 0 ? (
                      <div className="text-center py-5 bg-light rounded">
                        <FiFolder className="text-muted mb-2" size={48} />
                        <p className="text-muted">Chưa có dự án nào trong danh mục này</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <Table hover>
                          <thead className="table-light">
                            <tr>
                              <th>ID</th>
                              <th>Tên dự án</th>
                              <th>Trạng thái</th>
                              <th>Ngày tạo</th>
                              <th>Hành động</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projects.map((project) => (
                              <tr key={project.id}>
                                <td>#{project.id}</td>
                                <td>
                                  <div>
                                    <div className="fw-medium">{project.name_vn || project.name_en}</div>
                                    {project.name_vn && project.name_en && (
                                      <div className="text-muted small">{project.name_en}</div>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <Badge bg={project.status === "Active" ? "success" : "warning"}>
                                    {project.status === "Active" ? "Hoạt động" : "Ẩn"}
                                  </Badge>
                                </td>
                                <td>
                                  {new Date(project.createDate).toLocaleDateString("vi-VN")}
                                </td>
                                <td>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => navigate(`/page/projects/${project.id}?module=admin`)}
                                  >
                                    <FiEye />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa Danh mục Dự án</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên danh mục (Tiếng Việt) *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name_vn"
                    value={formData.name_vn}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.name_vn}
                    placeholder="Nhập tên danh mục bằng tiếng Việt"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.name_vn}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên danh mục (Tiếng Anh) *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.name_en}
                    placeholder="Nhập tên danh mục bằng tiếng Anh"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.name_en}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hình ảnh chính</Form.Label>
                  {category?.mainImage && (
                    <div className="mb-2">
                      <Image
                        src={`${import.meta.env.VITE_API_URL}${category.mainImage}`}
                        alt="Current main image"
                        width={100}
                        height={100}
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="text-muted small">Hình ảnh hiện tại</div>
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    name="mainImage"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">
                    Chọn hình ảnh chính mới cho danh mục
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hình ảnh mặc định</Form.Label>
                  {category?.defaultImage && (
                    <div className="mb-2">
                      <Image
                        src={`${import.meta.env.VITE_API_URL}${category.defaultImage}`}
                        alt="Current default image"
                        width={100}
                        height={100}
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="text-muted small">Hình ảnh hiện tại</div>
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    name="defaultImage"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">
                    Chọn hình ảnh mặc định mới cho danh mục
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Ẩn</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleEdit} disabled={saving}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa danh mục dự án <strong>"{category?.name_vn}"</strong>?</p>
          <p className="text-muted small">
            Danh mục sẽ được đánh dấu là ẩn thay vì xóa hoàn toàn khỏi hệ thống.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={saving}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang xóa...
              </>
            ) : (
              "Xóa"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectCategoryDetailPage;
