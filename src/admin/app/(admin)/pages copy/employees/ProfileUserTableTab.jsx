import { useState, useEffect, useCallback } from "react";
import { Row, Col, Form, Button, Table, Spinner, Badge } from "react-bootstrap";
import { useParams } from "react-router-dom"; 
import {userController} from "@/config/config"
// 💡 MOCK COMPONENT cho IconifyIcon
const IconifyIcon = ({ icon, className }) => {
  const iconMap = {
    'mdi:refresh': '↻', 
    'mdi:pencil': '✎', 
    'mdi:key-outline': '🔑', 
    'mdi:check': '✓', 
    'mdi:close': '✗', 
    'mdi:content-save-outline': '💾', 
    'mdi:cancel': '✖',
  };
  return <span className={className} style={{ display: 'inline-block', width: '1em', textAlign: 'center' }}>{iconMap[icon] || '■'}</span>;
};


// // 💡 MOCK CONTROLLER cho userController
// const mockUserController = (() => {
//     // Dữ liệu mock ban đầu.
//     let users = [
//         { id: 7, id_employee: "2", userName: "johndoe2", email: "johndoe2@example.com", roles: 1, status: "Active" },
//         // { id: 8, id_employee: "3", userName: "testuser", email: "test@example.com", roles: 0, status: "Deactivate" },
//     ];
//     let nextId = 9;

//     return {
//         getByEmPloy: async (id_employee) => {
//             await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
//             const filteredUsers = users.filter(u => u.id_employee === id_employee);
            
//             // Trả về success: true và data là mảng (có thể rỗng)
//             return { success: true, data: filteredUsers }; 
//         },
//         create: async (payload) => {
//             await new Promise(resolve => setTimeout(resolve, 500));
//             // Kiểm tra trùng lặp đơn giản
//             if (users.some(u => u.userName === payload.userName)) {
//                 return { success: false, message: "Username đã tồn tại (Mock)" };
//             }
//             const newUser = { id: nextId++, ...payload, createDate: new Date().toISOString() };
//             users.push(newUser);
//             return { success: true, data: newUser, message: "Tạo tài khoản thành công (Mock)" };
//         },
//         update: async (id, payload) => {
//             await new Promise(resolve => setTimeout(resolve, 500));
//             const index = users.findIndex(u => u.id === id);
//             if (index !== -1) {
//                 users[index] = { ...users[index], ...payload, updateDate: new Date().toISOString() };
//                 return { success: true, message: "Cập nhật thành công (Mock)" };
//             }
//             return { success: false, message: "Không tìm thấy user (Mock)" };
//         }
//     };
// })();
// const userController = mockUserController; 

// Hàm tiện ích để chuyển đổi Roles số thành chuỗi
const roleMap = {
  0: "User",
  1: "Admin",
};

