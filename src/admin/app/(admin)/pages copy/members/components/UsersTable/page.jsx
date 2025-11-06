import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Table, Badge, Form, Modal, Pagination } from 'react-bootstrap';
import { memeberController } from '../../../../../../mvc/controllers/memebersController';
import { withSwal } from 'react-sweetalert2';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const controller = new memeberController();

const UsersTable = ({ swal }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [filter, setFilter] = useState({ page: 1, limit: 10, role: '', email: '', phone: '', status: '', sort: 'DESC' });
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await controller.getMemeber(filter);
      setUsers(data.data.data || []);
      setTotal(data.data.total || 0);
    } catch (err) {
      console.error(err);
      swal.fire({ title: 'Lỗi', text: 'Không thể tải danh sách thành viên', icon: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const onChangeForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmitAddUser = async (e) => {
    e.preventDefault();
    try {
      const newMember = await controller.createMemeber(form);
      if (newMember.statusCode === 200) {
        swal.fire({ title: 'Thành công!', text: 'Tạo thành viên mới thành công.', icon: 'success', timer: 2000 });
        setForm({ username: '', password: '', email: '' });
        setShowAdd(false);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      swal.fire({ title: 'Lỗi', text: 'Tạo thành viên thất bại. Vui lòng thử lại.', icon: 'error' });
    }
  };

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value, page: 1 });
  };

  const clearFilter = () => {
    setFilter({ page: 1, limit: 10, role: '', email: '', phone: '', status: '', sort: 'DESC' });
  };

  const handlePageChange = (page) => setFilter({ ...filter, page });

  const totalPages = Math.ceil(total / filter.limit);

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= filter.page - delta && i <= filter.page + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    return range;
  };

  const toggleStatus = async (u) => {
    const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
    const result = await swal.fire({
      title: 'Xác nhận',
      text: `Bạn có chắc chắn muốn đổi trạng thái ${u.username} sang ${newStatus}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      reverseButtons: true
    });
    if (result.isConfirmed) {
      try {
        const res = await controller.toggleMemberStatus(u.id); // endpoint toggle status
        if (res.statusCode === 200) {
          swal.fire('Thành công!', `Thành viên ${u.username} đã được chuyển sang ${newStatus}.`, 'success');
          fetchUsers();
        } else {
          swal.fire('Lỗi!', `Không thể cập nhật trạng thái ${u.username}.`, 'error');
        }
      } catch (err) {
        console.error(err);
        swal.fire('Lỗi!', 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
      }
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <h4 className="card-title mb-0">DANH SÁCH THÀNH VIÊN</h4>
            <Button variant="primary" onClick={() => setShowAdd(true)}>
              <Icon icon="mdi:plus-circle-outline" className="me-1" /> Thêm thành viên
            </Button>
          </div>

          {/* Filter */}
          <Form className="mb-4 p-3 bg-light border rounded">
            <Row className="g-3 align-items-end">
              <Col lg={3} md={6}>
                <Form.Label>Email</Form.Label>
                <Form.Control placeholder="Tìm theo Email..." name="email" value={filter.email} onChange={onFilterChange} />
              </Col>
              <Col lg={3} md={6}>
                <Form.Label>Vai trò</Form.Label>
                <Form.Select name="role" value={filter.role} onChange={onFilterChange}>
                  <option value="">Tất cả vai trò</option>
                  <option value="ctv">Cộng tác viên</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Col>
              <Col lg={3} md={6}>
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select name="status" value={filter.status} onChange={onFilterChange}>
                  <option value="">Tất cả trạng thái</option>
                  <option value="Active">Hoạt động</option>
                  <option value="Inactive">Bị khóa</option>
                </Form.Select>
              </Col>
              <Col lg={3} md={6} className="d-flex gap-2">
                <Button variant="info" onClick={fetchUsers} className="w-100">
                  <Icon icon="mdi:magnify" className="me-1" /> Tìm kiếm
                </Button>
                <Button   variant="danger" // màu đỏ chuẩn Bootstrap
 onClick={clearFilter} className="w-100">
                  <Icon icon="mdi:filter-remove-outline" className="me-1" /> Xóa lọc
                </Button>
              </Col>
            </Row>
          </Form>

          {/* Table */}
          <div className="table-responsive">
            <Table hover className="table-striped align-middle text-center">
              <thead className="table-primary">
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Cấp bậc</th>
                  <th>Là Admin</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center p-5">Đang tải dữ liệu...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={7} className="text-center p-5">Không tìm thấy thành viên nào.</td></tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id}>
                      <td><strong>{u.username}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <Badge bg={u.role === 'admin' ? 'success-light' : 'danger-light'} text={u.role === 'admin' ? 'success' : 'danger'}>
                          {u.role === 'admin' ? 'Có' : 'Không'}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={u.status === 'Active' ? 'success-light' : 'danger-light'} text={u.status === 'Active' ? 'success' : 'danger'}>
                          {u.status}
                        </Badge>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="d-flex justify-content-center gap-2">
                        <Link to={`/page/members/${u.id}/?module=admin`} className="btn btn-sm btn-primary">
                          <Icon icon="mdi:pencil-outline" />
                        </Link>
                        <Button size="sm" variant={u.status === 'Active' ? 'danger' : 'success'} onClick={() => toggleStatus(u)}>
                          <Icon icon={u.status === 'Active' ? 'mdi:account-cancel-outline' : 'mdi:account-check-outline'} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center">
              <span>Hiển thị {users.length} trên tổng số {total} thành viên</span>
              <Pagination className="justify-content-end mt-3 mb-0">
                <Pagination.First disabled={filter.page === 1} onClick={() => handlePageChange(1)} />
                <Pagination.Prev disabled={filter.page === 1} onClick={() => handlePageChange(filter.page - 1)} />
                {getPaginationRange().map((page, idx) =>
                  page === '...' ? <Pagination.Ellipsis key={idx} disabled /> :
                    <Pagination.Item key={idx} active={filter.page === page} onClick={() => handlePageChange(page)}>{page}</Pagination.Item>
                )}
                <Pagination.Next disabled={filter.page === totalPages} onClick={() => handlePageChange(filter.page + 1)} />
                <Pagination.Last disabled={filter.page === totalPages} onClick={() => handlePageChange(totalPages)} />
              </Pagination>
            </div>
          )}

        </Card.Body>
      </Card>

      {/* Add User Modal */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm thành viên mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={onSubmitAddUser}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control name="username" value={form.username} onChange={onChangeForm} placeholder="Nhập username" required autoFocus />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={form.password} onChange={onChangeForm} placeholder="Nhập password" required />
            </Form.Group>
            <Form.Group className="mb-0">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={onChangeForm} placeholder="Nhập email" required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button  onClick={() => setShowAdd(false)}>Đóng</Button>
            <Button type="submit" variant="primary">Lưu</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default withSwal(UsersTable);
