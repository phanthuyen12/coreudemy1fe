import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  Table,
  Badge,
  Image,
  Button,
  Form,
  Pagination,
  Modal,
} from "react-bootstrap";
import PageMetaData from "@/admin/components/PageTitle";
import IconifyIcon from "@/admin/components/wrappers/IconifyIcon";
import { employeesController } from "@/config/config";
import { useNavigate } from "react-router-dom";

// Import ảnh avatar mặc định cho người dùng mới hoặc khi API không trả về ảnh
import avatar4 from "@/assets/images/users/avatar-4.jpg";
import { Link } from "react-router-dom";

// Dữ liệu ban đầu cho các thẻ thống kê, sẽ được cập nhật từ API
const initialStatsData = [
  {
    name: "TỔNG NHÂN VIÊN",
    amount: 0,
    icon: "mdi:account-group",
    iconColor: "primary",
  },
  {
    name: "ĐANG HOẠT ĐỘNG",
    amount: 0,
    icon: "mdi:account-check",
    iconColor: "success",
  },
  {
    name: "QUẢN TRỊ VIÊN",
    amount: 1,
    icon: "mdi:account-supervisor-circle",
    iconColor: "info",
  }, // Dữ liệu giả định
  { name: "ĐÃ KHÓA", amount: 0, icon: "mdi:account-lock", iconColor: "danger" },
];

// Cấu hình số lượng mục hiển thị trên mỗi trang
const ITEMS_PER_PAGE = 10;
/**
 * Hàm tạo ra một mảng các mục cho thanh phân trang thông minh.
 * @param {number} currentPage - Trang hiện tại.
 * @param {number} totalPages - Tổng số trang.
 * @param {number} pageNeighbours - Số lượng trang hiển thị ở mỗi bên của trang hiện tại.
 * @returns {Array<number|string>} - Mảng chứa các số trang và dấu '...'
 */
