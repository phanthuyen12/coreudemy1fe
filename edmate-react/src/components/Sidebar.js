import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (itemTitle) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }));
  };

  const menuItems = [
    // {
    //   title: 'Dashboard',
    //   icon: 'ph ph-squares-four',
    //   badge: '3',
    //   hasDropdown: true,
    //   submenu: [
    //     { title: 'Dashboard One', path: '/' },
    //     { title: 'Dashboard Two', path: '/dashboard-2' },
    //     { title: 'Dashboard Three', path: '/dashboard-3' }
    //   ]
    // },
    // {
    //   title: 'Courses',
    //   icon: 'ph ph-graduation-cap',
    //   hasDropdown: true,
    //   submenu: [
    //     { title: 'Student Courses', path: '/student-courses' },
    //     { title: 'Mentor Courses', path: '/mentor-courses' },
    //     { title: 'Create Course', path: '/create-course' }
    //   ]
    // },
    { title: 'TRANG CHỦ', icon: 'ph ph-users-three', path: '/' },
    { title: 'ĐỔI MẬT KHẨU', icon: 'ph ph-clipboard-text', path: '/assignments' },
    { title: 'PROFILE', icon: 'ph ph-users', path: '/mentors' },
    { title: 'TICKET', icon: 'ph ph-bookmarks', path: '/resources' },
    { title: 'THÔNG BÁO', icon: 'ph ph-chats-teardrop', path: '/messages' },
    { title: 'AFFILIATE', icon: 'ph ph-chart-bar', path: '/analytics' },
    { title: 'CHÍNH SÁCH', icon: 'ph ph-calendar-dots', path: '/events' },
    { title: 'NÂNG CẤP', icon: 'ph ph-crown', path: '/learn/study' }
  ];

  // const settingsItems = [
  //   { title: 'Account Settings', icon: 'ph ph-gear', path: '/settings' },
  //   {
  //     title: 'Authentication',
  //     icon: 'ph ph-shield-check',
  //     hasDropdown: true,
  //     submenu: [
  //       { title: 'Sign In', path: '/sign-in' },
  //       { title: 'Sign Up', path: '/sign-up' },
  //       { title: 'Forgot Password', path: '/forgot-password' },
  //       { title: 'Reset Password', path: '/reset-password' },
  //       { title: 'Verify Email', path: '/verify-email' },
  //       { title: 'Two Step Verification', path: '/two-step-verification' }
  //     ]
  //   }
  // ];

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar Close Button */}
      <button 
        type="button" 
        className="sidebar-close-btn text-gray-500 hover-text-white hover-bg-main-600 text-md w-24 h-24 border border-gray-100 hover-border-main-600 d-xl-none d-flex flex-center rounded-circle position-absolute"
        onClick={onClose}
      >
        <i className="ph ph-x"></i>
      </button>

      {/* Logo */}
      <Link to="/" className="sidebar__logo text-center p-20 position-sticky inset-block-start-0 bg-white w-100 z-1 pb-10">
        <img src="/assets/images/logo/logo.png" alt="Logo" />
      </Link>

      {/* Menu */}
      <div className="sidebar-menu-wrapper overflow-y-auto scroll-sm">
        <div className="p-20 pt-10">
          <ul className="sidebar-menu">
            {menuItems.map((item, index) => (
              <li key={index} className={`sidebar-menu__item ${item.hasDropdown ? 'has-dropdown' : ''}`}>
                {item.hasDropdown ? (
                  <>
                    <button 
                      type="button" 
                      className="sidebar-menu__link btn btn-link p-0 text-start w-100"
                      onClick={() => toggleDropdown(item.title)}
                    >
                      <span className="icon"><i className={item.icon}></i></span>
                      <span className="text">{item.title}</span>
                      {item.badge && <span className="link-badge">{item.badge}</span>}
                      <i className={`ph ph-caret-down ms-auto ${openDropdowns[item.title] ? 'rotate-180' : ''}`}></i>
                    </button>
                    <ul className={`sidebar-submenu ${openDropdowns[item.title] ? 'show' : ''}`}>
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex} className="sidebar-submenu__item">
                          <Link 
                            to={subItem.path} 
                            className={`sidebar-submenu__link ${location.pathname === subItem.path ? 'active' : ''}`}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link 
                    to={item.path} 
                    className={`sidebar-menu__link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <span className="icon"><i className={item.icon}></i></span>
                    <span className="text">{item.title}</span>
                  </Link>
                )}
              </li>
            ))}

            {/* Settings Section */}
            {/* <li className="sidebar-menu__item">
              <span className="text-gray-300 text-sm px-20 pt-20 fw-semibold border-top border-gray-100 d-block text-uppercase">Settings</span>
            </li> */}

            {/* {settingsItems.map((item, index) => (
              <li key={index} className={`sidebar-menu__item ${item.hasDropdown ? 'has-dropdown' : ''}`}>
                {item.hasDropdown ? (
                  <>
                    <button type="button" className="sidebar-menu__link btn btn-link p-0 text-start">
                      <span className="icon"><i className={item.icon}></i></span>
                      <span className="text">{item.title}</span>
                    </button>
                    <ul className="sidebar-submenu">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex} className="sidebar-submenu__item">
                          <Link 
                            to={subItem.path} 
                            className={`sidebar-submenu__link ${location.pathname === subItem.path ? 'active' : ''}`}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link 
                    to={item.path} 
                    className={`sidebar-menu__link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <span className="icon"><i className={item.icon}></i></span>
                    <span className="text">{item.title}</span>
                  </Link>
                )}
              </li>
            ))} */}
          </ul>
        </div>

        {/* Pro Certificate Card */}
        <div className="p-20 pt-80">
          <div className="bg-main-50 p-20 pt-0 rounded-16 text-center mt-74">
            <span className="border border-5 bg-white mx-auto border-primary-50 w-114 h-114 rounded-circle flex-center text-success-600 text-2xl translate-n74">
              <img src="/assets/images/icons/certificate.png" alt="" className="centerised-img" />
            </span>
            <div className="mt-n74">
              <h5 className="mb-4 mt-22">Get Pro Certificate</h5>
              <p className="">Explore 400+ courses with lifetime members</p>
              <Link to="/learn/study" className="btn btn-main mt-16 rounded-pill">Get Access</Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
