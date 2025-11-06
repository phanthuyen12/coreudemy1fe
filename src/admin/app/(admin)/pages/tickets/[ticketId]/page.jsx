import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import PageTitle from '@/admin/components/PageTitle';
import dayjs from 'dayjs';
import {API_BASE_URL} from '../../../../../../../src/config/config'
const AdminTicketDetailPage = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [toast, setToast] = useState(null);
  const [replyText, setReplyText] = useState('');
  // THAY ĐỔI 1: State này giờ sẽ lưu đối tượng File, không còn là chuỗi base64
  const [replyImage, setReplyImage] = useState(null); 
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null); // Thêm ref cho input file để reset

  // Toast helper
  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch ticket detail
  const fetchData = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/tickets/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await response.json();
      setTicket(res);

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      showToast('danger', 'Lấy dữ liệu ticket thất bại');
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchData(ticketId);
    }
  }, [ticketId]);

  const info = useMemo(() => ticket || {}, [ticket]);
  const messages = info.messages || [];

  // THAY ĐỔI 2: Cập nhật hoàn toàn hàm gửi reply để dùng FormData
  const handleSendReply = async () => {
    if (!replyText.trim() && !replyImage) {
      showToast('danger', 'Vui lòng nhập nội dung hoặc chọn hình ảnh');
      return;
    }

    // Tạo đối tượng FormData
    const formData = new FormData();

    // Lấy userId từ thông tin admin đang đăng nhập (ví dụ)
    const adminId = 2; // Giữ giá trị tạm thời

    // Thêm các trường dữ liệu vào formData
    formData.append('message', replyText);
    formData.append('userId', adminId.toString()); // Chuyển sang chuỗi cho an toàn
    if (replyImage) {
      formData.append('image', replyImage); // Thêm file vào formData
    }
    
    try {
      // Gửi request với FormData
      const res = await fetch(`http://localhost:3000/tickets/${ticketId}/reply`, {
        method: 'POST',
        body: formData, // Không cần header Content-Type, trình duyệt sẽ tự xử lý
      });

      if (!res.ok) throw new Error('Lỗi server khi gửi phản hồi');

      // Reset form sau khi gửi thành công
      setReplyText('');
      setReplyImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input file hiệu quả hơn
      }
      showToast('success', 'Đã gửi phản hồi');

      fetchData(ticketId); // Tải lại dữ liệu
    } catch (err) {
      console.error(err);
      showToast('danger', 'Gửi phản hồi thất bại');
    }
  };

  // THAY ĐỔI 3: Cập nhật hàm xử lý ảnh để lưu đối tượng File
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReplyImage(file);
    } else {
      setReplyImage(null);
    }
  };

  // Hàm xóa ảnh đã chọn
  const handleRemoveImage = () => {
    setReplyImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  if (!ticket) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="container-fluid">
      <PageTitle title={`Chi tiết Ticket #${info.id || ''}`} subtitle="Support Tickets" />

      {toast && (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div className={`toast show bg-${toast.type} text-white`}>
            <div className="toast-body fw-semibold">{toast.text}</div>
          </div>
        </div>
      )}

      <div className="row g-3">
        {/* Left: conversation */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header bg-primary text-white fw-semibold">Cuộc hội thoại</div>
            <div className="card-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {messages.map((m) => (
                <div key={m.id} className="d-flex align-items-start gap-3 mb-3">
                  <div className="avatar-sm bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                    <span className="fw-bold">{m.sender.username[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-semibold">{m.sender.username}</span>
                      <span
                        className={`badge ${
                          m.sender.role === 'admin'
                            ? 'bg-danger text-white'
                            : 'bg-secondary-subtle text-muted'
                        }`}
                      >
                        {m.sender.role === 'admin' ? 'Admin' : 'Khách hàng'}
                      </span>
                      <span className="text-muted small ms-auto">
                        {dayjs(m.createdAt).format('HH:mm DD/MM/YYYY')}
                      </span>
                    </div>
                    <div className="mt-2 p-3 rounded border bg-light">
                      {m.message && <p className="mb-0" style={{whiteSpace: 'pre-wrap'}}>{m.message}</p>}
                      {m.image && (
                        <div className="mt-2">
                          <a href={m.image} target="_blank" rel="noopener noreferrer">
                         <img
  src={`${API_BASE_URL}/uploads/tickets/${m.image}`}
  alt="Attached"
  style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: 4, cursor: 'pointer' }}
/>

                           </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="card-footer">
                <div className="d-flex flex-column gap-2">
                    <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Nhập phản hồi của bạn..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                             <input ref={fileInputRef} className="form-control form-control-sm" type="file" accept="image/*" onChange={handleImageChange} />
                            {/* THAY ĐỔI 4: Cập nhật cách hiển thị preview */}
                            {replyImage && (
                                <div className="mt-2">
                                    <img src={URL.createObjectURL(replyImage)} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: 4 }} />
                                    <button onClick={handleRemoveImage} className="btn btn-sm btn-danger ms-2">Xóa ảnh</button>
                                </div>
                            )}
                        </div>
                        <button className="btn btn-primary" onClick={handleSendReply}>
                            Gửi phản hồi
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Right: ticket & user info */}
        <div className="col-lg-4">
          {/* ... Phần thông tin ticket và người dùng không thay đổi ... */}
          <div className="card mb-3">
            <div className="card-header bg-info-subtle fw-semibold">Thông tin ticket</div>
            <div className="card-body">
              <div className="mb-2">
                <span className="badge bg-primary-subtle text-primary me-2">ID: #{info.id}</span>
                <span className="badge bg-success-subtle text-success text-uppercase">{info.status}</span>
              </div>
              <div className="small text-muted">Tiêu đề</div>
              <div className="fw-semibold mb-2">{info.title}</div>
              <div className="small text-muted">Ngày tạo</div>
              <div className="mb-2">{dayjs(info.createdAt).format('DD/MM/YYYY HH:mm')}</div>
              <div className="small text-muted">Cập nhật lần cuối</div>
              <div>{dayjs(info.updatedAt).format('DD/MM/YYYY HH:mm')}</div>
            </div>
          </div>

          {info.user && (
            <div className="card">
              <div className="card-header bg-info-subtle fw-semibold">Thông tin khách hàng</div>
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="avatar-sm bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                    <span className="fw-bold">{info.user.username[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="fw-semibold">{info.user.username}</div>
                    <div className="text-muted small">{info.user.email}</div>
                  </div>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <div className="p-2 rounded border text-center">
                      <div className="fs-5 fw-bolder">{parseFloat(info.user.balance).toLocaleString('vi-VN')}đ</div>
                      <div className="text-muted small">Số dư</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded border text-center">
                      <div className="fs-5 fw-bolder">{parseFloat(info.user.totalTopup).toLocaleString('vi-VN')}đ</div>
                      <div className="text-muted small">Đã nạp</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTicketDetailPage;















