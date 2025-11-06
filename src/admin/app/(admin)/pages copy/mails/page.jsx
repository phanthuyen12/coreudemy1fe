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
import { useNavigate } from "react-router-dom";
import { mailController } from "@/config/config";

// Dữ liệu ban đầu cho các thẻ thống kê
const initialStatsData = [
  {
    name: "TỔNG MAIL",
    amount: 0,
    icon: "mdi:email-multiple",
    iconColor: "primary",
  },
  {
    name: "MAIL MỚI",
    amount: 0,
    icon: "mdi:email-plus",
    iconColor: "success",
  },
  {
    name: "ĐÃ ĐỌC",
    amount: 0,
    icon: "mdi:email-check",
    iconColor: "info",
  },
  {
    name: "CHƯA ĐỌC",
    amount: 0,
    icon: "mdi:email-outline",
    iconColor: "warning",
  },
];

// Cấu hình số lượng mục hiển thị trên mỗi trang
const ITEMS_PER_PAGE = 10;

/**
 * Hàm tạo ra một mảng các mục cho thanh phân trang thông minh.
 * @param {number} currentPage - Trang hiện tại
 * @param {number} totalPages - Tổng số trang
 * @returns {Array} Mảng các mục phân trang
 */
const generatePaginationItems = (currentPage, totalPages) => {
  const items = [];
  const maxVisiblePages = 5; // Số trang tối đa hiển thị

  if (totalPages <= maxVisiblePages) {
    // Nếu tổng số trang ít hơn hoặc bằng maxVisiblePages, hiển thị tất cả
    for (let i = 1; i <= totalPages; i++) {
      items.push(i);
    }
  } else {
    // Logic phân trang thông minh
    if (currentPage <= 3) {
      // Hiển thị 1, 2, 3, 4, 5, ..., totalPages
      for (let i = 1; i <= 5; i++) {
        items.push(i);
      }
      if (totalPages > 5) {
        items.push("...");
        items.push(totalPages);
      }
    } else if (currentPage >= totalPages - 2) {
      // Hiển thị 1, ..., totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages
      items.push(1);
      items.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Hiển thị 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
      items.push(1);
      items.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        items.push(i);
      }
      items.push("...");
      items.push(totalPages);
    }
  }

  return items;
};

