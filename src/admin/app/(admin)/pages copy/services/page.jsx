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
import { servicesController } from "@/config/config";
import { apiUrlNoApi } from "@/config/config";

// Dữ liệu ban đầu cho các thẻ thống kê
const initialStatsData = [
  {
    name: "TỔNG DỊCH VỤ",
    amount: 0,
    icon: "mdi:cog",
    iconColor: "primary",
  },
  {
    name: "ĐANG HOẠT ĐỘNG",
    amount: 0,
    icon: "mdi:check-circle",
    iconColor: "success",
  },
  {
    name: "ĐANG HIỂN THỊ",
    amount: 0,
    icon: "mdi:eye-check",
    iconColor: "info",
  },
  {
    name: "ĐÃ NGỪNG",
    amount: 0,
    icon: "mdi:stop-circle",
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

const ServicesPage = () => {
  const [dataTable, setDataTable] = useState([]);
  const [statsData, setStatsData] = useState(initialStatsData);

  // State quản lý bộ lọc và phân trang
  const [filters, setFilters] = useState({
    keyword: "", // Tìm kiếm theo tên dịch vụ
    serviceName_vn: "",
    serviceName_en: "",
    status: "", // Lọc theo trạng thái Active/Inactive
    isShow: "", // Lọc theo trạng thái hiển thị
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  // Hàm gọi API để lấy dữ liệu
  const fetchData = useCallback(async (page, currentFilters) => {
    try {
      const params = {
        page: page,
        limit: ITEMS_PER_PAGE,
        keyword: currentFilters.keyword,
        serviceName_vn: currentFilters.serviceName_vn,
        serviceName_en: currentFilters.serviceName_en,
        status: currentFilters.status,
        isShow: currentFilters.isShow,
      };

      const response = await servicesController.list(params);
      console.log("API Response:", response);

      // Xử lý dữ liệu từ API - có thể là response.data hoặc response trực tiếp
      let servicesData = [];
      if (response.data && Array.isArray(response.data)) {
        servicesData = response.data;
      } else if (Array.isArray(response)) {
        servicesData = response;
      } else {
        console.error("Unexpected response format:", response);
        servicesData = [];
      }

      console.log("Processed services data:", servicesData);

      // Định dạng lại dữ liệu services để hiển thị trên bảng
      const formattedData = servicesData.map((item) => ({
        ID: item.id,
        serviceName_vn: item.serviceName_vn,
        serviceName_en: item.serviceName_en,
        serviceImage: item.serviceImage,
        description_vn: item.description_vn,
        description_en: item.description_en,
        createDate: item.createDate,
        updateDate: item.updateDate,
        isShow: item.isShow,
        status: item.status,
      }));

      setDataTable(formattedData);

      // Cập nhật thông tin phân trang
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(servicesData.length / ITEMS_PER_PAGE) || 1,
      }));

      // Cập nhật các thẻ thống kê
      const totalServices = servicesData.length;
      const activeServices = servicesData.filter(service => service.status === 'Active').length;
      const visibleServices = servicesData.filter(service => service.isShow).length;
      const inactiveServices = totalServices - activeServices;

      setStatsData((prev) => [
        { ...prev[0], amount: totalServices },
        { ...prev[1], amount: activeServices },
        { ...prev[2], amount: visibleServices },
        { ...prev[3], amount: inactiveServices },
      ]);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dịch vụ:", error);
      setDataTable([]);
      setStatsData(initialStatsData);
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
    const clearedFilters = { keyword: "", serviceName_vn: "", serviceName_en: "", status: "", isShow: "" };
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
  const [selectedService, setSelectedService] = useState(null);
  
  const initialFormState = {
    serviceName_vn: "",
    serviceName_en: "",
    serviceImage: null, // Thay đổi từ string thành File object
    description_vn: "",
    description_en: "",
    isShow: true,
    status: "Active",
  };
  
  const [newServiceData, setNewServiceData] = useState(initialFormState);
  const [editServiceData, setEditServiceData] = useState(initialFormState);
  
  // State cho preview hình ảnh
  const [previewImage, setPreviewImage] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);

  // Xử lý việc nhập liệu trong form
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (files && files[0]) {
      // Xử lý file upload
      const file = files[0];
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh hợp lệ!');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('Kích thước file không được vượt quá 5MB!');
        return;
      }
      
      setNewServiceData({ 
        ...newServiceData, 
        [name]: file 
      });
      
      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    } else if (type === 'checkbox') {
      setNewServiceData({ 
        ...newServiceData, 
        [name]: checked 
      });
    } else {
      setNewServiceData({ 
        ...newServiceData, 
        [name]: value 
      });
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (files && files[0]) {
      // Xử lý file upload
      const file = files[0];
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh hợp lệ!');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('Kích thước file không được vượt quá 5MB!');
        return;
      }
      
      setEditServiceData({ 
        ...editServiceData, 
        [name]: file 
      });
      
      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => setEditPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    } else if (type === 'checkbox') {
      setEditServiceData({ 
        ...editServiceData, 
        [name]: checked 
      });
    } else {
      setEditServiceData({ 
        ...editServiceData, 
        [name]: value 
      });
    }
  };

  // Xử lý khi submit form tạo mới service
  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      // Tạo FormData để gửi multipart/form-data
      const formDataToSend = new FormData();
      
      // Append các trường dữ liệu
      formDataToSend.append("serviceName_vn", newServiceData.serviceName_vn);
      formDataToSend.append("serviceName_en", newServiceData.serviceName_en);
      formDataToSend.append("description_vn", newServiceData.description_vn);
      formDataToSend.append("description_en", newServiceData.description_en);
      formDataToSend.append("status", newServiceData.status);
      formDataToSend.append("isShow", newServiceData.isShow);
      
      // Append file ảnh nếu có
      if (newServiceData.serviceImage) {
        formDataToSend.append("serviceImage", newServiceData.serviceImage);
      }

      // Debug FormData
      console.log("=== CREATE SERVICE FORMDATA ===");
      console.log("FormData entries:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }

      await servicesController.create(formDataToSend);
      alert("Tạo dịch vụ thành công!");
      setShowCreateModal(false);
      setNewServiceData(initialFormState);
      setPreviewImage(null);
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi tạo dịch vụ:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Xử lý khi submit form cập nhật service
  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      // Tạo FormData để gửi multipart/form-data
      const formDataToSend = new FormData();
      
      // Append các trường dữ liệu
      formDataToSend.append("serviceName_vn", editServiceData.serviceName_vn);
      formDataToSend.append("serviceName_en", editServiceData.serviceName_en);
      formDataToSend.append("description_vn", editServiceData.description_vn);
      formDataToSend.append("description_en", editServiceData.description_en);
      formDataToSend.append("status", editServiceData.status);
      formDataToSend.append("isShow", editServiceData.isShow);
      
      // Append file ảnh nếu có
      if (editServiceData.serviceImage) {
        formDataToSend.append("serviceImage", editServiceData.serviceImage);
      }

      // Debug FormData
      console.log("=== UPDATE SERVICE FORMDATA ===");
      console.log("FormData entries:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }

      await servicesController.update(selectedService.ID, formDataToSend);
      alert("Cập nhật dịch vụ thành công!");
      setShowEditModal(false);
      setEditServiceData(initialFormState);
      setEditPreviewImage(null);
      setSelectedService(null);
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi cập nhật dịch vụ:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Xử lý xóa service
  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
      try {
        await servicesController.remove(serviceId);
        alert("Xóa dịch vụ thành công!");
        handleClearFilters();
      } catch (error) {
        console.error("Lỗi khi xóa dịch vụ:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại.");
      }
    }
  };

  // Xử lý bật/tắt hiển thị service
  const handleToggleShow = async (serviceId) => {
    try {
      await servicesController.toggle(serviceId);
      alert("Cập nhật trạng thái hiển thị thành công!");
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hiển thị:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Mở modal xem chi tiết
  const handleShowDetails = (service) => {
    setSelectedService(service);
    setShowDetailModal(true);
  };

  // Mở modal chỉnh sửa
  const handleShowEdit = (service) => {
    setSelectedService(service);
    setEditServiceData({
      serviceName_vn: service.serviceName_vn,
      serviceName_en: service.serviceName_en,
      serviceImage: null, // Reset file input
      description_vn: service.description_vn,
      description_en: service.description_en,
      isShow: service.isShow,
      status: service.status,
    });
    setEditPreviewImage(null); // Reset preview
    setShowEditModal(true);
  };

  // Đóng modal
  const handleCloseDetails = () => {
    setShowDetailModal(false);
    setSelectedService(null);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedService(null);
    setEditServiceData(initialFormState);
    setEditPreviewImage(null);
  };

  const handleCloseCreate = () => {
    setShowCreateModal(false);
    setNewServiceData(initialFormState);
    setPreviewImage(null);
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
      <PageMetaData title="Quản lý dịch vụ" />

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
            <h5 className="mb-0">Danh sách dịch vụ ({dataTable.length} dịch vụ)</h5>
            <div className="d-flex gap-2">
           
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                <IconifyIcon icon="mdi:plus" className="me-1" />
                Tạo mới
              </Button>
            </div>
          </div>
          <Form className="row g-3 align-items-center">
            <Col xl={3} md={6}>
              <Form.Control
                type="text"
                placeholder="Tên dịch vụ..."
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xl={3} md={6}>
              <Form.Control
                type="text"
                placeholder="Tên dịch vụ (VN)..."
                name="serviceName_vn"
                value={filters.serviceName_vn}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xl={3} md={6}>
              <Form.Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Ngừng hoạt động</option>
              </Form.Select>
            </Col>
            <Col xl={3} md={6}>
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  className="flex-grow-1"
                  onClick={handleSearch}
                >
                  Tìm kiếm
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

      {/* Bảng dữ liệu services */}
      <Card className="mt-3">
        <CardBody>
          <Table responsive hover className="text-nowrap align-middle">
            <thead className="table-light">
              <tr>
                <th>#ID</th>
                <th>Hình ảnh</th>
                <th>Tên dịch vụ</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Hiển thị</th>
                <th>Ngày tạo</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {dataTable.length > 0 ? (
                dataTable.map((service, index) => (
                  <tr key={service.ID || index}>
                    <td>
                      <strong>#{service.ID}</strong>
                    </td>
                    <td>
                      {service.serviceImage && service.serviceImage !== "services" ? (
                        <Image
                          src={`${apiUrlNoApi}${service.serviceImage}`}
                          rounded
                          width={50}
                          height={50}
                          className="object-fit-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="bg-light rounded d-flex align-items-center justify-content-center" 
                        style={{ width: 50, height: 50, display: service.serviceImage && service.serviceImage !== "services" ? 'none' : 'flex' }}
                      >
                        <IconifyIcon icon="mdi:image-outline" className="text-muted" />
                      </div>
                    </td>
                    <td>
                      <div>
                        <h6 className="mb-0">{service.serviceName_vn || "N/A"}</h6>
                        <small className="text-muted">{service.serviceName_en || "N/A"}</small>
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: "200px" }}>
                        <small className="text-muted text-truncate d-block">
                          {service.description_vn || "Không có mô tả"}
                        </small>
                      </div>
                    </td>
                    <td>
                      <Badge
                        pill
                        bg={service.status === 'Active' ? "success-subtle" : "warning-subtle"}
                        className={service.status === 'Active' ? "text-success" : "text-warning"}
                      >
                        {service.status === 'Active' ? "Hoạt động" : "Ngừng"}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        pill
                        bg={service.isShow ? "info-subtle" : "secondary-subtle"}
                        className={service.isShow ? "text-info" : "text-secondary"}
                      >
                        {service.isShow ? "Hiển thị" : "Ẩn"}
                      </Badge>
                    </td>
                    <td>{formatDate(service.createDate)}</td>
                    <td className="text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleShowDetails(service)}
                          title="Xem chi tiết"
                        >
                          <IconifyIcon icon="mdi:eye" />
                        </Button>
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleShowEdit(service)}
                          title="Chỉnh sửa"
                        >
                          <IconifyIcon icon="mdi:pencil" />
                        </Button>
                        <Button
                          size="sm"
                          variant={service.isShow ? "secondary" : "info"}
                          onClick={() => handleToggleShow(service.ID)}
                          title={service.isShow ? "Ẩn dịch vụ" : "Hiển thị dịch vụ"}
                        >
                          <IconifyIcon icon={service.isShow ? "mdi:eye-off" : "mdi:eye"} />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteService(service.ID)}
                          title="Xóa dịch vụ"
                        >
                          <IconifyIcon icon="mdi:delete-outline" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center">
                      <IconifyIcon icon="mdi:database-off" className="fs-48 text-muted mb-2" />
                      <h5 className="text-muted">Không tìm thấy dữ liệu phù hợp</h5>
                      <p className="text-muted mb-0">Thử thay đổi bộ lọc hoặc tạo dịch vụ mới</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Thanh phân trang */}
          {pagination.totalPages > 1 && (
            <Pagination className="justify-content-end mt-3 mb-0">
              <Pagination.Prev
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
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
                  >
                    {item}
                  </Pagination.Item>
                );
              })}

              <Pagination.Next
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              />
            </Pagination>
          )}
        </CardBody>
      </Card>

      {/* Modal tạo service mới */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tạo dịch vụ mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateService}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên dịch vụ (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="serviceName_vn"
                    value={newServiceData.serviceName_vn}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tên dịch vụ..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên dịch vụ (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="serviceName_en"
                    value={newServiceData.serviceName_en}
                    onChange={handleInputChange}
                    placeholder="Enter service name..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Hình ảnh dịch vụ</Form.Label>
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
                    name="serviceImage"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">
                    Chọn hình ảnh cho dịch vụ (JPG, PNG, GIF - tối đa 5MB)
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
                    value={newServiceData.description_vn}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả dịch vụ..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_en"
                    value={newServiceData.description_en}
                    onChange={handleInputChange}
                    placeholder="Enter service description..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    name="status"
                    value={newServiceData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Ngừng hoạt động</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isShow"
                    label="Hiển thị dịch vụ"
                    checked={newServiceData.isShow}
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
            >
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Lưu lại
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa service */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEdit}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa dịch vụ</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateService}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên dịch vụ (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="serviceName_vn"
                    value={editServiceData.serviceName_vn}
                    onChange={handleEditInputChange}
                    required
                    placeholder="Nhập tên dịch vụ..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên dịch vụ (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="serviceName_en"
                    value={editServiceData.serviceName_en}
                    onChange={handleEditInputChange}
                    placeholder="Enter service name..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Hình ảnh dịch vụ</Form.Label>
                  {selectedService?.serviceImage && selectedService.serviceImage !== "services" && (
                    <div className="mb-2">
                      <Image
                        src={`${apiUrlNoApi}${selectedService.serviceImage}`}
                        alt="Current service image"
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
                    name="serviceImage"
                    onChange={handleEditInputChange}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">
                    Chọn hình ảnh mới cho dịch vụ (JPG, PNG, GIF - tối đa 5MB)
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
                    value={editServiceData.description_vn}
                    onChange={handleEditInputChange}
                    placeholder="Nhập mô tả dịch vụ..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_en"
                    value={editServiceData.description_en}
                    onChange={handleEditInputChange}
                    placeholder="Enter service description..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    name="status"
                    value={editServiceData.status}
                    onChange={handleEditInputChange}
                  >
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Ngừng hoạt động</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isShow"
                    label="Hiển thị dịch vụ"
                    checked={editServiceData.isShow}
                    onChange={handleEditInputChange}
                  />
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
      {selectedService && (
        <Modal
          show={showDetailModal}
          onHide={handleCloseDetails}
          size="xl"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="d-flex align-items-center">
              <IconifyIcon icon="mdi:cog" className="me-2 text-primary" />
              Chi tiết dịch vụ: {selectedService.serviceName_vn}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4} className="text-center">
                <div className="mb-4">
                  {selectedService.serviceImage && selectedService.serviceImage !== "services" ? (
                    <Image
                      src={`${apiUrlNoApi}${selectedService.serviceImage}`}
                      fluid
                      className="mb-3 rounded shadow"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="bg-light rounded d-flex align-items-center justify-content-center mb-3 shadow" style={{ height: "300px" }}>
                      <IconifyIcon icon="mdi:image-outline" className="fs-48 text-muted" />
                    </div>
                  )}
                  <h4 className="mb-2">{selectedService.serviceName_vn}</h4>
                  {selectedService.serviceName_en && (
                    <p className="text-muted mb-3">{selectedService.serviceName_en}</p>
                  )}
                  <div className="d-flex gap-2 justify-content-center">
                    <Badge bg={selectedService.status === 'Active' ? "success" : "warning"} className="fs-6 px-3 py-2">
                      <IconifyIcon icon={selectedService.status === 'Active' ? "mdi:check-circle" : "mdi:pause-circle"} className="me-1" />
                      {selectedService.status === 'Active' ? "Hoạt động" : "Ngừng"}
                    </Badge>
                    <Badge bg={selectedService.isShow ? "info" : "secondary"} className="fs-6 px-3 py-2">
                      <IconifyIcon icon={selectedService.isShow ? "mdi:eye" : "mdi:eye-off"} className="me-1" />
                      {selectedService.isShow ? "Hiển thị" : "Ẩn"}
                    </Badge>
                  </div>
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
                        <h6 className="text-muted mb-2">ID Dịch vụ</h6>
                        <p className="mb-0 fw-bold">#{selectedService.ID}</p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Trạng thái</h6>
                        <Badge bg={selectedService.status === 'Active' ? "success" : "warning"} className="fs-6">
                          {selectedService.status === 'Active' ? "Hoạt động" : "Ngừng"}
                        </Badge>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Ngày tạo</h6>
                        <p className="mb-0">
                          <IconifyIcon icon="mdi:calendar-plus" className="me-1 text-info" />
                          {formatDate(selectedService.createDate)}
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Cập nhật lần cuối</h6>
                        <p className="mb-0">
                          <IconifyIcon icon="mdi:calendar-edit" className="me-1 text-warning" />
                          {formatDate(selectedService.updateDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h5 className="mb-3 d-flex align-items-center">
                    <IconifyIcon icon="mdi:text" className="me-2 text-info" />
                    Mô tả dịch vụ
                  </h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="border rounded p-3">
                        <h6 className="text-muted mb-2">
                          <IconifyIcon icon="mdi:flag-variant" className="me-1" />
                          Tiếng Việt
                        </h6>
                        <p className="mb-0">
                          {selectedService.description_vn || (
                            <span className="text-muted fst-italic">Chưa có mô tả</span>
                          )}
                        </p>
                      </div>
                    </div>
                    {selectedService.description_en && (
                      <div className="col-12">
                        <div className="border rounded p-3">
                          <h6 className="text-muted mb-2">
                            <IconifyIcon icon="mdi:flag" className="me-1" />
                            Tiếng Anh
                          </h6>
                          <p className="mb-0">{selectedService.description_en}</p>
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
              handleShowEdit(selectedService);
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

export default ServicesPage;
