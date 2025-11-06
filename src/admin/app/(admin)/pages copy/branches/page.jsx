import { useState, useEffect, useCallback } from "react";

import {
  Card,
  CardBody,
  Col,
  Row,
  Table,
  Badge,
  Button,
  Form,
  Pagination,
  Modal,
} from "react-bootstrap";
import PageMetaData from "@/admin/components/PageTitle";
import IconifyIcon from "@/admin/components/wrappers/IconifyIcon";
import ImageValidationInfo from "@/components/ImageValidationInfo";
import { validateImageQuality, validateImageDimensions, validateFormData, showValidationErrors } from "@/utils/imageValidation";
import { branchController, apiUrlNoApi } from "@/config/config";

// Dữ liệu ban đầu cho các thẻ thống kê
const initialStatsData = [
  {
    name: "TỔNG CHI NHÁNH",
    amount: 0,
    icon: "mdi:office-building",
    iconColor: "primary",
  },
  {
    name: "CHI NHÁNH HOẠT ĐỘNG",
    amount: 0,
    icon: "mdi:check-circle",
    iconColor: "success",
  },
  {
    name: "CHI NHÁNH CHÍNH",
    amount: 0,
    icon: "mdi:home-city",
    iconColor: "info",
  },
  {
    name: "CHI NHÁNH PHỤ",
    amount: 0,
    icon: "mdi:store",
    iconColor: "warning",
  },
];

// Cấu hình số lượng mục hiển thị trên mỗi trang
const ITEMS_PER_PAGE = 10;

/**
 * Hàm tạo ra một mảng các mục cho thanh phân trang thông minh.
 */
const getPaginationItems = (currentPage, totalPages, pageNeighbours = 1) => {
  const totalNumbers = pageNeighbours * 2 + 3;
  const totalBlocks = totalNumbers + 2;

  if (totalPages <= totalBlocks) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const startPage = Math.max(2, currentPage - pageNeighbours);
  const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

  let pages = [1];

  if (currentPage - pageNeighbours <= 2) {
    const end = 1 + totalNumbers;
    for (let i = 2; i < end; i++) {
      pages.push(i);
    }
    pages.push("...");
    pages.push(totalPages);
  } else if (currentPage + pageNeighbours >= totalPages - 1) {
    const start = totalPages - totalNumbers + 1;
    pages.push("...");
    for (let i = start; i < totalPages; i++) {
      pages.push(i);
    }
    pages.push(totalPages);
  } else {
    pages.push("...");
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    pages.push("...");
    pages.push(totalPages);
  }

  return pages;
};

