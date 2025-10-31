import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import DashboardFooter from './DashboardFooter';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Preloader */}
      <div className="preloader">
        <div className="loader"></div>
      </div>

      {/* Sidebar Overlay */}
      <div className="side-overlay" onClick={() => setSidebarOpen(false)}></div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main-wrapper">
        {/* Top Navbar */}
        <TopNavbar onToggleSidebar={toggleSidebar} />

        {/* Dashboard Body */}
        <div className="dashboard-body">
          <Outlet />
        </div>

        {/* Dashboard Footer */}
        <DashboardFooter />
      </div>
    </>
  );
};

export default Layout;

