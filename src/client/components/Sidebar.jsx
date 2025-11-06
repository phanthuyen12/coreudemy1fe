import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon as IconifyIcon } from '@iconify/react';

const Sidebar = ({ isOpen, isMobile, onClose, onToggleSidebar, isStudyPage = false }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "ri:home-line", badge: null },
    { name: "Tài liệu", path: "/documents", icon: "ri:file-list-line", badge: null },
    // { name: "Khóa học", path: "/courses", icon: "ri:book-line", badge: null },
    // { name: "Profile khóa học", path: "/course-profile", icon: "ri:bar-chart-line", badge: null },
    { name: "Đổi mật khẩu", path: "/change-password", icon: "ri:lock-line", badge: null },
    // { name: "Profile", path: "/profile", icon: "ri:user-line", badge: null },
    { name: "Tickets", path: "/tickets", icon: "ri:ticket-line", badge: "3" },
    // { name: "Thông báo", path: "/notifications", icon: "ri:notification-line", badge: "5" },
    // { name: "Affiliate", path: "/affiliate", icon: "ri:links-line", badge: null },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <div 
        className={`sidebar position-fixed start-0 d-none d-lg-block transition-all duration-300 ${
          isOpen ? 'sidebar-open' : 'sidebar-closed'
        }`}
        style={{
          top: '100px',
          height: 'calc(100% - 100px)',
          width: '300px',
          backgroundColor: '#1a1a1a',
          borderRight: '1px solid #333',
          zIndex: isStudyPage ? 1030 : 1025,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
        }}
      >
        {/* Header */}
        {/* <div className="sidebar-header p-4" style={{borderColor: 'transparent'}}>
          <div className="d-flex align-items-center">
            <div 
              className="d-flex align-items-center justify-content-center me-3"
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #ffc107, #ff8c00)',
                borderRadius: '12px'
              }}
            >
              <IconifyIcon icon="ri:eye-line" className="text-dark fw-bold fs-5" />
            </div>
            <span className="fs-3 fw-bold text-white" style={{letterSpacing: '0.5px'}}>
              ROVA
            </span>
          </div>
        </div> */}

        {/* Learn Now Button */}
        <div className="p-3">
             <button 
  className="btn w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-3 hover-lift"
  style={{
    backgroundColor: '#ffc107',
    color: '#000',
    borderRadius: '12px',
    border: 'none',
    fontSize: '1.2em',
    transition: 'all 0.2s ease'
  }}
  onClick={() => window.location.href = "/learn/study"}
>
  <IconifyIcon icon="ri:flashlight-line" />
  <span>HỌC NGAY</span>
