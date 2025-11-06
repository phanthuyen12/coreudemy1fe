import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLayoutContext } from '@/admin/context/useLayoutContext';

const ClientVerticalNavigationBar = () => {
  const { isMenuOpened } = useLayoutContext();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Trang chủ',
      icon: 'bx-home-circle',
      link: '/client/dashboard',
      badge: null
    },
    {
      id: 'courses',
      label: 'Khóa học',
      icon: 'bx-book-open',
      link: '/client/courses',
      badge: null
    },
    {
      id: 'video-learning',
      label: 'Học video',
      icon: 'bx-play-circle',
      link: '/client/video-learning',
      badge: 'HOT'
    },
    {
      id: 'trading-tools',
      label: 'Công cụ giao dịch',
      icon: 'bx-trending-up',
      link: '/client/trading-tools',
      badge: null
    },
    {
      id: 'community',
      label: 'Cộng đồng',
      icon: 'bx-group',
      link: '/client/community',
      badge: null
    },
    {
      id: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: 'bx-user',
      link: '/client/profile',
      badge: null
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: 'bx-cog',
      link: '/client/settings',
      badge: null
    }
  ];

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
  };

  return (
    <div className="vertical-menu">
      <div className="navbar-brand-box">
        <Link to="/client" className="logo logo-dark">
          <span className="logo-sm">
            <img src="/logoh3.png" alt="" height="22" />
          </span>
          <span className="logo-lg">
            <img src="/logoh3.png" alt="" height="17" />
          </span>
        </Link>

        <Link to="/client" className="logo logo-light">
          <span className="logo-sm">
            <img src="/logoh3.png" alt="" height="22" />
          </span>
          <span className="logo-lg">
            <img src="/logoh3.png" alt="" height="17" />
          </span>
        </Link>
      </div>

      <div className="h-100" data-simplebar>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.link}
                  className={`waves-effect ${activeMenu === item.id ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <i className={`bx ${item.icon}`}></i>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="badge rounded-pill bg-danger float-end">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClientVerticalNavigationBar;
