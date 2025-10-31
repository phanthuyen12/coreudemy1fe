import React from 'react';
import { Link } from 'react-router-dom';

const ClientHomePage = () => {
  return (
    <div className="client-home-page">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5 mb-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">
                Học Giao Dịch Chuyên Nghiệp
              </h1>
              <p className="lead mb-4">
                Khám phá phương pháp 3 hộp độc quyền - Chỉ mất 5 giây để quyết định MUA hoặc BÁN
              </p>
              <div className="d-flex gap-3">
                <Link to="/client/video-learning" className="btn btn-warning btn-lg">
                  <i className="bx bx-play-circle me-2"></i>
                  HỌC NGAY
                </Link>
                <Link to="/client/courses" className="btn btn-outline-light btn-lg">
                  <i className="bx bx-book-open me-2"></i>
                  Xem Khóa Học
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <img 
                  src="/images/logo-dark-full.png" 
                  alt="ROVA Trading" 
                  className="img-fluid"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="fw-bold">Tại Sao Chọn ROVA Trading?</h2>
              <p className="text-muted">Phương pháp giao dịch đã được chứng minh hiệu quả</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bx bx-time text-white" style={{ fontSize: '24px' }}></i>
                  </div>
                  <h5 className="card-title">Quyết Định Nhanh</h5>
                  <p className="card-text text-muted">
                    Chỉ mất 5 giây để ra quyết định MUA hoặc BÁN với phương pháp 3 hộp
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bx bx-trending-up text-white" style={{ fontSize: '24px' }}></i>
                  </div>
                  <h5 className="card-title">Giao Dịch Đa Dạng</h5>
                  <p className="card-text text-muted">
                    Có thể giao dịch TẤT CẢ CẶP TIỀN, đặc biệt là VÀNG, BTC, kể cả CHỨNG KHOÁN
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bx bx-target-lock text-white" style={{ fontSize: '24px' }}></i>
                  </div>
                  <h5 className="card-title">Độ Chính Xác Cao</h5>
                  <p className="card-text text-muted">
                    Xác định điểm ENTRY, TP và SL CHUẨN XÁC với tỷ lệ thành công cao
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bx bx-refresh text-white" style={{ fontSize: '24px' }}></i>
                  </div>
                  <h5 className="card-title">Tần Suất Cao</h5>
                  <p className="card-text text-muted">
                    Tần suất ra KÈO NHIỀU, ít nhất 1-2 KÈO/NGÀY
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bx bx-shield-check text-white" style={{ fontSize: '24px' }}></i>
                  </div>
                  <h5 className="card-title">An Toàn</h5>
                  <p className="card-text text-muted">
                    Quản lý rủi ro hiệu quả với hệ thống stop loss thông minh
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bx bx-support text-white" style={{ fontSize: '24px' }}></i>
                  </div>
                  <h5 className="card-title">Hỗ Trợ 24/7</h5>
                  <p className="card-text text-muted">
                    Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ bạn mọi lúc
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Preview Section */}
      <div className="course-preview-section bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="fw-bold">Khóa Học Nổi Bật</h2>
              <p className="text-muted">Trải nghiệm toàn bộ 37 videos - Hơn 35 giờ học</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{ width: '50px', height: '50px' }}>
                      <span className="text-white fw-bold">01</span>
                    </div>
                    <div>
                      <h5 className="card-title mb-1">Sự Khác Biệt Của Phương Pháp 3 Hộp</h5>
                      <p className="text-muted mb-0">11:16 • 1.1k lượt xem • FREE</p>
                    </div>
                  </div>
                  <p className="card-text">
                    Khám phá bí mật đằng sau phương pháp 3 hộp - công cụ mạnh mẽ giúp bạn giao dịch hiệu quả.
                  </p>
                  <Link to="/client/video-learning" className="btn btn-warning">
                    <i className="bx bx-play-circle me-2"></i>
                    Xem Ngay
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{ width: '50px', height: '50px' }}>
                      <span className="text-white fw-bold">02</span>
                    </div>
                    <div>
                      <h5 className="card-title mb-1">[Tradingview] Thực chứng sự kỳ diệu của phương pháp</h5>
                      <p className="text-muted mb-0">06:16 • 856 lượt xem • FREE</p>
                    </div>
                  </div>
                  <p className="card-text">
                    Xem cách áp dụng phương pháp 3 hộp trên TradingView và kết quả thực tế.
                  </p>
                  <Link to="/client/video-learning" className="btn btn-success">
                    <i className="bx bx-play-circle me-2"></i>
                    Xem Ngay
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h3 className="fw-bold mb-3">Sẵn Sàng Bắt Đầu Hành Trình Giao Dịch?</h3>
              <p className="mb-0">
                Tham gia cộng đồng hơn 10,000+ trader đã thành công với phương pháp 3 hộp
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/client/video-learning" className="btn btn-warning btn-lg">
                <i className="bx bx-play-circle me-2"></i>
                BẮT ĐẦU NGAY
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHomePage;
