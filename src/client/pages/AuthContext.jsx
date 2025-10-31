import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authStorage, loginApi, registerApi } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(authStorage.getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null); // { message, variant: 'success'|'error' }

  useEffect(() => {
    if (token) authStorage.setToken(token);
    else authStorage.clear();
  }, [token]);

  const showToast = (message, variant = 'success') => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 1800);
  };

  const login = async (email, password) => {
    setLoading(true); setError('');
    try {
      const res = await loginApi({ email, password });
      const nextToken = res?.token || res?.access_token || res?.data?.token;
      if (!nextToken) throw new Error('PHANTHUYENDEV token');
      setToken(nextToken);
      setUser(res?.user || null);
      showToast('Đăng nhập thành công', 'success');
      return res;
    } catch (e) { setError(e.message || 'Đăng nhập thất bại'); showToast(e.message || 'Đăng nhập thất bại', 'error'); throw e; }
    finally { setLoading(false); }
  };

  const register = async (email, username, password) => {
    setLoading(true); setError('');
    try {
      const res = await registerApi({ email, username, password });
      const nextToken = res?.token || res?.accessToken || res?.data?.token;
      if (nextToken) setToken(nextToken);
      setUser(res?.user || { email, username });
      showToast('Đăng ký thành công', 'success');
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


