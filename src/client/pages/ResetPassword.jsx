import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthController } from '../../admin/mvc/controllers/authController';

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

// --- Modal Component ---
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
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [passwordFormData, setPasswordFormData] = useState({ 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [showPasswords, setShowPasswords] = useState({ 
    new: false, 
    confirm: false 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState({ 
    show: false, 
    title: '', 
    message: '', 
    type: 'success' 
  });

  const authController = new AuthController();

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setModalState({ 
        show: true, 
        title: 'Lỗi', 
        message: 'Token không hợp lệ. Vui lòng kiểm tra lại link đặt lại mật khẩu.', 
        type: 'error' 
      });
    }
  }, [token]);

  // --- Helper Functions ---
  const handleCloseModal = () => {
    setModalState({ ...modalState, show: false });
    // Nếu thành công, chuyển về trang đăng nhập sau 1 giây
    if (modalState.type === 'success') {
      setTimeout(() => {
        navigate('/auth/sign-in');
      }, 1000);
    }
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!token) {
      setModalState({ 
        show: true, 
        title: 'Lỗi', 
        message: 'Token không hợp lệ. Vui lòng kiểm tra lại link đặt lại mật khẩu.', 
        type: 'error' 
      });
      return;
    }

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setModalState({ 
        show: true, 
        title: 'Lỗi', 
        message: 'Mật khẩu xác nhận không khớp!', 
        type: 'error' 
      });
      return;
    }

    if (passwordFormData.newPassword.length < 6) {
      setModalState({ 
        show: true, 
        title: 'Lỗi', 
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự!', 
        type: 'error' 
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await authController.resetPassword(token, passwordFormData.newPassword);
      
      if (result.success) {
        setModalState({ 
          show: true, 
          title: 'Thành Công', 
          message: 'Đặt lại mật khẩu thành công! Bạn sẽ được chuyển đến trang đăng nhập.', 
          type: 'success' 
        });
        setPasswordFormData({ newPassword: '', confirmPassword: '' });
      } else {
        setModalState({ 
          show: true, 
          title: 'Thất Bại', 
          message: result.error || 'Đã có lỗi xảy ra. Vui lòng thử lại.', 
          type: 'error' 
        });
      }
    } catch (err) {
      setModalState({ 
        show: true, 
        title: 'Thất Bại', 
        message: err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <style>{`
        /* General Styles */
        .reset-password-page { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            padding: 20px; 
            background-color: #121212; 
            min-height: 100vh; 
            display: flex;
            align-items: center;
            justify-content: center;
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

        .password-subtitle {
            color: #ccc;
            text-align: center;
            margin-bottom: 2rem;
            font-size: 1rem;
        }

        /* Card Container Styles */
        .card-container { 
            background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%); 
            border: 1px solid #2a2a2a; 
            border-radius: 20px; 
            padding: 40px; 
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); 
            width: 100%;
            max-width: 500px;
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
            width: 100%;
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
      
      <Modal 
        show={modalState.show} 
        title={modalState.title} 
        message={modalState.message} 
        onClose={handleCloseModal} 
        type={modalState.type} 
      />
      
      <div className="main-content">
        <h1 className="password-title">ĐẶT LẠI MẬT KHẨU</h1>
        <p className="password-subtitle">Vui lòng nhập mật khẩu mới của bạn</p>

        <div className="card-container">
          <div className="section-label">Thông tin mật khẩu mới</div>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-section">
              <div className="form-group">
                <label className="form-label">Mật khẩu mới:</label>
                <div className="input-with-icon">
                  <input 
                    type={showPasswords.new ? 'text' : 'password'} 
                    className="form-input" 
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)" 
                    value={passwordFormData.newPassword} 
                    onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)} 
                    disabled={isLoading || !token}
                    required
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
                    disabled={isLoading || !token}
                    required
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
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button 
                type="submit" 
                className="submit-button" 
                disabled={isLoading || !token}
              >
                {isLoading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <LockLineIcon /> ĐẶT LẠI MẬT KHẨU
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

