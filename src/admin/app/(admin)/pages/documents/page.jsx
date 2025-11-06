import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import { useEffect, useMemo, useState } from 'react';
import { Card, Button, Table, Form, Modal, Row, Col, Badge } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { documentsController } from '@/admin/mvc/controllers/documentsController.js';
import { documentCategoriesController } from '@/admin/mvc/controllers/documentCategoriesController.js';
import Swal from 'sweetalert2';

const DocumentsPage = () => {
  const ctrl = useMemo(() => new documentsController(), []);
  const categoriesCtrl = useMemo(() => new documentCategoriesController(), []);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    categoryId: '',
    title: '',
    description: '',
    link: '',
    type: '',
    uploadedBy: '',
    isActive: true
  });

  const load = async () => {
    try {
      setLoading(true);
      const [docs, cats] = await Promise.all([ctrl.list(), categoriesCtrl.list()]);
      const docsList = Array.isArray(docs) ? docs : (docs?.data ?? docs?.items ?? []);
      const catList = Array.isArray(cats) ? cats : (cats?.data ?? cats?.items ?? []);
      setItems(docsList);
      setCategories(catList);
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể tải dữ liệu' });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ categoryId: '', title: '', description: '', link: '', type: '', uploadedBy: '', isActive: true });
    setShowModal(true);
  };

  const openEdit = (it) => {
    setEditingId(it.id);
    setForm({
      categoryId: it.categoryId || '',
      title: it.title || '',
      description: it.description || '',
      link: it.link || '',
      type: it.type || '',
      uploadedBy: it.uploadedBy || '',
      isActive: !!it.isActive
    });
    setShowModal(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.link || !form.type) return;
    const payload = {
      categoryId: form.categoryId === '' ? undefined : Number(form.categoryId),
      title: form.title,
      description: form.description || undefined,
      link: form.link,
      type: form.type,
      uploadedBy: form.uploadedBy === '' ? undefined : Number(form.uploadedBy),
      isActive: !!form.isActive
    };
    try {
      if (editingId) await ctrl.update(editingId, payload);
      else await ctrl.create(payload);
      await load();
      Swal.fire({ icon: 'success', title: 'Thành công', timer: 1200, showConfirmButton: false });
      setShowModal(false);
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể lưu' });
    }
  };

  const onDelete = async (id) => {
    const ok = await Swal.fire({ icon: 'warning', title: 'Xóa tài liệu?', showCancelButton: true });
    if (!ok.isConfirmed) return;
    try {
      await ctrl.remove(id);
      await load();
      Swal.fire({ icon: 'success', title: 'Đã xóa', timer: 1000, showConfirmButton: false });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể xóa' });
    }
  };

  return (
    <>
      <PageBreadcrumb subName="Pages" title="Tài liệu" />
      <PageMetaData title="Tài liệu" />

      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h4 className="card-title mb-0">DANH SÁCH TÀI LIỆU</h4>
            <Button size="sm" variant="primary" onClick={openAdd}>Thêm tài liệu</Button>
          </div>

          <div className="table-responsive mt-3">
            <Table hover className="table-striped align-middle">
              <thead className="table-primary text-center">
                <tr>
                  <th>Tiêu đề</th>
                  <th>Danh mục</th>
                  <th>Loại</th>
                  <th>Link</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center p-5">Đang tải dữ liệu...</td></tr>
                ) : (!Array.isArray(items) || items.length === 0) ? (
                  <tr><td colSpan={7} className="text-center p-5">Không có tài liệu.</td></tr>
                ) : (
                  items.map((it) => {
                    const cat = (Array.isArray(categories) ? categories : []).find((c) => c.id === it.categoryId);
                    return (
                      <tr key={it.id}>
                        <td className="text-muted"><strong>{it.title}</strong></td>
                        <td>{cat ? cat.name : '—'}</td>
                        <td><Badge bg="secondary">{it.type}</Badge></td>
                        <td><a href={it.link} target="_blank" rel="noreferrer">Mở</a></td>
                        <td>{it.isActive ? 'Active' : 'Inactive'}</td>
                        <td className="text-center">{it.createdAt ? new Date(it.createdAt).toLocaleDateString() : '—'}</td>
                        <td className="text-center d-flex justify-content-center gap-2">
                          <Button size="sm" variant="primary" title="Sửa" onClick={() => openEdit(it)}>
                            <Icon icon="mdi:pencil-outline" />
                          </Button>
                          <Button size="sm" variant="danger" title="Xóa" onClick={() => onDelete(it.id)}>
                            <Icon icon="mdi:trash-can-outline" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Chỉnh sửa tài liệu' : 'Thêm tài liệu'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={onSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Danh mục</Form.Label>
                  <Form.Select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">— Không chọn —</option>
                    {(categories || []).map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Loại</Form.Label>
                  <Form.Control value={form.type} required onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="pdf, sheet, doc, slide" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Tiêu đề</Form.Label>
                  <Form.Control value={form.title} required onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Link</Form.Label>
                  <Form.Control type="url" value={form.link} required onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Uploaded By (User ID)</Form.Label>
                  <Form.Control value={form.uploadedBy} onChange={(e) => setForm({ ...form, uploadedBy: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="d-flex align-items-center gap-2" style={{ marginTop: 30 }}>
                  <Form.Check type="checkbox" checked={!!form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} label="Active" />
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
    </>
  );
};

export default DocumentsPage;


