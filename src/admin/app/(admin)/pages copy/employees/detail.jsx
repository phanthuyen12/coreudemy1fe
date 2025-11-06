import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom"; 
import {apiUrlNoApi} from "@/config/config"
import ProfileInfoTableTab from "./ProfileInfoTableTab";
import {
  Card,
  CardBody,
  Col,
  Row,
  Button,
  Badge,
  Image,
  Form,
  Tabs,
  Tab,
  ListGroup,
  Spinner, // Thêm Spinner để hiển thị trạng thái đang lưu
  Table,
} from "react-bootstrap";

import PageMetaData from "@/admin/components/PageTitle";
import IconifyIcon from "@/admin/components/wrappers/IconifyIcon";
// Giả định employeesController có phương thức DetailEmployees
import { employeesController } from "@/config/config"; 
import ProfileUserTableTab from  "./ProfileUserTableTab";
// Import avatar mẫu
import defaultAvatar from "@/assets/images/users/avatar-1.jpg";

// Hàm định dạng tiền tệ (Giữ nguyên)
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Hàm định dạng ngày/thời gian (Giữ nguyên)
const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return "N/A";
  const options = includeTime
    ? {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    : { year: "numeric", month: "2-digit", day: "2-digit" };
  try {
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  } catch (error) {
    return "N/A"; 
  }
};

// Component cho các thẻ thống kê (Giữ nguyên)
const StatCard = ({ icon, label, value, color }) => (
  <Col md={6} lg={3}>
    <Card className="shadow-sm border-0 h-100">
      <CardBody className="py-3">
        <div className="d-flex align-items-center">
          <div className="avatar-sm flex-shrink-0">
            <span
              className={`avatar-title bg-${color}-subtle text-${color} rounded-circle`}
              style={{ width: "45px", height: "45px" }}
            >
              <IconifyIcon icon={icon} className="fs-20" />
            </span>
          </div>
          <div className="ms-3 flex-grow-1">
            <p className="text-muted mb-1 text-truncate">{label}</p>
            <h5 className="mb-0 fw-bold">{value}</h5>
          </div>
        </div>
      </CardBody>
    </Card>
  </Col>
);

// Dữ liệu mẫu ban đầu (được dùng làm giá trị khởi tạo)
const initialUserData = {
  id: null,
  fullName: "Đang tải...",
  shortName: "...",
  levelName_vn: "N/A",
  levelName_en: "N/A",
  email: "N/A",
  phone: "N/A",
  degree: "N/A",
  description_vn: "N/A",
  description_en: "N/A",
  avatarPic: defaultAvatar, 
  isActive: false,
  tb_profiles: [],
  walletBalance: 0,
  totalDeposit: 0,
  totalSpent: 0,
  debt: 0,
  referrer: "Không có",
  discount: 0,
  createdAt: null, 
  updatedAt: null, 
  gender: "N/A",
};

