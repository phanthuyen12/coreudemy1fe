import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { DEFAULT_PAGE_TITLE } from '@/admin/context/constants';
import { AuthProvider } from '@/admin/context/useAuthContext';
import { LayoutProvider } from '@/admin/context/useLayoutContext';
import { NotificationProvider } from '@/admin/context/useNotificationContext';
import { HelmetProvider } from 'react-helmet-async';
const handleChangeTitle = () => {
  if (document.visibilityState == 'hidden') document.title = 'Please come back 🥺';else document.title = DEFAULT_PAGE_TITLE;
};
const AppProvidersWrapper = ({
  children
}) => {
  useEffect(() => {
    document.addEventListener('visibilitychange', handleChangeTitle);
    return () => {
      document.removeEventListener('visibilitychange', handleChangeTitle);
    };
  }, []);
  return <HelmetProvider>
      <AuthProvider>
        <LayoutProvider>
          <NotificationProvider>
            {children}
            <ToastContainer theme="colored" />
          </NotificationProvider>
        </LayoutProvider>
      </AuthProvider>
    </HelmetProvider>;
};
export default AppProvidersWrapper;