const MailsPage = () => {
  const navigate = useNavigate();
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(initialStatsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mailToDelete, setMailToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const [loadingMail, setLoadingMail] = useState(false);

  // Load mails data
  const loadMails = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
      };

      const response = await mailController.list(params);
      
      if (response.success) {
        setMails(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
        
        // Cập nhật stats
        setStatsData(prev => [
          { ...prev[0], amount: response.data.pagination?.totalItems || 0 },
          { ...prev[1], amount: response.data.newMails || 0 },
          { ...prev[2], amount: response.data.readMails || 0 },
          { ...prev[3], amount: response.data.unreadMails || 0 },
        ]);
      } else {
        console.error("Failed to load mails:", response.message);
      }
    } catch (error) {
      console.error("Error loading mails:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    loadMails();
  }, [loadMails]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadMails();
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle view mail
  const handleViewMail = async (mailId) => {
    try {
      setLoadingMail(true);
      const response = await mailController.getById(mailId);
      
      if (response.success) {
        console.log("Mail details:", response.data);
        setSelectedMail(response.data);
        setShowViewModal(true);
      } else {
        console.error("Failed to load mail:", response.message);
        alert("Không thể tải nội dung mail");
      }
    } catch (error) {
      console.error("Error loading mail:", error);
      alert("Có lỗi xảy ra khi tải mail");
    } finally {
      setLoadingMail(false);
    }
  };

  // Handle delete mail
  const handleDelete = async () => {
    if (!mailToDelete) return;

    try {
      const response = await mailController.remove(mailToDelete.id);
      
      if (response.success) {
        setShowDeleteModal(false);
        setMailToDelete(null);
        loadMails(); // Reload the list
      } else {
        console.error("Failed to delete mail:", response.message);
      }
    } catch (error) {
      console.error("Error deleting mail:", error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <PageMetaData title="Quản lý Mail" />
      
      <div className="page-content">
        <div className="container-fluid">
          {/* Stats Cards */}
          <Row className="mb-4">
            {statsData.map((stat, index) => (
              <Col key={index} xl={3} md={6}>
                <Card className="card-animate">
                  <CardBody>
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <p className="text-uppercase fw-medium text-muted text-truncate fs-13">
                          {stat.name}
                        </p>
                        <h4 className="fs-22 fw-semibold mb-0">
                          <span className="counter-value" data-target={stat.amount}>
                            {stat.amount}
                          </span>
                        </h4>
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`avatar-sm flex-shrink-0`}>
                          <span className={`avatar-title bg-${stat.iconColor}-subtle text-${stat.iconColor} rounded fs-18`}>
                            <IconifyIcon icon={stat.icon} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Main Content */}
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  {/* Search Bar */}
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form onSubmit={handleSearch}>
                        <div className="search-box">
                          <Form.Control
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm mail..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <IconifyIcon icon="mdi:magnify" className="search-icon" />
                        </div>
                      </Form>
                    </Col>
                    <Col md={6} className="text-end">
                      <Button
                        variant="primary"
                        onClick={handleSearch}
                        className="me-2"
                      >
                        <IconifyIcon icon="mdi:magnify" className="me-1" />
                        Tìm kiếm
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          setSearchTerm("");
                          setCurrentPage(1);
                        }}
                      >
                        <IconifyIcon icon="mdi:refresh" className="me-1" />
                        Làm mới
                      </Button>
                    </Col>
                  </Row>

                  {/* Table */}
                  <div className="table-responsive">
                    <Table className="table-nowrap table-hover">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col">Tên</th>
                          <th scope="col">Email</th>
                          <th scope="col">Nội dung</th>
                          <th scope="col">Ngày tạo</th>
                          <th scope="col">Trạng thái</th>
                          <th scope="col">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan={7} className="text-center py-4">
                              <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            </td>
                          </tr>
                        ) : mails.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-4">
                              <div className="text-muted">Không có mail nào</div>
                            </td>
                          </tr>
                        ) : (
                          mails.map((mail) => (
                            <tr key={mail.id}>
                              <td>
                                <Badge bg="primary">#{mail.id}</Badge>
                              </td>
                              <td>
                                <div className="fw-medium">
                                  {mail.firstName} {mail.lastName}
                                </div>
                              </td>
                              <td>
                                <div className="text-muted">{mail.email}</div>
                              </td>
                              <td>
                                <div className="text-truncate" style={{ maxWidth: '200px' }}>
                                  {mail.content}
                                </div>
                              </td>
                              <td>
                                <div className="text-muted">
                                  {formatDate(mail.createdAt)}
                                </div>
                              </td>
                              <td>
                                <Badge bg="success">Mới</Badge>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleViewMail(mail.id)}
                                    disabled={loadingMail}
                                  >
                                    <IconifyIcon icon="mdi:eye" />
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => {
                                      setMailToDelete(mail);
                                      setShowDeleteModal(true);
                                    }}
                                  >
                                    <IconifyIcon icon="mdi:delete" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="text-muted">
                        Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} đến{' '}
                        {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} trong tổng số {totalItems} mục
                      </div>
                      <Pagination className="mb-0">
                        <Pagination.Prev
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                        />
                        {generatePaginationItems(currentPage, totalPages).map((item, index) => (
                          <Pagination.Item
                            key={index}
                            active={item === currentPage}
                            onClick={() => typeof item === 'number' && handlePageChange(item)}
                            disabled={item === '...'}
                          >
                            {item}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                        />
                      </Pagination>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* View Mail Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <IconifyIcon icon="mdi:email" className="me-2" />
            Chi tiết Mail
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingMail ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Đang tải nội dung mail...</p>
            </div>
          ) : selectedMail ? (
            <div>
              {/* Mail Info */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <h6 className="text-muted mb-2">Thông tin người gửi</h6>
                    <p className="mb-1">
                      <IconifyIcon icon="mdi:account" className="me-1 text-primary" />
                      <strong>Tên:</strong> {selectedMail.firstName} {selectedMail.lastName}
                    </p>
                    <p className="mb-0">
                      <IconifyIcon icon="mdi:email" className="me-1 text-info" />
                      <strong>Email:</strong> {selectedMail.email}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <h6 className="text-muted mb-2">Thông tin thời gian</h6>
                    <p className="mb-1">
                      <IconifyIcon icon="mdi:calendar-plus" className="me-1 text-success" />
                      <strong>Ngày tạo:</strong> {formatDate(selectedMail.createDate)}
                    </p>
                    <p className="mb-0">
                      <IconifyIcon icon="mdi:calendar-edit" className="me-1 text-warning" />
                      <strong>Cập nhật:</strong> {formatDate(selectedMail.updateDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mail Content */}
              <div className="border rounded p-3">
                <h6 className="text-muted mb-3">
                  <IconifyIcon icon="mdi:message-text" className="me-1" />
                  Nội dung mail
                </h6>
                <div className="bg-light p-3 rounded">
                  <p className="mb-0" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {selectedMail.content}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <IconifyIcon icon="mdi:alert-circle" className="text-warning" style={{ fontSize: '48px' }} />
              <p className="mt-2 text-muted">Không thể tải nội dung mail</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa mail từ{' '}
          <strong>{mailToDelete?.firstName} {mailToDelete?.lastName}</strong>?
          <br />
          <small className="text-muted">Hành động này không thể hoàn tác.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MailsPage;



