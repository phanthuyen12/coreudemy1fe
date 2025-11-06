import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import { useEffect, useMemo, useState } from 'react';
import { Card, Button, Table, Form, Modal, Row, Col, Badge } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { documentCategoriesController } from '@/admin/mvc/controllers/documentCategoriesController.js';
import Swal from 'sweetalert2';

const DocumentCategoriesPage = () => {
  const ctrl = useMemo(() => new documentCategoriesController(), []);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [documentsPreview, setDocumentsPreview] = useState({ show: false, list: [], category: null });

  const load = async () => {
    try {
      setLoading(true);
      const res = await ctrl.list();
      const list = Array.isArray(res) ? res : (res?.data ?? res?.items ?? []);
      setItems(list);
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể tải danh mục' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (it) => {
    setEditingId(it.id);
    setForm({ name: it.name || '', description: it.description || '' });
    setShowModal(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    try {
      if (editingId) await ctrl.update(editingId, form);
      else await ctrl.create(form);
      await load();
      Swal.fire({ icon: 'success', title: 'Thành công', timer: 1200, showConfirmButton: false });
      setShowModal(false);
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể lưu' });
    }
  };

  const onDelete = async (id) => {
    const ok = await Swal.fire({ icon: 'warning', title: 'Xóa danh mục?', showCancelButton: true });
    if (!ok.isConfirmed) return;
    try {
      await ctrl.remove(id);
      await load();
      Swal.fire({ icon: 'success', title: 'Đã xóa', timer: 1000, showConfirmButton: false });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể xóa' });
    }
  };

  const previewDocuments = async (category) => {
    try {
      const res = await ctrl.documentsByCategory(category.id);
      const list = Array.isArray(res) ? res : (res?.data ?? res?.items ?? []);
      setDocumentsPreview({ show: true, list, category });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể lấy tài liệu' });
    }
  };

  return (
    <>
      <PageBreadcrumb subName="Pages" title="Danh mục tài liệu" />
      <PageMetaData title="Danh mục tài liệu" />

      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h4 className="card-title mb-0">DANH SÁCH DANH MỤC</h4>
            <Button size="sm" variant="primary" onClick={openAdd}>Thêm danh mục</Button>
          </div>

          <div className="table-responsive mt-3">
            <Table hover className="table-striped align-middle">
              <thead className="table-primary text-center">
                <tr>
                  <th>Tên</th>
                  <th>Mô tả</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center p-5">Đang tải dữ liệu...</td></tr>
                ) : (!Array.isArray(items) || items.length === 0) ? (
                  <tr><td colSpan={4} className="text-center p-5">Không có danh mục.</td></tr>
                ) : (
                  items.map((it) => (
                    <tr key={it.id}>
                      <td className="text-muted"><strong>{it.name}</strong></td>
                      <td className="text-muted">{it.description || '—'}</td>
                      <td className="text-center">{it.createdAt ? new Date(it.createdAt).toLocaleDateString() : '—'}</td>
                      <td className="text-center d-flex justify-content-center gap-2">
                        <Button size="sm" variant="info" title="Xem tài liệu" onClick={() => previewDocuments(it)}>
                          <Icon icon="mdi:eye-outline" />
                        </Button>
                        <Button size="sm" variant="primary" title="Sửa" onClick={() => openEdit(it)}>
                          <Icon icon="mdi:pencil-outline" />
                        </Button>
                        <Button size="sm" variant="danger" title="Xóa" onClick={() => onDelete(it.id)}>
                          <Icon icon="mdi:trash-can-outline" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
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
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Tên</Form.Label>
                  <Form.Control value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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

      <Modal show={documentsPreview.show} onHide={() => setDocumentsPreview({ show: false, list: [], category: null })} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tài liệu: {documentsPreview.category?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(documentsPreview.list || []).length === 0 ? (
            <div className="text-center text-muted">Không có tài liệu.</div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>Tiêu đề</th>
                    <th>Loại</th>
                    <th>Link</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {documentsPreview.list.map((d) => (
                    <tr key={d.id}>
                      <td>{d.title}</td>
                      <td><Badge bg="secondary">{d.type}</Badge></td>
                      <td><a href={d.link} target="_blank" rel="noreferrer">Mở</a></td>
                      <td>{d.isActive ? 'Active' : 'Inactive'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DocumentCategoriesPage;


