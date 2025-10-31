import { lazy, Suspense } from 'react';
import FallbackLoading from '@/admin/components/FallbackLoading';
import Footer from '@/admin/components/layout/Footer';
import Preloader from '@/admin/components/Preloader';
const TopNavigationBar = lazy(() => import('@/admin/components/layout/TopNavigationBar'));
const VerticalNavigationBar = lazy(() => import('@/admin/components/layout/VerticalNavigationBar'));
const AdminLayout = ({
  children
}) => {
  return <div className="wrapper">
      <Suspense fallback={<FallbackLoading />}>
        <TopNavigationBar />
      </Suspense>

      <Suspense fallback={<FallbackLoading />}>
        <VerticalNavigationBar />
      </Suspense>

      <div className="page-content">
        <div className="container-fluid">
          <Suspense fallback={<Preloader />}>{children}</Suspense>
        </div>

        <Footer />
      </div>
    </div>;
};
export default AdminLayout;