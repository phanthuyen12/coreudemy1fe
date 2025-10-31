import React, { useMemo, useState, useEffect } from 'react';
import PageTitle from '@/admin/components/PageTitle';
import { Button } from 'react-bootstrap';
import { ticketController } from '../../../../mvc/controllers/ticketController';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
const AdminTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [toast, setToast] = useState(null); 
  const ctrTicket = new ticketController();
  const navigate = useNavigate();

  const showToast = (type, text) => { 
    setToast({ type, text }); 
    setTimeout(() => setToast(null), 1800); 
  };

  async function fetchData() {
    try {
      const res = await ctrTicket.getAllData();
      setTickets(res || []);
    } catch (err) {
      showToast('danger', 'Lấy dữ liệu thất bại');
    }
  }

  useEffect(() => { fetchData(); }, []);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    pending: tickets.filter(t => t.status === 'Pending').length,
    closed: tickets.filter(t => t.status === 'Closed').length
  }), [tickets]);

  const statusColor = (status) => {
    switch(status){
      case 'Open': return 'success';
      case 'Pending': return 'warning';
      case 'Closed': return 'secondary';
      default: return 'light';
    }
  }

  return (
    <>
      <PageTitle title="Cấu hình" subtitle="Quản lý ticket hỗ trợ" />

      {toast && (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex:1080 }}>
          <div className={`toast show bg-${toast.type} text-white`}>
            <div className="toast-body fw-semibold">{toast.text}</div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="row g-3 mb-3">
        {[
          { label: 'Tổng tickets', value: stats.total, color: '#6f42c1' },
          { label: 'Đang mở', value: stats.open, color: '#16a34a' },
          { label: 'Chờ xử lý', value: stats.pending, color: '#f59e0b' },
          { label: 'Đã đóng', value: stats.closed, color: '#0ea5e9' },
        ].map((s, i) => (
          <div className="col-md-3" key={i}>
            <div className="card h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width:40,height:40, background:'#1f2937'}}>
                  <i className={`ri ri-ticket-line fs-5`} style={{color:s.color}}></i>
                </div>
                <div>
                  <div className="text-muted small">{s.label}</div>
                  <div className="fs-4 fw-bold">{s.value}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <div className="fw-bold">DANH SÁCH YÊU CẦU HỖ TRỢ</div>
          <Button size="sm" variant="success" onClick={()=>showToast('info','Tạo ticket mới (demo)')}>
            <i className="ri-add-line me-1"></i> Ticket mới
          </Button>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Người tạo</th>
                <th>Trạng thái</th>
                <th>Cập nhật</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id}>
                  <td>#{t.id}</td>
                  <td>{t.title}</td>
                  <td>
                    {t.user.username} <br />
                    <small className="text-muted">{t.user.email}</small>
                  </td>
                  <td>
                    <span className={`badge bg-${statusColor(t.status)}-subtle text-${statusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>{dayjs(t.updatedAt).format('DD/MM/YYYY HH:mm')}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button size="sm" variant="success" onClick={() => navigate(`/page/ticket/${t.id}?module=admin`)}>Xem</Button>
                      <Button size="sm" variant="danger" onClick={()=>showToast('danger','Đã xoá (demo)')}>Xoá</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminTicketsPage;
