import React, { useState } from 'react';
import { Card, CardBody, Col, Row, Container, Button, Badge } from 'react-bootstrap';
import { Icon as IconifyIcon } from '@iconify/react';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications] = useState([]); // Empty notifications for now

  const tabItems = [
    { id: 'all', label: 'Tất cả mail', count: 0 },
    { id: 'read', label: 'Email đã xem', count: 0 },
    { id: 'unread', label: 'Email chưa xem', count: 0 }
  ];

  return (
    <div className="notifications-page" style={{ padding: '20px' }}>
      <style>{`
        .notifications-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .notifications-title {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .notifications-container {
          background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%);
          border: 1px solid #2a2a2a;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          margin: 0 auto;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .section-title {
          color: #fff;
          font-size: 1.3rem;
          font-weight: 700;
        }
        
        .tab-navigation {
          display: flex;
          gap: 8px;
        }
        
        .tab-button {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .tab-button.active {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #000;
        }
        
        .tab-button:not(.active) {
          background: #2a2a2a;
          color: #fff;
        }
        
        .tab-button:not(.active):hover {
          background: #333;
        }
        
        .tab-count {
          background: rgba(0, 0, 0, 0.2);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.8rem;
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
        
        .notification-item {
          background: #2a2a2a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          transition: all 0.3s ease;
        }
        
        .notification-item:hover {
          background: #333;
          border-color: #FFD700;
        }
        
        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        
        .notification-title {
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 4px;
        }
        
        .notification-time {
          color: #888;
          font-size: 0.8rem;
        }
        
        .notification-content {
          color: #ccc;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 12px;
        }
        
        .notification-actions {
          display: flex;
          gap: 12px;
        }
        
        .action-button {
          background: none;
          border: 1px solid #444;
          border-radius: 6px;
          padding: 6px 12px;
          color: #fff;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .action-button:hover {
          border-color: #FFD700;
          color: #FFD700;
        }
        
        .action-button.primary {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          border-color: #FFD700;
          color: #000;
        }
        
        .action-button.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }
        
        .unread-badge {
          background: #e74c3c;
          color: #fff;
          border-radius: 50%;
          width: 8px;
          height: 8px;
          display: inline-block;
          margin-left: 8px;
        }
        
        @media (max-width: 768px) {
          .notifications-title {
            font-size: 2rem;
          }
          
          .notifications-container {
            padding: 20px;
          }
          
          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          
          .tab-navigation {
            width: 100%;
            flex-wrap: wrap;
          }
          
          .tab-button {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>

      {/* Notifications Title */}
      <h1 className="notifications-title">THÔNG BÁO CỦA BẠN</h1>

      {/* Main Notifications Container */}
      <div className="notifications-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Lịch sử email của bạn</h2>
          
          {/* Tab Navigation */}
          <div className="tab-navigation">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="tab-count">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">📮</div>
            <div className="empty-message">Bạn chưa có thông báo nào!</div>
            <div className="empty-subtitle">
              Khi có thông báo mới, chúng sẽ xuất hiện ở đây
            </div>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification, index) => (
              <div key={index} className="notification-item">
                <div className="notification-header">
                  <div>
                    <div className="notification-title">
                      {notification.title}
                      {!notification.read && <span className="unread-badge"></span>}
                    </div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                </div>
                <div className="notification-content">
                  {notification.content}
                </div>
                <div className="notification-actions">
                  <button className="action-button">Đánh dấu đã đọc</button>
                  <button className="action-button">Xóa</button>
                  <button className="action-button primary">Xem chi tiết</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;




















