import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { useAuthContext } from '@/admin/context/useAuthContext';
import { useNotificationContext } from '@/admin/context/useNotificationContext';
import { AuthController } from '@/admin/mvc/controllers/authController';
const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    saveSession
  } = useAuthContext();
  const [searchParams] = useSearchParams();
  const {
    showNotification
  } = useNotificationContext();
  const authController = new AuthController();
  const loginFormSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: yup.string().required('Please enter your password')
  });
  const {
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: 'thaicong@gmail.com',
      password: 'thuyen2005'
    }
  });
  const redirectUser = () => {
    const redirectLink = searchParams.get('redirectTo');
    if (redirectLink) navigate(redirectLink);
    else navigate('/dashboard?module=admin');
  };
  const login = handleSubmit(async values => {
    setLoading(true);
    try {
      const result = await authController.login(values.email, values.password);
      
      if (result.success && result.data) {
        const { access_token, user } = result.data;
        
        // Check if user role is admin
        if (user.role === 'admin') {
          // Save session with access_token for admin
        saveSession({
            access_token: access_token,
            user: user,
            token: access_token // Keep token for backward compatibility
        });
          
        redirectUser();
        showNotification({
            message: 'Đăng nhập thành công. Đang chuyển hướng...',
          variant: 'success'
        });
        } else {
          // User is not admin
          showNotification({
            message: 'Bạn không có quyền truy cập trang admin. Chỉ tài khoản admin mới được phép đăng nhập.',
            variant: 'danger'
          });
        }
      } else {
        // Login failed
        showNotification({
          message: result.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.',
          variant: 'danger'
        });
      }
    } catch (e) {
      showNotification({
        message: e.message || 'Đăng nhập không thành công. Vui lòng thử lại.',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  });
  return {
    loading,
    login,
    control
  };
};
export default useSignIn;