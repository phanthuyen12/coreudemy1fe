import PageBreadcrumb from "@/admin/components/layout/PageBreadcrumb";
import PageMetaData from "@/admin/components/PageTitle";
import { useState, useEffect } from "react";
import { videosProductController } from "../../../../mvc/controllers/videosProductController.js";
import {
  Card,
  Button,
  Table,
  Form,
  Modal,
  Pagination,
  Row,
  Col,
  
  Badge,
  Spinner,
} from "react-bootstrap";
import { Link } from 'react-router-dom';

import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import { coursesController } from "../../../../mvc/controllers/coursesController";
import { videoCategoriesController } from "../../../../mvc/controllers/videoCategoriesController.js";

const catCtrl = new videoCategoriesController();
const cCtrl = new coursesController();
const vCtrl = new videosProductController();

const CourseVideosPage = () => {
  const [courses, setCourses] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [modalCategories, setModalCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalVideos, setTotalVideos] = useState(0);

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    title: "",
    status: "",
    courseId: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    courseId: "",
    categoryId: "",
    title: "",
    file: null,
    url: "",
    duration: "",
    order: 1,
    description: "",
    access: "Free",
  });

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await vCtrl.getVideoProducts(filter);
      setVideos(res.data.data || []);
      setTotalVideos(res.data.total || 0);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể tải danh sách video!",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInitialData = async () => {
    const courseRes = await cCtrl.getCourses({
      page: 1,
      limit: 1000,
      active: 1,
    });
    const fetchedCourses = courseRes?.data?.data || [];
    setCourses(fetchedCourses);

    if (fetchedCourses.length > 0) {
      let allCats = [];
      const categoryPromises = fetchedCourses.map((course) =>
        catCtrl.getDetailCategory(course.id)
      );
      const results = await Promise.all(categoryPromises);
      
      // FIX 1: The spread operator error occurred here.
      // The API returns an object like { data: { data: [...] } }.
      // We need to access the inner `data.data` array before spreading it.
      // Using optional chaining `?.` prevents errors if the structure is missing.
      results.forEach((res) => {
        const cats = res?.data?.data;
        if (Array.isArray(cats)) {
            allCats.push(...cats);
        }
      });
      setAllCategories(allCats);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [filter]);

  const onChangeForm = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const onChangeFilter = (e) =>
    setFilter({ ...filter, [e.target.name]: e.target.value, page: 1 });
  const clearFilter = () =>
    setFilter({ page: 1, limit: 10, title: "", status: "", courseId: "" });
  const handlePageChange = (page) => setFilter({ ...filter, page });

  const openAdd = () => {
    setEditingId(null);
    setForm({
      courseId: "",
      categoryId: "",
      title: "",
      file: null,
      url: "",
      duration: "",
      order: 1,
      description: "",
      access: "Free",
    });
    setModalCategories([]);
    setShowModal(true);
  };

  const openEdit = async (item) => {
    setEditingId(item.id);
    setForm({ ...item, file: null, url: item.url || "" }); // Ensure form state is consistent
    if (item.courseId) {
      // FIX 2: Same issue as before, ensure we get the nested array.
      // The `modalCategories.map` error happened because you were setting an object to state, not an array.
      try {
        const res = await catCtrl.getDetailCategory(item.courseId);
        setModalCategories(res?.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch categories for editing:", error);
        setModalCategories([]);
      }
    }
    setShowModal(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.courseId || !form.categoryId) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng điền đầy đủ các trường bắt buộc!",
      });
      return;
    }
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "file" && form.file) {
        formData.append("video", form.file);
      } else if (form[key] !== null && key !== 'url') { // Don't send the temporary blob URL
        formData.append(key, form[key]);
      }
    });
    
    // Always set a status if it's not present
    if (!formData.has('status')) {
      formData.append("status", "1");
    }

    try {
      let response;
      if (editingId) {
        response = await vCtrl.updateVideoProduct(editingId, formData);
      } else {
        response = await vCtrl.createVideoProduct(formData);
      }

      if (
        response &&
        response.data &&
        (response.statusCode === 200 || response.statusCode === 201)
      ) {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
        setShowModal(false);
        fetchVideos(); // Refresh data after success
      } else {
        Swal.fire({
          icon: "error",
          title: "Có lỗi xảy ra",
          text: response?.message || "Unknown error",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Thao tác thất bại",
        text: error?.response?.data?.message || "Lỗi máy chủ",
      });
    }
  };

  const onDelete = (id) => {
    // Delete logic...
  };

  const totalPages = Math.max(1, Math.ceil(totalVideos / filter.limit));

  return (
    <>
      <PageBreadcrumb subName="Pages" title="Videos Khóa Học" />
      <PageMetaData title="Videos Khóa Học" />

      <div className="container-fluid">
        <Card>
          <Card.Body>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <h4 className="card-title mb-0">DANH SÁCH VIDEOS</h4>
              <Button size="sm" variant="primary" onClick={openAdd}>
                <Icon icon="mdi:video-plus-outline" className="me-1" /> Thêm
                video
              </Button>
            </div>

            <Form
              className="mt-3 p-3 bg-light border rounded"
              onSubmit={(e) => {
                e.preventDefault();
                fetchVideos();
              }}
            >
              <Row className="g-3 align-items-end">
                <Col lg={3} md={6}>
                  <Form.Label>Tìm kiếm</Form.Label>
                  <Form.Control
                    name="title"
                    value={filter.title}
                    onChange={onChangeFilter}
                    placeholder="Tiêu đề video"
                  />
                </Col>
                <Col lg={3} md={6}>
                  <Form.Label>Khóa học</Form.Label>
                   {/* FIX 3: This dropdown should control the 'filter' state, not the 'form' state. */}
                  <Form.Select
                    name="courseId"
                    value={filter.courseId}
                    onChange={onChangeFilter}
                  >
                    <option value="">Tất cả khóa học</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col lg={2} md={6}>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    name="status"
                    value={filter.status}
                    onChange={onChangeFilter}
                  >
                    <option value="">Tất cả</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </Form.Select>
                </Col>
                <Col lg={4} md={6} className="d-flex gap-2">
                  <Button variant="info" type="submit" className="w-100">
                    Tìm kiếm
                  </Button>
                  <Button
                    variant="danger"
                    className="w-100"
                    onClick={clearFilter}
                  >
                    Xóa lọc
                  </Button>
                </Col>
              </Row>
            </Form>

            <div className="table-responsive mt-3">
              <Table className=" align-middle text-center">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Khóa học</th>
                    <th>Danh mục</th>
                    <th>Tiêu đề</th>
                    <th>Thời lượng</th>
                    <th>Số thứ tự</th>
                    <th>Truy cập</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="text-center p-5">
                        <Spinner animation="border" /> Đang tải...
                      </td>
                    </tr>
                  ) : videos.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-5 text-center">
                        Không có dữ liệu.
                      </td>
                    </tr>
                  ) : (
                    videos.map((v, idx) => (
                      <tr key={v.id}>
                        <td>{(filter.page - 1) * filter.limit + idx + 1}</td>
                        <td>{v.course?.title || "—"}</td>
                        <td>{v.category?.title || "—"}</td>
                        <td className="text-start">
                          <strong>{v.title}</strong>
                        </td>
                        <td>{v.duration || "—"}</td>
                        <td>
                          <Badge bg="secondary">{v.order}</Badge>
                        </td>
                        <td>
                          <Badge
                            bg={v.access === "Free" ? "success" : "warning"}
                          >
                            {v.access}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={v.status ? "success" : "secondary"}>
                            {v.status ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="d-flex justify-content-center gap-2">
                          <Button size="sm" variant="light" title="Sửa" onClick={() => openEdit(v)}>
                              <Icon icon="mdi:pencil-outline" className="text-primary" />
                          </Button>
                          {/* Using Link is also fine, but button onClick is more consistent with the Add modal */}
                          {/* <Link to={`/page/videos/detail/${v.id}?module=admin`}>
                            <Button size="sm" variant="light" title="Sửa">
                                <Icon icon="mdi:pencil-outline" className="text-primary" />
                            </Button>
                          </Link> */}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>

            {totalPages > 1 && !loading && (
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  Hiển thị {videos.length} trên {totalVideos}
                </span>
                <Pagination className="justify-content-end mt-3 mb-0">
                  <Pagination.First
                    disabled={filter.page === 1}
                    onClick={() => handlePageChange(1)}
                  />
                  <Pagination.Prev
                    disabled={filter.page === 1}
                    onClick={() => handlePageChange(filter.page - 1)}
                  />
                  {/* Create a limited array for pagination items for better UI */}
                  {[...Array(totalPages).keys()].map((page) => (
                    <Pagination.Item
                      key={page + 1}
                      active={filter.page === page + 1}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {page + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={filter.page === totalPages}
                    onClick={() => handlePageChange(filter.page + 1)}
                  />
                  <Pagination.Last
                    disabled={filter.page === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                  />
                </Pagination>
              </div>
            )}
          </Card.Body>
        </Card>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingId ? "Chỉnh sửa video" : "Thêm video"}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={onSubmit}>
            <Modal.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Khóa học (*)</Form.Label>
                    <Form.Select
                      name="courseId"
                      value={form.courseId}
                      onChange={async (e) => {
                        const courseId = e.target.value;
                        setForm({ ...form, courseId, categoryId: "" });
                        if (courseId) {
                           // FIX 4: Final fix, again ensuring we get the nested array.
                          try {
                            const res = await catCtrl.getDetailCategory(courseId);
                            setModalCategories(res?.data?.data || []);
                          } catch (error) {
                            console.error("Failed to fetch categories:", error);
                            setModalCategories([]);
                          }
                        } else {
                          setModalCategories([]);
                        }
                      }}
                      required
                    >
                      <option value="">Chọn khóa học</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Danh mục (*)</Form.Label>
                    <Form.Select
                      name="categoryId"
                      value={form.categoryId}
                      onChange={onChangeForm}
                      required
                      disabled={!form.courseId || modalCategories.length === 0}
                    >
                      <option value="">Chọn danh mục</option>
                      {/* This .map will now work because modalCategories is guaranteed to be an array */}
                      {modalCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Tiêu đề (*)</Form.Label>
                    <Form.Control
                      name="title"
                      value={form.title}
                      onChange={onChangeForm}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Upload video</Form.Label>
                    <Form.Control
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Clean up previous blob URL to prevent memory leaks
                          if (form.url.startsWith('blob:')) {
                            URL.revokeObjectURL(form.url);
                          }
                          setForm({
                            ...form,
                            file,
                            url: URL.createObjectURL(file),
                          });
                        }
                      }}
                    />
                    {form.url && (
                      <video
                        key={form.url} // Add key to force re-render when src changes
                        src={form.url}
                        controls
                        width="100%"
                        className="mt-2 rounded"
                      />
                    )}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Thời lượng</Form.Label>
                    <Form.Control
                      name="duration"
                      value={form.duration}
                      onChange={onChangeForm}
                      placeholder="e.g., 12:34"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Số thứ tự</Form.Label>
                    <Form.Control
                      name="order"
                      type="number"
                      min={1}
                      value={form.order}
                      onChange={onChangeForm}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Truy cập</Form.Label>
                    <Form.Select
                      name="access"
                      value={form.access}
                      onChange={onChangeForm}
                    >
                      <option value="Free">Free</option>
                      <option value="Premium">Premium</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={form.description}
                      onChange={onChangeForm}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="light" onClick={() => setShowModal(false)}>
                Đóng
              </Button>
              <Button type="submit" variant="primary">
                Lưu
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default CourseVideosPage;



















