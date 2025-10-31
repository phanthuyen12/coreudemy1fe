import { useEffect } from 'react';
import { deleteCookie } from 'cookies-next';

const AdminLogout = () => {
  useEffect(() => {
    try {
      // Clear admin session cookie
      deleteCookie('_REBACK_AUTH_KEY_');
    } catch (_) {}
    // Hard redirect to client home
    window.location.replace('/');
  }, []);

  return null;
};

export default AdminLogout;



