import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '@/admin/layouts/AuthLayout';
import { useAuthContext } from '@/admin/context/useAuthContext';
import { appRoutes, authRoutes } from '@/admin/routes/index';
import AdminLayout from '@/admin/layouts/AdminLayout';

const AppRouter = props => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Routes>
      {/* Auth routes */}
      {(authRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={
            <AuthLayout {...props}>
              {route.element}
            </AuthLayout>
          }
        />
      ))}

      {/* App routes (admin) */}
      {(appRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={
            isAuthenticated ? (
              <AdminLayout {...props}>
                {route.element}
              </AdminLayout>
            ) : (
              <Navigate
                to={{
                  pathname: '/auth/sign-in',
                  search: `redirectTo=${route.path}&module=admin`
                }}
              />
            )
          }
        />
      ))}
    </Routes>
  );
};

export default AppRouter;
