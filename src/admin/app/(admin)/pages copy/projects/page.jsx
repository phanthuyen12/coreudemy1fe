import React, { useState, useEffect, useCallback, startTransition } from "react";
import { validateImageQuality, validateImageDimensions, validateFormData, showValidationErrors } from "@/utils/imageValidation";
import { apiUrlNoApi } from "@/config/config";
import ImageValidationInfo from "@/components/ImageValidationInfo";

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
  InputGroup, 
  FormControl,
  Badge,
  Spinner,
  Alert,
  Image,
  Pagination,
  ButtonGroup,
} from "react-bootstrap";
import { 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiEye, 
  FiTrash2, 
  FiRefreshCw,
  FiImage,
  FiHome,
  FiList
} from "react-icons/fi";
import { Icon } from '@iconify/react';
import { projectsController, projectCategoriesController, clientsController } from "@/config/config";
import PageMetaData from "@/admin/components/PageTitle";

// Tách riêng Component Pagination để tránh bị lỗi nếu chưa được import
const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
    // Logic render Pagination của bạn
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


const ProjectsPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
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
    extraImage: null,
    status: "Active",
    show_home: false,
    show_list: true,
    // ===================================
    // BẮT ĐẦU CÁC TRƯỜNG MỚI
    // ===================================
    totalArea: "",
    numberFloor: "",
    specialFeature: "",
    amenities_vn: "",
    amenities: "",
    totalCost: "",
    // ===================================
    // KẾT THÚC CÁC TRƯỜNG MỚI
    // ===================================
  });
  const [formErrors, setFormErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });

  // Load projects data
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : '',
        category: categoryFilter !== "all" ? categoryFilter : ''
      };
      
      const response = await projectsController.list(params);
      
      // Handle API response structure based on your data
      if (response.success && response.data) {
        setProjects(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } else {
        setProjects(response.data || response || []);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi tải danh sách dự án" });
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, statusFilter, categoryFilter]);

  // Load categories and clients
  const loadReferenceData = useCallback(async () => {
    try {
      const [categoriesRes, clientsRes] = await Promise.all([
        projectCategoriesController.list(),
        clientsController.list()
      ]);
      setCategories(categoriesRes.data.data || categoriesRes);
      setClients(clientsRes.data.data || clientsRes);
    } catch (error) {
      console.error("Error loading reference data:", error);
    }
  }, []);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    loadProjects();
    loadReferenceData();
  }, [loadProjects, loadReferenceData]);

  // Handle search
  const handleSearch = useCallback(() => {
    startTransition(() => {
      setCurrentPage(1);
      loadProjects();
    });
  }, [loadProjects]);

  // Handle filter change
  const handleFilterChange = useCallback((filterType, value) => {
    if (filterType === "status") setStatusFilter(value);
    if (filterType === "category") setCategoryFilter(value);
    setCurrentPage(1);
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
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
      extraImage: null,
      status: "Active",
      show_home: false,
      show_list: true,
      // ===================================
      // BẮT ĐẦU CÁC TRƯỜNG MỚI
      // ===================================
      totalArea: "",
      numberFloor: "",
      specialFeature: "",
      amenities_vn: "",
      amenities: "",
      totalCost: "",
      // ===================================
      // KẾT THÚC CÁC TRƯỜNG MỚI
      // ===================================
    });
    setFormErrors({});
    setAlertMessage({ type: "", message: "" });
  };

  // Handle form input change
  const handleInputChange = async (e) => {
    const { name, value, files, type, checked } = e.target;
    console.log(`Input Change - Name: ${name}, Value: ${value}`);
    if (files) {
      const file = files[0];
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

        setFormData(prev => ({ ...prev, [name]: file }));
      }
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

  // Validate form (Bạn có thể thêm validation cho các trường mới tại đây nếu cần thiết)
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

  // Handle create project với FormData
  const handleCreate = async () => {
    // Validate required fields
    const requiredFields = ['projectName', 'id_projectCategory', 'id_client', 'stage_vn', 'stage_en', 'year'];
    const formValidation = validateFormData(formData, requiredFields);
    
    if (!formValidation.isValid) {
      showValidationErrors(formValidation.errors);
      return;
    }

    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      // Tạo FormData để gửi multipart/form-data
      const formDataToSend = new FormData();
      
      // Append các trường dữ liệu CŨ
      formDataToSend.append("id_client", formData.id_client);
      formDataToSend.append("id_projectCategory", formData.id_projectCategory);
      formDataToSend.append("projectName", formData.projectName);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("stage_vn", formData.stage_vn);
      formDataToSend.append("stage_en", formData.stage_en);
      formDataToSend.append("year", formData.year);
      formDataToSend.append("description_vn", formData.description_vn);
      formDataToSend.append("description_en", formData.description_en);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("show_home", formData.show_home);
      formDataToSend.append("show_list", formData.show_list);
      
      // ===================================
      // BẮT ĐẦU APPEND CÁC TRƯỜNG MỚI
      // ===================================
      formDataToSend.append("totalArea", formData.totalArea || 0); // Gửi 0 nếu không có
      formDataToSend.append("numberFloor", formData.numberFloor || 0); // Gửi 0 nếu không có
      formDataToSend.append("specialFeature", formData.specialFeature);
      formDataToSend.append("amenities_vn", formData.amenities_vn);
      formDataToSend.append("amenities", formData.amenities);
      formDataToSend.append("totalCost", formData.totalCost || 0); // Gửi 0 nếu không có
      // ===================================
      // KẾT THÚC APPEND CÁC TRƯỜNG MỚI
      // ===================================

      // Append file ảnh nếu có
      if (formData.mainImage) {
        formDataToSend.append("mainImage", formData.mainImage);
      }
      if (formData.extraImage) {
        formDataToSend.append("extraImage", formData.extraImage);
      }

      // Debug FormData (Kiểm tra dữ liệu)
      console.log("=== CREATE PROJECT FORMDATA ===");
      console.log("totalCost value:", formData.totalCost);
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }

      await projectsController.create(formDataToSend);
      setShowCreateModal(false);
      resetForm();
      loadProjects();
      setAlertMessage({ type: "success", message: "Tạo dự án thành công!" });
    } catch (error) {
      console.error("Error creating project:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi tạo dự án" });
    } finally {
      setSaving(false);
    }
  };

  // Handle edit project với FormData
  const handleEdit = async () => {
    // Validate required fields
    const requiredFields = ['projectName', 'id_projectCategory', 'id_client', 'stage_vn', 'stage_en', 'year'];
    const formValidation = validateFormData(formData, requiredFields);
    
    if (!formValidation.isValid) {
      showValidationErrors(formValidation.errors);
      return;
    }

    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      // Tạo FormData để gửi multipart/form-data
      const formDataToSend = new FormData();
      
      // Append các trường dữ liệu CŨ
      formDataToSend.append("id_client", formData.id_client);
      formDataToSend.append("id_projectCategory", formData.id_projectCategory);
      formDataToSend.append("projectName", formData.projectName);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("stage_vn", formData.stage_vn);
      formDataToSend.append("stage_en", formData.stage_en);
      formDataToSend.append("year", formData.year);
      formDataToSend.append("description_vn", formData.description_vn);
      formDataToSend.append("description_en", formData.description_en);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("show_home", formData.show_home);
      formDataToSend.append("show_list", formData.show_list);

      // ===================================
      // BẮT ĐẦU APPEND CÁC TRƯỜNG MỚI
      // ===================================
      formDataToSend.append("totalCost", formData.totalCost || 0);
      formDataToSend.append("totalArea", formData.totalArea || 0);
      formDataToSend.append("numberFloor", formData.numberFloor || 0);
      formDataToSend.append("specialFeature", formData.specialFeature);
      formDataToSend.append("amenities_vn", formData.amenities_vn);
      formDataToSend.append("amenities", formData.amenities);
      // ===================================
      // KẾT THÚC APPEND CÁC TRƯỜNG MỚI
      // ===================================

      // Append file ảnh nếu có
      if (formData.mainImage) {
        formDataToSend.append("mainImage", formData.mainImage);
      }
      if (formData.extraImage) {
        formDataToSend.append("extraImage", formData.extraImage);
      }

      // Debug FormData (Kiểm tra dữ liệu)
      console.log("=== UPDATE PROJECT FORMDATA ===");
      console.log("totalCost value:", formData.totalCost);
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }

      await projectsController.update(selectedProject.id, formDataToSend);
      setShowEditModal(false);
      resetForm();
      loadProjects();
      setAlertMessage({ type: "success", message: "Cập nhật dự án thành công!" });
    } catch (error) {
      console.error("Error updating project:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi cập nhật dự án" });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete project (Giữ nguyên logic của bạn là toggle status)
  const handleDelete = async () => {
    try {
      setSaving(true);
      await projectsController.toggleActive(selectedProject.id); // Giả định API này set status=Inactive
      setShowDeleteModal(false);
      loadProjects();
      setAlertMessage({ type: "success", message: "Xóa dự án (Đánh dấu ẩn) thành công!" });
    } catch (error) {
      console.error("Error deleting project:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi xóa dự án" });
    } finally {
      setSaving(false);
    }
  };

  // Handle toggle status (Giữ nguyên)
  const handleToggleStatus = async (project) => {
    try {
      await projectsController.toggleActive(project.id);
      loadProjects();
      setAlertMessage({ type: "success", message: "Cập nhật trạng thái thành công!" });
    } catch (error) {
      console.error("Error toggling status:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi cập nhật trạng thái" });
    }
  };

  // Handle toggle show home (Giữ nguyên)
  const handleToggleShowHome = async (project) => {
    try {
      await projectsController.toggleShowHome(project.id);
      loadProjects();
      setAlertMessage({ type: "success", message: "Cập nhật hiển thị trang chủ thành công!" });
    } catch (error) {
      console.error("Error toggling show home:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi cập nhật hiển thị trang chủ" });
    }
  };

  // Handle toggle show list (Giữ nguyên)
  const handleToggleShowList = async (project) => {
    try {
      await projectsController.toggleShowList(project.id);
      loadProjects();
      setAlertMessage({ type: "success", message: "Cập nhật hiển thị danh sách thành công!" });
    } catch (error) {
      console.error("Error toggling show list:", error);
      setAlertMessage({ type: "danger", message: "Lỗi khi cập nhật hiển thị danh sách" });
    }
  };

  // Open edit modal
  const openEditModal = (project) => {
    setSelectedProject(project);
    setFormData({
      id_client: project.id_client || "",
      id_projectCategory: project.id_projectCategory || "",
      projectName: project.projectName || "",
      location: project.location || "",
      stage_vn: project.stage_vn || "",
      stage_en: project.stage_en || "",
      year: project.year || new Date().getFullYear(),
      description_vn: project.description_vn || "",
      description_en: project.description_en || "",
      mainImage: null,
      extraImage: null,
      status: project.status || "Active",
      show_home: project.show_home || false,
      show_list: project.show_list !== false,
      // ===================================
      // GÁN GIÁ TRỊ CÁC TRƯỜNG MỚI
      // ===================================
      totalArea: project.totalArea || "",
      numberFloor: project.numberFloor || "",
      specialFeature: project.specialFeature || "",
      amenities_vn: project.amenities_vn || "",
      amenities: project.amenities || "",
      totalCost: project.totalCost || "",
      // ===================================
      // KẾT THÚC GÁN GIÁ TRỊ
      // ===================================
    });
    setShowEditModal(true);
  };

  // Open detail modal (Giữ nguyên)
  const openDetailModal = (project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  // Open delete modal (Giữ nguyên)
  const openDeleteModal = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  // Calculate statistics (Giữ nguyên)
  const stats = {
    total: projects.length,
    active: projects.filter(project => project.status === "Active").length,
    inactive: projects.filter(project => project.status === "Inactive").length,
    showHome: projects.filter(project => project.show_home).length,
    showList: projects.filter(project => project.show_list).length
  };

  // Stats data for cards (Giữ nguyên)
  const statsData = [
    {
      name: "Tổng dự án",
      amount: stats.total,
      icon: "iconamoon:folder",
      iconColor: "primary"
    },
    {
      name: "Đang hoạt động",
      amount: stats.active,
      icon: "iconamoon:toggle-right",
      iconColor: "success"
    },
    {
      name: "Đã ẩn",
      amount: stats.inactive,
      icon: "iconamoon:toggle-left",
      iconColor: "warning"
    },
    {
      name: "Hiển thị trang chủ",
      amount: stats.showHome,
      icon: "iconamoon:home",
      iconColor: "info"
    }
  ];

  return (
    <div className="">
      <div className="">
        <PageMetaData title="Quản lý Dự án" />

        {/* Page Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Quản lý Dự án</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <span className="text-muted">Quản lý</span>
                  </li>
                  <li className="breadcrumb-item active">Dự án</li>
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

        {/* Các thẻ thống kê */}
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
                <h5 className="card-title mb-0">Danh sách Dự án</h5>
                <div className="d-flex gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={loadProjects}
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
                {/* Search and Filter */}
                <Row className="mb-3 align-items-center">
                  {/* Ô tìm kiếm */}
                  <Col md={4}>
                    <InputGroup>
                      <FormControl
                        placeholder="Tìm kiếm theo tên dự án..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <Button variant="primary" onClick={handleSearch}>
                        <FiSearch />
                      </Button>
                    </InputGroup>
                  </Col>

                  {/* Bộ lọc trạng thái */}
                  <Col md={4}>
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) => handleFilterChange("status", e.target.value)}
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="Active">Hoạt động</option>
                      <option value="Inactive">Ẩn</option>
                    </Form.Select>
                  </Col>

                  {/* Bộ lọc danh mục */}
                  <Col md={4}>
                    <Form.Select
                      value={categoryFilter}
                      onChange={(e) => handleFilterChange("category", e.target.value)}
                    >
                      <option value="all">Tất cả danh mục</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name_vn}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>


                {/* Data Table */}
                <div className="table-responsive">
                  <Table hover className="table-nowrap">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Hình ảnh</th>
                        <th>Tên dự án</th>
                        <th>Danh mục</th>
                        <th>Khách hàng</th>
                        <th>Giai đoạn</th>
                        <th>Năm</th>
                        <th>Trạng thái</th>
                        <th>Hiển thị</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={10} className="text-center py-4">
                            <Spinner animation="border" size="sm" className="me-2" />
                            Đang tải...
                          </td>
                        </tr>
                      ) : projects.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="text-center py-4 text-muted">
                            Không có dữ liệu
                          </td>
                        </tr>
                      ) : (
                        projects.map((project) => (
                          <tr key={project.id}>
                            <td>
                              <span className="fw-medium">#{project.id}</span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                {project.mainImage ? (
                                  <Image
                                    src={`${apiUrlNoApi}${project.mainImage}`}
                                    alt={project.projectName}
                                    width={40}
                                    height={40}
                                    className="rounded"
                                    style={{ objectFit: "cover" }}
                                    title="Hình ảnh chính"
                                  />
                                ) : (
                                  <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                    <FiImage className="text-muted" size={20} />
                                  </div>
                                )}
                                {project.extraImage && (
                                  <Image
                                    src={`${apiUrlNoApi}${project.extraImage}`}
                                    alt={`${project.projectName} - Extra`}
                                    width={40}
                                    height={40}
                                    className="rounded"
                                    style={{ objectFit: "cover" }}
                                    title="Hình ảnh phụ"
                                  />
                                )}
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="fw-medium">{project.projectName}</div>
                                <div className="text-muted small">{project.location}</div>
                              </div>
                            </td>
                            <td>
                              <span className="text-muted">
                                {categories.find(c => c.id === project.id_projectCategory)?.name_vn || "N/A"}
                              </span>
                            </td>
                            <td>
                              <span className="text-muted">
                                {clients.find(c => c.id === project.id_client)?.clientName_vn || "N/A"}
                              </span>
                            </td>
                            <td>
                              <div>
                                <div className="fw-medium">{project.stage_vn}</div>
                                <div className="text-muted small">{project.stage_en}</div>
                              </div>
                            </td>
                            <td>
                              <span className="fw-medium">{project.year}</span>
                            </td>
                            <td>
                              <Badge
                                bg={project.status === "Active" ? "success" : "warning"}
                                className="cursor-pointer"
                                onClick={() => handleToggleStatus(project)}
                              >
                                {project.status === "Active" ? "Hoạt động" : "Ẩn"}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Badge
                                  bg={project.show_home ? "info" : "secondary"}
                                  className="cursor-pointer"
                                  onClick={() => handleToggleShowHome(project)}
                                >
                                  <FiHome className="me-1" />
                                  Home
                                </Badge>
                                <Badge
                                  bg={project.show_list ? "info" : "secondary"}
                                  className="cursor-pointer"
                                  onClick={() => handleToggleShowList(project)}
                                >
                                  <FiList className="me-1" />
                                  List
                                </Badge>
                              </div>
                            </td>
                            <td>
                              <ButtonGroup size="sm">
                                <Button
                                  variant="primary"
                                  onClick={() => openDetailModal(project)}
                                >
                                  <FiEye />
                                </Button>
                                <Button
                                  variant="warning"
                                  onClick={() => openEditModal(project)}
                                >
                                  <FiEdit2 />
                                </Button>
                                <Button
                                  variant="danger"
                                  onClick={() => openDeleteModal(project)}
                                >
                                  <FiTrash2 />
                                </Button>
                              </ButtonGroup>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div className="text-muted small">
                      Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số {totalItems} dự án
                    </div>
                    <PaginationComponent
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
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
          <Modal.Title>Thêm Dự án Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Existing Row 1: Tên dự án, Địa điểm */}
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

            {/* Existing Row 2: Danh mục dự án, Khách hàng */}
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

            {/* Existing Row 3: Giai đoạn (VN), Giai đoạn (EN) */}
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

            {/* **NEW ROW 4: totalArea, numberFloor** */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Diện tích tổng (m²)</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalArea"
                    value={formData.totalArea}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 5000"
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số tầng</Form.Label>
                  <Form.Control
                    type="number"
                    name="numberFloor"
                    value={formData.numberFloor}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 10"
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* **NEW ROW 5: specialFeature (VN), specialFeature (EN)** */}
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Đặc điểm nổi bật (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="specialFeature"
                    value={formData.specialFeature}
                    onChange={handleInputChange}
                    placeholder="Nhập đặc điểm nổi bật bằng tiếng Việt"
                  />
                </Form.Group>
              </Col>
             
            </Row>

            {/* **NEW ROW 6: amenities (VN), amenities (EN)** */}
            <Row>
              {/* <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tiện ích (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="amenities_vn"
                    value={formData.amenities_vn}
                    onChange={handleInputChange}
                    placeholder="Nhập tiện ích bằng tiếng Việt (cách nhau bởi dấu phẩy)"
                  />
                </Form.Group>
              </Col> */}
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Tiện ích </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    placeholder="Nhập tiện ích bằng tiếng Anh (separated by commas)"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chi phí dự án (Total Cost)</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalCost"
                    value={formData.totalCost}
                    onChange={handleInputChange}
                    placeholder="Nhập chi phí dự án (VND)"
                    min="0"
                  />
                  <Form.Text className="text-muted">
                    Chi phí tổng thể của dự án
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {/* Existing Row 7: Năm, Hình ảnh chính */}
            <Row>
              <Col md={12}>
                <ImageValidationInfo />
              </Col>
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
                  <Form.Control
                    type="file"
                    name="mainImage"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">
                    Chọn hình ảnh chính cho dự án
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hình ảnh phụ</Form.Label>
                  <Form.Control
                    type="file"
                    name="extraImage"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">
                    Chọn hình ảnh phụ cho dự án (tùy chọn)
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {/* Existing Row 8: Mô tả (VN), Mô tả (EN) */}
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

            {/* Existing Row 9: Trạng thái, Hiển thị trang chủ, Hiển thị danh sách */}
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
            
            {/* **NEW ROW 4: totalArea, numberFloor** */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Diện tích tổng (m²)</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalArea"
                    value={formData.totalArea}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 5000"
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số tầng</Form.Label>
                  <Form.Control
                    type="number"
                    name="numberFloor"
                    value={formData.numberFloor}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 10"
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* **NEW ROW 5: specialFeature (VN), specialFeature (EN)** */}
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Đặc điểm nổi bật (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="specialFeature"
                    value={formData.specialFeature}
                    onChange={handleInputChange}
                    placeholder="Nhập đặc điểm nổi bật bằng tiếng Việt"
                  />
                </Form.Group>
              </Col>
             
            </Row>

            {/* **NEW ROW 6: amenities (VN), amenities (EN)** */}
            <Row>
              {/* <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tiện ích (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="amenities_vn"
                    value={formData.amenities_vn}
                    onChange={handleInputChange}
                    placeholder="Nhập tiện ích bằng tiếng Việt (cách nhau bởi dấu phẩy)"
                  />
                </Form.Group>
              </Col> */}
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Tiện ích </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    placeholder="Nhập tiện ích bằng tiếng Anh (separated by commas)"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chi phí dự án (Total Cost)</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalCost"
                    value={formData.totalCost}
                    onChange={handleInputChange}
                    placeholder="Nhập chi phí dự án (VND)"
                    min="0"
                  />
                  <Form.Text className="text-muted">
                    Chi phí tổng thể của dự án
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <ImageValidationInfo />
              </Col>
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
                  {selectedProject?.mainImage && (
                    <div className="mb-2">
                      <Image
                                                  src={`${apiUrlNoApi}${selectedProject.mainImage}`}

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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hình ảnh phụ</Form.Label>
                  {selectedProject?.extraImage && (
                    <div className="mb-2">
                      <Image
                        src={`${apiUrlNoApi}${selectedProject.extraImage}`}
                        alt="Current extra image"
                        width={100}
                        height={100}
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="text-muted small">Hình ảnh phụ hiện tại</div>
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    name="extraImage"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">
                    Chọn hình ảnh phụ mới cho dự án (tùy chọn)
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

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết Dự án</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <h6>Thông tin cơ bản</h6>
                  <p><strong>ID:</strong> #{selectedProject.id}</p>
                  <p><strong>Tên dự án:</strong> {selectedProject.projectName}</p>
                  <p><strong>Địa điểm:</strong> {selectedProject.location || "N/A"}</p>
                  <p><strong>Danh mục:</strong> {categories.find(c => c.id === selectedProject.id_projectCategory)?.name_vn || "N/A"}</p>
                  <p><strong>Khách hàng:</strong> {clients.find(c => c.id === selectedProject.id_client)?.clientName_vn || "N/A"}</p>
                  <p><strong>Giai đoạn:</strong> {selectedProject.stage_vn} / {selectedProject.stage_en}</p>
                  <p><strong>Năm:</strong> {selectedProject.year}</p>
                  {/* **THÔNG TIN MỚI** */}
                  <p><strong>Diện tích tổng:</strong> {selectedProject.totalArea ? `${selectedProject.totalArea} m²` : "N/A"}</p>
                  <p><strong>Số tầng:</strong> {selectedProject.numberFloor || "N/A"}</p>
                  {/* **END THÔNG TIN MỚI** */}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <h6>Hình ảnh</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="small text-muted">Hình ảnh chính</h6>
                      {selectedProject.mainImage ? (
                        <div>
                          <Image
                            src={`${apiUrlNoApi}${selectedProject.mainImage}`}
                            alt="Main image"
                            fluid
                            className="rounded mb-2"
                            style={{ maxHeight: "200px", objectFit: "cover" }}
                          />
                          <div className="text-muted small">
                            <strong>Đường dẫn:</strong> {selectedProject.mainImage}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-5 bg-light rounded">
                          <FiImage className="text-muted mb-2" size={48} />
                          <p className="text-muted">Chưa có hình ảnh chính</p>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <h6 className="small text-muted">Hình ảnh phụ</h6>
                      {selectedProject.extraImage ? (
                        <div>
                          <Image
                            src={`${apiUrlNoApi}${selectedProject.extraImage}`}
                            alt="Extra image"
                            fluid
                            className="rounded mb-2"
                            style={{ maxHeight: "200px", objectFit: "cover" }}
                          />
                          <div className="text-muted small">
                            <strong>Đường dẫn:</strong> {selectedProject.extraImage}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-5 bg-light rounded">
                          <FiImage className="text-muted mb-2" size={48} />
                          <p className="text-muted">Chưa có hình ảnh phụ</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
              {/* **MÔ TẢ CŨ VÀ THÔNG TIN MỚI (ĐẶC ĐIỂM, TIỆN ÍCH)** */}
              <Col md={12}>
                <div className="mb-3">
                  <h6>Mô tả & Chi tiết</h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <p className="fw-medium">Mô tả (Tiếng Việt):</p>
                      <p className="text-muted">{selectedProject.description_vn || "Chưa có mô tả"}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <p className="fw-medium">Mô tả (Tiếng Anh):</p>
                      <p className="text-muted">{selectedProject.description_en || "Chưa có mô tả"}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <p className="fw-medium">Đặc điểm nổi bật (Tiếng Việt):</p>
                      <p className="text-muted">{selectedProject.specialFeature || "Chưa có"}</p>
                    </div>
                
                    {/* <div className="col-md-6">
                      <p className="fw-medium">Tiện ích (Tiếng Việt):</p>
                      <p className="text-muted">{selectedProject.amenities_vn || "Chưa có"}</p>
                    </div> */}
                    <div className="col-md-6">
                      <p className="fw-medium">Tiện ích :</p>
                      <p className="text-muted">{selectedProject.amenities || "Chưa có"}</p>
                    </div>
                  </div>
                </div>
              </Col>
              {/* **END MÔ TẢ CŨ VÀ THÔNG TIN MỚI** */}
              <Col md={12}>
                <div className="mb-3">
                  <h6>Trạng thái</h6>
                  <div className="d-flex gap-2">
                    <Badge bg={selectedProject.status === "Active" ? "success" : "warning"}>
                      {selectedProject.status === "Active" ? "Hoạt động" : "Ẩn"}
                    </Badge>
                    <Badge bg={selectedProject.show_home ? "info" : "secondary"}>
                      <FiHome className="me-1" />
                      {selectedProject.show_home ? "Hiển thị trang chủ" : "Ẩn trang chủ"}
                    </Badge>
                    <Badge bg={selectedProject.show_list ? "info" : "secondary"}>
                      <FiList className="me-1" />
                      {selectedProject.show_list ? "Hiển thị danh sách" : "Ẩn danh sách"}
                    </Badge>
                  </div>
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
            openEditModal(selectedProject);
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
          <p>Bạn có chắc chắn muốn xóa dự án <strong>"{selectedProject?.projectName}"</strong>?</p>
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

export default ProjectsPage;