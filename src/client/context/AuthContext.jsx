import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStorage, loginApi, registerApi } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(authStorage.getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null); // { message, variant: 'success'|'error' }

  // Ghi token vào storage chỉ khi cần, và clear khi falsy
  useEffect(() => {
    const stored = authStorage.getToken();
    if (token && token !== stored) {
      authStorage.setToken(token);
    }
    if (!token && stored) {
      authStorage.clear();
    }
  }, [token]);

  // Đồng bộ token nếu bị thay đổi ở tab/luồng khác
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'auth_token') {
        setToken(e.newValue || null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const showToast = (message, variant = 'success') => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 1800);
  };

  const login = async (email, password) => {
    setLoading(true); setError('');
    try {
      const res = await loginApi({ email, password });
      const nextToken = res?.access_token || res?.token || res?.data?.token;
      if (!nextToken) throw new Error('Không nhận được token');
      setToken(nextToken);
      setUser(res?.user || null);
      showToast('Đăng nhập thành công', 'success');
      navigate('/learn/study', { replace: true });
      return res;
    } catch (e) { setError(e.message || 'Đăng nhập thất bại'); showToast(e.message || 'Đăng nhập thất bại', 'error'); throw e; }
    finally { setLoading(false); }
  };

  const register = async (email, username, password) => {
    setLoading(true); setError('');
    try {
      const res = await registerApi({ email, username, password });
      const nextToken = res?.access_token || res?.token || res?.data?.token;
      if (nextToken) setToken(nextToken);
      setUser(res?.user || { email, username });
      showToast('Đăng ký thành công', 'success');
      navigate('/learn/study', { replace: true });
      return res;
    } catch (e) { setError(e.message || 'Đăng ký thất bại'); showToast(e.message || 'Đăng ký thất bại', 'error'); throw e; }
    finally { setLoading(false); }
  };

  const logout = () => { setToken(null); setUser(null); };

  const value = useMemo(() => ({ token, user, loading, error, login, register, logout, isAuthenticated: !!token }), [token, user, loading, error]);
  return (
    <AuthContext.Provider value={value}>
      {children}
      {toast && (
        <div className="client-toast" style={{position:'fixed', top: 68, right: 16, zIndex: 2000}}>
          <div style={{
            background: toast.variant === 'success' ? '#FFCF00' : '#0b0b0b',
            color: toast.variant === 'success' ? '#000' : '#FFCF00',
            border: '1px solid #FFCF00',
            padding: '10px 14px',
            borderRadius: 10,
            boxShadow: '0 10px 24px rgba(0,0,0,.35)',
            fontWeight: 800,
            minWidth: 220,
            textAlign: 'center'
          }}>
            {toast.message}
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


