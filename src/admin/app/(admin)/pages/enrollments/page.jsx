import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import { useEffect, useState } from 'react';
import { Card, Button, Table, Badge, Form, Modal, Row, Col, Pagination } from 'react-bootstrap';
import { enrollmentsController } from '../../../../mvc/controllers/enrollmentsController.js';
import { memeberController } from '../../../../mvc/controllers/memebersController.js';
import { coursesController } from '../../../../mvc/controllers/coursesController.js';
import Swal from 'sweetalert2';

const controller = new enrollmentsController();
const userController = new memeberController();
const courseController = new coursesController();

const defaultForm = {
  userId: '',
  courseId: '',
  status: '',
  start_at: '',
  end_at: '',
  payment_status: '',
  voucher_code: '',
  note: ''
};

const EnrollmentPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...defaultForm });
  const [filter, setFilter] = useState({ page: 1, limit: 10, userId: '', courseId: '', status: '' });
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [enrollIdEditing, setEnrollIdEditing] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await controller.getEnrollments(filter);
      setEnrollments(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      Swal.fire('Lỗi', 'Không thể tải enrollments', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Lấy user/courses về cho Select
  const fetchUsersAndCourses = async () => {
    try {
      const userRes = await userController.getMemeber({ page: 1, limit: 999 });
      setUsers(userRes.data.data || []);
      const courseRes = await courseController.getCourses({ page: 1, limit: 999 });
      setCourses(courseRes.data.data || []);
    } catch (e) {
      // Silent error
    }
  };

  useEffect(() => { fetchData(); }, [filter]);
  useEffect(() => { if (showModal) fetchUsersAndCourses(); }, [showModal]);

  const onChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const onChangeFilter = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value, page: 1 });
  };
  const clearFilter = () => setFilter({ page: 1, limit: 10, userId: '', courseId: '', status: '' });
  const handlePageChange = (page) => setFilter({ ...filter, page });
  const totalPages = Math.max(Math.ceil(total / filter.limit), 1);

  const openAdd = () => {
    setShowModal(true);
    setForm({ ...defaultForm });
    setIsEdit(false);
    setEnrollIdEditing(null);
  };
  const openEdit = (enroll) => {
    setShowModal(true);
    setForm({
      userId: enroll.user?.id || '',
      courseId: enroll.course?.id || '',
      status: enroll.status || '',
      start_at: enroll.start_at ? enroll.start_at.substring(0, 16) : '',
      end_at: enroll.end_at ? enroll.end_at.substring(0, 16) : '',
      payment_status: enroll.payment_status || '',
      voucher_code: enroll.voucher_code || '',
      note: enroll.note || '',
    });
    setIsEdit(true);
    setEnrollIdEditing(enroll.id);
  };
  const closeModal = () => setShowModal(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (isEdit && enrollIdEditing) {
        data = await controller.updateEnrollment(enrollIdEditing, form);
        if (data.statusCode === 200) {
          Swal.fire('Thành công!', 'Cập nhật enrollment thành công', 'success');
        } else {
          Swal.fire('Lỗi!', 'Cập nhật enrollment thất bại', 'error');
        }
      } else {
        data = await controller.createEnrollment(form);
        if (data.statusCode === 200) {
          Swal.fire('Thành công!', 'Tạo enrollment thành công', 'success');
        } else {
          Swal.fire('Lỗi!', 'Tạo enrollment thất bại', 'error');
        }
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      Swal.fire('Lỗi!', 'Xử lý enrollment thất bại', 'error');
    }
  };

  const onDelete = async (id) => {
    const confirm = await Swal.fire({ title: 'Xác nhận', text: 'Xoá enrollment này?', icon: 'warning', showCancelButton: true });
    if (confirm.isConfirmed) {
      try {
        await controller.deleteEnrollment(id);
        fetchData();
      } catch (err) {
        Swal.fire('Lỗi', 'Không thể xoá enrollment', 'error');
      }
    }
  };

  return (
    <>
      <PageBreadcrumb subName="Pages" title="Enrollments" />
      <PageMetaData title="Enrollments" />
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">QUẢN LÝ ENROLLMENTS</h4>
            <Button variant="primary" onClick={openAdd}>Tạo Enrollment</Button>
          </div>
          {/* Filter */}
          <Form className="mb-3 p-3 bg-light border rounded">
            <Row className="g-3 align-items-end">
              <Col md={3}><Form.Label>User ID</Form.Label><Form.Control name="userId" value={filter.userId} onChange={onChangeFilter} /></Col>
              <Col md={3}><Form.Label>Course ID</Form.Label><Form.Control name="courseId" value={filter.courseId} onChange={onChangeFilter} /></Col>
              {/* <Col md={3}><Form.Label>Status</Form.Label><Form.Control name="status" value={filter.status} onChange={onChangeFilter} placeholder="Active/Pending/Cancel..." /></Col> */}
              <Col md={3} className="d-flex gap-2"><Button onClick={fetchData} variant="info">Tìm kiếm</Button><Button variant="danger" onClick={clearFilter}>Xoá lọc</Button></Col>
            </Row>
          </Form>

          {/* Table */}
          <div className="table-responsive">
            <Table >
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>User </th>
                  <th>Course ID</th>
                  <th>Status</th>
                  <th>Start At</th>
                  <th>End At</th>
                  <th>Payment</th>
                  <th>Voucher</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={12} className="text-center p-5">Đang tải...</td></tr>
                ) : enrollments.length === 0 ? (
                  <tr><td colSpan={12} className="text-center p-5">Không có dữ liệu.</td></tr>
                ) : enrollments.map(e => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.user?.username || e.user?.email || e.userId || '—'}</td>
                    <td>{e.course?.title || e.course?.code || e.courseId || '—'}</td>
                    <td><Badge bg="info">{e.status}</Badge></td>
                    <td>{e.start_at ? new Date(e.start_at).toLocaleString() : ''}</td>
                    <td>{e.end_at ? new Date(e.end_at).toLocaleString() : ''}</td>
                    <td>{e.payment_status}</td>
                    <td>{e.voucher_code}</td>
                    <td>{e.createdAt ? new Date(e.createdAt).toLocaleString() : ''}</td>
                    <td>{e.updatedAt ? new Date(e.updatedAt).toLocaleString() : ''}</td>
                    <td>{e.note}</td>
                    <td>
                      <Button size="sm" variant="warning" className="me-2" onClick={() => openEdit(e)}>
                        Sửa
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => onDelete(e.id)}>Xoá</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="justify-content-end mt-3 mb-0">
              <Pagination.First disabled={filter.page === 1} onClick={() => handlePageChange(1)} />
              <Pagination.Prev disabled={filter.page === 1} onClick={() => handlePageChange(filter.page - 1)} />
              {Array.from({ length: totalPages }).map((_, i) => (
                <Pagination.Item key={i + 1} active={filter.page === i + 1} onClick={() => handlePageChange(i + 1)}>{i + 1}</Pagination.Item>
              ))}
              <Pagination.Next disabled={filter.page === totalPages} onClick={() => handlePageChange(filter.page + 1)} />
              <Pagination.Last disabled={filter.page === totalPages} onClick={() => handlePageChange(totalPages)} />
            </Pagination>
          )}
        </Card.Body>
      </Card>

      {/* Modal tạo mới */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton><Modal.Title>{isEdit ? 'Cập nhật Enrollment' : 'Tạo Enrollment mới'}</Modal.Title></Modal.Header>
        <Form onSubmit={onSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>User</Form.Label>
                  <Form.Select name="userId" value={form.userId} onChange={onChangeForm} required>
                    <option value="">-- Chọn User --</option>
                    {users.map(u => (
                      <option value={u.id} key={u.id}>{u.username || u.email || u.id}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Course</Form.Label>
                  <Form.Select name="courseId" value={form.courseId} onChange={onChangeForm} required>
                    <option value="">-- Chọn Course --</option>
                    {courses.map(c => (
                      <option value={c.id} key={c.id}>{c.title || c.code || c.id}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={form.status} onChange={onChangeForm} required>
                    <option value="">-- Status --</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Start At</Form.Label>
                  <Form.Control type="datetime-local" name="start_at" value={form.start_at} onChange={onChangeForm} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>End At</Form.Label>
                  <Form.Control type="datetime-local" name="end_at" value={form.end_at} onChange={onChangeForm} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Payment Status</Form.Label>
                  <Form.Select name="payment_status" value={form.payment_status} onChange={onChangeForm} required>
                    <option value="">-- Payment --</option>
                    <option value="ngan_hang">Ngân hàng</option>
                    <option value="tien_mat">Tiền mặt</option>
                    <option value="free">Free</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}><Form.Group><Form.Label>Voucher</Form.Label><Form.Control name="voucher_code" value={form.voucher_code} onChange={onChangeForm} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Note</Form.Label><Form.Control name="note" value={form.note} onChange={onChangeForm} /></Form.Group></Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={closeModal}>Đóng</Button>
            <Button type="submit" variant="primary">{isEdit ? 'Cập nhật' : 'Lưu'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default EnrollmentPage;