const ProfileUserTableTab = ({ profile }) => {
  const { id } = useParams(); // Lấy id_employee từ URL (employee ID)
  const employeeId = id || "2"; // 💡 Mặc định là "2" để test với Mock Data ban đầu

  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [userAccounts, setUserAccounts] = useState([]);
  
  // 💡 STATE QUẢN LÝ ẨN/HIỆN FORM TẠO MỚI
  const [showCreateForm, setShowCreateForm] = useState(true);

  // State cho form TẠO mới
  const [newUserForm, setNewUserForm] = useState({
    userName: "",
    email: "",
    password: "",
    roles: 0, // Default 0 (User)
    status: "Active", // Match API capitalization
  });

  // --- STATE FOR EDITING (BASIC INFO) ---
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    userName: "",
    email: "",
    roles: 0, 
    status: "Active", 
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // --- STATE FOR PASSWORD EDITING ---
  const [passwordEditingId, setPasswordEditingId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  // --- END STATE FOR EDITING ---


  // Sử dụng useCallback để tránh tạo lại hàm khi component re-render
  const fetchUserAccounts = useCallback(async (id_employee) => {
    if (!id_employee) return;
    
    try {
      setIsLoadingUsers(true);
      const res = await userController.getByEmPloy(id_employee);
      
      let normalizedData = [];

      if (res.success && res.data) {
        const apiData = res.data;
        // Chuẩn hóa dữ liệu: nếu là object thì chuyển thành mảng 1 phần tử
        normalizedData = Array.isArray(apiData) ? apiData : (apiData ? [apiData] : []);
        setUserAccounts(normalizedData);
      } else {
        setUserAccounts([]);
      }

      // 💡 LOGIC KIỂM TRA: Chỉ hiển thị form tạo mới nếu danh sách rỗng
      setShowCreateForm(normalizedData.length === 0);
      
    } catch (error) {
      console.error("Lỗi khi tải danh sách tài khoản:", error);
      setUserAccounts([]);
      // Nếu có lỗi, ta vẫn cho phép tạo mới phòng khi lỗi là do chưa có data
      setShowCreateForm(true); 
    } finally {
      setIsLoadingUsers(false);
    }
  }, []); 

  useEffect(() => {
    if (employeeId) {
      fetchUserAccounts(employeeId);
    }
  }, [employeeId, fetchUserAccounts]);

  // Handler cho form TẠO MỚI 
  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    // Chuyển value sang số nếu là trường roles
    const parsedValue = name === 'roles' ? parseInt(value, 10) : value;
    setNewUserForm((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setIsSavingUser(true);
      
      const payload = {
        ...newUserForm,
        id_employee: employeeId, // Bổ sung id_employee vào payload
      };
      
      const res = await userController.create(payload);
      
      if (res.success===false) {
        throw new Error(res.message || "Tạo tài khoản thất bại");
      }
      else{
        // Sử dụng alert() để thông báo thành công (theo code gốc)
        alert('Tạo tài khoản thành công');
      }
      // Tải lại danh sách sau khi tạo thành công. fetchUserAccounts sẽ cập nhật showCreateForm
      await fetchUserAccounts(employeeId);
      
      // Reset form
      setNewUserForm({
        userName: "",
        email: "",
        password: "",
        roles: 0, 
        status: "Active",
      });

    } catch (error) {
      console.error("Lỗi tạo tài khoản:", error);
      // Sử dụng alert() để thông báo lỗi (theo code gốc)
      alert(`Lỗi tạo tài khoản: ${error.message}`);
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleToggleUserStatus = async (acc) => {
    try {
      // Đảm bảo chỉ gửi "Active" hoặc "Deactivate"
      const currentStatus = acc.status?.toLowerCase() === "active" ? "Active" : "Deactivate";
      const newStatus = currentStatus === "Active" ? "Deactivate" : "Active";
     const payload={ status: newStatus }
        const res = await userController.update(acc.id, payload);

    //   const res = await userController.update(acc.id, { status: newStatus });
      
      if (res.success) {
        fetchUserAccounts(employeeId);
      } else {
        throw new Error(res.message || "Cập nhật trạng thái thất bại");
      }

    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      // Sử dụng alert() để thông báo lỗi (theo code gốc)
      alert(`Lỗi cập nhật trạng thái: ${error.message}`);
    }
  };

  // --- HANDLERS CHO CHỨC NĂNG CHỈNH SỬA THÔNG TIN CƠ BẢN (EDIT) ---
  const handleStartEdit = (user) => {
    if (isUpdating || isSavingUser || passwordEditingId !== null) return; 

    setEditingId(user.id);
    setEditFormData({
      userName: user.userName,
      email: user.email,
      roles: parseInt(user.roles, 10) || 0,
      status: user.status || "Active",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'roles' ? parseInt(value, 10) : value;
    setEditFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ userName: "", email: "", roles: 0, status: "Active" });
  };
  
  const handleUpdateUser = async (e, userId) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      
      const payload = {
        userName: editFormData.userName,
        email: editFormData.email,
        roles: editFormData.roles,
        status: editFormData.status,
      };
      console.log(payload)
      const res = await userController.update(userId, payload); 
      console.log(res)
      if (res.success === false) {
        throw new Error(res.message || "Cập nhật tài khoản thất bại");
      } else {
        // Sử dụng alert() để thông báo thành công (theo code gốc)
        alert('Cập nhật tài khoản thành công');
      }

      await fetchUserAccounts(employeeId);
      handleCancelEdit(); 

    } catch (error) {
      console.error("Lỗi cập nhật tài khoản:", error);
      // Sử dụng alert() để thông báo lỗi (theo code gốc)
      alert(`Lỗi cập nhật tài khoản: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };
  // --- END HANDLERS CHO CHỨC NĂNG CHỈNH SỬA THÔNG TIN CƠ BẢN (EDIT) ---


  // --- HANDLERS CHO CHỨC NĂNG CẬP NHẬT MẬT KHẨU ---
  const handleStartPasswordEdit = (userId) => {
    // Vô hiệu hóa khi đang chỉnh sửa thông tin cơ bản
    if (editingId !== null || isUpdating || isSavingUser) return;
    setPasswordEditingId(userId);
    setNewPassword(""); // Đảm bảo trường mật khẩu mới luôn rỗng khi bắt đầu chỉnh sửa
  };

  const handleCancelPasswordEdit = () => {
    setPasswordEditingId(null);
    setNewPassword("");
  };

  const handlePasswordUpdate = async (e, userId) => {
    e.preventDefault();
    if (newPassword.length < 6) {
        // Sử dụng alert() để thông báo lỗi (theo code gốc)
        alert("Mật khẩu phải có ít nhất 6 ký tự.");
        return;
    }

    try {
        setIsPasswordUpdating(true);
        
        const payload = { password: newPassword };
        const res = await userController.update(userId, payload);

        if (res.success === false) {
            throw new Error(res.message || "Cập nhật mật khẩu thất bại");
        } else {
            // Sử dụng alert() để thông báo thành công (theo code gốc)
            alert('Cập nhật mật khẩu thành công!');
        }

        handleCancelPasswordEdit();

    } catch (error) {
        console.error("Lỗi cập nhật mật khẩu:", error);
        // Sử dụng alert() để thông báo lỗi (theo code gốc)
        alert(`Lỗi cập nhật mật khẩu: ${error.message}`);
    } finally {
        setIsPasswordUpdating(false);
    }
  };
  // --- END HANDLERS CHO CHỨC NĂNG CẬP NHẬT MẬT KHẨU ---

  if (isLoadingUsers) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <Spinner animation="border" size="sm" className="me-2" />{" "}
        Đang tải danh sách tài khoản...
      </div>
    );
  }

  return (
    <div className="p-3">
      
      {/* SECTION 1: DANH SÁCH TÀI KHOẢN (TABLE) */}
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
        <h5 className="mb-0 fw-bold text-primary">Danh sách tài khoản</h5>
        <Button
          size="sm"
          variant="danger"
          onClick={() => fetchUserAccounts(employeeId)}
          title="Làm mới danh sách"
          disabled={editingId !== null || isUpdating || isSavingUser || passwordEditingId !== null || isPasswordUpdating}
        >
          <IconifyIcon icon="mdi:refresh" className="me-1" /> Làm mới
        </Button>
      </div>

      <div className="shadow-sm rounded-lg overflow-hidden border">
        <Table striped bordered hover responsive className="align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Status</th>
              
              {/* 💡 CHỈNH SỬA: Tăng chiều rộng cột Hành động */}
              <th className="text-center" style={{ width: '320px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {userAccounts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted py-3">
                  Chưa có tài khoản nào được liên kết với nhân viên này.
                </td>
              </tr>
            ) : (
              userAccounts.map((acc, idx) => {
                const isAccountActive = acc.status?.toLowerCase() === "active";
                const isEditing = acc.id === editingId;
                const isPasswordFormActive = acc.id === passwordEditingId;

                return (
                  <>
                    <tr key={acc.id || idx}>
                      <td>{idx + 1}</td>
                      <td>{isEditing ? (
                          <Form.Control
                            type="text"
                            name="userName"
                            value={editFormData.userName}
                            onChange={handleEditChange}
                            required
                            size="sm"
                          />
                      ) : acc.userName}</td>
                      <td>{isEditing ? (
                          <Form.Control
                            type="email"
                            name="email"
                            value={editFormData.email}
                            onChange={handleEditChange}
                            required
                            size="sm"
                          />
                      ) : acc.email}</td>
                      <td>
                        {isEditing ? (
                          <Form.Select
                            name="roles"
                            value={editFormData.roles}
                            onChange={handleEditChange}
                            size="sm"
                          >
                            <option value={0}>User</option>
                            <option value={1}>Admin</option>
                          </Form.Select>
                        ) : (
                          <Badge bg={acc.roles === 1 ? "info" : "secondary"}>
                            {roleMap[acc.roles] || acc.roles}
                          </Badge>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <Form.Select
                            name="status"
                            value={editFormData.status}
                            onChange={handleEditChange}
                            size="sm"
                          >
                            <option value="Active">Active</option>
                            <option value="Deactivate">Deactivate</option>
                          </Form.Select>
                        ) : (
                          <Badge bg={isAccountActive ? "success" : "danger"}>
                            {acc.status}
                          </Badge>
                        )}
                      </td>
                      <td className="text-center">
                        {isEditing ? (
                          <>
                            <Button 
                              variant="success" 
                              size="sm" 
                              className="me-2" 
                              onClick={(e) => handleUpdateUser(e, acc.id)}
                              disabled={isUpdating}
                              title="Lưu thay đổi"
                            >
                              {isUpdating ? <Spinner animation="border" size="sm" /> : <IconifyIcon icon="mdi:check" />}
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={handleCancelEdit}
                              disabled={isUpdating}
                              title="Hủy bỏ"
                            >
                              <IconifyIcon icon="mdi:close" />
                            </Button>
                          </>
                        ) : (
                          // 💡 PHẦN ĐÃ CHỈNH SỬA: DÙNG d-flex ĐỂ SẮP XẾP CÁC PHẦN TỬ TRÊN MỘT HÀNG
                          <div className="d-flex align-items-center justify-content-center">
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-2"
                              onClick={() => handleStartEdit(acc)}
                              disabled={editingId !== null || isUpdating || isSavingUser || isPasswordFormActive || isPasswordUpdating}
                              title="Chỉnh sửa thông tin cơ bản"
                            >
                              <IconifyIcon icon="mdi:pencil" className="me-1" /> Edit
                            </Button>
                            
                            <Button 
                              variant="warning" 
                              size="sm" 
                              className="me-3" // Tăng khoảng cách để phân tách rõ ràng
                              onClick={() => handleStartPasswordEdit(acc.id)}
                              disabled={editingId !== null || isUpdating || isSavingUser || isPasswordFormActive || isPasswordUpdating}
                              title="Đổi mật khẩu"
                            >
                              <IconifyIcon icon="mdi:key-outline" className="me-1" /> Mật khẩu
                            </Button>

                            <Form.Check
                              type="switch"
                              id={`status-switch-${acc.id}`}
                              checked={isAccountActive}
                              onChange={() => handleToggleUserStatus(acc)}
                              className="d-inline-flex align-items-center"
                              label={
                                  <span className="ms-2 text-nowrap">
                                      {/* Làm gọn label của switch */}
                                      {isAccountActive ? "Khóa" : "Mở khóa"}
                                  </span>
                              }
                              disabled={editingId !== null || isUpdating || isSavingUser || isPasswordFormActive || isPasswordUpdating}
                            />
                          </div>
                          // 💡 KẾT THÚC PHẦN ĐÃ CHỈNH SỬA
                        )}
                      </td>
                    </tr>
                    
                    {/* INLINE PASSWORD UPDATE ROW */}
                    {isPasswordFormActive && (
                        <tr className="table-secondary">
                            <td colSpan="3" className="fw-bold align-middle">
                                Đổi Mật khẩu cho {acc.userName}:
                            </td>
                            <td colSpan="3">
                                <Form onSubmit={(e) => handlePasswordUpdate(e, acc.id)} className="d-flex p-2">
                                    <Form.Control
                                        type="password"
                                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        size="sm"
                                        className="me-2"
                                        disabled={isPasswordUpdating}
                                    />
                                    <Button 
                                        type="submit" 
                                        variant="success" 
                                        size="sm" 
                                        className="me-2"
                                        disabled={isPasswordUpdating || newPassword.length < 6}
                                    >
                                        {isPasswordUpdating ? <Spinner animation="border" size="sm" /> : <IconifyIcon icon="mdi:content-save-outline" />}
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        size="sm" 
                                        onClick={handleCancelPasswordEdit}
                                        disabled={isPasswordUpdating}
                                    >
                                        <IconifyIcon icon="mdi:cancel" />
                                    </Button>
                                </Form>
                            </td>
                        </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </Table>
      </div>


      {/* SECTION 2: TẠO TÀI KHOẢN MỚI (FORM) - CHỈ HIỂN THỊ KHI showCreateForm LÀ TRUE */}
      {showCreateForm && ( 
        <>
          <h5 className="mt-5 mb-4 fw-bold text-primary border-bottom pb-2">Tạo tài khoản mới</h5>
          <Form onSubmit={handleCreateUser} className="shadow p-4 rounded-3 bg-light">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="userName"
                    value={newUserForm.userName}
                    onChange={handleCreateFormChange}
                    required
                    disabled={editingId !== null || isUpdating || passwordEditingId !== null || isPasswordUpdating}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={newUserForm.email}
                    onChange={handleCreateFormChange}
                    required
                    disabled={editingId !== null || isUpdating || passwordEditingId !== null || isPasswordUpdating}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={newUserForm.password}
                    onChange={handleCreateFormChange}
                    required
                    disabled={editingId !== null || isUpdating || passwordEditingId !== null || isPasswordUpdating}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Roles (1: Admin, 0: User)</Form.Label>
                  <Form.Select
                    name="roles"
                    value={newUserForm.roles}
                    onChange={handleCreateFormChange}
                    disabled={editingId !== null || isUpdating || passwordEditingId !== null || isPasswordUpdating}
                  >
                    <option value={0}>0 (User)</option>
                    <option value={1}>1 (Admin)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    name="status"
                    value={newUserForm.status}
                    onChange={handleCreateFormChange}
                    disabled={editingId !== null || isUpdating || passwordEditingId !== null || isPasswordUpdating}
                  >
                    <option value="Active">Active</option>
                    <option value="Deactivate">Deactivate</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} className="text-end mt-4">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isSavingUser || editingId !== null || isUpdating || passwordEditingId !== null || isPasswordUpdating}
                >
                  {isSavingUser ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo tài khoản"
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      )} 
   
    </div>
  );
};

export default ProfileUserTableTab;