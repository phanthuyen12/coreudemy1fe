import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ClientDashboardPage = () => {
  const [searchTicket, setSearchTicket] = useState('');

  const learningProgress = {
    completed: 1,
    total: 37,
    percentage: Math.round((1 / 37) * 100)
  };

  const totalLearningTime = "9 phút";

  const recentActivities = [
    {
      id: 1,
      type: 'video',
      title: 'Sự Khác Biệt Của Phương Pháp 3 Hộp',
      duration: '11:16',
      completed: true,
      date: '2024-01-15'
    },
    {
      id: 2,
      type: 'video',
      title: '[Tradingview] Thực chứng sự kỳ diệu của phương pháp',
      duration: '06:16',
      completed: false,
      date: '2024-01-15'
    },
    {
      id: 3,
      type: 'quiz',
      title: 'Kiểm tra kiến thức - Bài 1',
      duration: '15 phút',
      completed: false,
      date: '2024-01-14'
    }
  ];

  return (
    <div className="client-dashboard">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">DASHBOARD</h4>
          <p className="text-muted mb-0">Chào mừng bạn đến với ROVA Trading</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/client/video-learning" className="btn btn-warning">
            <i className="bx bx-play-circle me-2"></i>
            HỌC NGAY
          </Link>
          <Link to="/client/courses" className="btn btn-outline-primary">
            <i className="bx bx-book-open me-2"></i>
            NÂNG CẤP PRO
          </Link>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="row mb-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '50px', height: '50px' }}>
                  <i className="bx bx-graduation text-white" style={{ fontSize: '20px' }}></i>
                </div>
                <div>
                  <h6 className="card-title mb-1">Tiến độ học:</h6>
                  <h4 className="mb-0 text-primary">{learningProgress.completed}/{learningProgress.total}</h4>
                  <div className="progress mt-2" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-warning" 
                      role="progressbar" 
                      style={{ width: `${learningProgress.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '50px', height: '50px' }}>
                  <i className="bx bx-time text-white" style={{ fontSize: '20px' }}></i>
                </div>
                <div>
                  <h6 className="card-title mb-1">Tổng thời gian học:</h6>
                  <h4 className="mb-0 text-success">{totalLearningTime}</h4>
                  <small className="text-muted">Tiếp tục học để cải thiện kỹ năng</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pb-0">
              <h5 className="card-title mb-0">Hoạt động gần đây</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="list-group-item border-0 px-0">
                    <div className="d-flex align-items-center">
                      <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                        activity.completed ? 'bg-success' : 'bg-light'
                      }`} style={{ width: '40px', height: '40px' }}>
                        <i className={`bx ${
                          activity.type === 'video' ? 'bx-play-circle' : 'bx-edit'
                        } ${activity.completed ? 'text-white' : 'text-muted'}`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{activity.title}</h6>
                        <small className="text-muted">
                          {activity.duration} • {activity.date}
                        </small>
                      </div>
                      <div>
                        {activity.completed ? (
                          <span className="badge bg-success">Hoàn thành</span>
                        ) : (
                          <Link to="/client/video-learning" className="btn btn-sm btn-outline-primary">
                            Tiếp tục
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Center */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0">Trung tâm Ticket</h5>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bx bx-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tìm mã phiếu"
                      value={searchTicket}
                      onChange={(e) => setSearchTicket(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <button className="btn btn-outline-secondary w-100">
                    <i className="bx bx-filter me-2"></i>
                    Bộ lọc
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Mã phiếu</th>
                      <th>Ngày gửi</th>
                      <th>Loại yêu cầu</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div className="text-muted">
                          <i className="bx bx-envelope" style={{ fontSize: '48px' }}></i>
                          <p className="mt-3 mb-0">Bạn chưa có ticket nào</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardPage;
