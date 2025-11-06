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
import { clientsController } from "@/config/config";
import { apiUrlNoApi } from "@/config/config";
import { validateImageQuality, validateImageDimensions, validateFormData, showValidationErrors } from "@/utils/imageValidation";
import ImageValidationInfo from "@/components/ImageValidationInfo";

// Dữ liệu ban đầu cho các thẻ thống kê
const initialStatsData = [
  {
    name: "TỔNG KHÁCH HÀNG",
    amount: 0,
    icon: "mdi:account-group",
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

const ClientsPage = () => {
  const [dataTable, setDataTable] = useState([]);
  const [statsData, setStatsData] = useState(initialStatsData);

  // State quản lý bộ lọc và phân trang
  const [filters, setFilters] = useState({
    keyword: "", // Tìm kiếm theo tên khách hàng, email, phone
    clientName_vn: "",
    clientName_en: "",
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
      // Tạo params với các filter
      const params = {
        page: page,
        limit: ITEMS_PER_PAGE,
        keyword: currentFilters.keyword || "",
        clientName_vn: currentFilters.clientName_vn || "",
        clientName_en: currentFilters.clientName_en || "",
        status: currentFilters.status || "",
        isShow: currentFilters.isShow || "",
      };

      console.log("API Request params:", params);

      const response = await clientsController.list(params);
      console.log("API Response:", response);

      // Xử lý dữ liệu từ API - có thể có nhiều cấu trúc khác nhau
      let clientsData = [];
      let totalCount = 0;
      let paginationInfo = null;
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Cấu trúc: { data: { data: [...], pagination: {...} } }
        clientsData = response.data.data;
        paginationInfo = response.data.pagination;
        totalCount = paginationInfo?.totalItems || response.data.data.length;
        console.log("Extracted clients data from response.data.data:", clientsData);
        console.log("Pagination info:", paginationInfo);
      } else if (response.data && Array.isArray(response.data)) {
        // Cấu trúc: { data: [...] }
        clientsData = response.data;
        totalCount = response.total || response.data.length;
        console.log("Extracted clients data from response.data:", clientsData);
      } else if (Array.isArray(response)) {
        // Cấu trúc: [...]
        clientsData = response;
        totalCount = response.length;
        console.log("Extracted clients data from response array:", clientsData);
      } else {
        console.error("Unexpected response format:", response);
        clientsData = [];
        totalCount = 0;
      }

      console.log("Processed clients data:", clientsData);
      console.log("Total count:", totalCount);

      // Định dạng lại dữ liệu clients để hiển thị trên bảng
      const formattedData = clientsData.map((item) => ({
        ID: item.id,
        clientName_vn: item.clientName_vn,
        clientName_en: item.clientName_en,
        logo: item.logo,
        address: item.address,
        email: item.email,
        phone: item.phone,
        createDate: item.createDate,
        updateDate: item.updateDate,
        isShow: item.isShow,
        status: item.status,
      }));

      console.log("Formatted data length:", formattedData.length);
      console.log("Formatted data:", formattedData);

      setDataTable(formattedData);

      // Cập nhật thông tin phân trang dựa trên API response
      if (paginationInfo) {
        // Sử dụng thông tin pagination từ API
        setPagination((prev) => ({
          currentPage: paginationInfo.currentPage || page,
          totalPages: paginationInfo.totalPages || 1,
        }));
      } else {
        // Tính toán pagination từ totalCount
        setPagination((prev) => ({
          currentPage: page,
          totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE) || 1,
        }));
      }

      // Cập nhật các thẻ thống kê
      const totalClients = totalCount;
      const activeClients = clientsData.filter(client => client.status === 'Active').length;
      const visibleClients = clientsData.filter(client => client.isShow).length;
      const inactiveClients = totalClients - activeClients;

      setStatsData((prev) => [
        { ...prev[0], amount: totalClients },
        { ...prev[1], amount: activeClients },
        { ...prev[2], amount: visibleClients },
        { ...prev[3], amount: inactiveClients },
      ]);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu khách hàng:", error);
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
    const clearedFilters = { 
      keyword: "", 
      clientName_vn: "", 
      clientName_en: "", 
      status: "", 
      isShow: "" 
    };
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
  const [selectedClient, setSelectedClient] = useState(null);
  
  const initialFormState = {
    clientName_vn: "",
    clientName_en: "",
    logo: null,
    address: "",
    email: "",
    phone: "",
    isShow: true,
    status: "Active",
  };
  
  const [newClientData, setNewClientData] = useState(initialFormState);
  const [editClientData, setEditClientData] = useState(initialFormState);

  // Xử lý việc nhập liệu trong form
  const handleInputChange = async (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
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

        setNewClientData({ 
          ...newClientData, 
          [name]: file 
        });
      } else {
        setNewClientData({ 
          ...newClientData, 
          [name]: null 
        });
      }
    } else {
      setNewClientData({ 
        ...newClientData, 
        [name]: type === 'checkbox' ? checked : value 
      });
    }
  };

  const handleEditInputChange = async (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
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

        setEditClientData({ 
          ...editClientData, 
          [name]: file 
        });
      } else {
        setEditClientData({ 
          ...editClientData, 
          [name]: null 
        });
      }
    } else {
      setEditClientData({ 
        ...editClientData, 
        [name]: type === 'checkbox' ? checked : value 
      });
    }
  };

  // Xử lý khi submit form tạo mới client
  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      const requiredFields = ['clientName_vn'];
      const formValidation = validateFormData(newClientData, requiredFields);
      
      if (!formValidation.isValid) {
        showValidationErrors(formValidation.errors);
        return;
      }

      console.log(newClientData)
      await clientsController.create(newClientData);
      alert("Tạo khách hàng thành công!");
      setShowCreateModal(false);
      setNewClientData(initialFormState);
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi tạo khách hàng:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Xử lý khi submit form cập nhật client
  const handleUpdateClient = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      const requiredFields = ['clientName_vn'];
      const formValidation = validateFormData(editClientData, requiredFields);
      
      if (!formValidation.isValid) {
        showValidationErrors(formValidation.errors);
        return;
      }

      await clientsController.update(selectedClient.ID, editClientData);
      alert("Cập nhật khách hàng thành công!");
      setShowEditModal(false);
      setEditClientData(initialFormState);
      setSelectedClient(null);
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi cập nhật khách hàng:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Xử lý bật/tắt hiển thị client
  const handleToggleShow = async (clientId) => {
    try {
      await clientsController.toggle(clientId);
      alert("Cập nhật trạng thái hiển thị thành công!");
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hiển thị:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Xử lý bật/tắt trạng thái active/inactive
  const handleToggleStatus = async (clientId) => {
    try {
      await clientsController.toggleShowActive(clientId);
      alert("Cập nhật trạng thái hoạt động thành công!");
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hoạt động:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Mở modal xem chi tiết
  const handleShowDetails = (client) => {
    setSelectedClient(client);
    setShowDetailModal(true);
  };

  // Mở modal chỉnh sửa
  const handleShowEdit = (client) => {
    setSelectedClient(client);
    setEditClientData({
      clientName_vn: client.clientName_vn,
      clientName_en: client.clientName_en,
      logo: null, // Reset file input
      address: client.address,
      email: client.email,
      phone: client.phone,
      isShow: client.isShow,
      status: client.status,
    });
    setShowEditModal(true);
  };

  // Đóng modal
  const handleCloseDetails = () => {
    setShowDetailModal(false);
    setSelectedClient(null);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedClient(null);
    setEditClientData(initialFormState);
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
      <PageMetaData title="Quản lý khách hàng" />

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
            <h5 className="mb-0">Danh sách khách hàng ({dataTable.length} khách hàng)</h5>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-info" 
                size="sm"
                onClick={() => {
                  console.log("=== DEBUG CLIENTS DATA ===");
                  console.log("Current filters:", filters);
                  console.log("Current pagination:", pagination);
                  console.log("dataTable:", dataTable);
                  console.log("statsData:", statsData);
                }}
              >
                <IconifyIcon icon="mdi:bug" className="me-1" />
                Debug
              </Button>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                <IconifyIcon icon="mdi:plus" className="me-1" />
                Tạo mới
              </Button>
            </div>
          </div>
          <Form className="row g-3 align-items-center">
            <Col xl={2} md={6}>
              <Form.Control
                type="text"
                placeholder="Từ khóa tìm kiếm..."
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xl={2} md={6}>
              <Form.Control
                type="text"
                placeholder="Tên khách hàng (VN)..."
                name="clientName_vn"
                value={filters.clientName_vn}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xl={2} md={6}>
              <Form.Control
                type="text"
                placeholder="Tên khách hàng (EN)..."
                name="clientName_en"
                value={filters.clientName_en}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xl={2} md={6}>
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
            <Col xl={2} md={6}>
              <Form.Select
                name="isShow"
                value={filters.isShow}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả hiển thị</option>
                <option value="true">Đang hiển thị</option>
                <option value="false">Đã ẩn</option>
              </Form.Select>
            </Col>
            <Col xl={2} md={6}>
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

      {/* Bảng dữ liệu clients */}
      <Card className="mt-3">
        <CardBody>
          <Table responsive hover className="text-nowrap align-middle">
            <thead className="table-light">
              <tr>
                <th>#ID</th>
                <th>Logo</th>
                <th>Tên khách hàng</th>
                <th>Liên hệ</th>
                <th>Trạng thái</th>
                <th>Hiển thị</th>
                <th>Ngày tạo</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {dataTable.length > 0 ? (
                dataTable.map((client, index) => (
                  <tr key={client.ID || index}>
                    <td>
                      <strong>#{client.ID}</strong>
                    </td>
                    <td>
                      {client.logo ? (
                        <Image
                          src={`${apiUrlNoApi}${client.logo}`}
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
                      {/* <div 
                        className="bg-light rounded d-flex align-items-center justify-content-center" 
                        style={{ width: 50, height: 50, display: client.logo ? 'none' : 'flex' }}
                      >
                        <IconifyIcon icon="mdi:image-outline" className="text-muted" />
                      </div> */}
                    </td>
                    <td>
                      <div>
                        <h6 className="mb-0">{client.clientName_vn || "N/A"}</h6>
                        <small className="text-muted">{client.clientName_en || "N/A"}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <small className="text-muted">{client.email || "N/A"}</small>
                        <br />
                        <small className="text-muted">{client.phone || "N/A"}</small>
                      </div>
                    </td>
                    <td>
                      <Badge
                        pill
                        bg={client.status === 'Active' ? "success-subtle" : "warning-subtle"}
                        className={client.status === 'Active' ? "text-success" : "text-warning"}
                      >
                        {client.status === 'Active' ? "Hoạt động" : "Ngừng"}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        pill
                        bg={client.isShow ? "info-subtle" : "secondary-subtle"}
                        className={client.isShow ? "text-info" : "text-secondary"}
                      >
                        {client.isShow ? "Hiển thị" : "Ẩn"}
                      </Badge>
                    </td>
                    <td>{formatDate(client.createDate)}</td>
                    <td className="text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleShowDetails(client)}
                          title="Xem chi tiết"
                        >
                          <IconifyIcon icon="mdi:eye" />
                        </Button>
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleShowEdit(client)}
                          title="Chỉnh sửa"
                        >
                          <IconifyIcon icon="mdi:pencil" />
                        </Button>
                        <Button
                          size="sm"
                          variant={client.isShow ? "secondary" : "info"}
                          onClick={() => handleToggleShow(client.ID)}
                          title={client.isShow ? "Ẩn khách hàng" : "Hiển thị khách hàng"}
                        >
                          <IconifyIcon icon={client.isShow ? "mdi:eye-off" : "mdi:eye"} />
                        </Button>
                        {/* <Button
                          size="sm"
                          variant={client.status === 'Active' ? "danger" : "success"}
                          onClick={() => handleToggleStatus(client.ID)}
                          title={client.status === 'Active' ? "Ngừng hoạt động" : "Kích hoạt"}
                        >
                          <IconifyIcon icon={client.status === 'Active' ? "mdi:pause" : "mdi:play"} />
                        </Button> */}
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
                      <p className="text-muted mb-0">Thử thay đổi bộ lọc hoặc tạo khách hàng mới</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Thanh phân trang */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted">
              Hiển thị {dataTable.length} khách hàng trên trang {pagination.currentPage} / {pagination.totalPages}
              {dataTable.length > 0 && (
                <span className="ms-2">
                  (Tổng: {dataTable.length} khách hàng)
                </span>
              )}
            </div>
            {pagination.totalPages > 1 && (
              <Pagination className="mb-0">
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
          </div>
        </CardBody>
      </Card>

      {/* Modal tạo client mới */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tạo khách hàng mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateClient}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên khách hàng (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="clientName_vn"
                    value={newClientData.clientName_vn}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tên khách hàng..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên khách hàng (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="clientName_en"
                    value={newClientData.clientName_en}
                    onChange={handleInputChange}
                    placeholder="Enter client name..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <ImageValidationInfo />
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Logo</Form.Label>
                  <Form.Control
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">
                    Chọn file hình ảnh cho logo khách hàng
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={newClientData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={newClientData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={newClientData.address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    name="status"
                    value={newClientData.status}
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
                    label="Hiển thị khách hàng"
                    checked={newClientData.isShow}
                    onChange={handleInputChange}
                  />
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

      {/* Modal chỉnh sửa client */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEdit}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa khách hàng</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateClient}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên khách hàng (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="clientName_vn"
                    value={editClientData.clientName_vn}
                    onChange={handleEditInputChange}
                    required
                    placeholder="Nhập tên khách hàng..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên khách hàng (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="clientName_en"
                    value={editClientData.clientName_en}
                    onChange={handleEditInputChange}
                    placeholder="Enter client name..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <ImageValidationInfo />
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Logo</Form.Label>
                  <Form.Control
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleEditInputChange}
                  />
                  <Form.Text className="text-muted">
                    Chọn file hình ảnh mới để thay thế logo hiện tại
                  </Form.Text>
                  {selectedClient?.logo && (
                    <div className="mt-2">
                      <small className="text-muted">Logo hiện tại:</small>
                      <br />
                      <Image
                        src={`${apiUrlNoApi}${selectedClient.logo}`}
                        width={100}
                        height={100}
                        className="rounded object-fit-cover"
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editClientData.email}
                    onChange={handleEditInputChange}
                    placeholder="example@email.com"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={editClientData.phone}
                    onChange={handleEditInputChange}
                    placeholder="Nhập số điện thoại..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={editClientData.address}
                    onChange={handleEditInputChange}
                    placeholder="Nhập địa chỉ..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    name="status"
                    value={editClientData.status}
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
                    label="Hiển thị khách hàng"
                    checked={editClientData.isShow}
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
      {selectedClient && (
        <Modal
          show={showDetailModal}
          onHide={handleCloseDetails}
          size="xl"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="d-flex align-items-center">
              <IconifyIcon icon="mdi:account-group" className="me-2 text-primary" />
              Chi tiết khách hàng: {selectedClient.clientName_vn}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4} className="text-center">
                <div className="mb-4">
                  {selectedClient.logo ? (
                    <Image
                      src={`${apiUrlNoApi}${selectedClient.logo}`}
                      fluid
                      className="mb-3 rounded shadow"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="bg-light rounded d-flex align-items-center justify-content-center mb-3 shadow" style={{ height: "300px" }}>
                      <IconifyIcon icon="mdi:image-outline" className="fs-48 text-muted" />
                    </div>
                  )}
                  <h4 className="mb-2">{selectedClient.clientName_vn}</h4>
                  {selectedClient.clientName_en && (
                    <p className="text-muted mb-3">{selectedClient.clientName_en}</p>
                  )}
                  <div className="d-flex gap-2 justify-content-center">
                    <Badge bg={selectedClient.status === 'Active' ? "success" : "warning"} className="fs-6 px-3 py-2">
                      <IconifyIcon icon={selectedClient.status === 'Active' ? "mdi:check-circle" : "mdi:pause-circle"} className="me-1" />
                      {selectedClient.status === 'Active' ? "Hoạt động" : "Ngừng"}
                    </Badge>
                    <Badge bg={selectedClient.isShow ? "info" : "secondary"} className="fs-6 px-3 py-2">
                      <IconifyIcon icon={selectedClient.isShow ? "mdi:eye" : "mdi:eye-off"} className="me-1" />
                      {selectedClient.isShow ? "Hiển thị" : "Ẩn"}
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
                        <h6 className="text-muted mb-2">ID Khách hàng</h6>
                        <p className="mb-0 fw-bold">#{selectedClient.ID}</p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Trạng thái</h6>
                        <Badge bg={selectedClient.status === 'Active' ? "success" : "warning"} className="fs-6">
                          {selectedClient.status === 'Active' ? "Hoạt động" : "Ngừng"}
                        </Badge>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Email</h6>
                        <p className="mb-0">
                          <IconifyIcon icon="mdi:email" className="me-1 text-primary" />
                          {selectedClient.email || "Chưa có"}
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Số điện thoại</h6>
                        <p className="mb-0">
                          <IconifyIcon icon="mdi:phone" className="me-1 text-success" />
                          {selectedClient.phone || "Chưa có"}
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Ngày tạo</h6>
                        <p className="mb-0">
                          <IconifyIcon icon="mdi:calendar-plus" className="me-1 text-info" />
                          {formatDate(selectedClient.createDate)}
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Cập nhật lần cuối</h6>
                        <p className="mb-0">
                          <IconifyIcon icon="mdi:calendar-edit" className="me-1 text-warning" />
                          {formatDate(selectedClient.updateDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h5 className="mb-3 d-flex align-items-center">
                    <IconifyIcon icon="mdi:map-marker" className="me-2 text-danger" />
                    Địa chỉ
                  </h5>
                  <div className="border rounded p-3 mb-4">
                    <p className="mb-0">
                      {selectedClient.address || (
                        <span className="text-muted fst-italic">Chưa có địa chỉ</span>
                      )}
                    </p>
                  </div>

                  <h5 className="mb-3 d-flex align-items-center">
                    <IconifyIcon icon="mdi:eye" className="me-2 text-info" />
                    Trạng thái hiển thị
                  </h5>
                  <div className="border rounded p-3">
                    <div className="d-flex align-items-center">
                      <IconifyIcon 
                        icon={selectedClient.isShow ? "mdi:eye-check" : "mdi:eye-off"} 
                        className={`me-2 ${selectedClient.isShow ? "text-info" : "text-secondary"}`} 
                      />
                      <span className={selectedClient.isShow ? "text-info" : "text-secondary"}>
                        {selectedClient.isShow ? "Đang hiển thị trên website" : "Đã ẩn khỏi website"}
                      </span>
                    </div>
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
              handleShowEdit(selectedClient);
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

export default ClientsPage;