const getPaginationItems = (currentPage, totalPages, pageNeighbours = 1) => {
  const totalNumbers = pageNeighbours * 2 + 3; // Số lượng trang hiển thị chính (e.g., 1, 2, 3, 4, 5)
  const totalBlocks = totalNumbers + 2; // Bao gồm cả dấu '...' và trang đầu/cuối (e.g., 1, ..., 3, 4, 5, ..., 1000)

  // Trường hợp 1: Nếu tổng số trang không đủ nhiều, hiển thị tất cả
  if (totalPages <= totalBlocks) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const startPage = Math.max(2, currentPage - pageNeighbours);
  const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

  let pages = [1]; // Luôn bắt đầu với trang 1

  // Trường hợp 2: Trang hiện tại ở gần đầu
  // (1) [2] 3 4 ... 1000
  if (currentPage - pageNeighbours <= 2) {
    const end = 1 + totalNumbers;
    for (let i = 2; i < end; i++) {
      pages.push(i);
    }
    pages.push("...");
    pages.push(totalPages);
  }
  // Trường hợp 3: Trang hiện tại ở gần cuối
  // 1 ... 997 998 [999] 1000
  else if (currentPage + pageNeighbours >= totalPages - 1) {
    const start = totalPages - totalNumbers + 1;
    pages.push("...");
    for (let i = start; i < totalPages; i++) {
      pages.push(i);
    }
    pages.push(totalPages);
  }
  // Trường hợp 4: Trang hiện tại ở giữa
  // 1 ... 499 [500] 501 ... 1000
  else {
    pages.push("...");
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    pages.push("...");
    pages.push(totalPages);
  }

  return pages;
};
const EmployeesPage = () => {
  const [dataTable, setDataTable] = useState([]);
  const [statsData, setStatsData] = useState(initialStatsData);
  const navigate = useNavigate();

  // --- State quản lý bộ lọc và phân trang ---
  const [filters, setFilters] = useState({
    keyword: "", // Dùng cho tìm kiếm chung (fullName, email, phone)
    levelName_vn: "", // Lọc theo cấp bậc
    status: "", // Lọc theo trạng thái (active/inactive)
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  // --- Hàm gọi API để lấy dữ liệu ---
  // useCallback được sử dụng để tối ưu, tránh việc hàm bị tạo lại mỗi lần component re-render
  const fetchData = useCallback(async (page, currentFilters) => {
    try {
      // Xây dựng đối tượng params để gửi lên API
      const params = {
        page: page,
        limit: ITEMS_PER_PAGE,
        fullName: currentFilters.keyword, // API sẽ tìm kiếm keyword này trong trường fullName
        email: currentFilters.keyword, // và trong trường email
        phone: currentFilters.keyword, // và trong trường phone
        levelName_vn: currentFilters.levelName_vn,
        status: currentFilters.status,
      };

      const response = await employeesController.searchEmployees(params);

      // Giả định cấu trúc API trả về: { data: { employees: [...], totalPages: 5, total: 50, active: 45, inactive: 5 } }
      const responseData = response.data;
      console.log(responseData);

      // Định dạng lại dữ liệu nhân viên để hiển thị trên bảng
      const formattedData = responseData.rows.map((item) => ({
        ID: item.id,
        fullName: item.fullName,
        shortName: item.shortName,
        levelName_vn: item.levelName_vn,
        levelName_en: item.levelName_en,
        email: item.email,
        phone: item.phone,
        degree: item.degree,
        description_vn: item.description_vn,
        description_en: item.description_en,
        avatarPic: item.avatarUrl || avatar4, // Dùng ảnh từ API, nếu không có thì dùng ảnh mặc định
        status: item.isActive ? "Active" : "Banned",
        createdDate: item.createdAt,
        updatedDate: item.updatedAt,
      }));

      setDataTable(formattedData);

      // Cập nhật lại thông tin phân trang từ API
      setPagination((prev) => ({
        ...prev,
        totalPages: responseData.totalPages || 1,
      }));

      // (Tùy chọn) Cập nhật các thẻ thống kê từ API
      setStatsData((prev) => [
        { ...prev[0], amount: responseData.total || 0 },
        { ...prev[1], amount: responseData.active || 0 },
        prev[2], // Giữ nguyên số Quản trị viên
        { ...prev[3], amount: responseData.inactive || 0 },
      ]);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu nhân viên:", error);
      setDataTable([]); // Nếu lỗi, làm trống bảng để thông báo cho người dùng
    }
  }, []);

  // useEffect này sẽ chạy một lần khi component được tạo để tải dữ liệu ban đầu
  useEffect(() => {
    fetchData(1, filters);
  }, [fetchData]);

  // --- Các hàm xử lý sự kiện cho bộ lọc và phân trang ---

  // Cập nhật state `filters` khi người dùng thay đổi giá trị trong các ô input/select
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Kích hoạt khi nhấn nút "Tìm kiếm"
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Luôn quay về trang đầu tiên khi tìm kiếm
    fetchData("", filters);
  };

  // Kích hoạt khi nhấn nút "Xóa lọc"
  const handleClearFilters = () => {
    const clearedFilters = { keyword: "", levelName_vn: "", status: "" };
    setFilters(clearedFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchData(1, clearedFilters);
  };

  // Kích hoạt khi người dùng click vào một trang khác
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: pageNumber }));
      fetchData(pageNumber, filters);
    }
  };

  // --- State và hàm xử lý cho các Modal (Tạo mới, Xem chi tiết & Chỉnh sửa) ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const initialFormState = {
    fullName: "",
    shortName: "",
    email: "",
    phone: "",
    degree: "",
    levelName_vn: "Thành viên Đồng",
    description_vn: "",
    description_en: "",
    avatarPic: null, // Thêm trường cho file ảnh












  };
  const [newEmployeeData, setNewEmployeeData] = useState(initialFormState);
  const [editEmployeeData, setEditEmployeeData] = useState(initialFormState);

  // Xử lý việc nhập liệu trong form tạo mới
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files && files[0]) {
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
      
      setNewEmployeeData({ 
        ...newEmployeeData, 
        [name]: file 
      });
    } else {
      setNewEmployeeData({ ...newEmployeeData, [name]: value });
    }
  };

  // Xử lý việc nhập liệu trong form chỉnh sửa
  const handleEditInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files && files[0]) {
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
      
      setEditEmployeeData({ 
        ...editEmployeeData, 
        [name]: file 
      });
    } else {
      setEditEmployeeData({ ...editEmployeeData, [name]: value });
    }
  };

  // Xử lý khi submit form tạo mới nhân viên
  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      // Tạo FormData để gửi multipart/form-data
      const formDataToSend = new FormData();
      
      // Append các trường dữ liệu
      formDataToSend.append("fullName", newEmployeeData.fullName);
      formDataToSend.append("shortName", newEmployeeData.shortName);
      formDataToSend.append("email", newEmployeeData.email);
      formDataToSend.append("phone", newEmployeeData.phone);
      formDataToSend.append("degree", newEmployeeData.degree);
      formDataToSend.append("levelName_vn", newEmployeeData.levelName_vn);
      formDataToSend.append("description_vn", newEmployeeData.description_vn);
      formDataToSend.append("description_en", newEmployeeData.description_en);
      
      // Append file ảnh nếu có
      if (newEmployeeData.avatarPic) {
        formDataToSend.append("avatarPic", newEmployeeData.avatarPic);
      }

      // Debug FormData
      console.log("=== CREATE EMPLOYEE FORMDATA ===");
      console.log("FormData entries:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }

      await employeesController.createEmployees(formDataToSend);
      alert("Tạo nhân viên thành công!");
      setShowCreateModal(false);
      setNewEmployeeData(initialFormState);
      handleClearFilters(); // Tải lại toàn bộ dữ liệu từ đầu để thấy nhân viên mới
    } catch (error) {
      console.error("Lỗi khi tạo nhân viên:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Xử lý khi submit form cập nhật nhân viên
  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      // Tạo FormData để gửi multipart/form-data
      const formDataToSend = new FormData();
      
      // Append các trường dữ liệu
      formDataToSend.append("fullName", editEmployeeData.fullName);
      formDataToSend.append("shortName", editEmployeeData.shortName);
      formDataToSend.append("email", editEmployeeData.email);
      formDataToSend.append("phone", editEmployeeData.phone);
      formDataToSend.append("degree", editEmployeeData.degree);
      formDataToSend.append("levelName_vn", editEmployeeData.levelName_vn);
      formDataToSend.append("description_vn", editEmployeeData.description_vn);
      formDataToSend.append("description_en", editEmployeeData.description_en);
      
      // Append file ảnh nếu có
      if (editEmployeeData.avatarPic) {
        formDataToSend.append("avatarPic", editEmployeeData.avatarPic);
      }

      // Debug FormData
      console.log("=== UPDATE EMPLOYEE FORMDATA ===");
      console.log("FormData entries:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }

      await employeesController.updateEmployees(formDataToSend, selectedEmployee.ID);
      alert("Cập nhật nhân viên thành công!");
      setShowEditModal(false);
      setEditEmployeeData(initialFormState);
      setSelectedEmployee(null);
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi cập nhật nhân viên:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Mở modal chỉnh sửa
  const handleShowEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditEmployeeData({
      fullName: employee.fullName,
      shortName: employee.shortName,
      email: employee.email,
      phone: employee.phone,
      degree: employee.degree,
      levelName_vn: employee.levelName_vn,
      description_vn: employee.description_vn,
      description_en: employee.description_en,
      avatarPic: null, // Reset file input
    });
    setShowEditModal(true);
  };

  // Đóng modal chỉnh sửa
  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedEmployee(null);
    setEditEmployeeData(initialFormState);
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
      <PageMetaData title="Quản lý nhân viên" />

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
            <h5 className="mb-0">Danh sách nhân viên</h5>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <IconifyIcon icon="mdi:plus" className="me-1" />
              Tạo mới
            </Button>
          </div>
          <Form className="row g-3 align-items-center">
            <Col xl={3} md={6}>
              <Form.Control
                type="text"
                placeholder="Tên, Email, SĐT..."
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xl={3} md={6}>
              <Form.Select
                name="levelName_vn"
                value={filters.levelName_vn}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả cấp bậc</option>
                <option value="Thành viên Đồng">Thành viên Đồng</option>
                <option value="Thành viên Bạc">Thành viên Bạc</option>
                <option value="Thành viên Vàng">Thành viên Vàng</option>
              </Form.Select>
            </Col>
            <Col xl={3} md={6}>
              <Form.Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Bị khóa</option>
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

      {/* Bảng dữ liệu nhân viên */}
      <Card className="mt-3">
        <CardBody>
          <Table responsive hover className="text-nowrap align-middle">
            <thead className="table-light">
              <tr>
                <th>#ID</th>
                <th>Nhân viên</th>
                <th>Số điện thoại</th>
                <th>Cấp bậc</th>
                <th>Trạng thái</th>
                <th>Ngày tham gia</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {dataTable.length > 0 ? (
                dataTable.map((emp) => (
                  <tr key={emp.ID}>
                    <td>
                      <strong>#{emp.ID}</strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Image
                          src={emp.avatarPic}
                          roundedCircle
                          width={40}
                          height={40}
                          className="me-2 object-fit-cover"
                        />
                        <div>
                          <h6 className="mb-0">{emp.fullName}</h6>
                          <small className="text-muted">{emp.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{emp.phone}</td>
                    <td>{emp.levelName_vn}</td>
                    <td>
                      <Badge
                        pill
                        bg={
                          emp.status === "Active"
                            ? "success-subtle"
                            : "danger-subtle"
                        }
                        className={
                          emp.status === "Active"
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {emp.status === "Active" ? "Hoạt động" : "Bị khóa"}
                      </Badge>
                    </td>
                    <td>{formatDate(emp.createdDate)}</td>
                    <td className="text-center">
                    <Button
  size="sm"
  variant="primary"
  className="me-1 text-white"
  onClick={() => navigate(`/page/employees/${emp.ID}?module=admin`)}
>
  <IconifyIcon icon="mdi:eye" />
</Button>

<Button
  size="sm"
  variant="warning"
  className="me-1 text-white"
  onClick={() => handleShowEdit(emp)}
>
  <IconifyIcon icon="mdi:pencil" />
</Button>

<Button
  size="sm"
  variant="danger"
  className="me-1"
>
  <IconifyIcon icon="mdi:delete-outline" />
</Button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Không tìm thấy dữ liệu phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Thanh phân trang động */}
          {pagination.totalPages > 1 && (
            <Pagination className="justify-content-end mt-3 mb-0">
              {/* Nút Previous */}
              <Pagination.Prev
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              />

              {/* Render các mục phân trang đã được tính toán */}
              {getPaginationItems(
                pagination.currentPage,
                pagination.totalPages
              ).map((item, index) => {
                // Nếu là dấu '...', hiển thị Pagination.Ellipsis
                if (typeof item === "string") {
                  return (
                    <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />
                  );
                }

                // Nếu là số, hiển thị Pagination.Item
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

              {/* Nút Next */}
              <Pagination.Next
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              />
            </Pagination>
          )}
        </CardBody>
      </Card>

      {/* Modal tạo nhân viên mới */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tạo nhân viên mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateEmployee}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={newEmployeeData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập họ tên đầy đủ..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên ngắn</Form.Label>
                  <Form.Control
                    type="text"
                    name="shortName"
                    value={newEmployeeData.shortName}
                    onChange={handleInputChange}
                    placeholder="Nhập tên gọi tắt..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={newEmployeeData.email}
                    onChange={handleInputChange}
                    required
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
                    value={newEmployeeData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Cấp bậc</Form.Label>
                  <Form.Select
                    name="levelName_vn"
                    value={newEmployeeData.levelName_vn}
                    onChange={handleInputChange}
                  >
                    <option value="Thành viên Đồng">Thành viên Đồng</option>
                    <option value="Thành viên Bạc">Thành viên Bạc</option>
                    <option value="Thành viên Vàng">Thành viên Vàng</option>
                    <option value="Trưởng phòng">Trưởng phòng</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Bằng cấp</Form.Label>
                  <Form.Control
                    type="text"
                    name="degree"
                    value={newEmployeeData.degree}
                    onChange={handleInputChange}
                    placeholder="VD: Cử nhân..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Ảnh đại diện</Form.Label>
                  <Form.Control
                    type="file"
                    name="avatarPic"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">
                    Chọn ảnh đại diện cho nhân viên (JPG, PNG, GIF - tối đa 5MB)
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description_vn"
                    value={newEmployeeData.description_vn}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description_en"
                    value={newEmployeeData.description_en}
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

      {/* Modal chỉnh sửa nhân viên */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEdit}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa nhân viên</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateEmployee}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={editEmployeeData.fullName}
                    onChange={handleEditInputChange}
                    required
                    placeholder="Nhập họ tên đầy đủ..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên ngắn</Form.Label>
                  <Form.Control
                    type="text"
                    name="shortName"
                    value={editEmployeeData.shortName}
                    onChange={handleEditInputChange}
                    placeholder="Nhập tên gọi tắt..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editEmployeeData.email}
                    onChange={handleEditInputChange}
                    required
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
                    value={editEmployeeData.phone}
                    onChange={handleEditInputChange}
                    placeholder="Nhập số điện thoại..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Cấp bậc</Form.Label>
                  <Form.Select
                    name="levelName_vn"
                    value={editEmployeeData.levelName_vn}
                    onChange={handleEditInputChange}
                  >
                    <option value="Thành viên Đồng">Thành viên Đồng</option>
                    <option value="Thành viên Bạc">Thành viên Bạc</option>
                    <option value="Thành viên Vàng">Thành viên Vàng</option>
                    <option value="Trưởng phòng">Trưởng phòng</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Bằng cấp</Form.Label>
                  <Form.Control
                    type="text"
                    name="degree"
                    value={editEmployeeData.degree}
                    onChange={handleEditInputChange}
                    placeholder="VD: Cử nhân..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Ảnh đại diện</Form.Label>
                  <Form.Control
                    type="file"
                    name="avatarPic"
                    accept="image/*"
                    onChange={handleEditInputChange}
                  />
                  <Form.Text className="text-muted">
                    Chọn ảnh đại diện mới cho nhân viên (JPG, PNG, GIF - tối đa 5MB)
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description_vn"
                    value={editEmployeeData.description_vn}
                    onChange={handleEditInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả (Tiếng Anh)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description_en"
                    value={editEmployeeData.description_en}
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
    </>
  );
};

export default EmployeesPage;
