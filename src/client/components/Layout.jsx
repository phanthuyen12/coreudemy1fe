import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import clientCssUrl from '../assets/css/course-theme.css?url';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === '/';
  const isLearnOnly = location.pathname.startsWith('/learn') && location.pathname !== '/learn/study';
  const isDashboardPage = location.pathname === '/dashboard' || location.pathname === '/profile' || location.pathname === '/tickets' || location.pathname === '/change-password' || location.pathname === '/notifications' || location.pathname === '/affiliate';
  const isStudyPage = location.pathname === '/learn/study';

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth < 992) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Inject client CSS only when client layout is mounted
  useEffect(() => {
    const id = 'client-theme-css';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = clientCssUrl;
      document.head.appendChild(link);
    }
    // apply saved theme
    const saved = localStorage.getItem('client_theme');
    document.body.setAttribute('data-theme', saved === 'light' ? 'light' : 'dark');
    const onStorage = (e) => {
      if (e.key === 'client_theme') {
        document.body.setAttribute('data-theme', e.newValue === 'light' ? 'light' : 'dark');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      const el = document.getElementById(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Handle sidebar visibility based on route
  useEffect(() => {
    if (isHome) {
      setSidebarOpen(false);
    } else if (isDashboardPage) {
      setSidebarOpen(true);
    } else if (isStudyPage) {
      setSidebarOpen(false); // Mặc định ẩn cho study page
    }
  }, [isHome, isDashboardPage, isStudyPage]);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="layout-wrapper" style={{backgroundColor: '#0f0f0f', minHeight: '100vh'}}>
      {/* Top Navigation */}
      <Header 
        onToggleSidebar={handleToggleSidebar}
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
        hasSidebar={true}
      />
      
      {/* Sidebar (hidden on learn landing) */}
      {!isLearnOnly && (isDashboardPage || isStudyPage || sidebarOpen) && (
        <Sidebar 
          isOpen={sidebarOpen} 
          isMobile={isMobile}
          onClose={handleCloseSidebar}
          onToggleSidebar={handleToggleSidebar}
          isStudyPage={isStudyPage}
        />
      )}
      
      {/* Main Content */}
      <div 
        className={`main-content transition-all duration-300 ${
          !isLearnOnly && !isMobile && sidebarOpen ? 'sidebar-expanded' : 'sidebar-hidden'
        }`}
        style={{
          marginLeft: !isLearnOnly && !isMobile && (sidebarOpen && isDashboardPage) ? '300px' : '0',
          paddingTop: '100px',
          minHeight: '100vh'
        }}
      >
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={handleCloseSidebar}
          style={{
            position: 'fixed',
            top: '100px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1020
          }}
        />
      )}
      {/* Footer - show on landing/home only */}
      {isHome && (
        <Footer />
      )}
    </div>
  );
};

export default Layout;