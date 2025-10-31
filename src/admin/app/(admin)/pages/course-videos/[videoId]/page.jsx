import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Container,
  Alert,
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { videosProductController } from '../../../../../mvc/controllers/videosProductController';
import { coursesController } from '../../../../../mvc/controllers/coursesController';
import { videoCategoriesController } from '../../../../../mvc/controllers/videoCategoriesController';
import { API_BASE_URL } from "../../../../../../config/config.js";
import PageBreadcrumb from "@/admin/components/layout/PageBreadcrumb";
// Helper Component: CustomNotification
const CustomNotification = ({ show, message, type, onClose }) => {
  if (!show) return null;
  return (
    <Alert
      variant={type}
      onClose={onClose}
      dismissible
      className="position-fixed top-0 end-0 m-3"
      style={{ zIndex: 9999 }}
    >
      {message}
    </Alert>
  );
};

// Helper Component: PageMetaData
const PageMetaData = ({ title }) => {
  useEffect(() => { document.title = title; }, [title]);
  return null;
};

// Helper Component: PageBreadcrumb


// Khởi tạo controllers
const vCtrl = new videosProductController();
const cCtrl = new coursesController();
const vcCtrl = new videoCategoriesController();

// Main Component: VideoDetailPage
const VideoDetailPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    courseId: '',
    categoryId: '',
    duration: '',
    order: 1,
    access: 'Free',
    description: '',
    status: false, // true = Active, false = Inactive
    url: '',
    file: null, // State để lưu trữ đối tượng file sẽ upload
  });

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // 1. Lấy dữ liệu chi tiết của video khi component được render
  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        const res = await vCtrl.getVideoProductById(videoId);
        if (res?.data) {
          const data = res.data;
          // Chuyển đổi status từ API (vd: 'Active') sang boolean cho switch
          const statusBoolean = data.status === 'Active';

          setForm(prev => ({
            ...prev,
            ...data,
            status: statusBoolean,
          }));

          // Nếu có courseId, tải danh sách category tương ứng
          if (data.courseId) {
            fetchCategories(data.courseId);
          }
        }
      } catch (err) {
        console.error("Failed to fetch video details:", err);
        showNotification('Không thể tải dữ liệu video!', 'danger');
      }
    };
    
    fetchVideoDetail();
  }, [videoId]);
  
  // Lấy danh sách tất cả khóa học
  useEffect(() => {
    const fetchCourses = async () => {
        try {
          const res = await cCtrl.getCourses();
          if (res?.data) setCourses(res.data.data || []);
        } catch (err) {
          console.error("Failed to fetch courses:", err);
        }
    };
    fetchCourses();
  }, []);


  // Hàm lấy danh sách category theo courseId
  const fetchCategories = async (courseId) => {
    try {
      const res = await vcCtrl.getCategories({ courseId });
      setCategories(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories([]);
    }
  };

  // 2. Xử lý các thay đổi trên form
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'switch' ? checked : value,
    }));
  };

  // Xử lý khi thay đổi khóa học -> tải lại category
  const handleCourseChange = (e) => {
    const newCourseId = e.target.value;
    setForm(prev => ({ ...prev, courseId: newCourseId, categoryId: '' }));
    if (newCourseId) {
        fetchCategories(newCourseId);
    } else {
        setCategories([]);
    }
  };
  
  // 3. Xử lý khi người dùng chọn file mới
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        file: file, // Lưu đối tượng file thật
        url: URL.createObjectURL(file), // Tạo URL tạm thời để xem trước
      }));
    }
  };
  
  // 4. Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Thêm các trường dữ liệu vào formData
      formData.append('title', form.title);
      formData.append('courseId', form.courseId);
      formData.append('categoryId', form.categoryId);
      formData.append('duration', form.duration);
      formData.append('order', form.order);
      formData.append('access', form.access);
      formData.append('description', form.description);
      formData.append('status', form.status ? 'Active' : 'Inactive');

      // **Quan trọng**: Chỉ thêm file vào formData nếu người dùng đã chọn file mới
      if (form.file) {
        formData.append('url', form.file, form.file.name);
      }
      
      await vCtrl.updateVideoProduct(videoId, formData);
      showNotification('Dữ liệu đã được lưu thành công!', 'success');

    } catch (err) {
      console.error("Failed to save data:", err);
      showNotification('Lưu dữ liệu thất bại!', 'danger');
    }
  };

  // Hàm tiện ích hiển thị thông báo
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  return (
    <>
      <PageBreadcrumb subName="Pages" title="Chỉnh sửa chi tiết videos" />

      <PageMetaData title={`Chỉnh sửa: ${form.title || 'Video'}`} />
      <CustomNotification {...notification} onClose={() => setNotification(prev => ({ ...prev, show: false }))} />
        <Form onSubmit={handleSubmit}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center bg-light p-3">
              <h4 className="card-title mb-0">Thông tin Video: <span className="text-primary">{form.title}</span></h4>
              <div className="d-flex gap-2">
                <Button variant="secondary" onClick={() => navigate(-1)}>Quay lại</Button>
                <Button variant="primary" type="submit">Lưu thay đổi</Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="g-4">
                <Col lg={5}>
                  <h5 className="mb-3">Xem trước Video</h5>
                  <Card className="shadow-sm">
                    <Card.Body className="p-2">
                      {/* 5. Logic hiển thị video preview */}
                      {form.url ? (
                        <video
                          // Nếu url là 'blob:' -> dùng trực tiếp. Nếu không -> nối với URL của server.
                          src={form.url.startsWith('blob:') ? form.url : `${API_BASE_URL}/uploads/videos/${form.url}`}
                          controls
                          width="100%"
                          style={{ maxHeight: '400px', borderRadius: '8px', backgroundColor: '#000' }}
                        />
                      ) : (
                        <div
                          className="d-flex flex-column align-items-center justify-content-center bg-light text-muted"
                          style={{ height: '300px', borderRadius: '8px' }}
                        >
                          <span style={{ fontSize: '4rem' }}>🎬</span>
                          <p className="mt-2">Không có video để hiển thị</p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                  <Form.Group controlId="videoUpload" className="mt-3">
                    <Form.Label>Tải lên video mới (thay thế)</Form.Label>
                    <Form.Control type="file" accept="video/*" onChange={handleFileChange} />
                  </Form.Group>
                </Col>

                <Col lg={7}>
                  <h5 className="mb-3">Thông tin chi tiết</h5>
                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Tiêu đề Video</Form.Label>
                        <Form.Control required type="text" name="title" value={form.title} onChange={handleFormChange} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Thuộc Khóa học</Form.Label>
                        <Form.Select required name="courseId" value={form.courseId} onChange={handleCourseChange}>
                          <option value="">Chọn khóa học...</option>
                          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Thuộc Danh mục</Form.Label>
                        <Form.Select required name="categoryId" value={form.categoryId} onChange={handleFormChange} disabled={!form.courseId}>
                          <option value="">Chọn danh mục...</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}><Form.Group><Form.Label>Thời lượng (giây)</Form.Label><Form.Control type="number" name="duration" value={form.duration} onChange={handleFormChange} /></Form.Group></Col>
                    <Col md={4}><Form.Group><Form.Label>Số thứ tự</Form.Label><Form.Control type="number" name="order" value={form.order} onChange={handleFormChange} min={1} /></Form.Group></Col>
                    <Col md={4}><Form.Group><Form.Label>Quyền truy cập</Form.Label>
                      <Form.Select name="access" value={form.access} onChange={handleFormChange}>
                        <option value="Free">Free</option>
                        <option value="Premium">Premium</option>
                      </Form.Select>
                    </Form.Group></Col>
                    <Col md={12}><Form.Group><Form.Label>Mô tả ngắn</Form.Label><Form.Control as="textarea" rows={4} name="description" value={form.description || ''} onChange={handleFormChange} /></Form.Group></Col>
                    <Col md={12}>
                      <Form.Check
                        type="switch"
                        id="status-switch"
                        label="Trạng thái hoạt động"
                        name="status"
                        checked={form.status}
                        onChange={handleFormChange}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>
    </>
  );
};

export default VideoDetailPage;