const BranchesPage = () => {
  const [dataTable, setDataTable] = useState([]);
  const [statsData, setStatsData] = useState(initialStatsData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State quản lý bộ lọc và phân trang
  const [filters, setFilters] = useState({
    keyword: "", // Tìm kiếm theo tên công ty, địa chỉ, email, phone
    companyName_vn: "",
    companyName_en: "",
    shortName: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Hàm gọi API để lấy dữ liệu
  const fetchData = useCallback(async (page, currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: page,
        limit: ITEMS_PER_PAGE,
        keyword: currentFilters.keyword,
        companyName_vn: currentFilters.companyName_vn,
        companyName_en: currentFilters.companyName_en,
        shortName: currentFilters.shortName,
      };

      const response = await branchController.getBranches(params);
      console.log("=== BRANCHES API DEBUG ===");
      console.log("Request params:", params);
      console.log("Full API Response:", response);
      console.log("Response type:", typeof response);
      console.log("Response keys:", response ? Object.keys(response) : 'null');
      console.log("Response.success:", response?.success);
      console.log("Response.data:", response?.data);
      console.log("Response.data type:", typeof response?.data);
      console.log("Response.data length:", response?.data?.length);
      console.log("=========================");

      // Xử lý dữ liệu từ API - kiểm tra cấu trúc response
      let branchesData = [];
      let totalItems = 0;
      let totalPages = 1;
      
      if (response && response.success && response.data) {
        // Cấu trúc response chuẩn với nested data và pagination
        if (response.data.data && Array.isArray(response.data.data)) {
          branchesData = response.data.data;
          if (response.data.pagination) {
            totalItems = response.data.pagination.totalItems || response.data.data.length;
            totalPages = response.data.pagination.totalPages || Math.ceil(totalItems / ITEMS_PER_PAGE);
          } else {
            totalItems = response.data.total || response.data.data.length;
            totalPages = response.data.totalPages || Math.ceil(totalItems / ITEMS_PER_PAGE);
          }
          console.log("Using nested data structure - branches count:", branchesData.length);
          console.log("Pagination info:", response.data.pagination);
        } else if (Array.isArray(response.data)) {
          // Fallback: response.data là array trực tiếp
          branchesData = response.data;
          totalItems = response.total || response.data.length;
          totalPages = response.totalPages || Math.ceil(totalItems / ITEMS_PER_PAGE);
          console.log("Using direct array format - branches count:", branchesData.length);
        } else if (response.data.items && Array.isArray(response.data.items)) {
          // Cấu trúc với items và pagination info
          branchesData = response.data.items;
          totalItems = response.data.total || response.data.items.length;
          totalPages = response.data.totalPages || Math.ceil(totalItems / ITEMS_PER_PAGE);
          console.log("Using items structure - branches count:", branchesData.length);
        }
        console.log("Total items:", totalItems, "Total pages:", totalPages);
      } else if (response && Array.isArray(response.data)) {
        // Fallback: response.data là array
        branchesData = response.data;
        totalItems = response.total || response.data.length;
        totalPages = response.totalPages || Math.ceil(totalItems / ITEMS_PER_PAGE);
        console.log("Using response.data format - branches count:", branchesData.length);
      } else if (Array.isArray(response)) {
        // Fallback: response trực tiếp là array
        branchesData = response;
        totalItems = response.length;
        totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        console.log("Using direct array format - branches count:", branchesData.length);
      } else {
        console.error("Unexpected response format:", response);
        branchesData = [];
        totalItems = 0;
        totalPages = 1;
      }

      console.log("Processed branches data:", branchesData);

      // Định dạng lại dữ liệu chi nhánh để hiển thị trên bảng
      const formattedData = branchesData.map((item) => ({
        ID: item.id,
        companyName_vn: item.companyName_vn,
        companyName_en: item.companyName_en,
        shortName: item.shortName,
        address_vn: item.address_vn,
        address_en: item.address_en,
        phone: item.phone,
        email: item.email,
        businessLicenseImage: item.businessLicenseImage,
        aboutUs_vn: item.aboutUs_vn,
        aboutUs_en: item.aboutUs_en,
        philosophy_vn: item.philosophy_vn,
        philosophy_en: item.philosophy_en,
        slogan_vn: item.slogan_vn,
        slogan_en: item.slogan_en,
        googleMap: item.googleMap,
        facebook: item.facebook,
        instagram: item.instagram,
        youtube: item.youtube,
        isHeadOfice: item.isHeadOfice,
        whatWeDo: item.whatWeDo,
        ourImpact: item.ourImpact,
        coreValue: item.coreValue,
        ourMember: item.ourMember,
        createdDate: item.createdDate, // Thêm createdDate để hiển thị
        updatedDate: item.updatedDate, // Thêm updatedDate để hiển thị
        whatWeDo_vn: item.whatWeDo_vn,
        whatWeDo_en: item.whatWeDo_en,
        ourImpact_vn: item.ourImpact_vn,
        ourImpact_en: item.ourImpact_en,
        coreValue_vn: item.coreValue_vn,
        coreValue_en: item.coreValue_en,
      }));

      setDataTable(formattedData);

      // Cập nhật thông tin phân trang từ server
      setPagination((prev) => ({
        ...prev,
        totalPages: totalPages,
        totalItems: totalItems,
      }));

      // Cập nhật các thẻ thống kê - sử dụng totalItems từ server
      const totalBranches = totalItems || branchesData.length;
      setStatsData((prev) => [
        { ...prev[0], amount: totalBranches },
        { ...prev[1], amount: totalBranches }, // Giả định tất cả đều hoạt động
        { ...prev[2], amount: Math.floor(totalBranches / 2) }, // Giả định một nửa là chi nhánh chính
        { ...prev[3], amount: Math.ceil(totalBranches / 2) }, // Giả định một nửa là chi nhánh phụ
      ]);
    } catch (error) {
      setError(error.message);
      console.error("Lỗi khi tải dữ liệu chi nhánh:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        params: params
      });
      
      // Hiển thị thông báo lỗi chi tiết hơn
      if (error.message.includes('Failed to fetch')) {
        console.error("Network error - có thể do CORS hoặc server không hoạt động");
      } else if (error.message.includes('404')) {
        console.error("API endpoint không tồn tại");
      } else if (error.message.includes('500')) {
        console.error("Lỗi server");
      }
      
      setDataTable([]);
      setStatsData(initialStatsData);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect để tải dữ liệu ban đầu
  useEffect(() => {
    fetchData(1, filters);
  }, [fetchData]);

  // Các hàm xử lý sự kiện cho bộ lọc và phân trang
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchData(1, filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { keyword: "", companyName_vn: "", companyName_en: "", shortName: "" };
    setFilters(clearedFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchData(1, clearedFilters);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: pageNumber }));
      fetchData(pageNumber, filters);
    }
  };

  // State và hàm xử lý cho các Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  
  const initialFormState = {
    companyName_vn: "",
    companyName_en: "",
    shortName: "",
    address_vn: "",
    address_en: "",
    phone: "",
    email: "",
    aboutUs_vn: "",
    aboutUs_en: "",
    philosophy_vn: "",
    philosophy_en: "",
    slogan_vn: "",
    slogan_en: "",
    googleMap: "",
    facebook: "",
    instagram: "",
    youtube: "",
    isHeadOfice: false,
    whatWeDo: "",
    ourImpact: "",
    coreValue: "",
    ourMember: "",
    whatWeDo_vn: "",
    whatWeDo_en: "",
    ourImpact_vn: "",
    ourImpact_en: "",
    coreValue_vn: "",
    coreValue_en: "",
  };
  
  const [newBranchData, setNewBranchData] = useState(initialFormState);
  const [editBranchData, setEditBranchData] = useState(initialFormState);
  const [newBranchImage, setNewBranchImage] = useState(null);
  const [editBranchImage, setEditBranchImage] = useState(null);
  const [newBranchImagePreview, setNewBranchImagePreview] = useState(null);
  const [editBranchImagePreview, setEditBranchImagePreview] = useState(null);

  // Xử lý việc nhập liệu trong form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBranchData({ 
      ...newBranchData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditBranchData({ 
      ...editBranchData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // Xử lý upload file cho form tạo mới
  const handleNewImageChange = async (e) => {
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

      setNewBranchImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBranchImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý upload file cho form chỉnh sửa
  const handleEditImageChange = async (e) => {
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

      setEditBranchImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditBranchImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý khi submit form tạo mới chi nhánh
  const handleCreateBranch = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      const requiredFields = ['companyName_vn', 'companyName_en', 'address_vn', 'address_en', 'phone', 'email'];
      const formValidation = validateFormData(newBranchData, requiredFields);
      
      if (!formValidation.isValid) {
        showValidationErrors(formValidation.errors);
        return;
      }

      // Tạo object chứa tất cả dữ liệu
      const submitData = { ...newBranchData };
      
      // Thêm file image nếu có
      if (newBranchImage) {
        submitData.businessLicenseImage = newBranchImage;
      }
      
      console.log('Submit data:', submitData);
      
      await branchController.create(submitData);
      alert("Tạo chi nhánh thành công!");
      setShowCreateModal(false);
      setNewBranchData(initialFormState);
      setNewBranchImage(null);
      setNewBranchImagePreview(null);
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi tạo chi nhánh:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Xử lý khi submit form cập nhật chi nhánh
  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      const requiredFields = ['companyName_vn', 'companyName_en', 'address_vn', 'address_en', 'phone', 'email'];
      const formValidation = validateFormData(editBranchData, requiredFields);
      
      if (!formValidation.isValid) {
        showValidationErrors(formValidation.errors);
        return;
      }

      // Tạo object chứa tất cả dữ liệu
      const submitData = { ...editBranchData };
      
      // Thêm file image nếu có
      if (editBranchImage) {
        submitData.businessLicenseImage = editBranchImage;
      }
      
      console.log('Update data:', submitData);
      
      await branchController.update(selectedBranch.ID, submitData);
      alert("Cập nhật chi nhánh thành công!");
      setShowEditModal(false);
      setEditBranchData(initialFormState);
      setEditBranchImage(null);
      setEditBranchImagePreview(null);
      setSelectedBranch(null);
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi cập nhật chi nhánh:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Xử lý xóa chi nhánh
  const handleDeleteBranch = async (branchId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chi nhánh này?")) {
      try {
        await branchController.deleteBranch(branchId);
        alert("Xóa chi nhánh thành công!");
        handleClearFilters();
      } catch (error) {
        console.error("Lỗi khi xóa chi nhánh:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại.");
      }
    }
  };

  // Mở modal xem chi tiết
  const handleShowDetails = (branch) => {
    setSelectedBranch(branch);
    setShowDetailModal(true);
  };

  // Mở modal chỉnh sửa
  const handleShowEdit = (branch) => {
    console.log('Branch data for edit:', branch); // Debug log
    setSelectedBranch(branch);
    
    const editData = {
      companyName_vn: branch.companyName_vn,
      companyName_en: branch.companyName_en,
      shortName: branch.shortName,
      address_vn: branch.address_vn,
      address_en: branch.address_en,
      phone: branch.phone,
      email: branch.email,
      aboutUs_vn: branch.aboutUs_vn,
      aboutUs_en: branch.aboutUs_en,
      philosophy_vn: branch.philosophy_vn || "",
      philosophy_en: branch.philosophy_en || "",
      slogan_vn: branch.slogan_vn || "",
      slogan_en: branch.slogan_en || "",
      googleMap: branch.googleMap || "",
      facebook: branch.facebook || "",
      instagram: branch.instagram || "",
      youtube: branch.youtube || "",
      isHeadOfice: branch.isHeadOfice || false,
      whatWeDo: branch.whatWeDo || "",
      ourImpact: branch.ourImpact || "",
      coreValue: branch.coreValue || "",
      ourMember: branch.ourMember ? String(branch.ourMember) : "",
      whatWeDo_vn: branch.whatWeDo_vn || "",
      whatWeDo_en: branch.whatWeDo_en || "",
      ourImpact_vn: branch.ourImpact_vn || "",
      ourImpact_en: branch.ourImpact_en || "",
      coreValue_vn: branch.coreValue_vn || "",
      coreValue_en: branch.coreValue_en || "",
    };
    
    console.log('Edit data set:', editData); // Debug log
    setEditBranchData(editData);
    
    // Reset image states
    setEditBranchImage(null);
    setEditBranchImagePreview(null);
    
    setShowEditModal(true);
  };

  // Đóng modal
  const handleCloseDetails = () => {
    setShowDetailModal(false);
    setSelectedBranch(null);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedBranch(null);
    setEditBranchData(initialFormState);
  };

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  return (
    <>
      <PageMetaData title="Quản lý chi nhánh" />

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

      {/* Form Lọc, Tìm kiếm và nút Tạo mới */}
      <Card className="mt-4">
        <CardBody>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h5 className="mb-0">
              Danh sách chi nhánh ({pagination.totalItems || dataTable.length} chi nhánh)
              {filters.keyword && (
                <span className="text-muted ms-2">
                  - Tìm kiếm: "{filters.keyword}"
                </span>
              )}
            </h5>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <IconifyIcon icon="mdi:plus" className="me-1" />
              Tạo mới
            </Button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="alert alert-danger mb-3" role="alert">
              <IconifyIcon icon="mdi:alert-circle" className="me-2" />
              <strong>Lỗi:</strong> {error}
              <Button 
                variant="link" 
                className="p-0 ms-2"
                onClick={() => setError(null)}
              >
                <IconifyIcon icon="mdi:close" />
              </Button>
            </div>
          )}
          
          <Form className="row g-3 align-items-center">
            <Col xl={3} md={6}>
              <Form.Control
                type="text"
                placeholder="Tên công ty, địa chỉ, email..."
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xl={3} md={6}>
              <Form.Control
                type="text"
                placeholder="Tên công ty (VN)..."
                name="companyName_vn"
                value={filters.companyName_vn}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xl={3} md={6}>
              <Form.Control
                type="text"
                placeholder="Tên ngắn..."
                name="shortName"
                value={filters.shortName}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xl={3} md={6}>
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  className="flex-grow-1"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang tải...
                    </>
                  ) : (
                    'Tìm kiếm'
                  )}
                </Button>
                <Button
                  variant="danger"
                  onClick={handleClearFilters}
                >
                  Xóa lọc
                </Button>
              </div>
            </Col>
          </Form>
        </CardBody>
      </Card>

      {/* Bảng dữ liệu chi nhánh */}
      <Card className="mt-3">
        <CardBody>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <h5 className="text-muted">Đang tải dữ liệu...</h5>
              <p className="text-muted mb-0">Vui lòng chờ trong giây lát</p>
            </div>
          ) : (
            <>
              <Table responsive hover className="text-nowrap align-middle">
            <thead className="table-light">
              <tr>
                <th>#ID</th>
                <th>Tên công ty</th>
                <th>Tên ngắn</th>
                <th>Địa chỉ</th>
                <th>Liên hệ</th>
                <th>Loại</th>
                <th>Ngày tạo</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {dataTable.length > 0 ? (
                dataTable.map((branch) => (
                  <tr key={branch.ID}>
                    <td>
                      <strong>#{branch.ID}</strong>
                    </td>
                    <td>
                      <div>
                        <h6 className="mb-0">{branch.companyName_vn}</h6>
                        <small className="text-muted">{branch.companyName_en}</small>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info-subtle" className="text-info">
                        {branch.shortName}
                      </Badge>
                    </td>
                    <td>
                      <div>
                        <small className="text-muted">{branch.address_vn}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <small className="text-muted">{branch.phone}</small>
                        <br />
                        <small className="text-muted">{branch.email}</small>
                      </div>
                    </td>
                    <td>
                      {branch.isHeadOfice ? (
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
                    <td>{formatDate(branch.createdDate)}</td>
                    <td className="text-center">
                      <Button
                        size="sm"
                        variant="primary"
                        className="me-1"
                        onClick={() => handleShowDetails(branch)}
                      >
                        <IconifyIcon icon="mdi:eye" />
                      </Button>
                      <Button
                        size="sm"
                        variant="warning"
                        className="me-1"
                        onClick={() => handleShowEdit(branch)}
                      >
                        <IconifyIcon icon="mdi:pencil" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="me-1"
                        onClick={() => handleDeleteBranch(branch.ID)}
                      >
                        <IconifyIcon icon="mdi:delete-outline" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center">
                      <IconifyIcon icon="mdi:office-building-off" className="fs-48 text-muted mb-2" />
                      <h5 className="text-muted">Không tìm thấy dữ liệu phù hợp</h5>
                      <p className="text-muted mb-0">Thử thay đổi bộ lọc hoặc tạo chi nhánh mới</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Thanh phân trang */}
          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                Hiển thị {((pagination.currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(pagination.currentPage * ITEMS_PER_PAGE, pagination.totalItems)} trong tổng số {pagination.totalItems} chi nhánh
              </div>
              <Pagination className="mb-0">
                <Pagination.Prev
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1 || loading}
                />

                {getPaginationItems(
                  pagination.currentPage,
                  pagination.totalPages
                ).map((item, index) => {
                  if (typeof item === "string") {
                    return (
                      <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />
                    );
                  }

                  return (
                  <Pagination.Item
                    key={item}
                    active={item === pagination.currentPage}
                    onClick={() => handlePageChange(item)}
                    disabled={loading}
                  >
                    {item}
                  </Pagination.Item>
                  );
                })}

                <Pagination.Next
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages || loading}
                />
              </Pagination>
            </div>
          )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Modal tạo chi nhánh mới */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tạo chi nhánh mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateBranch}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên công ty (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName_vn"
                    value={newBranchData.companyName_vn}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tên công ty..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên công ty (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName_en"
                    value={newBranchData.companyName_en}
                    onChange={handleInputChange}
                    placeholder="Enter company name..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên ngắn</Form.Label>
                  <Form.Control
                    type="text"
                    name="shortName"
                    value={newBranchData.shortName}
                    onChange={handleInputChange}
                    placeholder="Nhập tên ngắn..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={newBranchData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={newBranchData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Địa chỉ (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address_vn"
                    value={newBranchData.address_vn}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Địa chỉ (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address_en"
                    value={newBranchData.address_en}
                    onChange={handleInputChange}
                    placeholder="Enter address..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Giới thiệu (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="aboutUs_vn"
                    value={newBranchData.aboutUs_vn}
                    onChange={handleInputChange}
                    placeholder="Nhập giới thiệu về chi nhánh..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Giới thiệu (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="aboutUs_en"
                    value={newBranchData.aboutUs_en}
                    onChange={handleInputChange}
                    placeholder="Enter branch description..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Triết lý (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="philosophy_vn"
                    value={newBranchData.philosophy_vn}
                    onChange={handleInputChange}
                    placeholder="Nhập triết lý công ty..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Triết lý (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="philosophy_en"
                    value={newBranchData.philosophy_en}
                    onChange={handleInputChange}
                    placeholder="Enter company philosophy..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Slogan (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="slogan_vn"
                    value={newBranchData.slogan_vn}
                    onChange={handleInputChange}
                    placeholder="Nhập slogan..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Slogan (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="slogan_en"
                    value={newBranchData.slogan_en}
                    onChange={handleInputChange}
                    placeholder="Enter slogan..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Google Map Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="googleMap"
                    value={newBranchData.googleMap}
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
                    value={newBranchData.facebook}
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
                    value={newBranchData.instagram}
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
                    value={newBranchData.youtube}
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
                    checked={newBranchData.isHeadOfice}
                    onChange={handleInputChange}
                    label="Đây là trụ sở chính"
                  />
                </Form.Group>
              </Col>
              
              {/* Các trường mới */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Chúng tôi làm gì (What We Do) - Tiếng Việt</Form.Label>
                  <Form.Control as="textarea" rows={3} name="whatWeDo_vn" value={newBranchData.whatWeDo_vn} onChange={handleInputChange} placeholder="Mô tả những gì công ty làm (VN)..." />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Chúng tôi làm gì (What We Do) - Tiếng Anh</Form.Label>
                  <Form.Control as="textarea" rows={3} name="whatWeDo_en" value={newBranchData.whatWeDo_en} onChange={handleInputChange} placeholder="Describe what company does (EN)..." />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Tác động của chúng tôi (Our Impact) - Tiếng Việt</Form.Label>
                  <Form.Control as="textarea" rows={3} name="ourImpact_vn" value={newBranchData.ourImpact_vn} onChange={handleInputChange} placeholder="Mô tả tác động (VN)..." />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Tác động của chúng tôi (Our Impact) - Tiếng Anh</Form.Label>
                  <Form.Control as="textarea" rows={3} name="ourImpact_en" value={newBranchData.ourImpact_en} onChange={handleInputChange} placeholder="Describe impact (EN)..." />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Giá trị cốt lõi (Core Value) - Tiếng Việt</Form.Label>
                  <Form.Control as="textarea" rows={3} name="coreValue_vn" value={newBranchData.coreValue_vn} onChange={handleInputChange} placeholder="Mô tả giá trị cốt lõi (VN)..." />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Giá trị cốt lõi (Core Value) - Tiếng Anh</Form.Label>
                  <Form.Control as="textarea" rows={3} name="coreValue_en" value={newBranchData.coreValue_en} onChange={handleInputChange} placeholder="Describe core value (EN)..." />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Số thành viên (Our Member)</Form.Label>
                  <Form.Control
                    type="number"
                    name="ourMember"
                    value={newBranchData.ourMember}
                    onChange={handleInputChange}
                    placeholder="Nhập số lượng thành viên..."
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <ImageValidationInfo />
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Giấy phép kinh doanh</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleNewImageChange}
                    className="mb-2"
                  />
                  {newBranchImagePreview && (
                    <div className="mt-2">
                      <img
                        src={newBranchImagePreview}
                        alt="Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                        className="rounded border"
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Lưu lại
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa chi nhánh */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEdit}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa chi nhánh</Modal.Title>
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
                    value={editBranchData.companyName_vn}
                    onChange={handleEditInputChange}
                    required
                    placeholder="Nhập tên công ty..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên công ty (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName_en"
                    value={editBranchData.companyName_en}
                    onChange={handleEditInputChange}
                    placeholder="Enter company name..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên ngắn</Form.Label>
                  <Form.Control
                    type="text"
                    name="shortName"
                    value={editBranchData.shortName}
                    onChange={handleEditInputChange}
                    placeholder="Nhập tên ngắn..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={editBranchData.phone}
                    onChange={handleEditInputChange}
                    placeholder="Nhập số điện thoại..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editBranchData.email}
                    onChange={handleEditInputChange}
                    placeholder="example@email.com"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Địa chỉ (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address_vn"
                    value={editBranchData.address_vn}
                    onChange={handleEditInputChange}
                    placeholder="Nhập địa chỉ..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Địa chỉ (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address_en"
                    value={editBranchData.address_en}
                    onChange={handleEditInputChange}
                    placeholder="Enter address..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Giới thiệu (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="aboutUs_vn"
                    value={editBranchData.aboutUs_vn}
                    onChange={handleEditInputChange}
                    placeholder="Nhập giới thiệu về chi nhánh..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Giới thiệu (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="aboutUs_en"
                    value={editBranchData.aboutUs_en}
                    onChange={handleEditInputChange}
                    placeholder="Enter branch description..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Triết lý (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="philosophy_vn"
                    value={editBranchData.philosophy_vn}
                    onChange={handleEditInputChange}
                    placeholder="Nhập triết lý công ty..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Triết lý (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="philosophy_en"
                    value={editBranchData.philosophy_en}
                    onChange={handleEditInputChange}
                    placeholder="Enter company philosophy..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Slogan (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="slogan_vn"
                    value={editBranchData.slogan_vn}
                    onChange={handleEditInputChange}
                    placeholder="Nhập slogan..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Slogan (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="slogan_en"
                    value={editBranchData.slogan_en}
                    onChange={handleEditInputChange}
                    placeholder="Enter slogan..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Google Map Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="googleMap"
                    value={editBranchData.googleMap}
                    onChange={handleEditInputChange}
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
                    value={editBranchData.facebook}
                    onChange={handleEditInputChange}
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
                    value={editBranchData.instagram}
                    onChange={handleEditInputChange}
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
                    value={editBranchData.youtube}
                    onChange={handleEditInputChange}
                    placeholder="https://youtube.com/..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isHeadOfice"
                    checked={editBranchData.isHeadOfice}
                    onChange={handleEditInputChange}
                    label="Đây là trụ sở chính"
                  />
                </Form.Group>
              </Col>
              
              {/* Các trường mới */}
     <Col md={12}>
                <Form.Group>
                  <Form.Label>Chúng tôi làm gì (What We Do) - Tiếng Việt</Form.Label>
                  <Form.Control as="textarea" rows={3} name="whatWeDo_vn" value={editBranchData.whatWeDo_vn} onChange={handleInputChange} placeholder="Mô tả những gì công ty làm (VN)..." />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Chúng tôi làm gì (What We Do) - Tiếng Anh</Form.Label>
                  <Form.Control as="textarea" rows={3} name="whatWeDo_en" value={editBranchData.whatWeDo_en} onChange={handleInputChange} placeholder="Describe what company does (EN)..." />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Tác động của chúng tôi (Our Impact) - Tiếng Việt</Form.Label>
                  <Form.Control as="textarea" rows={3} name="ourImpact_vn" value={editBranchData.ourImpact_vn} onChange={handleInputChange} placeholder="Mô tả tác động (VN)..." />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Tác động của chúng tôi (Our Impact) - Tiếng Anh</Form.Label>
                  <Form.Control as="textarea" rows={3} name="ourImpact_en" value={editBranchData.ourImpact_en} onChange={handleInputChange} placeholder="Describe impact (EN)..." />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Giá trị cốt lõi (Core Value) - Tiếng Việt</Form.Label>
                  <Form.Control as="textarea" rows={3} name="coreValue_vn" value={editBranchData.coreValue_vn} onChange={handleInputChange} placeholder="Mô tả giá trị cốt lõi (VN)..." />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Giá trị cốt lõi (Core Value) - Tiếng Anh</Form.Label>
                  <Form.Control as="textarea" rows={3} name="coreValue_en" value={editBranchData.coreValue_en} onChange={handleInputChange} placeholder="Describe core value (EN)..." />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Số thành viên (Our Member)</Form.Label>
                  <Form.Control
                    type="number"
                    name="ourMember"
                    value={editBranchData.ourMember}
                    onChange={handleEditInputChange}
                    placeholder="Nhập số lượng thành viên..."
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <ImageValidationInfo />
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Giấy phép kinh doanh</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="mb-2"
                  />
                  {editBranchImagePreview && (
                    <div className="mt-2">
                      <img
                        src={editBranchImagePreview}
                        alt="Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                        className="rounded border"
                      />
                    </div>
                  )}
                  {selectedBranch?.businessLicenseImage && !editBranchImagePreview && (
                    <div className="mt-2">
                      <p className="text-muted mb-1">Hình ảnh hiện tại:</p>
                      <img
                        src={`${apiUrlNoApi}${selectedBranch.businessLicenseImage}`}
                        alt="Current License"
                        style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                        className="rounded border"
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Cập nhật
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      {selectedBranch && (
        <Modal
          show={showDetailModal}
          onHide={handleCloseDetails}
          size="xl"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="d-flex align-items-center">
              <IconifyIcon icon="mdi:office-building" className="me-2 text-primary" />
              Chi tiết chi nhánh: {selectedBranch.companyName_vn}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4} className="text-center">
                <div className="mb-4">
                  {selectedBranch.businessLicenseImage ? (
                    <div className="mb-3 shadow rounded overflow-hidden" style={{ height: "200px" }}>
                      <img
                        src={`${apiUrlNoApi}${selectedBranch.businessLicenseImage}`}
                        alt="Business License"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  ) : (
                    <div className="bg-light rounded d-flex align-items-center justify-content-center mb-3 shadow" style={{ height: "200px" }}>
                      <IconifyIcon icon="mdi:office-building" className="fs-48 text-muted" />
                    </div>
                  )}
                  <h4 className="mb-2">{selectedBranch.companyName_vn}</h4>
                  {selectedBranch.companyName_en && (
                    <p className="text-muted mb-3">{selectedBranch.companyName_en}</p>
                  )}
                  <Badge bg="info" className="fs-6 px-3 py-2">
                    <IconifyIcon icon="mdi:tag" className="me-1" />
                    {selectedBranch.shortName}
                  </Badge>
                </div>
              </Col>
              <Col md={8}>
                <div className="ps-3">
                  <h5 className="mb-3 d-flex align-items-center">
                    <IconifyIcon icon="mdi:information" className="me-2 text-primary" />
                    Thông tin chi tiết
                  </h5>
                  <div className="row g-3 mb-4">
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">ID Chi nhánh</h6>
                        <p className="mb-0 fw-bold">#{selectedBranch.ID}</p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Tên ngắn</h6>
                        <Badge bg="info" className="fs-6">
                          {selectedBranch.shortName}
                        </Badge>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Số điện thoại</h6>
                        <p className="mb-0">
                          <IconifyIcon icon="mdi:phone" className="me-1 text-success" />
                          {selectedBranch.phone || "Chưa có"}
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Email</h6>
                        <p className="mb-0">
                          <IconifyIcon icon="mdi:email" className="me-1 text-primary" />
                          {selectedBranch.email || "Chưa có"}
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Ngày tạo</h6>
                        <p className="mb-0">
                          <IconifyIcon icon="mdi:calendar-plus" className="me-1 text-info" />
                          {formatDate(selectedBranch.createdDate)}
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Cập nhật lần cuối</h6>
                        <p className="mb-0">
                          <IconifyIcon icon="mdi:calendar-edit" className="me-1 text-warning" />
                          {formatDate(selectedBranch.updatedDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h5 className="mb-3 d-flex align-items-center">
                    <IconifyIcon icon="mdi:map-marker" className="me-2 text-danger" />
                    Địa chỉ
                  </h5>
                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <div className="border rounded p-3">
                        <h6 className="text-muted mb-2">
                          <IconifyIcon icon="mdi:flag-variant" className="me-1" />
                          Tiếng Việt
                        </h6>
                        <p className="mb-0">
                          {selectedBranch.address_vn || (
                            <span className="text-muted fst-italic">Chưa có địa chỉ</span>
                          )}
                        </p>
                      </div>
                    </div>
                    {selectedBranch.address_en && (
                      <div className="col-12">
                        <div className="border rounded p-3">
                          <h6 className="text-muted mb-2">
                            <IconifyIcon icon="mdi:flag" className="me-1" />
                            Tiếng Anh
                          </h6>
                          <p className="mb-0">{selectedBranch.address_en}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <h5 className="mb-3 d-flex align-items-center">
                    <IconifyIcon icon="mdi:text" className="me-2 text-info" />
                    Giới thiệu
                  </h5>
                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <div className="border rounded p-3">
                        <h6 className="text-muted mb-2">
                          <IconifyIcon icon="mdi:flag-variant" className="me-1" />
                          Tiếng Việt
                        </h6>
                        <p className="mb-0">
                          {selectedBranch.aboutUs_vn || (
                            <span className="text-muted fst-italic">Chưa có giới thiệu</span>
                          )}
                        </p>
                      </div>
                    </div>
                    {selectedBranch.aboutUs_en && (
                      <div className="col-12">
                        <div className="border rounded p-3">
                          <h6 className="text-muted mb-2">
                            <IconifyIcon icon="mdi:flag" className="me-1" />
                            Tiếng Anh
                          </h6>
                          <p className="mb-0">{selectedBranch.aboutUs_en}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <h5 className="mb-3 d-flex align-items-center">
                    <IconifyIcon icon="mdi:lightbulb" className="me-2 text-warning" />
                    Triết lý
                  </h5>
                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <div className="border rounded p-3">
                        <h6 className="text-muted mb-2">
                          <IconifyIcon icon="mdi:flag-variant" className="me-1" />
                          Tiếng Việt
                        </h6>
                        <p className="mb-0">
                          {selectedBranch.philosophy_vn || (
                            <span className="text-muted fst-italic">Chưa có triết lý</span>
                          )}
                        </p>
                      </div>
                    </div>
                    {selectedBranch.philosophy_en && (
                      <div className="col-12">
                        <div className="border rounded p-3">
                          <h6 className="text-muted mb-2">
                            <IconifyIcon icon="mdi:flag" className="me-1" />
                            Tiếng Anh
                          </h6>
                          <p className="mb-0">{selectedBranch.philosophy_en}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <h5 className="mb-3 d-flex align-items-center">
                    <IconifyIcon icon="mdi:format-quote-close" className="me-2 text-success" />
                    Slogan
                  </h5>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="border rounded p-3">
                        <h6 className="text-muted mb-2">
                          <IconifyIcon icon="mdi:flag-variant" className="me-1" />
                          Tiếng Việt
                        </h6>
                        <p className="mb-0">
                          {selectedBranch.slogan_vn || (
                            <span className="text-muted fst-italic">Chưa có slogan</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="border rounded p-3">
                        <h6 className="text-muted mb-2">
                          <IconifyIcon icon="mdi:flag" className="me-1" />
                          Tiếng Anh
                        </h6>
                        <p className="mb-0">
                          {selectedBranch.slogan_en || (
                            <span className="text-muted fst-italic">No slogan</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h5 className="mb-3 d-flex align-items-center">
                    <IconifyIcon icon="mdi:share-variant" className="me-2 text-primary" />
                    Mạng xã hội & Liên kết
                  </h5>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="border rounded p-3">
                        <h6 className="text-muted mb-2">
                          <IconifyIcon icon="mdi:map" className="me-1 text-danger" />
                          Google Map
                        </h6>
                        <p className="mb-0">
                          {selectedBranch.googleMap ? (
                            <a href={selectedBranch.googleMap} target="_blank" rel="noopener noreferrer" className="text-primary">
                              Xem trên Google Map
                            </a>
                          ) : (
                            <span className="text-muted fst-italic">Chưa có link</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="border rounded p-3">
                        <h6 className="text-muted mb-2">
                          <IconifyIcon icon="mdi:facebook" className="me-1 text-primary" />
                          Facebook
                        </h6>
                        <p className="mb-0">
                          {selectedBranch.facebook ? (
                            <a href={selectedBranch.facebook} target="_blank" rel="noopener noreferrer" className="text-primary">
                              Truy cập Facebook
                            </a>
                          ) : (
                            <span className="text-muted fst-italic">Chưa có link</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="border rounded p-3">
                        <h6 className="text-muted mb-2">
                          <IconifyIcon icon="mdi:instagram" className="me-1 text-danger" />
                          Instagram
                        </h6>
                        <p className="mb-0">
                          {selectedBranch.instagram ? (
                            <a href={selectedBranch.instagram} target="_blank" rel="noopener noreferrer" className="text-primary">
                              Truy cập Instagram
                            </a>
                          ) : (
                            <span className="text-muted fst-italic">Chưa có link</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="border rounded p-3">
                        <h6 className="text-muted mb-2">
                          <IconifyIcon icon="mdi:youtube" className="me-1 text-danger" />
                          YouTube
                        </h6>
                        <p className="mb-0">
                          {selectedBranch.youtube ? (
                            <a href={selectedBranch.youtube} target="_blank" rel="noopener noreferrer" className="text-primary">
                              Truy cập YouTube
                            </a>
                          ) : (
                            <span className="text-muted fst-italic">Chưa có link</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h5 className="mb-3 d-flex align-items-center">
                    <IconifyIcon icon="mdi:office-building" className="me-2 text-info" />
                    Thông tin bổ sung
                  </h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="border rounded p-3">
                        <h6 className="text-muted mb-2">
                          <IconifyIcon icon="mdi:home-city" className="me-1" />
                          Loại chi nhánh
                        </h6>
                        <p className="mb-0">
                          {selectedBranch.isHeadOfice ? (
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
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            
            {/* Các trường mới */}
            <Row className="mt-4">
              <Col md={12} className="mb-3">
                <div className="border rounded p-3 h-100">
                  <h6 className="text-muted mb-2">Chúng tôi làm gì (What We Do) - VN</h6>
                  <p className="mb-0">{selectedBranch.whatWeDo_vn || "Chưa có thông tin"}</p>
                </div>
              </Col>
              <Col md={12} className="mb-3">
                <div className="border rounded p-3 h-100">
                  <h6 className="text-muted mb-2">What We Do - EN</h6>
                  <p className="mb-0">{selectedBranch.whatWeDo_en || "No information"}</p>
                </div>
              </Col>
              <Col md={12} className="mb-3">
                <div className="border rounded p-3 h-100">
                  <h6 className="text-muted mb-2">Tác động (Our Impact) - VN</h6>
                  <p className="mb-0">{selectedBranch.ourImpact_vn || "Chưa có thông tin"}</p>
                </div>
              </Col>
              <Col md={12} className="mb-3">
                <div className="border rounded p-3 h-100">
                  <h6 className="text-muted mb-2">Our Impact - EN</h6>
                  <p className="mb-0">{selectedBranch.ourImpact_en || "No information"}</p>
                </div>
              </Col>
              <Col md={12} className="mb-3">
                <div className="border rounded p-3 h-100">
                  <h6 className="text-muted mb-2">Giá trị cốt lõi (Core Value) - VN</h6>
                  <p className="mb-0">{selectedBranch.coreValue_vn || "Chưa có thông tin"}</p>
                </div>
              </Col>
              <Col md={12} className="mb-3">
                <div className="border rounded p-3 h-100">
                  <h6 className="text-muted mb-2">Core Value - EN</h6>
                  <p className="mb-0">{selectedBranch.coreValue_en || "No information"}</p>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetails}>
              <IconifyIcon icon="mdi:close" className="me-1" />
              Đóng
            </Button>
            <Button variant="warning" onClick={() => {
              handleCloseDetails();
              handleShowEdit(selectedBranch);
            }}>
              <IconifyIcon icon="mdi:pencil" className="me-1" />
              Chỉnh sửa
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default BranchesPage;
