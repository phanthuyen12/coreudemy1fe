import React, { useState, useEffect, useCallback, startTransition } from "react";
import { apiUrlNoApi } from "@/config/config";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardBody,
  Row, 
  Col, 
  Button, 
  Table, 
  Modal, 
  Form, 
  FormControl,
  Badge,
  Spinner,
  Alert,
  Image,
  Pagination,
  ButtonGroup,
  Carousel,
} from "react-bootstrap";
import { 
  FiPlus, 
  FiEdit2, 
  FiEye, 
  FiTrash2, 
  FiRefreshCw,
  FiImage,
  FiHome,
  FiList,
  FiUpload,
  FiX
} from "react-icons/fi";
import { Icon } from '@iconify/react';
import { projectsController, projectDetailsController } from "@/config/config";
import PageMetaData from "@/admin/components/PageTitle";
import { validateImageQuality, validateImageDimensions, validateFormData, showValidationErrors } from "@/utils/imageValidation";
import ImageValidationInfo from "@/components/ImageValidationInfo";
import ValidationResult from "@/components/ValidationResult";

// Pagination Component
const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <Pagination.Item 
        key={i} 
        active={i === currentPage}
        onClick={() => onPageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }
  return (
    <Pagination>
      <Pagination.Prev 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1} 
      />
      {pages}
      <Pagination.Next 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages} 
      />
    </Pagination>
  );
};

const ProjectDetailsPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [projectDetails, setProjectDetails] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projectFilter, setProjectFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    id_project: "",
    detail_vn: "",
    detail_en: "",
    imageList: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });
  const [validationResult, setValidationResult] = useState(null);

  // Load project details data
  const loadProjectDetails = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        project: projectFilter !== "all" ? projectFilter : undefined
      };
      
      console.log('Loading project details with params:', params);
      const response = await projectDetailsController.list(params);
      console.log('Project details response:', response);
      
      // Handle API response structure based on your data
      if (response.success && response.data) {
        setProjectDetails(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        console.log('Data loaded:', response.data.data?.length, 'items, total pages:', response.data.pagination?.totalPages);
      } else if (response.data) {
        // Fallback for different response structure
        setProjectDetails(response.data || []);
        setTotalPages(1);
        console.log('Data loaded (fallback):', response.data?.length, 'items');
      } else {
        setProjectDetails([]);
        setTotalPages(1);
        console.log('No data found');
      }
    } catch (error) {
      console.error("Error loading project details:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi tải danh sách chi tiết dự án" });
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, projectFilter]);

  // Load projects data
  const loadProjects = useCallback(async () => {
    try {
      const params = { limit: 100 };
      const response = await projectsController.list(params);
      setProjects(response.data.data || response);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  }, []);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    loadProjectDetails();
    loadProjects();
  }, [loadProjectDetails, loadProjects]);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filterType, value) => {
    console.log('Filter changed:', filterType, 'value:', value);
    if (filterType === "project") {
      setProjectFilter(value);
      console.log('Project filter set to:', value);
    }
    setCurrentPage(1);
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      id_project: "",
      detail_vn: "",
      detail_en: "",
      imageList: [],
    });
    setFormErrors({});
    setAlertMessage({ type: "", message: "" });
  };

  // Handle form input change
  const handleInputChange = async (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      const fileArray = Array.from(files);
      const validatedFiles = [];
      const rejectedFiles = [];
      
      // Validate each file individually
      for (const file of fileArray) {
        // Validate image quality
        const qualityValidation = validateImageQuality(file);
        if (!qualityValidation.isValid) {
          rejectedFiles.push({
            fileName: file.name,
            errors: qualityValidation.errors
          });
          continue; // Skip this file but continue with others
        }

        // Validate image dimensions
        const dimensionValidation = await validateImageDimensions(file);
        if (!dimensionValidation.isValid) {
          rejectedFiles.push({
            fileName: file.name,
            errors: dimensionValidation.errors
          });
          continue; // Skip this file but continue with others
        }

        // File passed validation
        validatedFiles.push(file);
      }
      
      // Set validation result for display
      setValidationResult({
        acceptedCount: validatedFiles.length,
        totalCount: fileArray.length,
        rejectedFiles: rejectedFiles
      });
      
      setFormData(prev => ({ 
        ...prev, 
        [name]: validatedFiles 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imageList: prev.imageList.filter((_, i) => i !== index)
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.id_project) errors.id_project = "Dự án là bắt buộc";
    if (!formData.detail_vn.trim()) errors.detail_vn = "Chi tiết (VN) là bắt buộc";
    if (!formData.detail_en.trim()) errors.detail_en = "Chi tiết (EN) là bắt buộc";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle create project detail
  const handleCreate = async () => {
    // Validate required fields
    const requiredFields = ['id_project', 'detail_vn', 'detail_en'];
    const formValidation = validateFormData(formData, requiredFields);
    
    if (!formValidation.isValid) {
      showValidationErrors(formValidation.errors);
      return;
    }

    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append("id_project", formData.id_project);
      formDataToSend.append("detail_vn", formData.detail_vn);
      formDataToSend.append("detail_en", formData.detail_en);
      
      // Append multiple images only if there are images
      if (formData.imageList && formData.imageList.length > 0) {
        formData.imageList.forEach((file, index) => {
          formDataToSend.append("imageList", file);
        });
      }

      console.log('Creating project detail with data:', {
        id_project: formData.id_project,
        detail_vn: formData.detail_vn,
        detail_en: formData.detail_en,
        imageCount: formData.imageList ? formData.imageList.length : 0
      });

      const response = await projectDetailsController.create(formDataToSend);
      
      if (response.success) {
        setShowCreateModal(false);
        resetForm();
        loadProjectDetails();
        setAlertMessage({ type: "success", message: "Tạo chi tiết dự án thành công!" });
      } else {
        setAlertMessage({ type: "danger", message: response.message || "Lỗi khi tạo chi tiết dự án" });
      }
    } catch (error) {
      console.error("Error creating project detail:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi tạo chi tiết dự án: " + error.message });
    } finally {
      setSaving(false);
    }
  };

  // Handle edit project detail
  const handleEdit = async () => {
    // Validate required fields
    const requiredFields = ['id_project', 'detail_vn', 'detail_en'];
    const formValidation = validateFormData(formData, requiredFields);
    
    if (!formValidation.isValid) {
      showValidationErrors(formValidation.errors);
      return;
    }

    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append("id_project", formData.id_project);
      formDataToSend.append("detail_vn", formData.detail_vn);
      formDataToSend.append("detail_en", formData.detail_en);
      
      // Append multiple images only if there are new images
      if (formData.imageList && formData.imageList.length > 0) {
        formData.imageList.forEach((file, index) => {
          formDataToSend.append("imageList", file);
        });
      }

      console.log('Updating project detail with ID:', selectedProjectDetail.id);
      console.log('Form data being sent:', {
        id_project: formData.id_project,
        detail_vn: formData.detail_vn,
        detail_en: formData.detail_en,
        imageCount: formData.imageList ? formData.imageList.length : 0
      });

      const response = await projectDetailsController.update(selectedProjectDetail.id, formDataToSend);
      
      if (response.success) {
        setShowEditModal(false);
        resetForm();
        loadProjectDetails();
        setAlertMessage({ type: "success", message: "Cập nhật chi tiết dự án thành công!" });
      } else {
        setAlertMessage({ type: "danger", message: response.message || "Lỗi khi cập nhật chi tiết dự án" });
      }
    } catch (error) {
      console.error("Error updating project detail:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi cập nhật chi tiết dự án: " + error.message });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete project detail
  const handleDelete = async () => {
    try {
      setSaving(true);
      console.log('Deleting project detail with ID:', selectedProjectDetail.id);
      
      const response = await projectDetailsController.delete(selectedProjectDetail.id);
      
      if (response.success) {
        setShowDeleteModal(false);
        loadProjectDetails();
        setAlertMessage({ type: "success", message: "Xóa chi tiết dự án thành công!" });
      } else {
        setAlertMessage({ type: "danger", message: response.message || "Lỗi khi xóa chi tiết dự án" });
      }
    } catch (error) {
      console.error("Error deleting project detail:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi xóa chi tiết dự án: " + error.message });
    } finally {
      setSaving(false);
    }
  };

  // Open edit modal
  const openEditModal = (projectDetail) => {
    setSelectedProjectDetail(projectDetail);
    setFormData({
      id_project: projectDetail.id_project || "",
      detail_vn: projectDetail.detail_vn || "",
      detail_en: projectDetail.detail_en || "",
      imageList: [],
    });
    setShowEditModal(true);
  };

  // Open detail modal
  const openDetailModal = (projectDetail) => {
    setSelectedProjectDetail(projectDetail);
    setShowDetailModal(true);
  };

  // Open delete modal
  const openDeleteModal = (projectDetail) => {
    setSelectedProjectDetail(projectDetail);
    setShowDeleteModal(true);
  };

  // Calculate statistics
  const stats = {
    total: projectDetails.length,
  };

  // Stats data for cards
  const statsData = [
    {
      name: "Tổng chi tiết dự án",
      amount: stats.total,
      icon: "iconamoon:folder",
      iconColor: "primary"
    },
  ];

  // Parse image list from JSON string and normalize image paths
  const parseImageList = (imageListString) => {
    try {
      const imageList = JSON.parse(imageListString || '[]');
      return imageList.map(imagePath => {
        // If image path already has full path, use it as is
        if (imagePath.startsWith('/uploads/')) {
          return imagePath;
        }
        // If it's just filename, add the uploads path
        return `/uploads/projectDetails/${imagePath}`;
      });
    } catch {
      return [];
    }
  };

  return (
    <div className="">
      <div className="">
        <PageMetaData title="Quản lý Chi tiết Dự án" />

        {/* Page Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Quản lý Chi tiết Dự án</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <span className="text-muted">Quản lý</span>
                  </li>
                  <li className="breadcrumb-item active">Chi tiết Dự án</li>
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

        {/* Stats Cards */}
        <Row className="g-3">
          {statsData.map((stat, idx) => (
            <Col md={6} lg={3} key={idx}>
              <Card>
                <CardBody>
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
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Main Content */}
        <Row>
          <Col lg={12}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Danh sách Chi tiết Dự án</h5>
                <div className="d-flex gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={loadProjectDetails}
                    disabled={loading}
                  >
                    <FiRefreshCw className={loading ? "spinner-border-sm" : ""} />
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      resetForm();
                      setShowCreateModal(true);
                    }}
                  >
                    <FiPlus className="me-1" />
                    Thêm mới
                  </Button>
                </div>
              </Card.Header>

              <Card.Body>
                {/* Filter Section */}
                <Row className="mb-3 align-items-center">
                  {/* Project Filter */}
                  <Col md={6}>
                    <Form.Label className="fw-medium mb-2">Lọc theo dự án:</Form.Label>
                    <Form.Select
                      value={projectFilter}
                      onChange={(e) => handleFilterChange("project", e.target.value)}
                      size="sm"
                    >
                      <option value="all">Tất cả dự án</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.projectName}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  
                  {/* Pagination Info */}
                  <Col md={6} className="text-end">
                    <div className="d-flex align-items-center justify-content-end gap-3">
                      <span className="text-muted small">
                        Trang {currentPage} / {totalPages}
                      </span>
                      <span className="text-muted small">
                        Hiển thị {projectDetails.length} mục
                      </span>
                    </div>
                  </Col>
                </Row>

                {/* Data Table */}
                <div className="table-responsive">
                  <Table hover className="table-nowrap">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Dự án</th>
                        <th>Chi tiết (VN)</th>
                        <th>Chi tiết (EN)</th>
                        <th>Hình ảnh</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            <Spinner animation="border" size="sm" className="me-2" />
                            Đang tải...
                          </td>
                        </tr>
                      ) : projectDetails.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4 text-muted">
                            Không có dữ liệu
                          </td>
                        </tr>
                      ) : (
                        projectDetails.map((projectDetail) => {
                          const imageList = parseImageList(projectDetail.imageList);
                          console.log('Project detail:', projectDetail.id, 'Image list:', imageList); // Debug log
                          const project = projects.find(p => p.id === projectDetail.id_project);
                          
                          return (
                            <tr key={projectDetail.id}>
                              <td>
                                <span className="fw-medium">#{projectDetail.id}</span>
                              </td>
                              <td>
                                <div>
                                  <div className="fw-medium">{project?.projectName || "N/A"}</div>
                                  <div className="text-muted small">{project?.location || ""}</div>
                                </div>
                              </td>
                              <td>
                                <div className="text-truncate" style={{ maxWidth: "200px" }}>
                                  {projectDetail.detail_vn || "N/A"}
                                </div>
                              </td>
                              <td>
                                <div className="text-truncate" style={{ maxWidth: "200px" }}>
                                  {projectDetail.detail_en || "N/A"}
                                </div>
                              </td>
                              <td>
                                {imageList.length > 0 ? (
                                  <div className="d-flex align-items-center">
                                    <Image
                                      src={`${apiUrlNoApi}${imageList[0]}`}
                                      alt="First image"
                                      width={40}
                                      height={40}
                                      className="rounded me-2"
                                      style={{ objectFit: "cover" }}
                                      onError={(e) => {
                                        console.error('Image load error:', `${apiUrlNoApi}${imageList[0]}`);
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                    <span className="text-muted small">
                                      +{imageList.length - 1} ảnh khác
                                    </span>
                                  </div>
                                ) : (
                                  <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                    <FiImage className="text-muted" />
                                  </div>
                                )}
                              </td>
                              <td>
                                <span className="text-muted">
                                  {new Date(projectDetail.createDate).toLocaleDateString('vi-VN')}
                                </span>
                              </td>
                              <td>
                                <ButtonGroup size="sm">
                                  <Button
                                    variant="primary"
                                    onClick={() => openDetailModal(projectDetail)}
                                  >
                                    <FiEye />
                                  </Button>
                                  <Button
                                    variant="warning"
                                    onClick={() => openEditModal(projectDetail)}
                                  >
                                    <FiEdit2 />
                                  </Button>
                                  <Button
                                    variant="danger"
                                    onClick={() => openDeleteModal(projectDetail)}
                                  >
                                    <FiTrash2 />
                                  </Button>
                                </ButtonGroup>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div className="text-muted small">
                      Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, projectDetails.length)} trong tổng số {projectDetails.length} mục
                    </div>
                    <PaginationComponent
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Create Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm Chi tiết Dự án Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Dự án *</Form.Label>
                  <Form.Select
                    name="id_project"
                    value={formData.id_project}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.id_project}
                  >
                    <option value="">Chọn dự án</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.projectName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.id_project}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chi tiết (Tiếng Việt) *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="detail_vn"
                    value={formData.detail_vn}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.detail_vn}
                    placeholder="Nhập chi tiết bằng tiếng Việt"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.detail_vn}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chi tiết (Tiếng Anh) *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="detail_en"
                    value={formData.detail_en}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.detail_en}
                    placeholder="Nhập chi tiết bằng tiếng Anh"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.detail_en}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <ImageValidationInfo />
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Hình ảnh</Form.Label>
                  <Form.Control
                    type="file"
                    name="imageList"
                    onChange={handleInputChange}
                    accept="image/*"
                    multiple
                  />
                  <Form.Text className="text-muted">
                    Chọn nhiều hình ảnh cho chi tiết dự án
                  </Form.Text>
                  <ValidationResult 
                    acceptedCount={validationResult?.acceptedCount || 0}
                    totalCount={validationResult?.totalCount || 0}
                    rejectedFiles={validationResult?.rejectedFiles || []}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Preview selected images */}
            {formData.imageList.length > 0 && (
              <Row>
                <Col md={12}>
                  <Form.Label>Hình ảnh đã chọn:</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.imageList.map((file, index) => (
                      <div key={index} className="position-relative">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          width={80}
                          height={80}
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0"
                          style={{ transform: "translate(50%, -50%)" }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          <FiX />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleCreate} disabled={saving}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang tạo...
              </>
            ) : (
              "Tạo mới"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa Chi tiết Dự án</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Dự án *</Form.Label>
                  <Form.Select
                    name="id_project"
                    value={formData.id_project}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.id_project}
                  >
                    <option value="">Chọn dự án</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.projectName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.id_project}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chi tiết (Tiếng Việt) *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="detail_vn"
                    value={formData.detail_vn}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.detail_vn}
                    placeholder="Nhập chi tiết bằng tiếng Việt"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.detail_vn}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chi tiết (Tiếng Anh) *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="detail_en"
                    value={formData.detail_en}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.detail_en}
                    placeholder="Nhập chi tiết bằng tiếng Anh"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.detail_en}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <ImageValidationInfo />
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Hình ảnh mới</Form.Label>
                  <Form.Control
                    type="file"
                    name="imageList"
                    onChange={handleInputChange}
                    accept="image/*"
                    multiple
                  />
                  <Form.Text className="text-muted">
                    Chọn hình ảnh mới để thay thế (để trống nếu không muốn thay đổi)
                  </Form.Text>
                  <ValidationResult 
                    acceptedCount={validationResult?.acceptedCount || 0}
                    totalCount={validationResult?.totalCount || 0}
                    rejectedFiles={validationResult?.rejectedFiles || []}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Preview selected images */}
            {formData.imageList.length > 0 && (
              <Row>
                <Col md={12}>
                  <Form.Label>Hình ảnh mới đã chọn:</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.imageList.map((file, index) => (
                      <div key={index} className="position-relative">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          width={80}
                          height={80}
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0"
                          style={{ transform: "translate(50%, -50%)" }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          <FiX />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            )}
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

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết Dự án</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProjectDetail && (
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <h6>Thông tin cơ bản</h6>
                  <p><strong>ID:</strong> #{selectedProjectDetail.id}</p>
                  <p><strong>Dự án:</strong> {projects.find(p => p.id === selectedProjectDetail.id_project)?.projectName || "N/A"}</p>
                  <p><strong>Ngày tạo:</strong> {new Date(selectedProjectDetail.createDate).toLocaleString('vi-VN')}</p>
                  <p><strong>Ngày cập nhật:</strong> {new Date(selectedProjectDetail.updateDate).toLocaleString('vi-VN')}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <h6>Chi tiết</h6>
                  <div className="mb-3">
                    <p className="fw-medium">Chi tiết (Tiếng Việt):</p>
                    <p className="text-muted">{selectedProjectDetail.detail_vn || "Chưa có"}</p>
                  </div>
                  <div className="mb-3">
                    <p className="fw-medium">Chi tiết (Tiếng Anh):</p>
                    <p className="text-muted">{selectedProjectDetail.detail_en || "Chưa có"}</p>
                  </div>
                </div>
              </Col>
              <Col md={12}>
                <div className="mb-3">
                  <h6>Hình ảnh</h6>
                  {(() => {
                    const imageList = parseImageList(selectedProjectDetail.imageList);
                    console.log('Parsed image list:', imageList); // Debug log
                    return imageList.length > 0 ? (
                      <div>
                        {/* Carousel for main view */}
                        <Carousel className="mb-3">
                          {imageList.map((image, index) => (
                            <Carousel.Item key={index}>
                              <div className="d-flex justify-content-center">
                                <Image
                                  src={`${apiUrlNoApi}${image}`}
                                  alt={`Detail image ${index + 1}`}
                                  fluid
                                  className="rounded"
                                  style={{ maxHeight: "400px", objectFit: "cover" }}
                                  onError={(e) => {
                                    console.error('Carousel image load error:', `${apiUrlNoApi}${image}`);
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            </Carousel.Item>
                          ))}
                        </Carousel>
                        
                        {/* Grid view for all images */}
                        <div className="mt-3">
                          <h6 className="mb-2">Tất cả hình ảnh ({imageList.length})</h6>
                          <div className="row g-2">
                            {imageList.map((image, index) => (
                              <div key={index} className="col-md-3 col-sm-4 col-6">
                                <div className="position-relative">
                                  <Image
                                    src={`${apiUrlNoApi}${image}`}
                                    alt={`Thumbnail ${index + 1}`}
                                    fluid
                                    className="rounded"
                                    style={{ 
                                      height: "120px", 
                                      objectFit: "cover",
                                      width: "100%"
                                    }}
                                    onError={(e) => {
                                      console.error('Thumbnail load error:', `${apiUrlNoApi}${image}`);
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                  <div className="position-absolute top-0 start-0 bg-dark text-white px-1 rounded-bottom-end">
                                    {index + 1}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-5 bg-light rounded">
                        <FiImage className="text-muted mb-2" size={48} />
                        <p className="text-muted">Chưa có hình ảnh</p>
                      </div>
                    );
                  })()}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => {
            setShowDetailModal(false);
            openEditModal(selectedProjectDetail);
          }}>
            Chỉnh sửa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa chi tiết dự án này?</p>
          <p className="text-muted small">
            Hành động này không thể hoàn tác.
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

export default ProjectDetailsPage;