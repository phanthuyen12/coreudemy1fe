import React, { useState, useEffect } from 'react';
import {  userController} from '../../admin/mvc/controllers/userController';
// --- MOCK Controllers and Services (defined in-file to resolve import error) ---
// **LƯU Ý:** Trong ứng dụng thực tế, bạn sẽ cần thay thế phần này bằng các import thực tế
// và logic fetch data/API call của mình.
  const clt = new userController();

const authStorage = {
  getUserInfo: async () => {
    const token = localStorage.getItem("auth_token");
    console.log("Auth Token:", token);
    if (token) {
      try {
        const data = await clt.getInfoUser(token);
        console.log("Fetched user info:", data);

        // Lưu vào localStorage để cache
        // localStorage.setItem("userProfile", JSON.stringify(data));
        return data;
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }

    // Không có token → lấy dữ liệu cache hoặc trả về default
    return JSON.parse(localStorage.getItem("userProfile")) || {
      id: "user-123",
      username: "nguyenvana",
      email: "nguyenvana@example.com",
      isLoggedIn: false,
    };
  },

  setUserInfo: (profile) => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
  },
};


class memeberController {
    // Existing: Change password (mocked)
    async changePassword(email, currentPassword, newPassword) {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        const userProfile = authStorage.getUserInfo();
        // Kiểm tra mật khẩu hiện tại giả lập.
        if (currentPassword !== 'password123') { // Giả định mật khẩu hiện tại là 'password123'
            throw new Error('Mật khẩu hiện tại không đúng.');
        }
        // Success
        return { success: true };
    }

    // New: Update user info (mocked)
    async updateUserInfo(userId, newUsername, newEmail) {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        if (newUsername.toLowerCase().includes('admin') || newUsername.length < 3) {
             throw new Error('Tên người dùng không hợp lệ (Quá ngắn hoặc chứa từ khóa cấm).');
        }
        // Simulate success and return the updated data
        return { success: true, username: newUsername, email: newEmail };
    }
}

// Instantiate mock controller
const ctrM = new memeberController();
// --- End MOCK ---

// --- SVG Icon Components ---
const EyeLineIcon = ({ className, onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor" onClick={onClick}>
    <path d="M12 3c5.392 0 9.878 3.88 10.857 9-1.007 5.23-5.594 9-10.857 9-5.263 0-9.85-3.77-10.857-9C2.122 6.88 6.608 3 12 3zm0 2c-4.418 0-8.165 3.14-9.066 7.5C3.835 16.86 7.582 20 12 20c4.418 0 8.165-3.14 9.066-7.5C20.165 8.14 16.418 5 12 5zm0 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
  </svg>
);

const EyeOffLineIcon = ({ className, onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor" onClick={onClick}>
    <path d="M12 3c5.392 0 9.878 3.88 10.857 9a14.24 14.24 0 0 1-1.353 3.597l-1.81-1.81A7.502 7.502 0 0 0 12 10.5a7.5 7.5 0 0 0-7.294 5.402l-1.81-1.81A14.24 14.24 0 0 1 1.143 12C2.122 6.88 6.608 3 12 3zm6.855 8.244a12.25 12.25 0 0 0-1.518-2.48l-1.606 1.605a4.5 4.5 0 0 1 3.124 3.124l1.605-1.605a12.25 12.25 0 0 0-1.605-1.519zm-1.81 3.528l-1.928 1.928A7.472 7.472 0 0 0 12 18a7.5 7.5 0 0 0-3.308-.756l-1.928 1.928A9.501 9.501 0 0 0 12 20c4.418 0 8.165-3.14 9.066-7.5a12.14 12.14 0 0 0-3.92-4.228zM3.28 4.695L2.122 3.536 21.02 22.435l1.158-1.158L3.28 4.695z" />
  </svg>
);

const CheckLineIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
    </svg>
);

const CloseLineIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
    </svg>
);

const LockLineIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 2c3.866 0 7 3.134 7 7v3h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V13a1 1 0 0 1 1-1h1v-3c0-3.866 3.134-7 7-7zm0 2c-2.761 0-5 2.239-5 5v3h10v-3c0-2.761-2.239-5-5-5zM5 13v8h14v-8H5zm7 2a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1z" />
    </svg>
);

const UserLineIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M4 22a8 8 0 1 1 16 0H4zm8-9c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z" />
    </svg>
);

const MailLineIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm6.262 6.649L4 17.653V6.347l6.262 5.302zm3.476 0L20 6.347v11.306l-6.262-5.302zM12 13.347l6.59-5.301L20 7.82V5h-1.82l-6.18 4.98-6.18-4.98H4v2.82l1.41-1.13 6.59 5.301z" />
    </svg>
);

const CheckboxCircleFillIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z" />
    </svg>
);

const ErrorWarningFillIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
    </svg>
);

// --- Modal Component (For Messages) ---
const Modal = ({ show, title, message, onClose, type }) => {
  if (!show) return null;
  const isSuccess = type === 'success';
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
           {isSuccess ? <CheckboxCircleFillIcon className="modal-icon success" /> : <ErrorWarningFillIcon className="modal-icon error" />}
          <h2 className="modal-title">{title}</h2>
        </div>
        <p className="modal-message">{message}</p>
        <button onClick={onClose} className="modal-close-button">Đóng</button>
      </div>
    </div>
  );
};

// --- Main Component ---
const ChangePassword = () => {
  const [userProfile, setUserProfile] = useState({ id: null, username: '', email: '' });
  const [editFormData, setEditFormData] = useState({ username: '', email: '' });

  const [passwordFormData, setPasswordFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);

  const [modalState, setModalState] = useState({ show: false, title: '', message: '', type: 'success' });
  const fetchUserInfo = async () => { 
  const info = await authStorage.getUserInfo();
  console.log("Fetched user info 1:", info);

  const token = localStorage.getItem("auth_token"); // ❌ không cần await
  console.log("Fetched user info 2:", token);
};

  // 1. Fetch User Data on Load
  useEffect(() => {
    // Sử dụng async IIFE để lấy info và set state đúng cách
    (async () => {
      const info = await authStorage.getUserInfo();
      setUserProfile(info);
      setEditFormData({ username: info.username, email: info.email });
    })();
  }, []);


  // --- Helper Functions ---
  const handleCloseModal = () => {
    setModalState({ ...modalState, show: false });
  };

  // --- Profile Update Logic ---
  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (editFormData.username.trim() === '' || editFormData.email.trim() === '' || userProfile.id == null) {
      setModalState({ show: true, title: 'Lỗi', message: 'Tên người dùng và email không được để trống.', type: 'error' });
      return;
    }
    if (editFormData.username === userProfile.username && editFormData.email === userProfile.email) {
      setModalState({ show: true, title: 'Thông báo', message: 'Không có thay đổi nào được thực hiện.', type: 'error' });
      return;
    }
    setIsProfileUpdating(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await clt.updateInfoUser(token, userProfile.id, editFormData.email, editFormData.username);
      const updated = res?.data || res; // hỗ trợ cả 2 dạng response
      const newProfile = {
        ...userProfile,
        username: updated?.username ?? editFormData.username,
        email: updated?.email ?? editFormData.email,
      };
      setUserProfile(newProfile);
      authStorage.setUserInfo(newProfile);
      setModalState({ show: true, title: 'Thành Công', message: 'Cập nhật thông tin cá nhân thành công!', type: 'success' });
    } catch (err) {
      setModalState({ show: true, title: 'Thất Bại', message: err.message || 'Đã có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại.', type: 'error' });
      setEditFormData({ username: userProfile.username, email: userProfile.email });
    } finally {
      setIsProfileUpdating(false);
    }
  };


  // --- Password Change Logic (Completed from the truncated part) ---
  const handlePasswordInputChange = (field, value) => {
    setPasswordFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setModalState({ show: true, title: 'Lỗi', message: 'Mật khẩu xác nhận không khớp!', type: 'error' });
      return;
    }
    if (passwordFormData.newPassword.length < 6) {
      setModalState({ show: true, title: 'Lỗi', message: 'Mật khẩu mới phải có ít nhất 6 ký tự!', type: 'error' });
      return;
    }
    if (passwordFormData.newPassword === passwordFormData.currentPassword) {
      setModalState({ show: true, title: 'Lỗi', message: 'Mật khẩu mới phải khác mật khẩu hiện tại.', type: 'error' });
      return;
    }
    setIsPasswordLoading(true);
    try {
      // Sử dụng email từ userProfile để gọi API
      console.log("Changing password for:", userProfile.email); 
      console.log("Current Password:", passwordFormData.currentPassword); 
      console.log("New Password:", passwordFormData.newPassword);
      const token = localStorage.getItem("auth_token"); 
       await clt.changePassword(userProfile.email, passwordFormData.currentPassword, passwordFormData.newPassword,token); 
      setModalState({ show: true, title: 'Thành Công', message: 'Đổi mật khẩu thành công!', type: 'success' });
      setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setModalState({ show: true, title: 'Thất Bại', message: err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.', type: 'error' });
    } finally {
      setIsPasswordLoading(false);
    }
  };


  return (
    <div className="change-password-page">
      <style>{`
        /* General Styles */
        .change-password-page { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            padding: 20px; 
            background-color: #121212; 
            min-height: 100vh; 
        }
       
        .password-title { 
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent; 
            background-clip: text; 
            font-weight: 800; 
            font-size: 2.8rem; 
            text-align: center; 
            margin-bottom: 2rem; 
            letter-spacing: 1px;
        }

        /* Card Container Styles */
        .card-container { 
            background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%); 
            border: 1px solid #2a2a2a; 
            border-radius: 20px; 
            padding: 40px; 
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); 
            margin-bottom: 30px;
        }
        
        /* Form Element Styles */
        .form-section { margin-bottom: 32px; }
        .section-label { color: #FFD700; font-size: 1.2rem; font-weight: 700; margin-bottom: 24px; border-bottom: 2px solid #2a2a2a; padding-bottom: 8px; }
        .form-group { margin-bottom: 24px; }
        .form-label { color: #fff; font-weight: 600; margin-bottom: 8px; display: block; }
        .form-input { 
            width: 100%; 
            background: #2a2a2a; 
            border: 1px solid #444; 
            border-radius: 8px; 
            padding: 12px 16px; 
            color: #fff; 
            font-size: 14px; 
            transition: all 0.3s ease; 
            padding-right: 48px; 
        }
        .form-input:focus { outline: none; border-color: #FFA500; box-shadow: 0 0 0 2px rgba(255, 165, 0, 0.3); }
        .form-input::placeholder { color: #888; }
        .read-only-input { opacity: 0.8; cursor: default; }
        .read-only-note { font-size: 0.8rem; color: #888; margin-top: 4px; }

        .input-with-icon { position: relative; }
        .input-icon { 
            position: absolute; 
            right: 14px; 
            top: 50%; 
            transform: translateY(-50%); 
            color: #FFD700; 
            font-size: 18px; 
            cursor: pointer; 
            transition: all 0.3s ease; 
            width: 24px; 
            height: 24px; 
        }
        .input-icon:hover { color: #FFA500; }
        
        /* Submit Button Styles */
        .submit-button { 
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); 
            border: none; 
            border-radius: 10px; 
            padding: 12px 28px; 
            color: #000; 
            font-weight: 700; 
            font-size: 1rem; 
            cursor: pointer; 
            transition: all 0.3s ease; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            gap: 10px; 
            box-shadow: 0 4px 10px rgba(255, 215, 0, 0.2);
        }
        .submit-button svg { width: 20px; height: 20px; }
        .submit-button:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(255, 165, 0, 0.4); }
        .submit-button:disabled { opacity: 0.6; cursor: not-allowed; }
        
        /* Loading Spinner */
        .spinner { 
            width: 20px; 
            height: 20px; 
            border: 2px solid #000; 
            border-top-color: transparent; 
            border-radius: 50%; 
            animation: spin 1s linear infinite; 
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        /* Password Requirements */
        .password-requirements { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 16px; margin-top: 16px; }
        .requirements-title { color: #FFD700; font-weight: 600; margin-bottom: 8px; }
        .requirement-item { color: #ccc; font-size: 0.9rem; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
        .requirement-icon { font-size: 14px; width: 14px; height: 14px; }
        .requirement-icon.valid { color: #4CAF50; }
        .requirement-icon.invalid { color: #f44336; }
        
        /* Profile Specific */
        .profile-info-group { margin-bottom: 16px; }
        .profile-label { display: flex; align-items: center; gap: 4px; }
        .profile-update-button { min-width: 180px; }


        /* Modal Styles */
        .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: #2a2a2a; color: #fff; padding: 24px; border-radius: 16px; width: 90%; max-width: 400px; text-align: center; border: 1px solid #444; }
        .modal-header { display: flex; flex-direction: column; align-items: center; margin-bottom: 16px; }
        .modal-icon { font-size: 48px; margin-bottom: 12px; width: 48px; height: 48px; }
        .modal-icon.success { color: #4CAF50; }
        .modal-icon.error { color: #f44336; }
        .modal-title { font-size: 1.5rem; font-weight: 600; margin: 0; }
        .modal-message { font-size: 1rem; color: #ccc; margin-bottom: 24px; }
        .modal-close-button { background-color: #FFD700; color: #000; border: none; border-radius: 8px; padding: 12px 24px; cursor: pointer; font-weight: 600; font-size: 1rem; transition: background-color 0.3s ease; }
        .modal-close-button:hover { background-color: #FFA500; }
        
        /* Responsiveness */
        @media (max-width: 768px) { 
            .password-title { font-size: 2rem; margin-bottom: 1.5rem; } 
            .card-container { padding: 24px; } 
            .submit-button { width: 100%; justify-content: center; padding: 14px; } 
        }
      `}</style>
      <Modal show={modalState.show} title={modalState.title} message={modalState.message} onClose={handleCloseModal} type={modalState.type} />
      
      <div className="main-content">
        <h1 className="password-title">QUẢN LÝ TÀI KHOẢN</h1>

        {/* --- 1. USER PROFILE UPDATE CARD --- */}
        <div className="card-container">
          <div className="section-label">Cập nhật thông tin cá nhân</div>
          <form onSubmit={handleProfileUpdate}>
            {/* Username Field */}
            <div className="profile-info-group">
              <label className="form-label profile-label">
                <UserLineIcon className="w-5 h-5 mr-2 text-yellow-400" /> Tên người dùng
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Nhập tên người dùng mới"
                value={editFormData.username}
                onChange={e => handleEditInputChange('username', e.target.value)}
                required
                disabled={isProfileUpdating}
              />
            </div>

            {/* Email Field (thay đổi: cho phép sửa) */}
            <div className="profile-info-group">
              <label className="form-label profile-label">
                <MailLineIcon className="w-5 h-5 mr-2 text-yellow-400" /> Email
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="Nhập email mới"
                value={editFormData.email}
                onChange={e => handleEditInputChange('email', e.target.value)}
                required
                disabled={isProfileUpdating}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="submit" className="submit-button profile-update-button" disabled={isProfileUpdating}>
                {isProfileUpdating ? (
                  <div className="spinner"></div>
                ) : (
                  <><CheckLineIcon /> CẬP NHẬT HỒ SƠ</>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* --- 2. CHANGE PASSWORD CARD --- */}
        <div className="card-container">
          <div className="section-label">Thay đổi mật khẩu</div>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-section">
              <div className="form-group">
                <label className="form-label">Mật khẩu hiện tại:</label>
                <div className="input-with-icon">
                  <input 
                    type={showPasswords.current ? 'text' : 'password'} 
                    className="form-input" 
                    placeholder="Nhập mật khẩu hiện tại" 
                    value={passwordFormData.currentPassword} 
                    onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                    disabled={isPasswordLoading}
                  />
                  {showPasswords.current ? 
                    <EyeLineIcon className="input-icon" onClick={() => togglePasswordVisibility('current')} /> : 
                    <EyeOffLineIcon className="input-icon" onClick={() => togglePasswordVisibility('current')} />
                  }
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <div className="form-group">
                <label className="form-label">Mật khẩu mới:</label>
                <div className="input-with-icon">
                  <input 
                    type={showPasswords.new ? 'text' : 'password'} 
                    className="form-input" 
                    placeholder="Nhập mật khẩu mới" 
                    value={passwordFormData.newPassword} 
                    onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)} 
                    disabled={isPasswordLoading}
                  />
                  {showPasswords.new ? 
                    <EyeLineIcon className="input-icon" onClick={() => togglePasswordVisibility('new')} /> : 
                    <EyeOffLineIcon className="input-icon" onClick={() => togglePasswordVisibility('new')} />
                  }
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu mới:</label>
                <div className="input-with-icon">
                  <input 
                    type={showPasswords.confirm ? 'text' : 'password'} 
                    className="form-input" 
                    placeholder="Xác nhận mật khẩu mới" 
                    value={passwordFormData.confirmPassword} 
                    onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)} 
                    disabled={isPasswordLoading}
                  />
                  {showPasswords.confirm ? 
                    <EyeLineIcon className="input-icon" onClick={() => togglePasswordVisibility('confirm')} /> : 
                    <EyeOffLineIcon className="input-icon" onClick={() => togglePasswordVisibility('confirm')} />
                  }
                </div>
              </div>

              <div className="password-requirements">
                <div className="requirements-title">Yêu cầu mật khẩu:</div>
                <div className="requirement-item">
                  {passwordFormData.newPassword.length >= 6 ? <CheckLineIcon className="requirement-icon valid" /> : <CloseLineIcon className="requirement-icon invalid" />} Ít nhất 6 ký tự
                </div>
                <div className="requirement-item">
                  {passwordFormData.newPassword === passwordFormData.confirmPassword && passwordFormData.newPassword !== '' ? <CheckLineIcon className="requirement-icon valid" /> : <CloseLineIcon className="requirement-icon invalid" />} Mật khẩu xác nhận khớp
                </div>
                <div className="requirement-item">
                  {passwordFormData.newPassword !== passwordFormData.currentPassword && passwordFormData.newPassword !== '' ? <CheckLineIcon className="requirement-icon valid" /> : <CloseLineIcon className="requirement-icon invalid" />} Khác với mật khẩu hiện tại
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="submit-button" disabled={isPasswordLoading}>
                {isPasswordLoading ? (<div className="spinner"></div>) : (<><LockLineIcon /> ĐỔI MẬT KHẨU</>)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
