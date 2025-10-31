import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import { useEffect, useMemo, useState } from 'react';
import { Card, Button, Table, Badge, Form, Modal, Pagination, Row, Col } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { coursesController } from "../../../../mvc/controllers/coursesController.js";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../../../../config/config.js";
import { withSwal } from 'react-sweetalert2';

const Courser = () => {
  const [courses, setCourses] = useState([]);
  const coursesControllers = new coursesController();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', description: '', image: '', active: 1, isHeadOfice: 0 });
  const [file, setFile] = useState(null);
  const [showVideosModal, setShowVideosModal] = useState(false);
  const [videosCourse, setVideosCourse] = useState(null);
  const [filter, setFilter] = useState({ page: 1, limit: 10, title: '', active:1 });
  const [total, setTotal] = useState(0);

  const onChangeForm = (e) => {
    const value = (e.target.name === 'active' || e.target.name === 'isHeadOfice') ? Number(e.target.value) : e.target.value;
    console.log(e.target.value)
    setForm({ ...form, [e.target.name]: value });
  };

  const onChangeFilter = (e) => {
    const value = e.target.name === 'active' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value;
    setFilter({ ...filter, [e.target.name]: value, page: 1 });
  };

  const clearFilter = () => setFilter({ page: 1, limit: 10, title: '', active: '' });

  const autoCodeFromName = (name) => name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 8);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await coursesControllers.getCourses({
        ...filter,
        active: filter.active === '' ? '' : filter.active // Gửi active dưới dạng số hoặc rỗng
      });
      // Chuyển đổi active từ true/false thành 1/0 nếu cần
      const coursesData = res.data.data.map(course => ({
        ...course,
        active: course.active ? 1 : 0
      }));
      setCourses(coursesData || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      Swal.fire({ title: 'Lỗi', text: 'Không thể tải danh sách khóa học', icon: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [filter.page, filter.limit, filter.title, filter.active]);

  useEffect(() => {
    if (form.name && !form.code) {
      setForm((prev) => ({ ...prev, code: autoCodeFromName(form.name) }));
    }
  }, [form.name]);

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
  const handlePageChange = (page) => setFilter({ ...filter, page });

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', code: '', description: '', image: '', active: 1, isHeadOfice: 0 });
    setFile(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.title,
      code: item.code,
      description: item.description,
      image: item.thumbnail || '',
      active: item.active, // Đã chuyển thành 1/0
      isHeadOfice: item.isHeadOfice !== undefined ? (item.isHeadOfice ? 1 : 0) : 0
    });
    setFile(null);
    setShowModal(true);
  };

  const onSubmitCourse = async (e) => {
    e.preventDefault();
    if (!form.name || !form.code) return;

    const formData = new FormData();
    formData.append('title', form.name);
    formData.append('description', form.description);
    formData.append('code', form.code);
    formData.append('active', form.active); // Gửi active dưới dạng 1/0
    formData.append('isHeadOfice', form.isHeadOfice); // Gửi isHeadOfice dưới dạng 1/0
    if (file) formData.append('thumbnail', file);

  try {
  if (editingId) {
    await coursesControllers.updateCourse(editingId, formData);
  } else {
    await coursesControllers.createCourses(formData);
  }
  await fetchCourses();
  Swal.fire({
    icon: 'success',
    title: 'Thành công',
    text: editingId ? 'Cập nhật khóa học thành công!' : 'Thêm khóa học thành công!',
    timer: 2000,
    showConfirmButton: false
  });
} catch (err) {
  console.error(err);
  Swal.fire({
    icon: 'error',
    title: 'Lỗi',
    text: 'Không thể lưu khóa học'
  });
}


    setShowModal(false);
  };

  const onDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        await coursesControllers.deleteCourse(id);
        await fetchCourses();
      } catch (err) {
        console.error(err);
        Swal.fire({ title: 'Lỗi', text: 'Không thể xóa khóa học', icon: 'error' });
      }
    }
  };

 const toggleStatus = async (id) => {
  const course = courses.find((c) => c.id === id);
  if (!course) return;

  try {
    await coursesControllers.updateCourse(id, { active: course.active === 1 ? 0 : 1 });
    await fetchCourses();
    swal.fire({
      icon: 'success',
      title: 'Cập nhật trạng thái!',
      text: `Khóa học "${course.title}" đã được ${course.active === 1 ? 'tạm dừng' : 'kích hoạt'}`,
      timer: 1500,
      showConfirmButton: false
    });
  } catch (err) {
    console.error(err);
    swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Không thể cập nhật trạng thái'
    });
  }
};

  const openVideos = (item) => {
    setVideosCourse(item);
    setShowVideosModal(true);
  };

  const onImageChange = (e) => {
    const fileSelected = e.target.files?.[0];
    if (!fileSelected) return;
    setFile(fileSelected);
    const imageUrl = URL.createObjectURL(fileSelected);
    setForm((prev) => ({ ...prev, image: imageUrl }));
  };

  return (
    <>
      <PageBreadcrumb subName="Pages" title="Danh mục Khóa Học" />
      <PageMetaData title="Danh mục Khóa Học" />

      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h4 className="card-title mb-0">DANH SÁCH KHÓA HỌC</h4>
            <Button size="sm" variant="primary" onClick={openAdd}>Thêm khóa học</Button>
          </div>

          {/* Bộ lọc */}
          <Form className="mt-3 p-3 bg-light border rounded">
            <Row className="g-3 align-items-end">
              <Col lg={4} md={6}>
                <Form.Label>Tìm kiếm</Form.Label>
                <Form.Control name="title" value={filter.title} onChange={onChangeFilter} placeholder="Tên / Mã khóa" />
              </Col>
              <Col lg={3} md={6}>
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select name="active" value={filter.active} onChange={onChangeFilter}>
                  <option value="">Tất cả</option>
                  <option value="1">Hoạt động</option>
                  <option value="0">Tạm dừng</option>
                </Form.Select>
              </Col>
              <Col lg={2} md={6} className="d-flex gap-2">
                <Button variant="info" className="w-100" onClick={fetchCourses}>Tìm kiếm</Button>
                <Button   variant="danger"   // full màu đỏ
  className="w-100" onClick={clearFilter}>Xóa lọc</Button>
              </Col>
            </Row>
          </Form>

          {/* Bảng */}
          <div className="table-responsive mt-3">
            <Table hover className="table-striped align-middle">
              <thead className="table-primary text-center">
                <tr>
                  <th>Ảnh</th>
                  <th>Tên khóa học</th>
                  <th>Mã</th>
                  <th>Mô tả</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center p-5">Đang tải dữ liệu...</td></tr>
                ) : courses.length === 0 ? (
                  <tr><td colSpan={7} className="text-center p-5">Không tìm thấy khóa học nào.</td></tr>
                ) : (
                  courses.map((c) => (
                    <tr key={c.id}>
                      <td className="text-center">
                        <img src={`${API_BASE_URL}/uploads/courses/${c.thumbnail}` || '/logo-sm.png'} alt={c.title} width={46} height={46} className="rounded object-fit-cover" />
                      </td>
                      <td className="text-muted"><strong>{c.title}</strong></td>
                      <td><Badge bg="primary">{c.code}</Badge></td>
                      <td className="text-muted">{c.description || '—'}</td>
                      <td className="text-center">
                        <Badge
                          bg={c.active === 1 ? 'success' : 'secondary'}
                          role="button"
                          onClick={() => toggleStatus(c.id)}
                        >
                          {c.active === 1 ? 'Hoạt động' : 'Tạm dừng'}
                        </Badge>
                      </td>
                      <td className="text-center">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="text-center d-flex justify-content-center gap-2">
  <Button size="sm" variant="primary" title="Sửa" onClick={() => openEdit(c)}>
    <Icon icon="mdi:pencil-outline" />
  </Button>
  
  <Button size="sm" variant="success" title="Thêm videos" onClick={() => openVideos(c)}>
    <Icon icon="mdi:video-plus-outline" />
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
              <span>Hiển thị {courses.length} trên tổng số {total} khóa học</span>
              <Pagination className="justify-content-end mt-3 mb-0">
                <Pagination.First disabled={filter.page === 1} onClick={() => handlePageChange(1)} />
                <Pagination.Prev disabled={filter.page === 1} onClick={() => handlePageChange(filter.page - 1)} />
                {getPaginationRange().map((page, idx) =>
                  page === '...' ? (
                    <Pagination.Ellipsis key={idx} disabled />
                  ) : (
                    <Pagination.Item
                      key={idx}
                      active={filter.page === Number(page)}
                      onClick={() => handlePageChange(Number(page))}
                    >
                      {page}
                    </Pagination.Item>
                  )
                )}
                <Pagination.Next disabled={filter.page === totalPages} onClick={() => handlePageChange(filter.page + 1)} />
                <Pagination.Last disabled={filter.page === totalPages} onClick={() => handlePageChange(totalPages)} />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal thêm/sửa */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={onSubmitCourse}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên khóa học</Form.Label>
                  <Form.Control name="name" value={form.name} onChange={onChangeForm} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Mã khóa (CODE)</Form.Label>
                  <Form.Control
                    name="code"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả ngắn</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={form.description} onChange={onChangeForm} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Ảnh đại diện</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={onImageChange} />
                 {/* Nếu đang edit */}
{editingId && form.image && (
  <div className="mt-2">
    <img
      src={form.image.startsWith('http') ? form.image : `${API_BASE_URL}/uploads/courses/${form.image}`}
      alt="preview"
      height={80}
      className="rounded"
    />
  </div>
)}

{/* Nếu thêm mới (không edit) */}
{!editingId && form.image && (
  <div className="mt-2">
    <img
      src={form.image}
      alt="preview"
      height={80}
      className="rounded"
    />
  </div>
)}

                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    name="active"
                    value={form.active}
                    onChange={onChangeForm}
                  >
                    <option value="1">Hoạt động</option>
                    <option value="0">Tạm dừng</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Loại khóa học</Form.Label>
                  <Form.Select
                    name="isHeadOfice"
                    value={form.isHeadOfice}
                    onChange={onChangeForm}
                  >
                    <option value="0">Khóa học phụ</option>
                    <option value="1">Khóa học chính</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowModal(false)}>Đóng</Button>
            <Button type="submit" variant="primary">Lưu</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal videos */}
      <Modal show={showVideosModal} onHide={() => setShowVideosModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm videos cho: {videosCourse?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-info mb-0">
            Tính năng quản lý videos sẽ được tích hợp ở bước tiếp theo (upload/list/sort).
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowVideosModal(false)}>Đóng</Button>
          <Button variant="primary" onClick={() => setShowVideosModal(false)}>Lưu</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default withSwal(Courser);