// =======================================================
// COMPONENT CON: ProfileEditTab (Tab Chỉnh sửa thông tin)
// =======================================================
const ProfileEditTab = ({ userData, onSave, isSaving }) => {
  // State để quản lý dữ liệu form tạm thời
  const [formData, setFormData] = useState({
    fullName: userData.fullName,
    shortName: userData.shortName,
    email: userData.email,
    phone: userData.phone,
    levelName_vn: userData.levelName_vn,
    levelName_en: userData.levelName_en,
    degree: userData.degree,
    description_vn: userData.description_vn,
    description_en: userData.description_en,
    referrer: userData.referrer,
    discount: userData.discount,
    isActive: userData.isActive,
  });

  // State quản lý file avatar mới và preview
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(userData.avatarPic);
  
  // Cập nhật preview khi userData thay đổi (sau khi fetch hoặc save thành công)
  useEffect(() => {
    setPreviewAvatar(userData.avatarPic);
  }, [userData.avatarPic]);

  // Đồng bộ lại form khi dữ liệu người dùng thay đổi
  useEffect(() => {
    setFormData({
      fullName: userData.fullName,
      shortName: userData.shortName,
      email: userData.email,
      phone: userData.phone,
      levelName_vn: userData.levelName_vn,
      levelName_en: userData.levelName_en,
      degree: userData.degree,
      description_vn: userData.description_vn,
      description_en: userData.description_en,
      referrer: userData.referrer,
      discount: userData.discount,
      isActive: userData.isActive,
    });
  }, [userData]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatarFile(file);
      // Tạo URL tạm thời để xem trước ảnh
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSaving) return; // Ngăn chặn double submit

    // Tạo FormData để gửi dữ liệu (bao gồm file avatar nếu có)
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      // Chuyển boolean sang chuỗi để an toàn
      const normalizedValue = typeof value === "boolean" ? String(value) : value ?? "";
      fd.append(key, normalizedValue);
    });
    if (newAvatarFile) {
      fd.append("avatarPic", newAvatarFile);
    }

    // Debug: log FormData entries reliably
    try {
      const debugEntries = Array.from(fd.entries()).map(([k, v]) => [
        k,
        v instanceof File ? { name: v.name, size: v.size, type: v.type } : v,
      ]);
      console.log("FormData entries:", debugEntries);
    } catch (err) {
      console.log("Unable to inspect FormData entries", err);
    }

    onSave(fd);
    // Không cần reset form/file ở đây, component cha sẽ gọi fetchData hoặc
    // cập nhật lại state userData, từ đó useEffect trên sẽ cập nhật preview.
  };

  return (
    <div className="p-3">
      <Form onSubmit={handleSubmit}>
        <Row className="g-3 mb-4">
          <Col xs={12}>
            <h5 className="mb-3 fw-bold text-primary">Cập nhật Ảnh đại diện</h5>
            <div className="d-flex align-items-center gap-4">
              <Image
               src={`${apiUrlNoApi}/${previewAvatar}` ||`${apiUrlNoApi}/${defaultAvatar}`  } 
               
                roundedCircle
                width={100}
                height={100}
                className="border border-3 border-secondary"
                style={{ objectFit: "cover" }}
              />
              <div>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label className="text-muted mb-1">Chọn ảnh mới (JPG, PNG)</Form.Label>
                  <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
                </Form.Group>
                <p className="text-muted small">Ảnh hiện tại: **{userData.avatarPic.includes('http') || userData.avatarPic.includes('uploads') ? 'Đã tải lên' : 'Mặc định'}**</p>
              </div>
            </div>
          </Col>
        </Row>
        
        <Row className="g-3">
          {/* fullName */}
          <Col md={6}>
            <Form.Group>
              <Form.Label>Họ và Tên</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          {/* shortName */}
          <Col md={6}>
            <Form.Group>
              <Form.Label>Tên viết tắt/Username</Form.Label>
              <Form.Control
                type="text"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                required
              />
          </Form.Group>
          </Col>
          
          {/* email */}
          <Col md={6}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          
          {/* phone */}
          <Col md={6}>
            <Form.Group>
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          
          {/* levelName_vn */}
          <Col md={6}>
            <Form.Group>
              <Form.Label>Cấp bậc (VN)</Form.Label>
              <Form.Control 
                type="text"
                name="levelName_vn"
                value={formData.levelName_vn}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          {/* levelName_en */}
          <Col md={6}>
            <Form.Group>
              <Form.Label>Chức danh (EN)</Form.Label>
              <Form.Control
                type="text"
                name="levelName_en"
                value={formData.levelName_en}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>

            <div className="d-flex align-items-center justify-content-start mb-3">
                <Form.Check
                  type="switch"
                  id="isActiveSwitch"
                  label={formData.isActive ? "Đang hoạt động" : "Bị khóa"}
                  name="isActive"
                  checked={!!formData.isActive}
                  onChange={handleChange}
                  className="me-auto"
                />
              </div>
                        </Col>

          {/* degree */}
          <Col md={6}>
            <Form.Group>
              <Form.Label>Bằng cấp</Form.Label>
              <Form.Control
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          
          {/* description_vn */}
          <Col md={12}>
            <Form.Group>
              <Form.Label>Mô tả (Tiếng Việt)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description_vn"
                value={formData.description_vn}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          
          {/* description_en */}
          <Col md={12}>
            <Form.Group>
              <Form.Label>Mô tả (Tiếng Anh)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description_en"
                value={formData.description_en}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

         
          
          
          {/* Nút lưu */}
          <Col xs={12} className="text-end mt-4">
            {/* isActive: cho phép bật/tắt */}
            
            <Button variant="primary" type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};


