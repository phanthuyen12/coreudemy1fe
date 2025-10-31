import React, { useMemo, useState } from 'react';
import PageTitle from '@/admin/components/PageTitle';

const AdminBankingPage = () => {
  const stats = useMemo(() => ([
    { label: 'Toàn thời gian', value: '8.560.000đ', icon: 'ri-time-line', color: 'bg-danger-subtle text-danger' },
    { label: 'Tháng 10', value: '2.320.000đ', icon: 'ri-calendar-line', color: 'bg-info-subtle text-info' },
    { label: 'Trong tuần', value: '980.000đ', icon: 'ri-calendar-event-line', color: 'bg-warning-subtle text-warning' },
    { label: 'Hôm nay', value: '220.000đ', icon: 'ri-flashlight-line', color: 'bg-primary-subtle text-primary' },
    // 4 box bổ sung
    { label: 'Giao dịch thành công', value: '126', icon: 'ri-checkbox-circle-line', color: 'bg-success-subtle text-success' },
    { label: 'Giao dịch thất bại', value: '7', icon: 'ri-close-circle-line', color: 'bg-danger-subtle text-danger' },
    { label: 'Chưa thanh toán', value: '12', icon: 'ri-time-line', color: 'bg-secondary-subtle text-secondary' },
    { label: 'Ngân hàng đang dùng', value: 'Vietcombank', icon: 'ri-bank-card-2-line', color: 'bg-info-subtle text-info' },
  ]), []);

  const [filters, setFilters] = useState({ memberId:'', username:'', txnId:'', bank:'', date:'' });
  const rows = [
    { id: 1, username: 'admin [ID 1]', txn: '462153897', status: 'Chưa thanh toán', amount:'20.000đ', received:'20.000đ', bank:'Vietcombank', time:'2025-10-02 21:11:16', updated:'2025-10-02 21:11:16' },
    { id: 2, username: 'admin [ID 1]', txn: '427193685', status: 'Hết hạn', amount:'7.000đ', received:'7.000đ', bank:'Vietcombank', time:'2025-09-28 01:59:29', updated:'2025-09-30 22:11:05' },
    { id: 3, username: 'admin [ID 1]', txn: '849371256', status: 'Hết hạn', amount:'10.000đ', received:'10.000đ', bank:'Vietcombank', time:'2025-09-27 12:54:04', updated:'2025-09-30 22:11:05' },
    { id: 4, username: 'admin [ID 1]', txn: '431267589', status: 'Hết hạn', amount:'20.000đ', received:'20.000đ', bank:'Vietcombank', time:'2025-09-27 02:38:07', updated:'2025-09-30 22:11:05' },
    { id: 5, username: 'admin [ID 1]', txn: '478936512', status: 'Hết hạn', amount:'30.000đ', received:'30.000đ', bank:'Vietcombank', time:'2025-09-25 14:38:34', updated:'2025-09-30 22:11:05' },
    { id: 6, username: 'admin [ID 1]', txn: '526184739', status: 'Hết hạn', amount:'20.000đ', received:'20.000đ', bank:'Vietcombank', time:'2025-09-25 14:38:14', updated:'2025-09-30 22:11:05' },
    { id: 7, username: 'admin [ID 1]', txn: '157243968', status: 'Hết hạn', amount:'1.000.000đ', received:'1.000.000đ', bank:'Vietcombank', time:'2025-09-24 13:39:22', updated:'2025-09-30 22:11:05' },
    { id: 8, username: 'admin [ID 1]', txn: '569784123', status: 'Hết hạn', amount:'10.000đ', received:'10.000đ', bank:'Vietcombank', time:'2025-09-21 13:18:53', updated:'2025-09-30 22:11:05' },
    { id: 9, username: 'admin [ID 1]', txn: '715946832', status: 'Hết hạn', amount:'100.000đ', received:'100.000đ', bank:'Vietcombank', time:'2025-09-20 23:25:09', updated:'2025-09-30 22:11:05' },
    { id: 10, username: 'admin [ID 1]', txn: '915723864', status: 'Hết hạn', amount:'100.000đ', received:'100.000đ', bank:'Vietcombank', time:'2025-09-18 03:51:12', updated:'2025-09-30 22:11:05' },
  ];

  return (
    <div className="container-fluid">
      <style>{`
        .banking-pagination .page-link { 
          border-radius: 10px; 
          border: 1px solid #e5e7eb; 
          color: #6b7280; 
          padding: .45rem .75rem; 
          background: #fff;
          transition: all .2s ease;
        }
        .banking-pagination .page-item + .page-item { margin-left: .25rem; }
        .banking-pagination .page-link:hover { background: #f3f4f6; color: #111827; }
        .banking-pagination .page-item.active .page-link { 
          background: #4f46e5; 
          border-color: #4f46e5; 
          color: #fff; 
          box-shadow: 0 6px 18px rgba(79,70,229,.25);
        }
        .banking-pagination .page-item.disabled .page-link { opacity: .5; }
      `}</style>
      <PageTitle title="Ngân hàng" subtitle="Nạp tiền" />

      {/* Cron hint */}
      <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
        <i className="ri-notification-2-line"></i>
        Vui lòng thực hiện CRON JOB 1 phút 1 lần hoặc nhanh hơn để hệ thống xử lý nạp tiền tự động.
        <a href="#cron" className="ms-2 fw-semibold">Xem hướng dẫn</a>
        <div className="ms-auto">
          <button className="btn btn-outline-secondary btn-sm"><i className="ri-settings-3-line me-1"></i> Cấu hình</button>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-3">
        {stats.map((s, i) => (
          <div className="col-md-3" key={i}>
            <div className="card h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className={`avatar-md rounded-circle d-flex align-items-center justify-content-center ${s.color}`}>
                  <i className={s.icon}></i>
                </div>
                <div>
                  <div className="fs-4 fw-bold">{s.value}</div>
                  <div className="text-muted small">{s.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header fw-semibold">THỐNG KÊ NẠP TIỀN THÁNG 10</div>
            <div className="card-body">
              <div className="border rounded" style={{height:260}}>
                {/* Placeholder cho biểu đồ: có thể thay bằng ApexCharts của theme */}
                <div className="h-100 d-flex align-items-center justify-content-center text-muted">Biểu đồ nạp tiền (placeholder)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <div className="fw-bold">LỊCH SỬ HÓA ĐƠN NẠP TIỀN</div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-primary btn-sm"><i className="ri-search-line me-1"></i> Tìm kiếm</button>
            <button className="btn btn-danger btn-sm"><i className="ri-close-circle-line me-1"></i> Xóa bộ lọc</button>
          </div>
        </div>
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-md-2"><input className="form-control" placeholder="Tìm ID thành viên" value={filters.memberId} onChange={e=>setFilters({...filters, memberId:e.target.value})} /></div>
            <div className="col-md-2"><input className="form-control" placeholder="Tìm Username" value={filters.username} onChange={e=>setFilters({...filters, username:e.target.value})} /></div>
            <div className="col-md-2"><input className="form-control" placeholder="Mã giao dịch" value={filters.txnId} onChange={e=>setFilters({...filters, txnId:e.target.value})} /></div>
            <div className="col-md-2"><input className="form-control" placeholder="Ngân hàng" value={filters.bank} onChange={e=>setFilters({...filters, bank:e.target.value})} /></div>
            <div className="col-md-2"><input className="form-control" placeholder="Chọn thời gian" value={filters.date} onChange={e=>setFilters({...filters, date:e.target.value})} /></div>
          </div>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Thao tác</th>
                  <th>Username</th>
                  <th>Mã giao dịch</th>
                  <th>Trạng thái</th>
                  <th>Số tiền nạp</th>
                  <th>Thực nhận</th>
                  <th>Ngân hàng</th>
                  <th>Thời gian</th>
                  <th>Cập nhật</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-warning btn-sm d-inline-flex align-items-center gap-1"><i className="ri-edit-2-line"></i> Edit</button>
                        <button className="btn btn-danger btn-sm d-inline-flex align-items-center gap-1"><i className="ri-delete-bin-6-line"></i></button>
                      </div>
                    </td>
                    <td>{r.username}</td>
                    <td>{r.txn}</td>
                    <td><span className={`badge ${r.status === 'Chưa thanh toán' ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-muted'}`}>{r.status}</span></td>
                    <td className="text-success fw-semibold">{r.amount}</td>
                    <td className="text-danger fw-semibold">{r.received}</td>
                    <td>{r.bank}</td>
                    <td>{r.time}</td>
                    <td>{r.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-2">
            <div className="text-muted small">Đã thanh toán: <span className="fw-semibold">0đ</span> | Thực nhận: <span className="fw-semibold">0đ</span></div>
            <nav>
              <ul className="pagination banking-pagination mb-0">
                <li className="page-item disabled"><span className="page-link"><i className="ri-arrow-left-s-line"></i></span></li>
                <li className="page-item active"><span className="page-link">1</span></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item"><a className="page-link" href="#"><i className="ri-arrow-right-s-line"></i></a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBankingPage;


