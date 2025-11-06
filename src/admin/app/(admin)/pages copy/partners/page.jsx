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
import { partnersController } from "@/config/config";
import { apiUrlNoApi } from "@/config/config";

// Dữ liệu ban đầu cho các thẻ thống kê
const initialStatsData = [
  {
    name: "TỔNG ĐỐI TÁC",
    amount: 0,
    icon: "mdi:handshake",
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
    name: "GIÁM ĐỐC",
    amount: 0,
    icon: "mdi:account-tie",
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

const PartnersPage = () => {
  const [dataTable, setDataTable] = useState([]);
  const [statsData, setStatsData] = useState(initialStatsData);

  // State quản lý bộ lọc và phân trang
  const [filters, setFilters] = useState({
    keyword: "", // Tìm kiếm theo tên đối tác
    fullName_vn: "",
    fullName_en: "",
    shortName: "",
    level_vn: "",
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
        fullName_vn: currentFilters.fullName_vn,
        fullName_en: currentFilters.fullName_en,
        shortName: currentFilters.shortName,
        level_vn: currentFilters.level_vn,
        isShow: currentFilters.isShow,
      };

      const response = await partnersController.list(params);
      console.log("API Response:", response);

      // Xử lý dữ liệu từ API - có thể là response.data hoặc response trực tiếp
      let partnersData = [];
      if (response.data && Array.isArray(response.data)) {
        partnersData = response.data;
      } else if (Array.isArray(response)) {
        partnersData = response;
      } else {
        console.error("Unexpected response format:", response);
        partnersData = [];
      }

      console.log("Processed partners data:", partnersData);

      // Định dạng lại dữ liệu partners để hiển thị trên bảng
      const formattedData = partnersData.map((item) => ({
        ID: item.id,
        fullName_vn: item.fullName_vn,
        fullName_en: item.fullName_en,
        shortName: item.shortName,
        images: item.images,
        level_vn: item.level_vn,
        level_en: item.level_en,
        description_vn: item.description_vn,
        description_en: item.description_en,
        createDate: item.createDate,
        updateDate: item.updateDate,
        isShow: item.isShow,
      }));

      setDataTable(formattedData);

      // Cập nhật thông tin phân trang
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(partnersData.length / ITEMS_PER_PAGE) || 1,
      }));

      // Cập nhật các thẻ thống kê
      const totalPartners = partnersData.length;
      const visiblePartners = partnersData.filter(partner => partner.isShow).length;
      const hiddenPartners = totalPartners - visiblePartners;
      const directors = partnersData.filter(partner => 
        partner.level_vn && partner.level_vn.toLowerCase().includes('giám đốc')
      ).length;

      setStatsData((prev) => [
        { ...prev[0], amount: totalPartners },
        { ...prev[1], amount: visiblePartners },
        { ...prev[2], amount: hiddenPartners },
        { ...prev[3], amount: directors },
      ]);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu đối tác:", error);
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
    const clearedFilters = { keyword: "", fullName_vn: "", fullName_en: "", shortName: "", level_vn: "", isShow: "" };
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
  const [selectedPartner, setSelectedPartner] = useState(null);
  
  const initialFormState = {
    fullName_vn: "",
    fullName_en: "",
    shortName: "",
    images: null,
    level_vn: "",
    level_en: "",
    description_vn: "",
    description_en: "",
    isShow: true,
  };
  
  const [newPartnerData, setNewPartnerData] = useState(initialFormState);
  const [editPartnerData, setEditPartnerData] = useState(initialFormState);

  // Xử lý việc nhập liệu trong form
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setNewPartnerData({ 
        ...newPartnerData, 
        [name]: files[0] || null 
      });
    } else {
      setNewPartnerData({ 
        ...newPartnerData, 
        [name]: type === 'checkbox' ? checked : value 
      });
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setEditPartnerData({ 
        ...editPartnerData, 
        [name]: files[0] || null 
      });
    } else {
      setEditPartnerData({ 
        ...editPartnerData, 
        [name]: type === 'checkbox' ? checked : value 
      });
    }
  };

  // Xử lý khi submit form tạo mới partner
  const handleCreatePartner = async (e) => {
    e.preventDefault();
    try {
      // Tạo FormData để gửi multipart/form-data
      const formDataToSend = new FormData();
      
      // Append các trường dữ liệu
      formDataToSend.append("fullName_vn", newPartnerData.fullName_vn);
      formDataToSend.append("fullName_en", newPartnerData.fullName_en);
      formDataToSend.append("shortName", newPartnerData.shortName);
      formDataToSend.append("level_vn", newPartnerData.level_vn);
      formDataToSend.append("level_en", newPartnerData.level_en);
      formDataToSend.append("description_vn", newPartnerData.description_vn);
      formDataToSend.append("description_en", newPartnerData.description_en);
      formDataToSend.append("isShow", newPartnerData.isShow);
      
      // Append file ảnh nếu có
      if (newPartnerData.images) {
        formDataToSend.append("images", newPartnerData.images);
      }

      // Debug FormData
      console.log("=== CREATE PARTNER FORMDATA ===");
      console.log("FormData entries:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }

      await partnersController.create(formDataToSend);
      alert("Tạo đối tác thành công!");
      setShowCreateModal(false);
      setNewPartnerData(initialFormState);
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi tạo đối tác:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Xử lý khi submit form cập nhật partner
  const handleUpdatePartner = async (e) => {
    e.preventDefault();
    try {
      // Tạo FormData để gửi multipart/form-data
      const formDataToSend = new FormData();
      
      // Append các trường dữ liệu
      formDataToSend.append("fullName_vn", editPartnerData.fullName_vn);
      formDataToSend.append("fullName_en", editPartnerData.fullName_en);
      formDataToSend.append("shortName", editPartnerData.shortName);
      formDataToSend.append("level_vn", editPartnerData.level_vn);
      formDataToSend.append("level_en", editPartnerData.level_en);
      formDataToSend.append("description_vn", editPartnerData.description_vn);
      formDataToSend.append("description_en", editPartnerData.description_en);
      formDataToSend.append("isShow", editPartnerData.isShow);
      
      // Append file ảnh nếu có
      if (editPartnerData.images) {
        formDataToSend.append("images", editPartnerData.images);
      }

      // Debug FormData
      console.log("=== UPDATE PARTNER FORMDATA ===");
      console.log("FormData entries:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }

      await partnersController.update(selectedPartner.ID, formDataToSend);
      alert("Cập nhật đối tác thành công!");
      setShowEditModal(false);
      setEditPartnerData(initialFormState);
      setSelectedPartner(null);
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi cập nhật đối tác:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Xử lý xóa partner (soft delete)
  const handleDeletePartner = async (partnerId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đối tác này?")) {
      try {
        await partnersController.remove(partnerId);
        alert("Xóa đối tác thành công!");
        handleClearFilters();
      } catch (error) {
        console.error("Lỗi khi xóa đối tác:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại.");
      }
    }
  };

  // Xử lý bật/tắt hiển thị partner
  const handleToggleShow = async (partnerId) => {
    try {
      await partnersController.toggle(partnerId);
      alert("Cập nhật trạng thái hiển thị thành công!");
      handleClearFilters();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hiển thị:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Mở modal xem chi tiết
  const handleShowDetails = (partner) => {
    setSelectedPartner(partner);
    setShowDetailModal(true);
  };

  // Mở modal chỉnh sửa
  const handleShowEdit = (partner) => {
    setSelectedPartner(partner);
    setEditPartnerData({
      fullName_vn: partner.fullName_vn,
      fullName_en: partner.fullName_en,
      shortName: partner.shortName,
      images: null, // Reset file input
      level_vn: partner.level_vn,
      level_en: partner.level_en,
      description_vn: partner.description_vn,
      description_en: partner.description_en,
      isShow: partner.isShow,
    });
    setShowEditModal(true);
  };

  // Đóng modal
  const handleCloseDetails = () => {
    setShowDetailModal(false);
    setSelectedPartner(null);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedPartner(null);
    setEditPartnerData(initialFormState);
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
      <PageMetaData title="Quản lý đối tác" />

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
            <h5 className="mb-0">Danh sách đối tác ({dataTable.length} đối tác)</h5>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <IconifyIcon icon="mdi:plus" className="me-1" />
              Tạo mới
            </Button>
          </div>
          <Form className="row g-3 align-items-center">
            <Col xl={3} md={6}>
              <Form.Control
                type="text"
                placeholder="Tên đối tác..."
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
              />
            </Col>
            <Col xl={3} md={6}>
              <Form.Control
                type="text"
                placeholder="Tên đối tác (VN)..."
                name="fullName_vn"
                value={filters.fullName_vn}
                onChange={handleFilterChange}
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

      {/* Bảng dữ liệu partners */}
      <Card className="mt-3">
        <CardBody>
          <Table responsive hover className="text-nowrap align-middle">
            <thead className="table-light">
              <tr>
                <th>#ID</th>
                <th>Hình ảnh</th>
                <th>Tên đối tác</th>
                <th>Tên ngắn</th>
                <th>Chức vụ</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {dataTable.length > 0 ? (
                dataTable.map((partner, index) => (
                  <tr key={partner.ID || index}>
                    <td>
                      <strong>#{partner.ID}</strong>
                    </td>
                    <td>
                      {partner.images ? (
                        <Image
                          src={`${apiUrlNoApi}${partner.images}`}
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
                        style={{ width: 50, height: 50, display: partner.images ? 'none' : 'flex' }}
                      >
                        <IconifyIcon icon="mdi:image-outline" className="text-muted" />
                      </div> */}
                    </td>
                    <td>
                      <div>
                        <h6 className="mb-0">{partner.fullName_vn || "N/A"}</h6>
                        <small className="text-muted">{partner.fullName_en || "N/A"}</small>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info-subtle" className="text-info">
                        {partner.shortName || "N/A"}
                      </Badge>
                    </td>
                    <td>
                      <div>
                        <small className="text-muted">{partner.level_vn || "N/A"}</small>
                        <br />
                        <small className="text-muted">{partner.level_en || "N/A"}</small>
                      </div>
                    </td>
                    <td>
                      <Badge
                        pill
                        bg={partner.isShow ? "success-subtle" : "warning-subtle"}
                        className={partner.isShow ? "text-success" : "text-warning"}
                      >
                        {partner.isShow ? "Hiển thị" : "Ẩn"}
                      </Badge>
                    </td>
                    <td>{formatDate(partner.createDate)}</td>
                    <td className="text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleShowDetails(partner)}
                          title="Xem chi tiết"
                        >
                          <IconifyIcon icon="mdi:eye" />
                        </Button>
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleShowEdit(partner)}
                          title="Chỉnh sửa"
                        >
                          <IconifyIcon icon="mdi:pencil" />
                        </Button>
                        <Button
                          size="sm"
                          variant={partner.isShow ? "secondary" : "info"}
                          onClick={() => handleToggleShow(partner.ID)}
                          title={partner.isShow ? "Ẩn đối tác" : "Hiển thị đối tác"}
                        >
                          <IconifyIcon icon={partner.isShow ? "mdi:eye-off" : "mdi:eye"} />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeletePartner(partner.ID)}
                          title="Xóa đối tác"
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
                      <p className="text-muted mb-0">Thử thay đổi bộ lọc hoặc tạo đối tác mới</p>
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

      {/* Modal tạo partner mới */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tạo đối tác mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreatePartner}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên đối tác (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName_vn"
                    value={newPartnerData.fullName_vn}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tên đối tác..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên đối tác (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName_en"
                    value={newPartnerData.fullName_en}
                    onChange={handleInputChange}
                    placeholder="Enter partner name..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên ngắn</Form.Label>
                  <Form.Control
                    type="text"
                    name="shortName"
                    value={newPartnerData.shortName}
                    onChange={handleInputChange}
                    placeholder="Nhập tên ngắn..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Hình ảnh</Form.Label>
                  <Form.Control
                    type="file"
                    name="images"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">
                    Chọn file hình ảnh cho đối tác
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Chức vụ (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="level_vn"
                    value={newPartnerData.level_vn}
                    onChange={handleInputChange}
                    placeholder="VD: Giám đốc..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Chức vụ (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="level_en"
                    value={newPartnerData.level_en}
                    onChange={handleInputChange}
                    placeholder="VD: Director..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_vn"
                    value={newPartnerData.description_vn}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả đối tác..."
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
                    value={newPartnerData.description_en}
                    onChange={handleInputChange}
                    placeholder="Enter partner description..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isShow"
                    label="Hiển thị đối tác"
                    checked={newPartnerData.isShow}
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

      {/* Modal chỉnh sửa partner */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEdit}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa đối tác</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdatePartner}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên đối tác (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName_vn"
                    value={editPartnerData.fullName_vn}
                    onChange={handleEditInputChange}
                    required
                    placeholder="Nhập tên đối tác..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên đối tác (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName_en"
                    value={editPartnerData.fullName_en}
                    onChange={handleEditInputChange}
                    placeholder="Enter partner name..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên ngắn</Form.Label>
                  <Form.Control
                    type="text"
                    name="shortName"
                    value={editPartnerData.shortName}
                    onChange={handleEditInputChange}
                    placeholder="Nhập tên ngắn..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Hình ảnh</Form.Label>
                  <Form.Control
                    type="file"
                    name="images"
                    accept="image/*"
                    onChange={handleEditInputChange}
                  />
                  <Form.Text className="text-muted">
                    Chọn file hình ảnh mới để thay thế hình hiện tại
                  </Form.Text>
                  {selectedPartner?.images && (
                    <div className="mt-2">
                      <small className="text-muted">Hình hiện tại:</small>
                      <br />
                      <Image
                        src={`${apiUrlNoApi}${selectedPartner.images}`}
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
                  <Form.Label>Chức vụ (Tiếng Việt)</Form.Label>
                  <Form.Control
                    type="text"
                    name="level_vn"
                    value={editPartnerData.level_vn}
                    onChange={handleEditInputChange}
                    placeholder="VD: Giám đốc..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Chức vụ (Tiếng Anh)</Form.Label>
                  <Form.Control
                    type="text"
                    name="level_en"
                    value={editPartnerData.level_en}
                    onChange={handleEditInputChange}
                    placeholder="VD: Director..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả (Tiếng Việt)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_vn"
                    value={editPartnerData.description_vn}
                    onChange={handleEditInputChange}
                    placeholder="Nhập mô tả đối tác..."
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
                    value={editPartnerData.description_en}
                    onChange={handleEditInputChange}
                    placeholder="Enter partner description..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isShow"
                    label="Hiển thị đối tác"
                    checked={editPartnerData.isShow}
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
      {selectedPartner && (
        <Modal
          show={showDetailModal}
          onHide={handleCloseDetails}
          size="xl"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="d-flex align-items-center">
              <IconifyIcon icon="mdi:handshake" className="me-2 text-primary" />
              Chi tiết đối tác: {selectedPartner.fullName_vn}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4} className="text-center">
                <div className="mb-4">
                  {selectedPartner.images ? (
                    <Image
                      src={`${apiUrlNoApi}${selectedPartner.images}`}
                      fluid
                      className="mb-3 rounded shadow"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="bg-light rounded d-flex align-items-center justify-content-center mb-3 shadow" style={{ height: "300px" }}>
                      <IconifyIcon icon="mdi:image-outline" className="fs-48 text-muted" />
                    </div>
                  )}
                  <h4 className="mb-2">{selectedPartner.fullName_vn}</h4>
                  {selectedPartner.fullName_en && (
                    <p className="text-muted mb-3">{selectedPartner.fullName_en}</p>
                  )}
                  <div className="d-flex flex-column gap-2 align-items-center">
                    <Badge bg="info" className="fs-6 px-3 py-2">
                      <IconifyIcon icon="mdi:tag" className="me-1" />
                      {selectedPartner.shortName}
                    </Badge>
                    <Badge bg={selectedPartner.isShow ? "success" : "warning"} className="fs-6 px-3 py-2">
                      <IconifyIcon icon={selectedPartner.isShow ? "mdi:eye" : "mdi:eye-off"} className="me-1" />
                      {selectedPartner.isShow ? "Hiển thị" : "Ẩn"}
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
                        <h6 className="text-muted mb-2">ID Đối tác</h6>
                        <p className="mb-0 fw-bold">#{selectedPartner.ID}</p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Tên ngắn</h6>
                        <Badge bg="info" className="fs-6">
                          {selectedPartner.shortName}
                        </Badge>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Ngày tạo</h6>
                        <p className="mb-0">
                          <IconifyIcon icon="mdi:calendar-plus" className="me-1 text-info" />
                          {formatDate(selectedPartner.createDate)}
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="border rounded p-3 h-100">
                        <h6 className="text-muted mb-2">Cập nhật lần cuối</h6>
                        <p className="mb-0">
                          <IconifyIcon icon="mdi:calendar-edit" className="me-1 text-warning" />
                          {formatDate(selectedPartner.updateDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h5 className="mb-3 d-flex align-items-center">
                    <IconifyIcon icon="mdi:account-tie" className="me-2 text-success" />
                    Chức vụ
                  </h5>
                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <div className="border rounded p-3">
                        <h6 className="text-muted mb-2">
                          <IconifyIcon icon="mdi:flag-variant" className="me-1" />
                          Tiếng Việt
                        </h6>
                        <p className="mb-0">
                          {selectedPartner.level_vn || (
                            <span className="text-muted fst-italic">Chưa có chức vụ</span>
                          )}
                        </p>
                      </div>
                    </div>
                    {selectedPartner.level_en && (
                      <div className="col-12">
                        <div className="border rounded p-3">
                          <h6 className="text-muted mb-2">
                            <IconifyIcon icon="mdi:flag" className="me-1" />
                            Tiếng Anh
                          </h6>
                          <p className="mb-0">{selectedPartner.level_en}</p>
                        </div>
                      </div>
                    )}
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
                          {selectedPartner.description_vn || (
                            <span className="text-muted fst-italic">Chưa có mô tả</span>
                          )}
                        </p>
                      </div>
                    </div>
                    {selectedPartner.description_en && (
                      <div className="col-12">
                        <div className="border rounded p-3">
                          <h6 className="text-muted mb-2">
                            <IconifyIcon icon="mdi:flag" className="me-1" />
                            Tiếng Anh
                          </h6>
                          <p className="mb-0">{selectedPartner.description_en}</p>
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
              handleShowEdit(selectedPartner);
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

export default PartnersPage;

