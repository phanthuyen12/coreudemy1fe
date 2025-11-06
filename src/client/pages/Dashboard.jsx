import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Row, Container, Button, Form, Table, Badge } from 'react-bootstrap';
import { Icon as IconifyIcon } from '@iconify/react';
import { ticketController } from '../../admin/mvc/controllers/ticketController';
import { memeberController } from '../../admin/mvc/controllers/memebersController';
import { authStorage } from '../services/auth';

const Dashboard = () => {
  const [searchTicket, setSearchTicket] = useState('');
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [infoUser, setInfoUser] = useState({});
  
  // Initialize controllers
  const ctrM = new memeberController();
  const ctrT = new ticketController();

  // Get user info and tickets
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get user token and info
        const token = await authStorage.getToken();
        const userInfo = await ctrM.getInfoToken(token);
        setInfoUser(userInfo);
        
        // Get user tickets
        if (userInfo.id) {
          const ticketsData = await ctrT.getUserTickets(userInfo.id);
          setTickets(ticketsData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter tickets based on search
  const filteredTickets = tickets.filter(ticket => 
    ticket.id.toString().includes(searchTicket) || 
    ticket.title.toLowerCase().includes(searchTicket.toLowerCase())
  );

  return (
    <div className="dashboard-page" style={{ padding: '20px' }}>
      <style>{`
        .dashboard-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .dashboard-title {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .info-card {
          background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%);
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        
        .info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }
        
        .info-card-title {
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 12px;
        }
        
        .info-card-value {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .info-icon {
          color: #FFD700;
          font-size: 1.2rem;
        }
        
        .cta-banner {
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          margin: 2rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .cta-text {
          color: #fff;
          font-size: 1.1rem;
          font-weight: 500;
        }
        
        .facebook-btn {
          background: linear-gradient(135deg, #1877f2 0%, #0d5bb8 100%);
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          color: #fff;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .facebook-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(24, 119, 242, 0.3);
        }
        
        .ticket-center {
          background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%);
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .ticket-center-title {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 24px;
        }
        
        .search-filter-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        
        .search-input {
          flex: 1;
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 8px;
          padding: 12px 16px;
          color: #fff;
          font-size: 14px;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #FFD700;
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
        }
        
        .search-input::placeholder {
          color: #888;
        }
        
        .filter-btn {
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 8px;
          padding: 12px 16px;
          color: #fff;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .filter-btn:hover {
          background: #333;
          border-color: #FFD700;
        }
        
        .table-header {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid #333;
          margin-bottom: 24px;
        }
        
        .table-header-item {
          color: #888;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }
        
        .empty-state-icon {
          font-size: 64px;
          margin-bottom: 24px;
          opacity: 0.7;
        }
        
        .empty-state-title {
          color: #fff;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .empty-state-subtitle {
          color: #888;
          font-size: 0.9rem;
        }
        
        .ticket-item {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid #333;
          align-items: center;
        }
        
        .ticket-item:last-child {
          border-bottom: none;
        }
        
        .ticket-code {
          color: #FFD700;
          font-weight: 600;
          font-family: monospace;
        }
        
        .ticket-date {
          color: #ccc;
          font-size: 0.9rem;
        }
        
        .ticket-type {
          color: #fff;
          font-size: 0.9rem;
        }
        
        .ticket-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-pending {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.3);
        }
        
        .status-processing {
          background: rgba(13, 110, 253, 0.2);
          color: #0d6efd;
          border: 1px solid rgba(13, 110, 253, 0.3);
        }
        
        .status-completed {
          background: rgba(25, 135, 84, 0.2);
          color: #198754;
          border: 1px solid rgba(25, 135, 84, 0.3);
        }
        
        @media (max-width: 768px) {
          .dashboard-title {
            font-size: 2rem;
          }
          
          .cta-banner {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .search-filter-bar {
            flex-direction: column;
          }
          
          .table-header,
          .ticket-item {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }
      `}</style>

      {/* Dashboard Title */}
      <h1 className="dashboard-title">DASHBOARD</h1>

      {/* Information Cards */}
      {/* <Row className="mb-4">
        <Col md={6} className="mb-3">
          <div className="info-card">
            <div className="info-card-title">Tiến độ học:</div>
            <div className="info-card-value">
              <IconifyIcon icon="ri:book-open-line" className="info-icon" />
              0/106
                </div>
          </div>
        </Col>
        <Col md={6} className="mb-3">
          <div className="info-card">
            <div className="info-card-title">Tổng thời gian học:</div>
            <div className="info-card-value">
              <IconifyIcon icon="ri:time-line" className="info-icon" />
              1 phút
              </div>
            </div>
          </Col>
      </Row> */}

      {/* Call to Action Banner */}
      <div className="cta-banner">
        <div className="cta-text">
          Đừng quên tham gia nhóm để nhận được nhiều quyền lợi
        </div>
        <Button className="facebook-btn">
          <IconifyIcon icon="ri:facebook-fill" />
          Nhóm học viên của 3H STATION
        </Button>
      </div>

      {/* Ticket Center */}
      <div className="ticket-center">
        <h2 className="ticket-center-title">Trung tâm Ticket</h2>
        
        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <div style={{ position: 'relative', flex: 1 }}>
            <IconifyIcon 
              icon="ri:search-line" 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#888',
                fontSize: '16px'
              }} 
            />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm mã phiếu"
              value={searchTicket}
              onChange={(e) => setSearchTicket(e.target.value)}
              style={{ paddingLeft: '40px' }}
                />
              </div>
          <Button className="filter-btn">
            <IconifyIcon icon="ri:filter-3-line" />
            Bộ lọc
          </Button>
                      </div>

        {/* Table Headers */}
        <div className="table-header">
          <div className="table-header-item">Mã phiếu</div>
          <div className="table-header-item">Ngày gửi</div>
          <div className="table-header-item">Loại yêu cầu</div>
          <div className="table-header-item">Trạng thái</div>
                    </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <div className="empty-state-title">Đang tải dữ liệu...</div>
            <div className="empty-state-subtitle">Vui lòng chờ trong giây lát</div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📮</div>
            <div className="empty-state-title">Bạn chưa có ticket nào</div>
            <div className="empty-state-subtitle">
              Khi bạn tạo ticket hỗ trợ, chúng sẽ xuất hiện ở đây
            </div>
          </div>
        ) : (
          <div>
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="ticket-item">
                <div className="ticket-code">#{ticket.id}</div>
                <div className="ticket-date">{new Date(ticket.createdAt).toLocaleDateString('vi-VN')}</div>
                <div className="ticket-type">{ticket.issueType}</div>
                <div className={`ticket-status ${ticket.status === 'Open' ? 'status-pending' : 'status-completed'}`}>
                  {ticket.status === 'Open' ? 'Đang chờ' : 'Đã phản hồi'}
                </div>
              </div>
            ))}
          </div>
        )}
            </div>
    </div>
  );
};
 
export default Dashboard;