import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import { useEffect, useMemo, useState } from 'react';
import { Card, Button, Table, Form, Modal, Pagination, Row, Col, Badge } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { videoCategoriesController } from '../../../../mvc/controllers/videoCategoriesController.js';
import { coursesController } from '../../../../mvc/controllers/coursesController.js';
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../../../../config/config.js";
import { withSwal } from 'react-sweetalert2';
const VideoCategoriesPage = () => {
  const [items, setItems] = useState([]);
  const ctrl = new videoCategoriesController();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', description: '', active: 1, courseId: '' });
  const [filter, setFilter] = useState({ page: 1, limit: 10, q: '', active: '', courseId: '' });
  const [total, setTotal] = useState(0);

  const onChangeForm = (e) => {
    const value = e.target.name === 'active' ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };
  const onChangeFilter = (e) => {
    const value = e.target.name === 'active' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value;
    setFilter({ ...filter, [e.target.name]: value, page: 1 });
  };
  const clearFilter = () => setFilter({ page: 1, limit: 10, q: '', active: '' });

  const autoCodeFromName = (name) => name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 8);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await ctrl.getCategories({ page: filter.page, limit: filter.limit, q: filter.q, active: filter.active, courseId: filter.courseId });
      const data = res?.data?.data || [];
      const normalized = data.map((c) => ({ ...c, active: c.active ? 1 : 0 }));
      setItems(normalized);
      setTotal(res?.data?.total || 0);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    const cCtrl = new coursesController();
    const res = await cCtrl.getCourses({ page: 1, limit: 1000, title: '', active: 1 });
    const list = (res?.data?.data || []).map((c) => ({ id: c.id, title: c.title }));
    setCourses(list);
  };

  useEffect(() => { fetchData(); }, [filter.page, filter.limit, filter.q, filter.active, filter.courseId]);
  useEffect(() => { fetchCourses(); }, []);
  useEffect(() => { if (form.name && !form.code) setForm((p) => ({ ...p, code: autoCodeFromName(form.name) })); }, [form.name]);

  const totalPages = Math.max(1, Math.ceil(total / filter.limit));
  const getPaginationRange = () => {
    const delta = 2; const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= filter.page - delta && i <= filter.page + delta)) range.push(i);
      else if (range[range.length - 1] !== '...') range.push('...');
    }
    return range;
  };
  const handlePageChange = (page) => setFilter({ ...filter, page });

  const openAdd = () => { setEditingId(null); setForm({ name: '', code: '', description: '', active: 1, courseId: '' }); setShowModal(true); };
  const openEdit = (item) => { setEditingId(item.id); setForm({ name: item.name || item.title, code: item.code, description: item.description, active: item.active, courseId: item.courseId || '' }); setShowModal(true); };

