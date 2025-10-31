import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/admin/context/useAuthContext';
import { useLayoutContext } from '@/admin/context/useLayoutContext';
import LogoBox from '@/admin/components/LogoBox';

const ClientTopNavigationBar = () => {
  const { isAuthenticated, user } = useAuthContext();
  const { isMenuOpened, isMenuToggled } = useLayoutContext();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <div className="d-flex">
          <div className="navbar-brand-box">
            <Link to="/client" className="logo logo-dark">
              <span className="logo-sm">
                <img src="/logo-sm.png" alt="" height="22" />
              </span>
              <span className="logo-lg">
                <img src="/logo-dark-full.png" alt="" height="17" />
              </span>
            </Link>

            <Link to="/client" className="logo logo-light">
              <span className="logo-sm">
                <img src="/logo-sm.png" alt="" height="22" />
              </span>
              <span className="logo-lg">
                <img src="/logo-light-full.png" alt="" height="17" />
              </span>
            </Link>
          </div>

          <button
            type="button"
            className="btn btn-sm px-3 font-size-16 header-item waves-effect"
            id="vertical-menu-btn"
            onClick={isMenuToggled}
          >
            <i className="fa fa-fw fa-bars"></i>
          </button>
        </div>

        <div className="d-flex">
          <div className="dropdown d-inline-block d-lg-none ms-2">
            <button
              type="button"
              className="btn header-item noti-icon waves-effect"
              id="page-header-search-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="mdi mdi-magnify"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
              <form className="p-3">
                <div className="form-group m-0">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tìm kiếm..."
                      aria-label="Recipient's username"
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="submit">
                        <i className="mdi mdi-magnify"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="dropdown d-none d-lg-inline-block ms-1">
            <button
              type="button"
              className="btn header-item noti-icon waves-effect"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="bx bx-customize"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
              <div className="px-lg-2">
                <div className="row g-0">
                  <div className="col">
                    <a className="dropdown-icon-item" href="#">
                      <img src="/images/brands/github.png" alt="Github" />
                      <span>Github</span>
                    </a>
                  </div>
                  <div className="col">
                    <a className="dropdown-icon-item" href="#">
                      <img src="/images/brands/bitbucket.png" alt="bitbucket" />
                      <span>Bitbucket</span>
                    </a>
                  </div>
                  <div className="col">
                    <a className="dropdown-icon-item" href="#">
                      <img src="/images/brands/dribbble.png" alt="dribbble" />
                      <span>Dribbble</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item noti-icon waves-effect"
              id="page-header-notifications-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="bx bx-bell"></i>
              <span className="badge bg-danger rounded-pill">3</span>
            </button>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
              <div className="p-3">
                <div className="row align-items-center">
                  <div className="col">
                    <h6 className="m-0">Thông báo</h6>
                  </div>
                  <div className="col-auto">
                    <a href="#!" className="small">
                      Đánh dấu tất cả đã đọc
                    </a>
                  </div>
                </div>
              </div>
              <div data-simplebar style={{ maxHeight: '230px' }}>
                <a href="" className="text-reset notification-item">
                  <div className="d-flex">
                    <div className="avatar-xs me-3">
                      <span className="avatar-title bg-primary rounded-circle font-size-16">
                        <i className="bx bx-cart"></i>
                      </span>
                    </div>
                    <div className="flex-1">
                      <h6 className="mt-0 mb-1">Đơn hàng mới</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">Bạn có đơn hàng mới</p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline"></i> 3 phút trước
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
                <a href="" className="text-reset notification-item">
                  <div className="d-flex">
                    <div className="avatar-xs me-3">
                      <span className="avatar-title bg-success rounded-circle font-size-16">
                        <i className="bx bx-badge-check"></i>
                      </span>
                    </div>
                    <div className="flex-1">
                      <h6 className="mt-0 mb-1">Đơn hàng đã xác nhận</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">Đơn hàng của bạn đã được xác nhận</p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline"></i> 1 giờ trước
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
                <a href="" className="text-reset notification-item">
                  <div className="d-flex">
                    <div className="avatar-xs me-3">
                      <span className="avatar-title bg-info rounded-circle font-size-16">
                        <i className="bx bx-message-square-detail"></i>
                      </span>
                    </div>
                    <div className="flex-1">
                      <h6 className="mt-0 mb-1">Tin nhắn mới</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">Bạn có tin nhắn mới từ admin</p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline"></i> 2 giờ trước
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              <div className="p-2 border-top d-grid">
                <a
                  className="btn btn-sm btn-link font-size-14 text-center"
                  href="javascript:void(0)"
                >
                  <i className="mdi mdi-arrow-right-circle me-1"></i>
                  <span>Xem tất cả</span>
                </a>
              </div>
            </div>
          </div>

          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item waves-effect"
              id="page-header-user-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <img
                className="rounded-circle header-profile-user"
                src="/images/users/avatar-1.jpg"
                alt="Header Avatar"
              />
              <span className="d-none d-xl-inline-block ms-1">
                {isAuthenticated ? user?.name || 'Người dùng' : 'Khách'}
              </span>
              <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-end">
              <a className="dropdown-item" href="#">
                <i className="bx bx-user font-size-16 align-middle me-1"></i>
                <span>Hồ sơ</span>
              </a>
              <a className="dropdown-item" href="#">
                <i className="bx bx-wallet font-size-16 align-middle me-1"></i>
                <span>Ví của tôi</span>
              </a>
              <a className="dropdown-item" href="#">
                <i className="bx bx-wrench font-size-16 align-middle me-1"></i>
                <span>Cài đặt</span>
              </a>
              <a className="dropdown-item" href="#">
                <i className="bx bx-lock-open font-size-16 align-middle me-1"></i>
                <span>Khóa màn hình</span>
              </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item text-danger" href="#">
                <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger"></i>
                <span>Đăng xuất</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientTopNavigationBar;
