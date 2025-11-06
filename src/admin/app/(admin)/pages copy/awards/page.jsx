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
  Image,
} from "react-bootstrap";
import PageMetaData from "@/admin/components/PageTitle";
import IconifyIcon from "@/admin/components/wrappers/IconifyIcon";
import { awardsController } from "@/config/config";
import { apiUrlNoApi } from "@/config/config";

// Dữ liệu ban đầu cho các thẻ thống kê
const initialStatsData = [
  {
    name: "TỔNG GIẢI THƯỞNG",
    amount: 0,
    icon: "mdi:trophy",
    iconColor: "primary",
  },
  {
    name: "ĐANG HIỂN THỊ",
    amount: 0,
    icon: "mdi:eye-check",
    iconColor: "success",
  },
  {
    name: "ĐÃ ẨN",
    amount: 0,
    icon: "mdi:eye-off",
    iconColor: "warning",
  },
  {
    name: "GIẢI THƯỞNG MỚI",
    amount: 0,
    icon: "mdi:star",
    iconColor: "info",
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

const AwardsPage = () => {
  const [dataTable, setDataTable] = useState([]);
  const [statsData, setStatsData] = useState(initialStatsData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // State quản lý bộ lọc và phân trang
  const [filters, setFilters] = useState({
    keyword: "", // Tìm kiếm theo tên giải thưởng
    awardName_vn: "",
    awardName_en: "",
    isShow: "", // Lọc theo trạng thái hiển thị
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
      };

      // Chỉ thêm các tham số có giá trị
      if (currentFilters.keyword && currentFilters.keyword.trim() !== '') {
        params.keyword = currentFilters.keyword.trim();
      }
      if (currentFilters.awardName_vn && currentFilters.awardName_vn.trim() !== '') {
        params.awardName_vn = currentFilters.awardName_vn.trim();
      }
      if (currentFilters.awardName_en && currentFilters.awardName_en.trim() !== '') {
        params.awardName_en = currentFilters.awardName_en.trim();
      }
      if (currentFilters.isShow !== '') {
        params.isShow = currentFilters.isShow;
      }

      const response = await awardsController.list(params);
      console.log("=== AWARDS API DEBUG ===");
      console.log("Request params:", params);
      console.log("Full API Response:", response);
      console.log("Response type:", typeof response);
      console.log("Response keys:", response ? Object.keys(response) : 'null');
      console.log("Response.success:", response?.success);
      console.log("Response.data:", response?.data);
      console.log("Response.data type:", typeof response?.data);
      console.log("Response.data keys:", response?.data ? Object.keys(response.data) : 'null');
      console.log("Response.data.data:", response?.data?.data);
      console.log("Response.data.pagination:", response?.data?.pagination);
      console.log("=========================");

      // Xử lý dữ liệu từ API - kiểm tra cấu trúc response
      let awardsData = [];
      let totalItems = 0;
      let totalPages = 1;
      
      if (response && response.success && response.data) {
        // Cấu trúc response chuẩn với nested data và pagination
        if (response.data.data && Array.isArray(response.data.data)) {
          awardsData = response.data.data;
          if (response.data.pagination) {
            totalItems = response.data.pagination.totalItems || response.data.data.length;
            totalPages = response.data.pagination.totalPages || Math.ceil(totalItems / ITEMS_PER_PAGE);
          } else {
            totalItems = response.data.total || response.data.data.length;
            totalPages = response.data.totalPages || Math.ceil(totalItems / ITEMS_PER_PAGE);
          }
          console.log("Using nested data structure - awards count:", awardsData.length);
          console.log("Pagination info:", response.data.pagination);
        } else if (Array.isArray(response.data)) {
          // Fallback: response.data là array trực tiếp
          awardsData = response.data;
          totalItems = response.total || response.data.length;
          totalPages = response.totalPages || Math.ceil(totalItems / ITEMS_PER_PAGE);
          console.log("Using direct array format - awards count:", awardsData.length);
        } else if (response.data.items && Array.isArray(response.data.items)) {
          // Cấu trúc với items và pagination info
          awardsData = response.data.items;
          totalItems = response.data.total || response.data.items.length;
          totalPages = response.data.totalPages || Math.ceil(totalItems / ITEMS_PER_PAGE);
          console.log("Using items structure - awards count:", awardsData.length);
        }
        console.log("Total items:", totalItems, "Total pages:", totalPages);
      } else if (response && Array.isArray(response.data)) {
        // Fallback: response.data là array
        awardsData = response.data;
        totalItems = response.total || response.data.length;
        totalPages = response.totalPages || Math.ceil(totalItems / ITEMS_PER_PAGE);
        console.log("Using response.data format - awards count:", awardsData.length);
      } else if (Array.isArray(response)) {
        // Fallback: response trực tiếp là array
        awardsData = response;
        totalItems = response.length;
        totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        console.log("Using direct array format - awards count:", awardsData.length);
      } else {
        console.error("Unexpected response format:", response);
        awardsData = [];
        totalItems = 0;
        totalPages = 1;
      }

      console.log("Processed awards data:", awardsData);

      // Định dạng lại dữ liệu awards để hiển thị trên bảng
      const formattedData = awardsData.map((item) => ({
        ID: item.id,
        awardName_vn: item.awardName_vn,
        awardName_en: item.awardName_en,
        imageList: item.imageList,
        description_vn: item.description_vn,
        description_en: item.description_en,
        createdDate: item.createdDate,
        updatedDate: item.updatedDate,
        isShow: item.isShow,
      }));

      setDataTable(formattedData);

      // Cập nhật thông tin phân trang từ server
      setPagination((prev) => ({
        ...prev,
        totalPages: totalPages,
        totalItems: totalItems,
      }));

      // Cập nhật các thẻ thống kê - sử dụng totalItems từ server
      const totalAwards = totalItems || awardsData.length;
      const visibleAwards = awardsData.filter(award => award.isShow).length;
      const hiddenAwards = totalAwards - visibleAwards;
      const newAwards = awardsData.filter(award => {
        const createdDate = new Date(award.createdDate);
        const now = new Date();
        const diffTime = Math.abs(now - createdDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30; // Giải thưởng mới trong 30 ngày
      }).length;

      setStatsData((prev) => [
        { ...prev[0], amount: totalAwards },
        { ...prev[1], amount: visibleAwards },
        { ...prev[2], amount: hiddenAwards },
        { ...prev[3], amount: newAwards },
      ]);
    } catch (error) {
      setError(error.message);
      console.error("Lỗi khi tải dữ liệu giải thưởng:", error);
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

  // Tìm kiếm khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = { keyword: "", awardName_vn: "", awardName_en: "", isShow: "" };
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
  const [selectedAward, setSelectedAward] = useState(null);
  
  const initialFormState = {
    awardName_vn: "",
    awardName_en: "",
    imageList: null, // Thay đổi từ string thành File object
    description_vn: "",
    description_en: "",
    isShow: true,
  };
  
  const [newAwardData, setNewAwardData] = useState(initialFormState);
  const [editAwardData, setEditAwardData] = useState(initialFormState);
  
  // State cho validation errors
  const [validationErrors, setValidationErrors] = useState({});
  
  // State cho preview hình ảnh
  const [previewImage, setPreviewImage] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);
  
  // Helper function để validate form data
  const validateFormData = (data) => {
    const errors = {};
    
    // Validate tên giải thưởng tiếng Việt
    if (!data.awardName_vn || data.awardName_vn.trim() === '') {
      errors.awardName_vn = 'Tên giải thưởng (Tiếng Việt) là bắt buộc';
    } else if (data.awardName_vn.length < 3) {
      errors.awardName_vn = 'Tên giải thưởng phải có ít nhất 3 ký tự';
    }
    
    // Validate tên giải thưởng tiếng Anh
    if (data.awardName_en && data.awardName_en.length < 3) {
      errors.awardName_en = 'Tên giải thưởng tiếng Anh phải có ít nhất 3 ký tự';
    }
    
    // Validate mô tả
    if (data.description_vn && data.description_vn.length > 500) {
      errors.description_vn = 'Mô tả không được vượt quá 500 ký tự';
    }
    
    if (data.description_en && data.description_en.length > 500) {
      errors.description_en = 'Mô tả tiếng Anh không được vượt quá 500 ký tự';
    }
    
    // Validate file ảnh
    if (data.imageList instanceof File) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(data.imageList.type)) {
        errors.imageList = 'Chỉ chấp nhận file ảnh JPG, PNG, GIF';
      }
      
      if (data.imageList.size > 5 * 1024 * 1024) { // 5MB
        errors.imageList = 'Kích thước file không được vượt quá 5MB';
      }
    }
    
    return errors;
  };
  const createFormData = (data) => {
    const formData = new FormData();
    
    // Thêm các trường dữ liệu vào FormData
    Object.keys(data).forEach(key => {
      if (key === 'imageList' && data[key] instanceof File) {
        formData.append('imageList', data[key]);
      } else if (key !== 'imageList') {
        formData.append(key, data[key]);
      }
    });
    
    return formData;
  };

  // Helper function để debug FormData
  const debugFormData = (formData, action) => {
    console.log(`=== ${action} FORMDATA ===`);
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? `File: ${value.name}` : value);
    }
    console.log('=========================');
  };

  // Xử lý việc nhập liệu trong form
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    // Clear validation error khi user nhập
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (files && files[0]) {
      // Xử lý file upload
      const file = files[0];
      
      // Validate file
      const errors = validateFormData({ imageList: file });
      if (errors.imageList) {
        setValidationErrors(prev => ({ ...prev, imageList: errors.imageList }));
        return;
      }
      
      setNewAwardData({ 
        ...newAwardData, 
        [name]: file 
      });
      
      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    } else if (type === 'checkbox') {
      setNewAwardData({ 
        ...newAwardData, 
        [name]: checked 
      });
    } else {
      setNewAwardData({ 
        ...newAwardData, 
        [name]: value 
      });
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    // Clear validation error khi user nhập
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (files && files[0]) {
      // Xử lý file upload
      const file = files[0];
      
      // Validate file
      const errors = validateFormData({ imageList: file });
      if (errors.imageList) {
        setValidationErrors(prev => ({ ...prev, imageList: errors.imageList }));
        return;
      }
      
      setEditAwardData({ 
        ...editAwardData, 
        [name]: file 
      });
      
      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => setEditPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    } else if (type === 'checkbox') {
      setEditAwardData({ 
        ...editAwardData, 
        [name]: checked 
      });
    } else {
      setEditAwardData({ 
        ...editAwardData, 
        [name]: value 
      });
    }
  };

  // Xử lý khi submit form tạo mới award
  const handleCreateAward = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const errors = validateFormData(newAwardData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setActionLoading(prev => ({ ...prev, create: true }));
    try {
      // Tạo FormData từ dữ liệu form
      const formDataToSend = createFormData(newAwardData);
      
      // Debug FormData
      debugFormData(formDataToSend, 'CREATE AWARD');

      await awardsController.create(formDataToSend);
      alert("Tạo giải thưởng thành công!");
      setShowCreateModal(false);
      setNewAwardData(initialFormState);
      setPreviewImage(null);
      setValidationErrors({});
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi tạo giải thưởng:", error);
      alert(`Có lỗi xảy ra: ${error.message}`);
    } finally {
      setActionLoading(prev => ({ ...prev, create: false }));
    }
  };

  // Xử lý khi submit form cập nhật award
  const handleUpdateAward = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const errors = validateFormData(editAwardData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setActionLoading(prev => ({ ...prev, update: true }));
    try {
      // Tạo FormData từ dữ liệu form
      const formDataToSend = createFormData(editAwardData);
      
      // Debug FormData
      debugFormData(formDataToSend, 'UPDATE AWARD');

      await awardsController.update(selectedAward.ID, formDataToSend);
      alert("Cập nhật giải thưởng thành công!");
      setShowEditModal(false);
      setEditAwardData(initialFormState);
      setEditPreviewImage(null);
      setSelectedAward(null);
      setValidationErrors({});
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi cập nhật giải thưởng:", error);
      alert(`Có lỗi xảy ra: ${error.message}`);
    } finally {
      setActionLoading(prev => ({ ...prev, update: false }));
    }
  };

  // Xử lý xóa award
  const handleDeleteAward = async (awardId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giải thưởng này?")) {
      setActionLoading(prev => ({ ...prev, [`delete-${awardId}`]: true }));
      try {
        await awardsController.remove(awardId);
        alert("Xóa giải thưởng thành công!");
        handleClearFilters();
      } catch (error) {
        console.error("Lỗi khi xóa giải thưởng:", error);
        alert(`Có lỗi xảy ra: ${error.message}`);
      } finally {
        setActionLoading(prev => ({ ...prev, [`delete-${awardId}`]: false }));
      }
    }
  };

  // Xử lý bật/tắt hiển thị award
  const handleToggleShow = async (awardId) => {
    setActionLoading(prev => ({ ...prev, [`toggle-${awardId}`]: true }));
    try {
      await awardsController.toggle(awardId);
      alert("Cập nhật trạng thái hiển thị thành công!");
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert(`Có lỗi xảy ra: ${error.message}`);
    } finally {
      setActionLoading(prev => ({ ...prev, [`toggle-${awardId}`]: false }));
    }
  };

  // Mở modal xem chi tiết
  const handleShowDetails = (award) => {
    setSelectedAward(award);
    setShowDetailModal(true);
  };

  // Mở modal chỉnh sửa
  const handleShowEdit = (award) => {
    setSelectedAward(award);
    setEditAwardData({
      awardName_vn: award.awardName_vn,
      awardName_en: award.awardName_en,
      imageList: null, // Reset file input
      description_vn: award.description_vn,
      description_en: award.description_en,
      isShow: award.isShow,
    });
    setEditPreviewImage(null); // Reset preview
    setShowEditModal(true);
  };

  // Đóng modal
  const handleCloseDetails = () => {
    setShowDetailModal(false);
    setSelectedAward(null);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedAward(null);
    setEditAwardData(initialFormState);
    setEditPreviewImage(null);
    setValidationErrors({});
  };

  const handleCloseCreate = () => {
    setShowCreateModal(false);
    setNewAwardData(initialFormState);
    setPreviewImage(null);
    setValidationErrors({});
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
      <PageMetaData title="Quản lý giải thưởng" />

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
              Danh sách giải thưởng ({pagination.totalItems || dataTable.length} giải thưởng)
              {filters.keyword && (
                <span className="text-muted ms-2">
                  - Tìm kiếm: "{filters.keyword}"
                </span>
              )}
            </h5>
            <Button 
              variant="primary" 
              onClick={() => setShowCreateModal(true)}
              disabled={loading}
            >
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
                placeholder="Tên giải thưởng..."
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                onKeyPress={handleKeyPress}
              />
            </Col>
            <Col xl={3} md={6}>
              <Form.Control
                type="text"
                placeholder="Tên giải thưởng (VN)..."
                name="awardName_vn"
                value={filters.awardName_vn}
                onChange={handleFilterChange}
                onKeyPress={handleKeyPress}
              />
            </Col>
            <Col xl={3} md={6}>
              <Form.Select
                name="isShow"
                value={filters.isShow}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Đang hiển thị</option>
                <option value="false">Đã ẩn</option>
              </Form.Select>
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
                  disabled={loading}
                >
                  Xóa lọc
                </Button>
              </div>
            </Col>
          </Form>
        </CardBody>
      </Card>

      {/* Bảng dữ liệu awards */}
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
                <th>Hình ảnh</th>
                <th>Tên giải thưởng</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {dataTable.length > 0 ? (
                dataTable.map((award) => (
                  <tr key={award.ID}>
                    <td>
                      <strong>#{award.ID}</strong>
                    </td>
                    <td>
                      {award.imageList ? (
                        <Image
                          src={`${apiUrlNoApi}${award.imageList}`}
                          rounded
                          width={50}
                          height={50}
                          className="object-fit-cover"
                        />
                      ) : (
                        <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                          <IconifyIcon icon="mdi:image-outline" className="text-muted" />
                        </div>
                      )}
                    </td>
                    <td>
                      <div>
                        <h6 className="mb-0">{award.awardName_vn}</h6>
                        <small className="text-muted">{award.awardName_en}</small>
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: "200px" }}>
                        <small className="text-muted text-truncate d-block">
                          {award.description_vn}
                        </small>
                      </div>
                    </td>
                    <td>
                      <Badge
                        pill
                        bg={award.isShow ? "success-subtle" : "warning-subtle"}
                        className={award.isShow ? "text-success" : "text-warning"}
                      >
                        {award.isShow ? "Hiển thị" : "Ẩn"}
                      </Badge>
                    </td>
                    <td>{formatDate(award.createdDate)}</td>
                    <td className="text-center">
                      <Button
                        size="sm"
                        variant="primary"
                        className="me-1"
                        onClick={() => handleShowDetails(award)}
                        disabled={actionLoading[`view-${award.ID}`]}
                      >
                        {actionLoading[`view-${award.ID}`] ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <IconifyIcon icon="mdi:eye" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="warning"
                        className="me-1"
                        onClick={() => handleShowEdit(award)}
                        disabled={actionLoading[`edit-${award.ID}`]}
                      >
                        {actionLoading[`edit-${award.ID}`] ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <IconifyIcon icon="mdi:pencil" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant={award.isShow ? "warning" : "success"}
                        className="me-1"
                        onClick={() => handleToggleShow(award.ID)}
                        title={award.isShow ? "Ẩn giải thưởng" : "Hiển thị giải thưởng"}
                        disabled={actionLoading[`toggle-${award.ID}`]}
                      >
                        {actionLoading[`toggle-${award.ID}`] ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <IconifyIcon icon={award.isShow ? "mdi:eye-off" : "mdi:eye"} />
                        )}
                      </Button>
                      {/* <Button
                        size="sm"
                        variant="danger"
                        className="me-1"
                        onClick={() => handleDeleteAward(award.ID)}
                        disabled={actionLoading[`delete-${award.ID}`]}
                      >
                        {actionLoading[`delete-${award.ID}`] ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <IconifyIcon icon="mdi:delete-outline" />
                        )}
                      </Button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center">
                      <IconifyIcon icon="mdi:trophy-off" className="fs-48 text-muted mb-2" />
                      <h5 className="text-muted">Không tìm thấy dữ liệu phù hợp</h5>
                      <p className="text-muted mb-0">Thử thay đổi bộ lọc hoặc tạo giải thưởng mới</p>
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
                    Hiển thị {((pagination.currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(pagination.currentPage * ITEMS_PER_PAGE, pagination.totalItems)} trong tổng số {pagination.totalItems} giải thưởng
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

      {/* Modal tạo award mới */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tạo giải thưởng mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateAward}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên giải thưởng (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="awardName_vn"
                    value={newAwardData.awardName_vn}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tên giải thưởng..."
                    isInvalid={!!validationErrors.awardName_vn}
                  />
                  {validationErrors.awardName_vn && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.awardName_vn}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên giải thưởng (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="awardName_en"
                    value={newAwardData.awardName_en}
                    onChange={handleInputChange}
                    placeholder="Enter award name..."
                    isInvalid={!!validationErrors.awardName_en}
                  />
                  {validationErrors.awardName_en && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.awardName_en}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Hình ảnh giải thưởng</Form.Label>
                  {previewImage && (
                    <div className="mb-2">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="text-muted small">Hình ảnh đã chọn</div>
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    name="imageList"
                    onChange={handleInputChange}
                    accept="image/*"
                    isInvalid={!!validationErrors.imageList}
                  />
                  {validationErrors.imageList && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.imageList}
                    </Form.Control.Feedback>
                  )}
                  <Form.Text className="text-muted">
                    Chọn hình ảnh cho giải thưởng (JPG, PNG, GIF - tối đa 5MB)
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_vn"
                    value={newAwardData.description_vn}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả giải thưởng..."
                    isInvalid={!!validationErrors.description_vn}
                  />
                  {validationErrors.description_vn && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.description_vn}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_en"
                    value={newAwardData.description_en}
                    onChange={handleInputChange}
                    placeholder="Enter award description..."
                    isInvalid={!!validationErrors.description_en}
                  />
                  {validationErrors.description_en && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.description_en}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isShow"
                    label="Hiển thị giải thưởng"
                    checked={newAwardData.isShow}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseCreate}
              disabled={actionLoading.create}
            >
              Hủy
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={actionLoading.create}
            >
              {actionLoading.create ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đang lưu...
                </>
              ) : (
                'Lưu lại'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa award */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEdit}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa giải thưởng</Modal.Title>
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
                    value={editAwardData.awardName_vn}
                    onChange={handleEditInputChange}
                    required
                    placeholder="Nhập tên giải thưởng..."
                    isInvalid={!!validationErrors.awardName_vn}
                  />
                  {validationErrors.awardName_vn && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.awardName_vn}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên giải thưởng (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="awardName_en"
                    value={editAwardData.awardName_en}
                    onChange={handleEditInputChange}
                    placeholder="Enter award name..."
                    isInvalid={!!validationErrors.awardName_en}
                  />
                  {validationErrors.awardName_en && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.awardName_en}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Hình ảnh giải thưởng</Form.Label>
                  {selectedAward?.imageList && (
                    <div className="mb-2">
                      <Image
                        src={`${apiUrlNoApi}${selectedAward.imageList}`}
                        alt="Current award image"
                        width={100}
                        height={100}
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="text-muted small">Hình ảnh hiện tại</div>
                    </div>
                  )}
                  {editPreviewImage && (
                    <div className="mb-2">
                      <Image
                        src={editPreviewImage}
                        alt="New preview"
                        width={100}
                        height={100}
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="text-muted small">Hình ảnh mới</div>
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    name="imageList"
                    onChange={handleEditInputChange}
                    accept="image/*"
                    isInvalid={!!validationErrors.imageList}
                  />
                  {validationErrors.imageList && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.imageList}
                    </Form.Control.Feedback>
                  )}
                  <Form.Text className="text-muted">
                    Chọn hình ảnh mới cho giải thưởng (JPG, PNG, GIF - tối đa 5MB)
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_vn"
                    value={editAwardData.description_vn}
                    onChange={handleEditInputChange}
                    placeholder="Nhập mô tả giải thưởng..."
                    isInvalid={!!validationErrors.description_vn}
                  />
                  {validationErrors.description_vn && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.description_vn}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_en"
                    value={editAwardData.description_en}
                    onChange={handleEditInputChange}
                    placeholder="Enter award description..."
                    isInvalid={!!validationErrors.description_en}
                  />
                  {validationErrors.description_en && (
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.description_en}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isShow"
                    label="Hiển thị giải thưởng"
                    checked={editAwardData.isShow}
                    onChange={handleEditInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={handleCloseEdit}
              disabled={actionLoading.update}
            >
              Hủy
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={actionLoading.update}
            >
              {actionLoading.update ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đang cập nhật...
                </>
              ) : (
                'Cập nhật'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      {selectedAward && (
        <Modal
          show={showDetailModal}
          onHide={handleCloseDetails}
          size="xl"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="d-flex align-items-center">
              <IconifyIcon icon="mdi:trophy" className="me-2 text-warning" />
              Chi tiết giải thưởng: {selectedAward.awardName_vn}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4} className="text-center">
                <div className="mb-4">
                  {selectedAward.imageList ? (
                    <Image
                      src={`${apiUrlNoApi}${selectedAward.imageList}`}
                      fluid
                      className="mb-3 rounded shadow"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="bg-light rounded d-flex align-items-center justify-content-center mb-3 shadow" style={{ height: "300px" }}>
                      <IconifyIcon icon="mdi:image-outline" className="fs-48 text-muted" />
                    </div>
                  )}
                  <h4 className="mb-2">{selectedAward.awardName_vn}</h4>
                  {selectedAward.awardName_en && (
                    <p className="text-muted mb-3">{selectedAward.awardName_en}</p>
                  )}
                  <Badge
                    bg={selectedAward.isShow ? "success" : "warning"}
                    className="fs-6 px-3 py-2"
                  >
                    <IconifyIcon icon={selectedAward.isShow ? "mdi:eye" : "mdi:eye-off"} className="me-1" />
                    {selectedAward.isShow ? "Đang hiển thị" : "Đã ẩn"}
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
                        <h6 className="text-muted mb-2">ID Giải thưởng</h6>
                        <p className="mb-0 fw-bold">#{selectedAward.ID}</p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Trạng thái</h6>
                        <Badge bg={selectedAward.isShow ? "success" : "warning"} className="fs-6">
                          {selectedAward.isShow ? "Hiển thị" : "Ẩn"}
                        </Badge>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Ngày tạo</h6>
                        <p className="mb-0">{formatDate(selectedAward.createdDate)}</p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Cập nhật lần cuối</h6>
                        <p className="mb-0">{formatDate(selectedAward.updatedDate)}</p>
                      </div>
                    </div>
                  </div>

                  <h5 className="mb-3 d-flex align-items-center">
                    <IconifyIcon icon="mdi:text" className="me-2 text-info" />
                    Mô tả
                  </h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="border rounded p-3">
                        <h6 className="text-muted mb-2">
                          <IconifyIcon icon="mdi:flag-variant" className="me-1" />
                          Tiếng Việt
                        </h6>
                        <p className="mb-0">
                          {selectedAward.description_vn || (
                            <span className="text-muted fst-italic">Chưa có mô tả</span>
                          )}
                        </p>
                      </div>
                    </div>
                    {selectedAward.description_en && (
                      <div className="col-12">
                        <div className="border rounded p-3">
                          <h6 className="text-muted mb-2">
                            <IconifyIcon icon="mdi:flag" className="me-1" />
                            Tiếng Anh
                          </h6>
                          <p className="mb-0">{selectedAward.description_en}</p>
                        </div>
                      </div>
                    )}
                  </div>
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
              handleShowEdit(selectedAward);
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

export default AwardsPage;
