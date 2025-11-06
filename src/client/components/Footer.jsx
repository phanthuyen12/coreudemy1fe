import React from 'react';
import { Icon as IconifyIcon } from '@iconify/react';
const logoFull = '/logoh3.png';

const Footer = () => {
  return (
    <footer style={{ background: '#0b0b0b', color: '#ddd', borderTop: '1px solid #1a1a1a' }}>
      <div className="container-fluid" style={{ padding: '48px 24px 24px' }}>
        <div className="row g-4 align-items-start">
          {/* Left: Brand and tagline */}
          <div className="col-12 col-lg-6">
            <div className="d-flex align-items-center gap-3 mb-3">
              <img src={logoFull} alt="Logo" style={{ height: 44 }} />
            </div>
            <h5 className="mb-3" style={{ color: '#fff', fontWeight: 700 }}>
3H STATION: HỌC – HỎI – HÀNH VỚI AI & HỆ THỐNG KINH DOANH THÔNG MINH

            </h5>
          </div>

          {/* Middle: Menu */}
          <div className="col-6 col-md-4 col-lg-3">
            <style>{`
              .footer-menu-link{display:inline-flex;align-items:center;gap:8px;line-height:1.9}
              .footer-menu-link svg{width:18px;height:18px;position:relative;top:-1px}
            `}</style>
            <div className="mb-2" style={{ color: '#ffd700', fontWeight: 700 }}>MENU</div>
            <ul className="list-unstyled m-0" style={{ lineHeight: 1.9 }}>
              <li><a href="/#chuong-trinh" className="text-decoration-none footer-menu-link" style={{ color: '#ddd' }}><IconifyIcon icon="ri:arrow-right-s-line"/> <span>Chương trình học</span></a></li>
              <li><a href="/#quyen-loi" className="text-decoration-none footer-menu-link" style={{ color: '#ddd' }}><IconifyIcon icon="ri:arrow-right-s-line"/> <span>Quyền lợi</span></a></li>
              <li><a href="/#ve-chung-toi" className="text-decoration-none footer-menu-link" style={{ color: '#ddd' }}><IconifyIcon icon="ri:arrow-right-s-line"/> <span>Bạn là ai?</span></a></li>
              <li><a href="/#hoat-dong" className="text-decoration-none footer-menu-link" style={{ color: '#ddd' }}><IconifyIcon icon="ri:arrow-right-s-line"/> <span>Hoạt động?</span></a></li>
            </ul>
          </div>

          {/* Right: Contact */}
          <div className="col-6 col-md-8 col-lg-3">
            <div className="mb-2" style={{ color: '#ffd700', fontWeight: 700 }}>LIÊN HỆ</div>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2">
                <IconifyIcon icon="ri:phone-line" className="text-warning"/>
                <div>
                  <div className="text-muted small">Hotline</div>
                  <div className="fs-5" style={{ color: '#ffd700', fontWeight: 800 }}>0911 809 909</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <IconifyIcon icon="ri:mail-line" className="text-warning"/>
                <div>
                  <div className="text-muted small">Email</div>
                  <div>Support.3HStation@gmail.com</div>
                </div>
              </div>
              <div className="d-flex align-items-start gap-2">
                <IconifyIcon icon="ri:map-pin-2-line" className="text-warning"/>
                <div className="small">
                  P002, Khu Đô Thị Ecocity Premia, Phường Tân An, Thành Phố Buôn Ma Thuột, Đắk Lắk, Việt Nam
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="d-flex justify-content-between align-items-center pt-4 mt-4" style={{ borderTop: '1px solid #1a1a1a' }}>
          <div className="small">Thiết kế bởi <span className="fw-semibold">3H STATION</span> / <span className="fw-semibold">E-Learning</span></div>
          <div className="d-flex align-items-center gap-2">
            <a href="#" className="text-decoration-none footer-social" aria-label="YouTube" style={{ color: '#ff3b30' }}><IconifyIcon icon="ri:youtube-fill" className="fs-4 anim-icon"/></a>
            <a href="#" className="text-decoration-none footer-social" aria-label="Facebook" style={{ color: '#1877f2' }}><IconifyIcon icon="ri:facebook-circle-fill" className="fs-4 anim-icon"/></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


