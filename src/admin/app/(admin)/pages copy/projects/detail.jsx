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
  FiRefreshCw,
  FiHome,
  FiList,
  FiMapPin,
  FiUser,
  FiTag
} from "react-icons/fi";
import { Icon } from '@iconify/react';
import { projectsController, projectDetailsController, projectCategoriesController, clientsController } from "@/config/config";
import PageMetaData from "@/admin/components/PageTitle";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [project, setProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState([]);
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    id_client: "",
    id_projectCategory: "",
    projectName: "",
    location: "",
    stage_vn: "",
    stage_en: "",
    year: new Date().getFullYear(),
    description_vn: "",
    description_en: "",
    mainImage: null,
    status: "Active",
    show_home: false,
    show_list: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });

  // Load project data
  const loadProject = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectsController.getById(id);
      setProject(response);
      
      // Set form data for editing
      setFormData({
        id_client: response.id_client || "",
        id_projectCategory: response.id_projectCategory || "",
        projectName: response.projectName || "",
        location: response.location || "",
        stage_vn: response.stage_vn || "",
        stage_en: response.stage_en || "",
        year: response.year || new Date().getFullYear(),
        description_vn: response.description_vn || "",
        description_en: response.description_en || "",
        mainImage: null,
        status: response.status || "Active",
        show_home: response.show_home || false,
        show_list: response.show_list !== false
      });
    } catch (error) {
      console.error("Error loading project:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi tải thông tin dự án" });
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Load project details
  const loadProjectDetails = useCallback(async () => {
    try {
      const response = await projectDetailsController.getByProject(id);
      setProjectDetails(response);
    } catch (error) {
      console.error("Error loading project details:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi tải chi tiết dự án" });
    }
  }, [id]);

  // Load reference data
  const loadReferenceData = useCallback(async () => {
    try {
      const [categoriesRes, clientsRes] = await Promise.all([
        projectCategoriesController.list(),
        clientsController.list()
      ]);
      setCategories(categoriesRes.data || categoriesRes);
      setClients(clientsRes.data || clientsRes);
    } catch (error) {
      console.error("Error loading reference data:", error);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadProject();
    loadProjectDetails();
    loadReferenceData();
  }, [loadProject, loadProjectDetails, loadReferenceData]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
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
    if (!formData.projectName.trim()) errors.projectName = "Tên dự án là bắt buộc";
    if (!formData.id_projectCategory) errors.id_projectCategory = "Danh mục dự án là bắt buộc";
    if (!formData.id_client) errors.id_client = "Khách hàng là bắt buộc";
    if (!formData.stage_vn.trim()) errors.stage_vn = "Giai đoạn (VN) là bắt buộc";
    if (!formData.stage_en.trim()) errors.stage_en = "Giai đoạn (EN) là bắt buộc";
    if (!formData.year) errors.year = "Năm là bắt buộc";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle edit project
  const handleEdit = async () => {
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      const dataToSend = { ...formData };
      delete dataToSend.mainImage; // Remove file from JSON data

      await projectsController.update(id, dataToSend);
      setShowEditModal(false);
      loadProject();
      setAlertMessage({ type: "success", message: "Cập nhật dự án thành công!" });
    } catch (error) {
      console.error("Error updating project:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi cập nhật dự án" });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete project
  const handleDelete = async () => {
    try {
      setSaving(true);
      await projectsController.toggleActive(id);
      setShowDeleteModal(false);
      navigate("/page/projects?module=admin");
      setAlertMessage({ type: "success", message: "Xóa dự án thành công!" });
    } catch (error) {
      console.error("Error deleting project:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi xóa dự án" });
    } finally {
      setSaving(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async () => {
    try {
      await projectsController.toggleActive(id);
      loadProject();
      setAlertMessage({ type: "success", message: "Cập nhật trạng thái thành công!" });
    } catch (error) {
      console.error("Error toggling status:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi cập nhật trạng thái" });
    }
  };

  // Handle toggle show home
  const handleToggleShowHome = async () => {
    try {
      await projectsController.toggleShowHome(id);
      loadProject();
      setAlertMessage({ type: "success", message: "Cập nhật hiển thị trang chủ thành công!" });
    } catch (error) {
      console.error("Error toggling show home:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi cập nhật hiển thị trang chủ" });
    }
  };

  // Handle toggle show list
  const handleToggleShowList = async () => {
    try {
      await projectsController.toggleShowList(id);
      loadProject();
      setAlertMessage({ type: "success", message: "Cập nhật hiển thị danh sách thành công!" });
    } catch (error) {
      console.error("Error toggling show list:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi cập nhật hiển thị danh sách" });
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="container-fluid">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="text-center">
              <Spinner animation="border" className="mb-3" />
              <p>Đang tải thông tin dự án...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-content">
        <div className="container-fluid">
          <Alert variant="danger">
            Không tìm thấy dự án với ID: {id}
          </Alert>
          <Button variant="primary" onClick={() => navigate("/page/projects?module=admin")}>
            <FiArrowLeft className="me-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    totalDetails: projectDetails.length,
    hasImages: !!project.mainImage,
    showHome: project.show_home,
    showList: project.show_list
  };

  // Stats data for cards
  const statsData = [
    {
      name: "Chi tiết dự án",
      amount: stats.totalDetails,
      icon: "iconamoon:folder",
      iconColor: "primary"
    },
    {
      name: "Có hình ảnh",
      amount: stats.hasImages ? "Có" : "Không",
      icon: "iconamoon:image",
      iconColor: "info"
    },
    {
      name: "Hiển thị trang chủ",
      amount: stats.showHome ? "Có" : "Không",
      icon: "iconamoon:home",
      iconColor: "success"
    },
    {
      name: "Hiển thị danh sách",
      amount: stats.showList ? "Có" : "Không",
      icon: "iconamoon:list",
      iconColor: "warning"
    }
  ];

  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageMetaData title="Chi tiết Dự án" />

        {/* Page Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Chi tiết Dự án</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <span className="text-muted">Quản lý</span>
                  </li>
                  <li className="breadcrumb-item">
                    <span 
                      className="text-primary cursor-pointer"
                      onClick={() => navigate("/page/projects?module=admin")}
                    >
                      Dự án
                    </span>
                  </li>
                  <li className="breadcrumb-item active">{project.projectName}</li>
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
                        {project.mainImage ? (
                          <Image
                            src={`${import.meta.env.VITE_API_URL}${project.mainImage}`}
                            alt={project.projectName}
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
                        <h4 className="mb-1">{project.projectName}</h4>
                        <p className="text-muted mb-2">
                          <FiMapPin className="me-1" />
                          {project.location}
                        </p>
                        <div className="d-flex align-items-center gap-3">
                          <Badge
                            bg={project.status === "Active" ? "success" : "warning"}
                            className="cursor-pointer"
                            onClick={handleToggleStatus}
                          >
                            {project.status === "Active" ? "Hoạt động" : "Ẩn"}
                          </Badge>
                          <Badge
                            bg={project.show_home ? "info" : "secondary"}
                            className="cursor-pointer"
                            onClick={handleToggleShowHome}
                          >
                            <FiHome className="me-1" />
                            {project.show_home ? "Hiển thị trang chủ" : "Ẩn trang chủ"}
                          </Badge>
                          <Badge
                            bg={project.show_list ? "info" : "secondary"}
                            className="cursor-pointer"
                            onClick={handleToggleShowList}
                          >
                            <FiList className="me-1" />
                            {project.show_list ? "Hiển thị danh sách" : "Ẩn danh sách"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex gap-2 justify-content-end">
                      <Button
                        variant="danger"
                        onClick={() => navigate("/page/projects?module=admin")}
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
        <Row className="g-3 mb-4">
          {statsData.map((stat, idx) => (
            <Col md={6} lg={3} key={idx}>
              <Card>
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h4 className="mb-1 fw-bold">{stat.amount}</h4>
                      <p className="text-muted mb-0 text-uppercase fs-13">
                        {stat.name}
                      </p>
                    </div>
                    <div className="avatar-sm">
                      <span
                        className={`avatar-title bg-${stat.iconColor}-subtle text-${stat.iconColor} rounded`}
                      >
                        <Icon icon={stat.icon} className="fs-24" />
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
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
                      active={activeTab === "details"}
                      onClick={() => setActiveTab("details")}
                    >
                      <FiFolder className="me-1" />
                      Chi tiết ({projectDetails.length})
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
                                <td>#{project.id}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Tên dự án:</td>
                                <td>{project.projectName}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Địa điểm:</td>
                                <td>{project.location || "Chưa có"}</td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Danh mục:</td>
                                <td>
                                  <Badge bg="primary">
                                    <FiTag className="me-1" />
                                    {categories.find(c => c.id === project.id_projectCategory)?.name_vn || "N/A"}
                                  </Badge>
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Khách hàng:</td>
                                <td>
                                  <Badge bg="info">
                                    <FiUser className="me-1" />
                                    {clients.find(c => c.id === project.id_client)?.clientName_vn || "N/A"}
                                  </Badge>
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Giai đoạn:</td>
                                <td>
                                  <div>
                                    <div className="fw-medium">{project.stage_vn}</div>
                                    <div className="text-muted small">{project.stage_en}</div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Năm:</td>
                                <td>
                                  <Badge bg="secondary">
                                    <FiCalendar className="me-1" />
                                    {project.year}
                                  </Badge>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-4">
                          <h5>Trạng thái</h5>
                          <Table borderless>
                            <tbody>
                              <tr>
                                <td className="fw-medium" width="30%">Trạng thái:</td>
                                <td>
                                  <Badge bg={project.status === "Active" ? "success" : "warning"}>
                                    {project.status === "Active" ? "Hoạt động" : "Ẩn"}
                                  </Badge>
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Hiển thị trang chủ:</td>
                                <td>
                                  <Badge bg={project.show_home ? "info" : "secondary"}>
                                    <FiHome className="me-1" />
                                    {project.show_home ? "Có" : "Không"}
                                  </Badge>
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Hiển thị danh sách:</td>
                                <td>
                                  <Badge bg={project.show_list ? "info" : "secondary"}>
                                    <FiList className="me-1" />
                                    {project.show_list ? "Có" : "Không"}
                                  </Badge>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <div className="mb-4">
                          <h5>Mô tả</h5>
                          <div className="row">
                            <div className="col-md-6">
                              <h6>Tiếng Việt</h6>
                              <p className="text-muted">{project.description_vn || "Chưa có mô tả"}</p>
                            </div>
                            <div className="col-md-6">
                              <h6>Tiếng Anh</h6>
                              <p className="text-muted">{project.description_en || "Chưa có mô tả"}</p>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Images Tab */}
                  <Tab.Pane eventKey="images" active={activeTab === "images"}>
                    <Row>
                      <Col md={12}>
                        <div className="mb-4">
                          <h5>Hình ảnh chính</h5>
                          {project.mainImage ? (
                            <div>
                              <Image
                                src={`${import.meta.env.VITE_API_URL}${project.mainImage}`}
                                alt="Main image"
                                fluid
                                className="rounded mb-2"
                                style={{ maxHeight: "400px", objectFit: "cover" }}
                              />
                              <p className="text-muted small">
                                <strong>Đường dẫn:</strong> {project.mainImage}
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
                    </Row>
                  </Tab.Pane>

                  {/* Details Tab */}
                  <Tab.Pane eventKey="details" active={activeTab === "details"}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5>Chi tiết dự án</h5>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={loadProjectDetails}
                      >
                        <FiRefreshCw className="me-1" />
                        Làm mới
                      </Button>
                    </div>
                    
                    {projectDetails.length === 0 ? (
                      <div className="text-center py-5 bg-light rounded">
                        <FiFolder className="text-muted mb-2" size={48} />
                        <p className="text-muted">Chưa có chi tiết dự án nào</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <Table hover>
                          <thead className="table-light">
                            <tr>
                              <th>ID</th>
                              <th>Chi tiết (VN)</th>
                              <th>Chi tiết (EN)</th>
                              <th>Hình ảnh</th>
                              <th>Ngày tạo</th>
                              <th>Hành động</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projectDetails.map((detail) => (
                              <tr key={detail.id}>
                                <td>#{detail.id}</td>
                                <td>
                                  <div className="text-truncate" style={{ maxWidth: "200px" }}>
                                    {detail.detail_vn || "Chưa có"}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-truncate" style={{ maxWidth: "200px" }}>
                                    {detail.detail_en || "Chưa có"}
                                  </div>
                                </td>
                                <td>
                                  {detail.imageList ? (
                                    <Badge bg="info">
                                      <FiImage className="me-1" />
                                      Có hình ảnh
                                    </Badge>
                                  ) : (
                                    <Badge bg="secondary">
                                      <FiImage className="me-1" />
                                      Không có
                                    </Badge>
                                  )}
                                </td>
                                <td>
                                  {new Date(detail.createDate).toLocaleDateString("vi-VN")}
                                </td>
                                <td>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => navigate(`/page/project-details/${detail.id}?module=admin`)}
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
          <Modal.Title>Chỉnh sửa Dự án</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên dự án *</Form.Label>
                  <Form.Control
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.projectName}
                    placeholder="Nhập tên dự án"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.projectName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Địa điểm</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Nhập địa điểm"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Danh mục dự án *</Form.Label>
                  <Form.Select
                    name="id_projectCategory"
                    value={formData.id_projectCategory}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.id_projectCategory}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name_vn}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.id_projectCategory}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Khách hàng *</Form.Label>
                  <Form.Select
                    name="id_client"
                    value={formData.id_client}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.id_client}
                  >
                    <option value="">Chọn khách hàng</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.clientName_vn}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.id_client}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giai đoạn (Tiếng Việt) *</Form.Label>
                  <Form.Control
                    type="text"
                    name="stage_vn"
                    value={formData.stage_vn}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.stage_vn}
                    placeholder="Nhập giai đoạn bằng tiếng Việt"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.stage_vn}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giai đoạn (Tiếng Anh) *</Form.Label>
                  <Form.Control
                    type="text"
                    name="stage_en"
                    value={formData.stage_en}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.stage_en}
                    placeholder="Nhập giai đoạn bằng tiếng Anh"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.stage_en}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Năm *</Form.Label>
                  <Form.Control
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.year}
                    min="1900"
                    max="2100"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.year}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hình ảnh chính</Form.Label>
                  {project?.mainImage && (
                    <div className="mb-2">
                      <Image
                        src={`${import.meta.env.VITE_API_URL}${project.mainImage}`}
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
                    Chọn hình ảnh chính mới cho dự án
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_vn"
                    value={formData.description_vn}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả bằng tiếng Việt"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả bằng tiếng Anh"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
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
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="show_home"
                    checked={formData.show_home}
                    onChange={handleInputChange}
                    label="Hiển thị trang chủ"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="show_list"
                    checked={formData.show_list}
                    onChange={handleInputChange}
                    label="Hiển thị danh sách"
                  />
                </Form.Group>
              </Col>
            </Row>
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
          <p>Bạn có chắc chắn muốn xóa dự án <strong>"{project?.projectName}"</strong>?</p>
          <p className="text-muted small">
            Dự án sẽ được đánh dấu là ẩn thay vì xóa hoàn toàn khỏi hệ thống.
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

export default ProjectDetailPage;