// =======================================================
// COMPONENT CHÍNH: UserDetailPage
// =======================================================
const UserDetailPage = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(initialUserData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // State quản lý trạng thái lưu

  // State quản lý tài khoản người dùng liên kết (tab User)
  const [userAccounts, setUserAccounts] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);

  // Form tạo tài khoản mới
  const [newUserForm, setNewUserForm] = useState({
    userName: "",
    email: "",
    password: "",
    roles: "user",
    status: "active",
  });

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserForm(prev => ({ ...prev, [name]: value }));
  };

  // Hàm ánh xạ và xử lý dữ liệu profile (Giữ nguyên)
  const employeeProfile = useMemo(() => {
    if (userData.tb_profiles && userData.tb_profiles.length > 0) {
      return {
        id :userData.tb_profiles[0].id ,
        id_employee: userData.id,
        pro_status: "Đang làm việc", 
        experience: userData.tb_profiles[0].experience,
        project: userData.tb_profiles[0].project,
      };
    }
    return null; 
  }, [userData]);


  const fetchData = async (employeeId) => {
    setIsLoading(true);
    try {
      // Giả định API trả về đúng cấu trúc bạn cung cấp
      const res = await employeesController.DetailEmployees(employeeId);
      
      if (res && res.success && res.data) {
        const apiData = res.data;
        
        // **Xử lý URL Avatar**: Nếu là đường dẫn tương đối, có thể cần thêm baseURL
        const avatarUrl = apiData.avatarPic 
            ? (apiData.avatarPic.startsWith('http') ? apiData.avatarPic : `/${apiData.avatarPic}`) 
            : defaultAvatar;

        const mappedData = {
          ...initialUserData, 
          id: apiData.id,
          fullName: apiData.fullName,
          shortName: apiData.shortName, 
          levelName_vn: apiData.levelName_vn,
          levelName_en: apiData.levelName_en,
          email: apiData.email,
          phone: apiData.phone,
          degree: apiData.degree,
          description_vn: apiData.description_vn,
          description_en: apiData.description_en,
          avatarPic: avatarUrl,
          isActive: apiData.isActive,
          tb_profiles: apiData.tb_profiles,
          // Giả định: Sử dụng giá trị mặc định cho các trường còn lại
          createdAt: initialUserData.createdAt || new Date().toISOString(), 
          updatedAt: initialUserData.updatedAt || new Date().toISOString(),
          gender: initialUserData.gender, 
        };

        setUserData(mappedData);
      } else {
        console.error("Lỗi khi tải chi tiết người dùng:", res?.message || "Dữ liệu không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi API:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch danh sách tài khoản người dùng liên kết với employee
  const fetchUserAccounts = async (employeeId) => {
    setIsLoadingUsers(true);
    try {
      if (employeesController && typeof employeesController.getUsersByEmployee === "function") {
        const res = await employeesController.getUsersByEmployee(employeeId);
        if (res && res.success) {
          setUserAccounts(Array.isArray(res.data) ? res.data : []);
        } else {
          setUserAccounts([]);
        }
      } else {
        // Fallback mock nếu API không tồn tại
        setUserAccounts([]);
      }
    } catch (e) {
      console.error("Lỗi khi tải danh sách tài khoản:", e);
      setUserAccounts([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
      fetchUserAccounts(id);
    }
  }, [id]);

  // HÀM XỬ LÝ LƯU THÔNG TIN PROFILE
  const handleProfileSave = async (dataToSave) => {
    setIsSaving(true);
    console.log("Dữ liệu gửi lên API Update:", dataToSave);

    try {
        // Chuẩn hóa dữ liệu thành FormData nếu chưa phải
        let formDataToSend;
        if (dataToSave instanceof FormData) {
          formDataToSend = dataToSave;
        } else {
          formDataToSend = new FormData();
          Object.entries(dataToSave).forEach(([key, value]) => {
            const normalizedValue = typeof value === "boolean" ? String(value) : value ?? "";
            formDataToSend.append(key, normalizedValue);
          });
          if (dataToSave.newAvatarFile) {
            formDataToSend.append("avatarPic", dataToSave.newAvatarFile);
          }
        }

      //   // Gợi ý API mẫu (thay bằng API thật của bạn)
      //   const sampleApiUrl = `/api/employees/${userData.id || "update"}`;
      //   const response = await fetch(sampleApiUrl, {
      //     method: "POST",
      //     body: formDataToSend,
      //     // KHÔNG set "Content-Type" khi dùng FormData; trình duyệt tự thêm boundary
      //   });
      // const sampleApiUrl = `/api/employees/${userData.id || "update"}`;
        const response = await employeesController.updateEmployees(formDataToSend,userData.id)
        console.log(response)
        // Giả lập xử lý response: coi như API trả thành công
        if (response.success===false) {
          throw new Error(`API error ${response.status}`);
        }

        // // Nếu muốn đọc JSON
        // const result = await response.json();

        // // // Cập nhật state tạm thời từ dữ liệu form đã gửi (để UI phản hồi ngay)
        // let newAvatarUrl = userData.avatarPic;
        // const sentFile = (dataToSave instanceof FormData) ? (dataToSave.get("avatarPic") || null) : dataToSave.newAvatarFile;
        // if (sentFile instanceof File) {
        //   newAvatarUrl = URL.createObjectURL(sentFile);
        // }

        // setUserData(prevData => ({
        //     ...prevData,
        //     ...((dataToSave instanceof FormData) ? {
        //       fullName: formDataToSend.get("fullName") ?? prevData.fullName,
        //       shortName: formDataToSend.get("shortName") ?? prevData.shortName,
        //       email: formDataToSend.get("email") ?? prevData.email,
        //       phone: formDataToSend.get("phone") ?? prevData.phone,
        //       levelName_vn: formDataToSend.get("levelName_vn") ?? prevData.levelName_vn,
        //       levelName_en: formDataToSend.get("levelName_en") ?? prevData.levelName_en,
        //       degree: formDataToSend.get("degree") ?? prevData.degree,
        //       description_vn: formDataToSend.get("description_vn") ?? prevData.description_vn,
        //       description_en: formDataToSend.get("description_en") ?? prevData.description_en,
        //       referrer: formDataToSend.get("referrer") ?? prevData.referrer,
        //       discount: formDataToSend.get("discount") ?? prevData.discount,
        //       isActive: String(formDataToSend.get("isActive")).toLowerCase() === "true",
        //     } : dataToSave),
        //     avatarPic: newAvatarUrl,
        //     updatedAt: new Date().toISOString(),
        // }));

        alert("Cập nhật thông tin thành công!");

        // Thực tế nên fetch lại dữ liệu từ server để đồng bộ
        await fetchData(id);

    } catch (error) {
        console.error("Lỗi khi lưu thông tin:", error);
        alert("Lỗi khi cập nhật thông tin!");
    } finally {
        setIsSaving(false);
    }
  };

  // Handlers cho tab User Accounts
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!userData?.id) return;
    setIsSavingUser(true);
    try {
      if (employeesController && typeof employeesController.createUserForEmployee === "function") {
        const res = await employeesController.createUserForEmployee(userData.id, newUserForm);
        if (res && res.success) {
          await fetchUserAccounts(userData.id);
          setNewUserForm({ userName: "", email: "", password: "", roles: "user", status: "active" });
          alert("Tạo tài khoản thành công");
        } else {
          alert("Không thể tạo tài khoản");
        }
      } else {
        // Fallback: thêm local
        const newAccount = {
          id: Date.now(),
          userName: newUserForm.userName,
          email: newUserForm.email,
          roles: newUserForm.roles,
          status: newUserForm.status,
        };
        setUserAccounts(prev => [newAccount, ...prev]);
        setNewUserForm({ userName: "", email: "", password: "", roles: "user", status: "active" });
        alert("Tạo tài khoản (local) thành công");
      }
    } catch (e) {
      console.error(e);
      alert("Có lỗi xảy ra khi tạo tài khoản");
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleToggleUserStatus = async (account) => {
    const nextStatus = account.status === "active" ? "inactive" : "active";
    try {
      if (employeesController && typeof employeesController.toggleUserStatus === "function") {
        const res = await employeesController.toggleUserStatus(account.id, nextStatus);
        if (res && res.success) {
          setUserAccounts(prev => prev.map(u => u.id === account.id ? { ...u, status: nextStatus } : u));
        }
      } else {
        // Fallback local
        setUserAccounts(prev => prev.map(u => u.id === account.id ? { ...u, status: nextStatus } : u));
      }
    } catch (e) {
      console.error(e);
      alert("Không thể cập nhật trạng thái tài khoản");
    }
  };

  // Nếu đang tải dữ liệu, hiển thị loading
  if (isLoading) {
    return (
      <>
        <PageMetaData title="Chi tiết Người dùng" />
        <Card>
          <CardBody className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3">Đang tải thông tin người dùng ID: {id}...</p>
          </CardBody>
        </Card>
      </>
    );
  }

  // Phân rã dữ liệu đã được ánh xạ
  const {
    id: userId,
    fullName,
    shortName,
    levelName_vn,
    levelName_en,
    email,
    phone,
    degree,
    description_vn,
    description_en,
    avatarPic,
    isActive,
    gender, 
    referrer, 
    discount, 
    walletBalance, 
    totalDeposit, 
    totalSpent, 
    debt, 
    createdAt, 
    updatedAt, 
  } = userData;

  const statusText = isActive ? "Đang hoạt động" : "Bị khóa";
  const statusBg = isActive ? "success" : "danger";


  return (
    <>
      <PageMetaData title={`Chi tiết Người dùng: ${fullName}`} />

      {/* --- Header Section --- */}
      <Card className="mb-4 shadow-lg border-0">
        <CardBody className="py-3 px-4">
          <Row className="align-items-center">
            {/* Cột Avatar & Tên */}
            <Col lg={6}>
              <div className="d-flex align-items-center">
               <Image
  src={`${apiUrlNoApi}/${avatarPic}`}   // ✅ Kết hợp apiUrl + tên ảnh
  roundedCircle
  width={80}
  height={80}
  className="me-3 border border-3 border-primary"
  style={{ objectFit: "cover" }}
  alt="User Avatar"
/>

                <div>
                  <h3 className="mb-1 fw-bold">{fullName}</h3> 
                  <p className="text-muted mb-0">
                    @{shortName} | ID: #{userId}
                  </p>
                </div>
              </div>
            </Col>

            {/* Cột Trạng thái & Hành động */}
            <Col lg={6}>
              <div className="d-flex flex-wrap justify-content-lg-end align-items-center gap-2 mt-2 mt-lg-0">
                <Badge
                  bg={statusBg}
                  className="p-2 fw-medium fs-6"
                >
                  {statusText}
                </Badge>
                <Button
                  variant="primary"
                  className="d-flex align-items-center gap-1 py-1 px-3 fw-medium"
                  style={{ borderRadius: "6px" }}
                >
                  <IconifyIcon icon="mdi:pencil-outline" /> Chỉnh sửa nhanh
                </Button>
                <Button
                  
                  className="d-flex align-items-center gap-1 py-1 px-3 fw-medium text-dark"
                  style={{ borderRadius: "6px" }}
                >
                  <IconifyIcon icon="mdi:ticket-outline" /> Tạo Ticket
                </Button>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* --- Main Content Section (Bố cục 2 cột) --- */}
      <Row>
        {/* Cột trái: Thông tin cá nhân cơ bản (Sidebar) */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 mb-4">
            <CardBody>
              <h5 className="mb-3 text-primary d-flex align-items-center">
                <IconifyIcon
                  icon="mdi:account-box-outline"
                  className="me-2 fs-20"
                />{" "}
                Thông tin Liên hệ
              </h5>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0">
                  <span className="fw-medium d-block text-muted">Email</span>
                  {email}
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <span className="fw-medium d-block text-muted">
                    Số điện thoại
                  </span>
                  {phone}
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <span className="fw-medium d-block text-muted">Cấp bậc</span>
                  <Badge bg="info" className="p-1 fw-medium">
                    {levelName_vn}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <span className="fw-medium d-block text-muted">
                    Giới tính
                  </span>
                  {gender}
                </ListGroup.Item>
              </ListGroup>

              <h5 className="mt-4 mb-3 text-primary d-flex align-items-center">
                <IconifyIcon icon="mdi:school-outline" className="me-2 fs-20" />{" "}
                Học vấn
              </h5>
              <p className="mb-1 fw-medium text-muted">Bằng cấp:</p>
              <p className="mb-0">{degree}</p>

              <h5 className="mt-4 mb-3 text-primary d-flex align-items-center">
                <IconifyIcon
                  icon="mdi:information-outline"
                  className="me-2 fs-20"
                />{" "}
                Mô tả
              </h5>
              <p className="mb-2">
                <span className="fw-medium">Tiếng Việt:</span>{" "}
                {description_vn}
              </p>
              <p className="mb-0">
                <span className="fw-medium">Tiếng Anh:</span>{" "}
                {description_en}
              </p>
            </CardBody>
          </Card>
        </Col>

        {/* Cột phải: Các Tabs chi tiết */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 mb-4">
            <CardBody>
              <Tabs
                defaultActiveKey="basic-edit"
                id="user-details-tabs"
                className="mb-3"
              >
                {/* Tab 1: Chỉnh sửa thông tin */}
                <Tab
                  eventKey="basic-edit"
                  title={
                    <span className="d-flex align-items-center">
                      <IconifyIcon
                        icon="mdi:account-edit-outline"
                        className="me-1"
                      />{" "}
                      Chỉnh sửa thông tin {isSaving && <Spinner animation="border" size="sm" className="ms-2" />}
                    </span>
                  }
                >
                  {/* SỬ DỤNG COMPONENT MỚI */}
                  <ProfileEditTab userData={userData} onSave={handleProfileSave} isSaving={isSaving} />
                </Tab>

                {/* Tab 2: Hồ sơ cá nhân (Profile) */}
                <Tab
                  eventKey="profile-info"
                  title={
                    <span className="d-flex align-items-center">
                      <IconifyIcon
                        icon="mdi:account-details-outline"
                        className="me-1"
                      />{" "}
                      Hồ sơ cá nhân
                    </span>
                  }
                >
                  <ProfileInfoTableTab profile={employeeProfile} /> 
                </Tab>

                {/* Tab 3: Tài khoản người dùng (thay cho Bảo mật) */}
                <Tab
                  eventKey="user-accounts"
                  title={
                    <span className="d-flex align-items-center">
                      <IconifyIcon icon="mdi:account-key-outline" className="me-1" />{" "}
                      Tài khoản người dùng
                    </span>
                  }
                >
                 <ProfileUserTableTab profile={employeeProfile}/>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UserDetailPage;