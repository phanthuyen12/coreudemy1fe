import {
  Card,
  CardBody,
  Button,
  Table,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import IconifyIcon from "@/admin/components/wrappers/IconifyIcon";
import { profileController } from "@/config/config";

const ProfileInfoTableTab = ({ profile }) => {
  const { id } = useParams(); // Lấy id_employee từ URL
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(profile || null);

  // Form state
  const [formData, setFormData] = useState({
    id_employee: profile?.id_employee || id || "",
    pro_status: profile?.pro_status || "",
    experience: profile?.experience || "",
    project: profile?.project || "",
  });

  // Load dữ liệu hồ sơ
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await profileController.getByID(id);
      if (res && res.data) {
        setProfileData(res.data);
        setFormData({
          id_employee: res.data.id_employee,
          pro_status: res.data.pro_status || "",
          experience: res.data.experience || "",
          project: res.data.project || "",
        });
      } else {
        setProfileData(null);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải dữ liệu hồ sơ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  // Xử lý thay đổi dữ liệu form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mở modal thêm/cập nhật
  const handleAddOrUpdate = () => {
    setShowModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Lưu dữ liệu
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await profileController.create(formData);
      console.log(res)
      if (res.success===true) {
        alert(profileData ? "Cập nhật hồ sơ thành công!" : "Thêm hồ sơ mới thành công!");
        setShowModal(false);
        loadData(); // Reload lại dữ liệu sau khi lưu
      } else {
        alert("Không thể lưu dữ liệu!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi hệ thống khi lưu dữ liệu!");
    }
  };

  // Xóa hồ sơ
  const handleDelete = async (idE) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ này?")) {
      try {
        const res = await profileController.delete(idE);
      if (res.success===true) {
          alert("Đã xóa thành công!");
          setProfileData(null);
        } else {
          alert("Không thể xóa hồ sơ!");
        }
      } catch (err) {
        console.error(err);
        alert("Lỗi hệ thống khi xóa!");
      }
    }
  };

  const hasProfile = !!profileData;

  return (
    <div className="p-3">
      <Card className="shadow-none border mb-0">
        <CardBody className="p-3">
          {/* Header */}
          <div className="d-flex justify-content-end mb-3">
            <Button
              variant={hasProfile ? "primary" : "success"}
              className="d-flex align-items-center gap-1 py-1 px-3 fw-medium"
              style={{ borderRadius: "6px" }}
              onClick={handleAddOrUpdate}
            >
              <IconifyIcon icon={hasProfile ? "mdi:pencil-outline" : "mdi:plus"} />
              {hasProfile ? "Cập nhật Hồ sơ" : "Thêm Hồ sơ"}
            </Button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : hasProfile ? (
            <div className="table-responsive">
              <Table bordered hover className="mb-0 text-dark align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "8%" }}>Mã NV</th>
                    <th style={{ width: "25%" }}>Trình độ học vấn</th>
                    <th style={{ width: "25%" }}>Kinh nghiệm</th>
                    <th>Dự án tham gia</th>
                    <th style={{ width: "8%" }} className="text-center">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-bold text-center">{profileData.id_employee}</td>
                    <td style={{ whiteSpace: "pre-wrap" }}>{profileData.pro_status}</td>
                    <td style={{ whiteSpace: "pre-wrap" }}>{profileData.experience}</td>
                    <td style={{ whiteSpace: "pre-wrap" }}>{profileData.project}</td>
                    <td className="text-center">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(profileData.id)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-5">
              <IconifyIcon
                icon="mdi:account-off-outline"
                className="fs-48 text-muted mb-2"
              />
              <p className="mb-0 text-muted">
                Người dùng này <strong>chưa có</strong> hồ sơ cá nhân.
                <br />
                Nhấn <span className="fw-bold">“Thêm Hồ sơ”</span> để bắt đầu.
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal thêm / cập nhật hồ sơ */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {hasProfile ? "Cập nhật Hồ sơ nhân viên" : "Thêm Hồ sơ mới"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSave}>
          <Modal.Body>
            {/* Mã nhân viên (luôn hiển thị, readonly nếu có profile) */}
            <Form.Group className="mb-3">
              <Form.Label>Mã nhân viên</Form.Label>
              <Form.Control
                type="text"
                name="id_employee"
                value={formData.id_employee}
                onChange={handleChange}
                readOnly={!!hasProfile}
                required
              />
            </Form.Group>

            {/* Trình độ học vấn */}
            <Form.Group className="mb-3">
              <Form.Label>Trình độ học vấn</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="pro_status"
                value={formData.pro_status}
                onChange={handleChange}
                placeholder="Nhập thông tin bằng cấp, chứng chỉ..."
                required
              />
            </Form.Group>

            {/* Kinh nghiệm */}
            <Form.Group className="mb-3">
              <Form.Label>Kinh nghiệm làm việc</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Nhập thông tin kinh nghiệm công việc..."
              />
            </Form.Group>

            {/* Dự án */}
            <Form.Group>
              <Form.Label>Các dự án đã tham gia</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="project"
                value={formData.project}
                onChange={handleChange}
                placeholder="Liệt kê các dự án tiêu biểu..."
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="submit" variant="primary">
              {hasProfile ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileInfoTableTab;
