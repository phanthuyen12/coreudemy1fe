import React, { useState } from 'react';
import { Card, CardBody, Col, Row, Container, Button, Badge } from 'react-bootstrap';
import { Icon as IconifyIcon } from '@iconify/react';

const Affiliate = () => {
  const [affiliateLink] = useState('https://ldh.academy/learn/auth/?ref=KHOAHOC-580');
  const [showQR, setShowQR] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    alert('Đã copy link affiliate!');
  };

  const toggleQR = () => {
    setShowQR(!showQR);
  };

  const benefits = [
    "Người được giới thiệu khi đăng ký từ link của bạn, sau này họ nâng cấp gói lúc nào thì bạn cũng được nhận hoa hồng",
    "Người giới thiệu sau đó nếu login từ link affiliate của người khác thì hoa hồng vẫn thuộc về người đầu tiên là bạn",
    "Hoa hồng được tính trên giá tại thời điểm giao dịch (giá luôn tăng nên hoa hồng của bạn luôn tăng)",
    "Yêu cầu rút hoa hồng bất kì lúc nào"
  ];

  const topPublishers = [
    { rank: 1, name: "duyhiep2023", badge: "Free", earnings: "1.000.000 ₫", avatar: "👤" },
    { rank: 2, name: "LDH MEDIA", badge: "Free", earnings: "0 ₫", avatar: "👤" },
    { rank: 3, name: "Lê Hiệp", badge: "Pro", earnings: "0 ₫", avatar: "👤" },
    { rank: 4, name: "Liêu LDHMedia", badge: "Pro", earnings: "0 ₫", avatar: "👤" }
  ];

  return (
    <div className="affiliate-page" style={{ padding: '20px' }}>
      <style>{`
        .affiliate-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .affiliate-title {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .affiliate-container {
          background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%);
          border: 1px solid #2a2a2a;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          margin: 0 auto;
        }
        
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .affiliate-link-section {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 300px;
        }
        
        .link-label {
          color: #fff;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .link-input {
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 8px;
          padding: 8px 12px;
          color: #fff;
          font-size: 0.9rem;
          flex: 1;
          min-width: 200px;
        }
        
        .copy-button {
          background: #FFD700;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          color: #000;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .copy-button:hover {
          background: #FFA500;
          transform: translateY(-1px);
        }
        
        .qr-button {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          color: #000;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .qr-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }
        
        .benefits-section {
          margin-bottom: 32px;
        }
        
        .benefits-title {
          color: #fff;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 16px;
        }
        
        .benefits-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }
        
        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: #2a2a2a;
          border-radius: 12px;
          border: 1px solid #333;
        }
        
        .benefit-icon {
          color: #4CAF50;
          font-size: 20px;
          margin-top: 2px;
        }
        
        .benefit-text {
          color: #ccc;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }
        
        .stat-card {
          background: #2a2a2a;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          border-color: #FFD700;
          transform: translateY(-2px);
        }
        
        .stat-title {
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 16px;
        }
        
        .stat-value {
          color: #FFD700;
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .stat-subtitle {
          color: #888;
          font-size: 0.9rem;
          margin-bottom: 16px;
        }
        
        .stat-button {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          border: none;
          border-radius: 8px;
          padding: 10px 16px;
          color: #000;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }
        
        .stat-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }
        
        .leaderboard-section {
          margin-top: 32px;
        }
        
        .leaderboard-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .leaderboard-badge {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #000;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.9rem;
        }
        
        .leaderboard-title {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .leaderboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }
        
        .publisher-card {
          background: #2a2a2a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .publisher-card:hover {
          border-color: #FFD700;
          transform: translateY(-2px);
        }
        
        .rank-icon {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }
        
        .rank-1 { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000; }
        .rank-2 { background: #C0C0C0; color: #000; }
        .rank-3 { background: #CD7F32; color: #fff; }
        .rank-other { background: #666; color: #fff; }
        
        .publisher-avatar {
          width: 60px;
          height: 60px;
          background: #FFD700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          font-size: 24px;
        }
        
        .publisher-name {
          color: #fff;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .publisher-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .badge-free {
          background: #4CAF50;
          color: #fff;
        }
        
        .badge-pro {
          background: #FFD700;
          color: #000;
        }
        
        .publisher-earnings {
          color: #FFD700;
          font-size: 1.2rem;
          font-weight: 700;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }
        
        .empty-illustration {
          font-size: 64px;
          margin-bottom: 24px;
        }
        
        .empty-message {
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .empty-subtitle {
          color: #888;
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .affiliate-title {
            font-size: 2rem;
          }
          
          .affiliate-container {
            padding: 20px;
          }
          
          .header-section {
            flex-direction: column;
            align-items: stretch;
          }
          
          .affiliate-link-section {
            min-width: auto;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .benefits-list {
            grid-template-columns: 1fr;
          }
          
          .leaderboard-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }
      `}</style>

      {/* Affiliate Title */}
      <h1 className="affiliate-title">THỐNG KÊ</h1>

      {/* Main Affiliate Container */}
      <div className="affiliate-container">
        {/* Header Section */}
        <div className="header-section">
          <div className="affiliate-link-section">
            <span className="link-label">Link Affiliate của bạn:</span>
            <input
              type="text"
              className="link-input"
              value={affiliateLink}
              readOnly
            />
            <button className="copy-button" onClick={copyToClipboard}>
              <IconifyIcon icon="ri:clipboard-line" />
            </button>
          </div>
          
        </div>

        {/* Benefits Section */}
        <div className="benefits-section">
          <h3 className="benefits-title">Quyền lợi Affiliate</h3>
          <div className="benefits-list">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
                <IconifyIcon icon="ri:check-line" className="benefit-icon" />
                <span className="benefit-text">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Level Progress Card */}
          <div className="stat-card">
            <h3 className="stat-title">Level hiện tại: 1</h3>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                border: '3px solid #FFD700',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#fff'
              }}>
                1
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <div style={{ flex: 1, height: '4px', background: '#333', borderRadius: '2px' }}>
                  <div style={{ width: '10%', height: '100%', background: '#FFD700', borderRadius: '2px' }}></div>
                </div>
                <span style={{ color: '#fff', fontSize: '0.9rem' }}>2</span>
              </div>
            </div>
            <div className="stat-subtitle">Số tiền đã tích lũy: <span style={{ color: '#FFD700' }}>0đ</span></div>
            <div className="stat-subtitle">Số tiền cần để lên level tiếp theo: <span style={{ color: '#FFD700' }}>15.000.000 ₫</span></div>
            <button className="stat-button">Tham khảo bảng Level Affiliate</button>
          </div>

          {/* Accumulated Funds Card */}
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <IconifyIcon icon="ri:hand-coin-line" style={{ fontSize: '24px', color: '#FFD700' }} />
              <span className="stat-title">Số tiền tích lũy của bạn:</span>
            </div>
            <div className="stat-value">0đ</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <IconifyIcon icon="ri:money-dollar-circle-line" style={{ fontSize: '24px', color: '#FFD700' }} />
              <span className="stat-title">Số tiền có thể rút:</span>
            </div>
            <div className="stat-value">0đ</div>
            <button className="stat-button">Cập nhật tài khoản ngân hàng</button>
          </div>

          {/* Commission Rate Card */}
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <IconifyIcon icon="ri:percent-line" style={{ fontSize: '24px', color: '#FFD700' }} />
              <span className="stat-title">Mức hoa hồng hiện tại của bạn:</span>
            </div>
            <div className="stat-value">580.000 ₫</div>
            <div className="stat-subtitle">Tương đương: <span style={{ color: '#e74c3c' }}>10%</span></div>
            <div style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '8px' }}>
              Chẳng những được chiết khấu cho người mua mà hoa hồng của bạn còn được tính trên GIÁ TRƯỚC KHI CHIẾT KHẤU
            </div>
          </div>

          {/* Link Statistics Card */}
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <IconifyIcon icon="ri:links-line" style={{ fontSize: '24px', color: '#FFD700' }} />
              <span className="stat-title">Tổng lượt truy cập link affiliate của bạn:</span>
            </div>
            <div className="stat-value">2</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <IconifyIcon icon="ri:discount-percent-line" style={{ fontSize: '24px', color: '#FFD700' }} />
              <span className="stat-title">Mức giảm giá cho người được giới thiệu:</span>
            </div>
            <div className="stat-value">0đ</div>
            <div className="stat-subtitle">Tương đương: <span style={{ color: '#e74c3c' }}>0%</span></div>
          </div>
        </div>

        {/* Top Publisher Leaderboard */}
       

        {/* Empty States for Additional Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>
          <div className="stat-card">
            <h3 className="stat-title">Số tiền hiện có của bạn đến từ</h3>
            <div className="empty-state">
              <div className="empty-illustration">📮</div>
              <div className="empty-message">Chưa có dữ liệu</div>
              <div className="empty-subtitle">Thông tin sẽ hiển thị khi có giao dịch</div>
            </div>
          </div>
          
          <div className="stat-card">
            <h3 className="stat-title">Danh sách giao dịch rút tiền</h3>
            <div className="empty-state">
              <div className="empty-illustration">📮</div>
              <div className="empty-message">Chưa có giao dịch</div>
              <div className="empty-subtitle">Lịch sử rút tiền sẽ hiển thị ở đây</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Affiliate;




