</button>

        </div>

        {/* Menu Items */}
        <nav className="px-3 pb-4" style={{flex: 1, overflowY: 'auto'}}>
          <div className="d-flex flex-column gap-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`
                  d-flex align-items-center gap-3 px-3 py-3 rounded text-decoration-none
                  transition-all duration-200 position-relative
                  ${isActive(item.path) ? 'text-white' : 'text-light'}
                `}
                style={{
                  backgroundColor: isActive(item.path) ? '#333' : 'transparent',
                  color: '#fff',
                  borderRadius: '10px',
                  marginBottom: '6px',
                  fontSize: '20px'
                }}
                title={item.name}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.backgroundColor = '#2a2a2a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <IconifyIcon 
                  icon={item.icon} 
                  className="fs-5" 
                  style={{minWidth: '28px', fontSize: '26px'}}
                />
                <span className="fw-medium flex-grow-1">{item.name}</span>
                {item.badge && (
                  <span 
                    className="badge rounded-pill"
                    style={{
                      backgroundColor: '#dc3545',
                      fontSize: '10px',
                      padding: '2px 6px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        {/* <div className="p-4" style={{borderColor: 'transparent'}}>
          <div className="d-flex align-items-center gap-3 p-3 rounded" style={{backgroundColor: '#2a2a2a'}}>
            <div 
              className="d-flex align-items-center justify-content-center"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#ffc107',
                borderRadius: '50%'
              }}
            >
              <IconifyIcon icon="ri:user-line" className="text-dark fs-5" />
            </div>
            <div className="flex-grow-1">
              <div className="text-white fw-medium small">Maxwell</div>
              <div className="text-muted small">FREE Plan</div>
            </div>
            <button 
              className="btn btn-link text-light p-1"
              title="Settings"
            >
              <IconifyIcon icon="ri:settings-line" />
            </button>
          </div>
        </div> */}
      </div>

      {/* Mobile Sidebar */}
      <div 
        className={`
          sidebar-mobile position-fixed start-0 d-lg-none
          transition-all duration-300
        `}
        style={{
          top: '100px',
          height: 'calc(100% - 100px)',
          width: '80vw',
          maxWidth: '260px',
          backgroundColor: '#1a1a1a',
          borderRight: '1px solid #333',
          zIndex: isStudyPage ? 1030 : 1025,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
        }}
      >
        {/* Header */}
        <div className="sidebar-header p-4" style={{borderColor: 'transparent'}}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div 
                className="d-flex align-items-center justify-content-center me-3"
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #ffc107, #ff8c00)',
                  borderRadius: '12px'
                }}
              >
                <IconifyIcon icon="ri:eye-line" className="text-dark fw-bold fs-5" />
              </div>
              <span className="fs-3 fw-bold text-white" style={{letterSpacing: '0.5px'}}>
                ROVA
              </span>
            </div>
            <button 
              onClick={onClose}
              className="btn btn-link text-light p-2"
              style={{borderRadius: '8px'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <IconifyIcon icon="ri:close-line" className="fs-4" />
            </button>
          </div>
        </div>

        {/* Learn Now Button */}
        <div className="p-4">
          <button 
            className="btn w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-3"
            style={{
              backgroundColor: '#ffc107',
              color: '#000',
              borderRadius: '12px',
              border: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <IconifyIcon icon="ri:flashlight-line" />
            <span>HỌC NGAY</span>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="px-3 pb-4" style={{flex: 1, overflowY: 'auto'}}>
          <div className="d-flex flex-column gap-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`
                  d-flex align-items-center gap-3 px-3 py-3 rounded text-decoration-none
                  transition-all duration-200
                  ${isActive(item.path) ? 'text-white' : 'text-light'}
                `}
                style={{
                  backgroundColor: isActive(item.path) ? '#333' : 'transparent',
                  color: '#fff',
                  borderRadius: '10px',
                  marginBottom: '4px'
                }}
                onClick={onClose}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.backgroundColor = '#2a2a2a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <IconifyIcon 
                  icon={item.icon} 
                  className="fs-5" 
                  style={{minWidth: '24px', fontSize: '24px'}}
                />
                <span className="fw-medium flex-grow-1">{item.name}</span>
                {item.badge && (
                  <span 
                    className="badge rounded-pill"
                    style={{
                      backgroundColor: '#dc3545',
                      fontSize: '10px',
                      padding: '2px 6px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        {/* <div className="p-4 border-top" style={{borderColor: '#333'}}>
          <div className="d-flex align-items-center gap-3 p-3 rounded" style={{backgroundColor: '#2a2a2a'}}>
            <div 
              className="d-flex align-items-center justify-content-center"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#ffc107',
                borderRadius: '50%'
              }}
            >
              <IconifyIcon icon="ri:user-line" className="text-dark fs-5" />
            </div>
            <div className="flex-grow-1">
              <div className="text-white fw-medium small">Maxwell</div>
              <div className="text-muted small">FREE Plan</div>
            </div>
            <button 
              className="btn btn-link text-light p-1"
              title="Settings"
            >
              <IconifyIcon icon="ri:settings-line" />
            </button>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Sidebar;