const onSubmit = async (e) => {
  e.preventDefault();
  if (!form.name || !form.code) return;

  const formData = new FormData();
  formData.append('title', form.name);
  formData.append('code', form.code);
  formData.append('description', form.description || '');
  formData.append('active', String(form.active));
  if (form.courseId) formData.append('courseId', String(form.courseId));

  try {
    let data;
    if (editingId) {
      data = await ctrl.updateCategory(editingId, formData);
    } else {
      data = await ctrl.createCategory(formData);
    }

    if (data) {
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: editingId
          ? 'Cập nhật khóa học thành công!'
          : 'Thêm khóa học thành công!',
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchData();
      setShowModal(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể lưu khóa học',
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Không thể lưu khóa học',
    });
  }
};


  const toggleStatusLocal = async (id) => {
    const current = items.find((x) => x.id === id);
    if (!current) return;
    const formData = new FormData();
    formData.append('active', current.active === 1 ? 0 : 1);
    await ctrl.updateCategory(id, formData);
    await fetchData();
  };

  return (
    <>
      <PageBreadcrumb subName="Pages" title="Danh mục Video" />
      <PageMetaData title="Danh mục Video" />

      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h4 className="card-title mb-0">DANH SÁCH DANH MỤC VIDEO</h4>
            <Button size="sm" variant="primary" onClick={openAdd}><Icon icon="mdi:folder-plus-outline" className="me-1" /> Thêm danh mục</Button>
          </div>

          <Form className="mt-3 p-3 bg-light border rounded">
            <Row className="g-3 align-items-end">
              <Col lg={4} md={6}>
                <Form.Label>Tìm kiếm</Form.Label>
                <Form.Control name="q" value={filter.q} onChange={onChangeFilter} placeholder="Tên / Mã" />
              </Col>
              <Col lg={3} md={6}>
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select name="active" value={filter.active} onChange={onChangeFilter}>
                  <option value="">Tất cả</option>
                  <option value="1">Hoạt động</option>
                  <option value="0">Tạm dừng</option>
                </Form.Select>
              </Col>
              <Col lg={3} md={6}>
                <Form.Label>Khóa học</Form.Label>
                <Form.Select name="courseId" value={filter.courseId} onChange={onChangeFilter}>
                  <option value="">Tất cả</option>
                  {(courses || []).map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col lg={2} md={6} className="d-flex gap-2">
                <Button variant="info" className="w-100" onClick={fetchData}>Tìm kiếm</Button>
                <Button  variant="danger" className="w-100" onClick={clearFilter}>Xóa lọc</Button>
              </Col>
            </Row>
          </Form>

          <div className="table-responsive mt-3">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên</th>
                  <th>Mã</th>
                  <th>Khóa học</th>
                  <th>Mô tả</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th style={{ width: 160 }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {(items || []).map((item, idx) => (
                  <tr key={item.id}>
                    <td>{(filter.page - 1) * filter.limit + idx + 1}</td>
                    <td>{item.name || item.title}</td>
                    <td>{item.code}</td>
                    <td>{(() => { const c = courses.find((x) => String(x.id) === String(item.courseId)); return c ? c.title : '-'; })()}</td>
                    <td>{item.description}</td>
                    <td>
                      <Badge bg={item.active === 1 ? 'success' : 'secondary'}>{item.active === 1 ? 'Hoạt động' : 'Tạm dừng'}</Badge>
                    </td>
                    <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openEdit(item)}>
                          <Icon icon="mdi:pencil" />
                        </Button>
                        <Button size="sm" variant={item.active === 1 ? 'warning' : 'success'} onClick={() => toggleStatusLocal(item.id)}>
                          <Icon icon="mdi:power" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!items || items.length === 0) && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted">Tổng: {total}</div>
            <Pagination className="mb-0">
              <Pagination.First disabled={filter.page === 1} onClick={() => handlePageChange(1)} />
              <Pagination.Prev disabled={filter.page === 1} onClick={() => handlePageChange(Math.max(1, filter.page - 1))} />
              {getPaginationRange().map((p, i) => p === '...' ? (
                <Pagination.Ellipsis key={`e-${i}`} disabled />
              ) : (
                <Pagination.Item key={p} active={p === filter.page} onClick={() => handlePageChange(p)}>{p}</Pagination.Item>
              ))}
              <Pagination.Next disabled={filter.page === totalPages} onClick={() => handlePageChange(Math.min(totalPages, filter.page + 1))} />
              <Pagination.Last disabled={filter.page === totalPages} onClick={() => handlePageChange(totalPages)} />
            </Pagination>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={onSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên</Form.Label>
                  <Form.Control name="name" value={form.name} onChange={onChangeForm} placeholder="Nhập tên" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Mã</Form.Label>
                  <Form.Control name="code" value={form.code} onChange={onChangeForm} placeholder="Tự sinh từ tên" required />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={form.description} onChange={onChangeForm} placeholder="Mô tả ngắn" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Khóa học</Form.Label>
                  <Form.Select name="courseId" value={form.courseId} onChange={onChangeForm} required>
                    <option value="">-- Chọn khóa học --</option>
                    {(courses || []).map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select name="active" value={form.active} onChange={onChangeForm}>
                    <option value="1">Hoạt động</option>
                    <option value="0">Tạm dừng</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button variant="primary" type="submit">Lưu</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default withSwal(VideoCategoriesPage);



