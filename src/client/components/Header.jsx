import React, { useEffect, useRef, useState } from 'react';
import { Icon as IconifyIcon } from '@iconify/react';
import logoSrc from '../../assets/images/logo-dark-full.png';
import { useAuth } from '../context/AuthContext';

const Header = ({ onToggleSidebar, sidebarOpen, isMobile, hasSidebar = true }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');
  const dropdownRef = useRef(null);
  const { isAuthenticated, user, logout } = useAuth ? (useAuth() || {}) : {};
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const openTimerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const customerId = 'KHOAHOC-580';
  const affiliateLevel = 1;
  const affiliateLink = 'https://example.com/aff/your-id';

  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current) {
        if (showProfileDropdown && !dropdownRef.current.contains(e.target)) {
          setShowProfileDropdown(false);
        }
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [showProfileDropdown]);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);

  const copyToClipboard = async (text, label = 'Đã copy!') => {
    try {
      await navigator.clipboard.writeText(text);
      setToastText(label);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1200);
    } catch (_) {}
  };

  const mapAdminUrlToClient = (url) => {
    if (!url) return '';
    if (url === '/page/courses') return '/courses';
    if (url === '/page/ticket') return '/tickets';
    return url; // '/dashboard' already matches client
  };

  const ALLOWED_CLIENT_PATHS = new Set(['/dashboard', '/courses', '/tickets']);

  const NEW_MENU = [
    { key: 'program', label: 'Chương trình học', icon: 'ri:play-circle-line', href: '/#chuong-trinh' },
    { key: 'benefits', label: 'Quyền lợi', icon: 'ri:shield-check-line', href: '/#quyen-loi' },
    { key: 'about', label: 'Lê Duy Hiệp là ai?', icon: 'ri:team-line', href: '/#ve-chung-toi' },
    { key: 'activities', label: 'Hoạt Động', icon: 'ri:archive-2-line', href: '/#hoat-dong' },
    { key: 'faq', label: 'Câu Hỏi Thường Gặp', icon: 'ri:question-answer-line', href: '/#faq' },
  ];

  const clientMenuItems = NEW_MENU;

  return (
    <>
      {/* Notification Banner */}
      <div 
        className="notification-banner position-fixed top-0 start-0 w-100 d-flex justify-content-center"
        style={{
          backgroundColor: '#FAA414',
          color: '#fff',
          padding: '8px 0',
          zIndex: 1040,
          height: '40px',
          overflow: 'hidden'
        }}
      >
        <style>{`
          @keyframes scroll-right {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        <div 
          className="marquee-content"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            whiteSpace: 'nowrap',
            animation: 'scroll-right 60s linear infinite',
            maxWidth: '800px',
            width: '800px'
          }}
        >
          <span style={{ marginRight: '40px' }}>
            Chi Phí • Kinh Doanh Hiệu Quả - Quảng Cáo TikTok Tăng Doanh Số - Tối Ưu Chi Phí • | Hotline kỹ thuật 
          </span>
         
        </div>
      </div>

      <header 
        className=" position-fixed start-0 end-0"
        style={{
          backgroundColor: '#0b0b0b',
          borderBottom: '1px solid #1a1a1a',
          zIndex: 1030,
          height: '60px',
          top: '40px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.35)'
        }}
      >
      <div className="container-fluid h-100">
        <div className="navbar-header d-flex align-items-center justify-content-between h-100 px-3 px-md-4" style={{paddingLeft: '16px', paddingRight: '16px', overflow: 'visible', width: '100%'}}>
          <style>{`
            .header-link { color:#eee; font-size:15px; text-decoration:none; font-weight:600; display:inline-flex; align-items:center; gap:10px; padding:6px 8px; transition:color .15s ease; white-space:nowrap; }
            .header-link:hover { color:#FFCF00; }
            .header-link svg { width:18px; height:18px; }
            .brand-wrap { display:flex; align-items:center; gap:10px; min-width:0; }
            .brand-logo { display:inline-flex; align-items:center; }
            .brand-logo img { height:36px; width:auto; display:block; }
            .social-pill { width:32px; height:32px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; background:#111; transition:transform .15s ease; color:#fff; text-decoration:none; }
            .social-pill:hover { transform:scale(1.08); }
            .login-link { color:#f2a900; text-decoration:none; font-weight:600; padding:8px 10px; }
            .cta-btn { background:linear-gradient(90deg,#ffd700,#ffb300); color:#000; border:none; border-radius:10px; font-weight:700; padding:10px 16px; }
          `}</style>
          {/* Left: hamburger + logo */}
          <div className="brand-wrap flex-shrink-1" style={{maxWidth: '30%'}}>
            {/* Menu toggler (hamburger) orange */}
            {hasSidebar && isAuthenticated && (
              <button
                onClick={() => {
                  if (isMobile) {
                    setMobileMenuOpen((v) => !v);
                  } else if (onToggleSidebar) {
                    onToggleSidebar();
                  }
                }}
                className="btn btn-link p-2 menu-toggle-btn"
                title={sidebarOpen ? "Đóng menu" : "Mở menu"}
                style={{
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'transparent',
                  color: '#ffa500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                aria-controls="mobile-nav"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation"
              >
                <IconifyIcon icon="ri:menu-2-line" className="fs-3" />
              </button>
            )}
            {!isAuthenticated && (
              <a href="/" className="brand-logo ms-1 ms-md-2" title="Trang chủ">
                <img src={logoSrc} alt="Logo" />
              </a>
            )}
            {/* removed three-dots quick menu per request */}
          </div>

          {/* Center: main navigation (desktop) */}
          <div className="d-none d-lg-flex flex-grow-1 ms-1 me-2">
            <nav >
              {clientMenuItems.map((item) => (
                <a key={item.key} href={item.url} className="header-link">
                  {item.icon && <IconifyIcon icon={item.icon} />}
                  <span className="d-none d-xl-inline">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Right: actions + socials + user */}
          <div className="d-flex align-items-center gap-1 gap-md-2 flex-shrink-0">
            {/* Social icons */}
            {/* <div className="d-none d-lg-flex align-items-center gap-1 me-1">
              <a href="#facebook" className="social-pill"><IconifyIcon icon="ri:facebook-fill" className="text-primary" /></a>
              <a href="#tiktok" className="social-pill"><IconifyIcon icon="ri:tiktok-fill" style={{color:'#fff'}} /></a>
              <a href="#youtube" className="social-pill"><IconifyIcon icon="ri:youtube-fill" className="text-danger" /></a>
            </div> */}
            {/* Search Box */}
            <div className="d-none d-md-flex align-items-center position-relative">
              {/* <div 
                className="d-flex align-items-center"
                style={{
                  backgroundColor: '#2a2a2a',
                  borderRadius: '25px',
                  padding: '8px 16px',
                  minWidth: '300px'
                }}
              >
                <IconifyIcon icon="ri:search-line" className="text-muted me-2" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm khóa học..."
                  className="border-0 bg-transparent text-white"
                  style={{outline: 'none', flex: 1}}
                />
              </div> */}
            </div>

          {/* Auth Buttons (hidden when authenticated) */}
            {!isAuthenticated && (
              <>
                <a 
                  className="btn cta-btn d-inline-flex align-items-center gap-2 px-2 px-md-3 py-2"
                  href="/learn/study"
                >
                  <IconifyIcon icon="ri:flashlight-line" />
                  <span>Đăng ký và học thử ngay</span>
                </a>
                <a href="/profile" className="d-none d-md-inline-block login-link ms-2">Đăng nhập</a>
              </>
            )}
          {isAuthenticated && (
            <>
              <a 
                className="btn d-inline-flex align-items-center gap-2 px-3 py-2"
                style={{ background:'#ffb300', color:'#000', border:'none', borderRadius:'10px', fontWeight:700 }}
                href="/pricing"
              >
                <IconifyIcon icon="ri:fire-line" />
                <span>NÂNG CẤP PRO</span>
              </a>
              <div
                className="position-relative d-none d-md-flex align-items-center ms-2"
                style={{ background:'#1a1a1a', borderRadius:'10px', padding:'6px 10px', cursor:'pointer' }}
                ref={dropdownRef}
                onMouseEnter={() => {
                  if (closeTimerRef.current) {
                    clearTimeout(closeTimerRef.current);
                    closeTimerRef.current = null;
                  }
                  openTimerRef.current = setTimeout(() => {
                    setShowProfileDropdown(true);
                  }, 150); // slight delay to show
                }}
                onMouseLeave={() => {
                  if (openTimerRef.current) {
                    clearTimeout(openTimerRef.current);
                    openTimerRef.current = null;
                  }
                  closeTimerRef.current = setTimeout(() => {
                    setShowProfileDropdown(false);
                  }, 350); // delay hide so users can move cursor
                }}
              >
                <div className="d-flex align-items-center justify-content-center" style={{ width:32, height:32, background:'#ffc107', borderRadius:'50%' }}>
                  <IconifyIcon icon="ri:user-line" className="text-dark" />
                </div>
                <div className="ms-2 d-flex align-items-center" style={{ gap:'8px' }}>
                  <span className="text-white" style={{ maxWidth:100, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.username || user?.name || 'User'}</span>
                  <span className="badge" style={{ background:'#28a745' }}>FREE</span>
                  <span className="text-warning">0 ₫</span>
                </div>
                {showProfileDropdown && (
                  <div 
                    className="position-absolute end-0"
                    style={{
                      top: 'calc(100% + 12px)',
                      backgroundColor: '#111',
                      borderRadius: '12px',
                      border: '1px solid #2a2a2a',
                      minWidth: '260px',
                      maxWidth: '280px',
                      zIndex: 1050,
                      boxShadow: '0 12px 32px rgba(0,0,0,0.45)'
                    }}
                  >
                    <div className="p-3 border-bottom" style={{borderColor: '#222'}}>
                      <div className="text-white fw-semibold mb-2">Thông tin khách hàng</div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="text-muted small">Mã khách hàng</div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-white small fw-medium">{customerId}</span>
                          <button className="btn btn-link p-0 text-light" title="Copy" onClick={() => copyToClipboard(customerId)}>
                            <IconifyIcon icon="ri:file-copy-line" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-2 border-bottom" style={{borderColor: '#222'}}>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted small">Affiliate Level</span>
                        <span className="small fw-bold" style={{color:'#ff4d4f'}}>{affiliateLevel}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted small">Link Affiliate</span>
                        <button className="btn btn-link p-0 text-light" title="Copy link" onClick={() => copyToClipboard(affiliateLink, 'Đã copy link!')}>
                          <IconifyIcon icon="ri:file-copy-line" />
                        </button>
                      </div>
                    </div>
                    <div className="p-2">
                      <a href="/change-password" className="w-100 text-start d-flex align-items-center gap-2 p-2 text-decoration-none"
                        style={{color:'#ddd', borderRadius:'8px'}}
                        onMouseEnter={(e)=> e.currentTarget.style.background='#222'}
                        onMouseLeave={(e)=> e.currentTarget.style.background='transparent'}
                      >
                        <IconifyIcon icon="ri:key-2-line" className="text-warning" />
                        <span>Đổi mật khẩu</span>
                      </a>
                      <button className="btn w-100 d-flex align-items-center gap-2 p-2 mt-1"
                        style={{background:'#660000', color:'#fff', borderRadius:'8px'}}
                        onMouseEnter={(e)=> e.currentTarget.style.background='#990000'}
                        onMouseLeave={(e)=> e.currentTarget.style.background='#660000'}
                        onClick={logout}
                      >
                        <IconifyIcon icon="ri:logout-box-line" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    </header>
    {/* Mobile Nav Panel */}
    <div
      id="mobile-nav"
      className={`d-lg-none position-fixed start-0 end-0 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      style={{ top: '100px', zIndex: 1035, transition: 'opacity .2s ease' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-3" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.45)' }}>
        <div style={{ background: '#111', border: '1px solid #2a2a2a' }}>
          <nav className="d-flex flex-column py-2">
            {clientMenuItems.map((item) => (
              <a key={item.key} href={item.url} className="px-3 py-2 header-link" style={{ display: 'flex' }} onClick={() => setMobileMenuOpen(false)}>
                {item.icon && <IconifyIcon icon={item.icon} />}
                <span className="ms-2">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
    {/* quick sidebar removed per request */}
    </>
  );
};

export default Header;