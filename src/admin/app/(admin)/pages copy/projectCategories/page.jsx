import React, {
  useState,
  useEffect,
  useCallback,
  startTransition,
} from "react";
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
  InputGroup,
  FormControl,
  Badge,
  Spinner,
  Alert,
  Image,
  Pagination,
  ButtonGroup,
  Dropdown,
} from "react-bootstrap";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiEye,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiFilter,
  FiRefreshCw,
  FiImage,
  FiFolder,
  FiCalendar,
} from "react-icons/fi";
import IconifyIcon from "@/admin/components/wrappers/IconifyIcon";
import { projectCategoriesController } from "@/config/config";
import PageMetaData from "@/admin/components/PageTitle";
import { validateImageQuality, validateImageDimensions, validateFormData, showValidationErrors } from "@/utils/imageValidation";
import ImageValidationInfo from "@/components/ImageValidationInfo";
const ProjectCategoriesPage = () => {
  const navigate = useNavigate();

  // State management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name_vn: "",
    name_en: "",
    status: "Active",
    mainImage: null,
    defaultImage: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });

  // Load categories data
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : "",
      };

      const response = await projectCategoriesController.list(params);
      
      // Handle API response structure based on your data
      if (response.success && response.data) {
        setCategories(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } else {
        setCategories(response.data || response || []);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      setAlertMessage({
        type: "danger",
        message: "Lỗi khi tải danh sách danh mục dự án",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, statusFilter]);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Handle search
  const handleSearch = useCallback(() => {
    startTransition(() => {
      setCurrentPage(1);
      loadCategories();
    });
  }, [loadCategories]);

  // Handle status filter change
  const handleStatusFilterChange = useCallback((status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      name_vn: "",
      name_en: "",
      status: "Active",
      mainImage: null,
      defaultImage: null,
    });
    setFormErrors({});
    setAlertMessage({ type: "", message: "" });
  };

  // Handle form input change
  const handleInputChange = async (e) => {
    const { name, value, files } = e.target;
    
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

        setFormData((prev) => ({ ...prev, [name]: file }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name_vn.trim())
      errors.name_vn = "Tên danh mục (VN) là bắt buộc";
    if (!formData.name_en.trim())
      errors.name_en = "Tên danh mục (EN) là bắt buộc";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle create category
  const handleCreate = async () => {
    // Validate required fields
    const requiredFields = ['name_vn', 'name_en'];
    const formValidation = validateFormData(formData, requiredFields);
    
    if (!formValidation.isValid) {
      showValidationErrors(formValidation.errors);
      return;
    }

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

      await projectCategoriesController.create(formDataToSend);
      setShowCreateModal(false);
      resetForm();
      loadCategories();
      setAlertMessage({
        type: "success",
        message: "Tạo danh mục dự án thành công!",
      });
    } catch (error) {
      console.error("Error creating category:", error);
      setAlertMessage({
        type: "danger",
        message: "Lỗi khi tạo danh mục dự án",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle edit category
  const handleEdit = async () => {
    // Validate required fields
    const requiredFields = ['name_vn', 'name_en'];
    const formValidation = validateFormData(formData, requiredFields);
    
    if (!formValidation.isValid) {
      showValidationErrors(formValidation.errors);
      return;
    }

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

      await projectCategoriesController.update(
        selectedCategory.id,
        formDataToSend
      );
      setShowEditModal(false);
      resetForm();
      loadCategories();
      setAlertMessage({
        type: "success",
        message: "Cập nhật danh mục dự án thành công!",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      setAlertMessage({
        type: "danger",
        message: "Lỗi khi cập nhật danh mục dự án",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete category
  const handleDelete = async () => {
    try {
      setSaving(true);
      await projectCategoriesController.toggleStatus(selectedCategory.id);
      setShowDeleteModal(false);
      loadCategories();
      setAlertMessage({
        type: "success",
        message: "Xóa danh mục dự án thành công!",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      setAlertMessage({
        type: "danger",
        message: "Lỗi khi xóa danh mục dự án",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (category) => {
    try {
      await projectCategoriesController.toggleStatus(category.id);
      loadCategories();
      setAlertMessage({
        type: "success",
        message: "Cập nhật trạng thái thành công!",
      });
    } catch (error) {
      console.error("Error toggling status:", error);
      setAlertMessage({
        type: "danger",
        message: "Lỗi khi cập nhật trạng thái",
      });
    }
  };

  // Open edit modal
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name_vn: category.name_vn || "",
      name_en: category.name_en || "",
      status: category.status || "Active",
      mainImage: null,
      defaultImage: null,
    });
    setShowEditModal(true);
  };

  // Open detail modal
  const openDetailModal = (category) => {
    setSelectedCategory(category);
    setShowDetailModal(true);
  };

  // Open delete modal
  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  // Calculate statistics
  const stats = {
    total: categories.length,
    active: categories.filter((cat) => cat.status === "Active").length,
    inactive: categories.filter((cat) => cat.status === "Inactive").length,
    withImages: categories.filter((cat) => cat.mainImage || cat.defaultImage)
      .length,
  };

  // Stats data for cards
  const statsData = [
    {
      name: "Tổng danh mục",
      amount: stats.total,
      icon: "iconamoon:folder",
      iconColor: "primary",
    },
    {
      name: "Đang hoạt động",
      amount: stats.active,
      icon: "iconamoon:toggle-right",
      iconColor: "success",
    },
    {
      name: "Đã ẩn",
      amount: stats.inactive,
      icon: "iconamoon:toggle-left",
      iconColor: "warning",
    },
    {
      name: "Có hình ảnh",
      amount: stats.withImages,
      icon: "iconamoon:image",
      iconColor: "info",
    },
  ];

  return (
    <div className="">
      <div className="">
        <PageMetaData title="Quản lý Danh mục Dự án" />

        {/* Page Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Quản lý Danh mục Dự án</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <span className="text-muted">Quản lý</span>
                  </li>
                  <li className="breadcrumb-item active">Danh mục Dự án</li>
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
                        <IconifyIcon icon={stat.icon} className="fs-24" />
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
                <h5 className="card-title mb-0">Danh sách Danh mục Dự án</h5>
                <div className="d-flex gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={loadCategories}
                    disabled={loading}
                  >
                    <FiRefreshCw
                      className={loading ? "spinner-border-sm" : ""}
                    />
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
                  <Col md={6}>
                    <InputGroup>
                      <FormControl
                        placeholder="Tìm kiếm theo tên danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <Button variant="danger" onClick={handleSearch}>
                        <FiSearch />
                      </Button>
                    </InputGroup>
                  </Col>

                  {/* Bộ lọc trạng thái */}
                  <Col md={6}>
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) => handleStatusFilterChange(e.target.value)}
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="Active">Hoạt động</option>
                      <option value="Inactive">Ẩn</option>
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
                        <th>Tên danh mục (VN)</th>
                        <th>Tên danh mục (EN)</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            <Spinner
                              animation="border"
                              size="sm"
                              className="me-2"
                            />
                            Đang tải...
                          </td>
                        </tr>
                      ) : categories.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-4 text-muted"
                          >
                            Không có dữ liệu
                          </td>
                        </tr>
                      ) : (
                        categories.map((category) => (
                          <tr key={category.id}>
                            <td>
                              <span className="fw-medium">#{category.id}</span>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                {category.mainImage && (
                                  <Image
                                    src={`${apiUrlNoApi}${category.mainImage}`}
                                    alt="Main"
                                    width={40}
                                    height={40}
                                    className="rounded"
                                    style={{ objectFit: "cover" }}
                                  />
                                )}
                                {category.defaultImage && (
                                  <Image
                                    src={`${apiUrlNoApi}${category.defaultImage}`}
                                    alt="Default"
                                    width={40}
                                    height={40}
                                    className="rounded"
                                    style={{ objectFit: "cover" }}
                                  />
                                )}
                                {!category.mainImage &&
                                  !category.defaultImage && (
                                    <div
                                      className="bg-light rounded d-flex align-items-center justify-content-center"
                                      style={{ width: 40, height: 40 }}
                                    >
                                      <FiImage className="text-muted" />
                                    </div>
                                  )}
                              </div>
                            </td>
                            <td>
                              <span className="fw-medium">
                                {category.name_vn}
                              </span>
                            </td>
                            <td>
                              <span className="text-muted">
                                {category.name_en}
                              </span>
                            </td>
                            <td>
                              <Badge
                                bg={
                                  category.status === "Active"
                                    ? "success"
                                    : "warning"
                                }
                                className="cursor-pointer"
                                onClick={() => handleToggleStatus(category)}
                              >
                                {category.status === "Active"
                                  ? "Hoạt động"
                                  : "Ẩn"}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex align-items-center text-muted">
                                <FiCalendar className="me-1" />
                                {new Date(
                                  category.createDate
                                ).toLocaleDateString("vi-VN")}
                              </div>
                            </td>
                            <td>
                              <ButtonGroup size="sm">
                                <Button
                                  variant="primary"
                                  onClick={() => openDetailModal(category)}
                                >
                                  <FiEye />
                                </Button>
                                <Button
                                  variant="warning"
                                  onClick={() => openEditModal(category)}
                                >
                                  <FiEdit2 />
                                </Button>
                                {/* <Button
                                  variant="danger"
                                  onClick={() => openDeleteModal(category)}
                                >
                                  <FiTrash2 />
                                </Button> */}
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
                      Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số {totalItems} mục
                    </div>
                    <Pagination>
                      <Pagination.Prev 
                        onClick={() => setCurrentPage(currentPage - 1)} 
                        disabled={currentPage === 1} 
                      />
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Pagination.Item 
                          key={i + 1} 
                          active={i + 1 === currentPage}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next 
                        onClick={() => setCurrentPage(currentPage + 1)} 
                        disabled={currentPage === totalPages} 
                      />
                    </Pagination>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Create Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm Danh mục Dự án Mới</Modal.Title>
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
              <Col md={12}>
                <ImageValidationInfo />
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
                    Chọn hình ảnh chính cho danh mục
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hình ảnh mặc định</Form.Label>
                  <Form.Control
                    type="file"
                    name="defaultImage"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">
                    Chọn hình ảnh mặc định cho danh mục
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
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
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
              <Col md={12}>
                <ImageValidationInfo />
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hình ảnh chính</Form.Label>
                  {selectedCategory?.mainImage && (
                    <div className="mb-2">
                      <Image
                        src={`${apiUrlNoApi}${selectedCategory.mainImage}`}
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
                  {selectedCategory?.defaultImage && (
                    <div className="mb-2">
                      <Image
                        src={`${apiUrlNoApi}${selectedCategory.defaultImage}`}
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

      {/* Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết Danh mục Dự án</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCategory && (
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <h6>Thông tin cơ bản</h6>
                  <p>
                    <strong>ID:</strong> #{selectedCategory.id}
                  </p>
                  <p>
                    <strong>Tên (VN):</strong> {selectedCategory.name_vn}
                  </p>
                  <p>
                    <strong>Tên (EN):</strong> {selectedCategory.name_en}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>
                    <Badge
                      bg={
                        selectedCategory.status === "Active"
                          ? "success"
                          : "warning"
                      }
                      className="ms-2"
                    >
                      {selectedCategory.status === "Active"
                        ? "Hoạt động"
                        : "Ẩn"}
                    </Badge>
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <h6>Hình ảnh</h6>
                  <div className="d-flex gap-2">
                    {selectedCategory.mainImage && (
                      <div>
                        <Image
                          src={`${apiUrlNoApi}${selectedCategory.mainImage}`}
                          alt="Main image"
                          width={120}
                          height={120}
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="text-muted small">Hình ảnh chính</div>
                      </div>
                    )}
                    {selectedCategory.defaultImage && (
                      <div>
                        <Image
                          src={`${apiUrlNoApi}${selectedCategory.defaultImage}`}
                          alt="Default image"
                          width={120}
                          height={120}
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="text-muted small">
                          Hình ảnh mặc định
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
              <Col md={12}>
                <div className="mb-3">
                  <h6>Thời gian</h6>
                  <p>
                    <strong>Ngày tạo:</strong>{" "}
                    {new Date(selectedCategory.createDate).toLocaleString(
                      "vi-VN"
                    )}
                  </p>
                  <p>
                    <strong>Ngày cập nhật:</strong>{" "}
                    {new Date(selectedCategory.updateDate).toLocaleString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowDetailModal(false);
              openEditModal(selectedCategory);
            }}
          >
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
          <p>
            Bạn có chắc chắn muốn xóa danh mục dự án{" "}
            <strong>"{selectedCategory?.name_vn}"</strong>?
          </p>
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

export default ProjectCategoriesPage;
