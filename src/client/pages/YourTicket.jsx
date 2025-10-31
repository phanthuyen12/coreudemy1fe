import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { authStorage } from '../services/auth';
import { memeberController } from '../../admin/mvc/controllers/memebersController';
import { ticketController } from '../../admin/mvc/controllers/ticketController';

// Định nghĩa URL cơ sở của API để dễ quản lý
const API_BASE_URL = 'http://localhost:3000';

// SVG Icon Component (Không thay đổi)
const Icon = ({ name, size = 20, color = 'currentColor' }) => {
    const icons = {
    'add-circle-line': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 11H17V13H13V17H11V13H7V11H11V7H13V11Z"></path></svg>,
    'grid-line': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M14 10H10V14H14V10ZM16 10V14H20V10H16ZM14 16H10V20H14V16ZM16 16V20H20V16H16ZM8 10H4V14H8V10ZM8 16H4V20H8V16ZM8 4H4V8H8V4ZM10 4V8H14V4H10ZM16 4V8H20V4H16ZM21 2H3C2.44772 2 2 2.44772 2 3V21C2 21.5523 2.44772 22 3 22H21C21.5523 22 22 21.5523 22 21V3C22 2.44772 21.5523 2 21 2ZM20 4V8H16V4H20ZM14 4V8H10V4H14ZM8 4V8H4V4H8ZM4 10V14H8V10H4ZM4 16V20H8V16H4ZM10 16H14V20H10V16ZM10 10H14V14H10V10ZM16 10V14H20V10H16ZM20 16H16V20H20V16Z"></path></svg>,
    'mail-check-line': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M22 13.3421V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H13.3421L12.636 4.41421L11.2218 3L20 3.00002V11.2218L18.5858 12.636L20 13.3421H22ZM20 5.41421V8.58579L18.5858 7.17157L20 5.41421ZM16.5858 9.17157L18 7.75736V5L4 5V19H20V15.5858L19 14.5858L16.5858 17L14 14.4142L15 13.4142L16.5858 15L19.4142 12.1716L20.4142 13.1716L16.5858 17L12.5 12.9142L4 20.4142V19L11.5 11.5L14.0858 14.0858L15.5 12.6716L12.5 9.67157L15.1716 7L16.5858 8.41421L17.1716 9.17157H16.5858Z"></path></svg>,
    'image-add-line': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M21 15V18H24V20H21V23H19V20H16V18H19V15H21ZM21.0082 3C21.556 3 22 3.44495 22 3.9934V13H20V5H4V19H14V21H3.0066C2.45059 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 3.0082 3H21.0082ZM8 10C8 11.1046 7.10457 12 6 12C4.89543 12 4 11.1046 4 10C4 8.89543 4.89543 8 6 8C7.10457 8 8 8.89543 8 10ZM19.2302 10.1668L14.3381 16H6.01251L10.4932 10.5057L13.2371 13.7812L19.2302 10.1668Z"></path></svg>,
    'send-plane-line': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M1.94592 9.31541C1.42371 9.1413 1.4194 8.86031 1.95662 8.6811L21.0433 2.319C21.5715 2.14285 21.8746 2.43812 21.7265 2.9569L16.2735 22.0431C16.1223 22.5713 15.8231 22.5699 15.6534 22.0413L12.6534 14L18.0001 5.99998L9.99999 11.3466L1.94592 9.31541Z"></path></svg>,
    'user-star-line': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M12 14V12C8.68629 12 6 9.31371 6 6C6 2.68629 8.68629 0 12 0C15.3137 0 18 2.68629 18 6C18 9.31371 15.3137 12 12 12V14ZM12 16C17.5228 16 22 18.2386 22 21V22H2V21C2 18.2386 6.47715 16 12 16ZM15.3151 16.059C15.9351 15.1116 16.92 14.5 18 14.5C19.933 14.5 21.5 16.067 21.5 18C21.5 19.933 19.933 21.5 18 21.5C16.067 21.5 14.5 19.933 14.5 18C14.5 17.1611 14.864 16.4103 15.4411 15.864L12 18L8.55891 15.864C9.136 16.4103 9.5 17.1611 9.5 18C9.5 19.933 7.933 21.5 6 21.5C4.067 21.5 2.5 19.933 2.5 18C2.5 16.067 4.067 14.5 6 14.5C7.08 14.5 8.06489 15.1116 8.68491 16.059C9.69234 16.0211 10.7854 16 12 16Z"></path></svg>,
    'attachment-line': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M14.228 12.0182L12.8138 13.4325L11.3995 12.0182C10.6185 11.2372 10.6185 9.97087 11.3995 9.18988C12.1805 8.40888 13.4468 8.40888 14.2278 9.18988C15.0088 9.97087 15.0088 11.2372 14.2278 12.0182H14.228ZM16.3493 7.0684C14.7872 5.50634 12.2478 5.50634 10.6858 7.0684L5.2312 12.523C3.27858 14.4756 3.27858 17.7419 5.2312 19.6945C7.18382 21.6472 10.4501 21.6472 12.4028 19.6945L18.7902 13.3071C19.9712 12.1261 19.9712 10.2734 18.7902 9.0924C17.6092 7.91141 15.7565 7.91141 14.5755 9.0924L13.1613 10.5066L14.5755 11.9208L15.9898 10.5066C16.3803 10.1161 17.0134 10.1161 17.404 10.5066C17.7945 10.8971 17.7945 11.5303 17.404 11.9208L11.0165 18.3083C9.83552 19.4893 7.98286 19.4893 6.80187 18.3083C5.62088 17.1273 5.62088 15.2746 6.80187 14.0936L12.2564 8.63905C13.0374 7.85805 14.3038 7.85805 15.0848 8.63905C15.8658 9.41999 15.8658 10.6864 15.0848 11.4674L13.6705 12.8816L15.0848 14.2958L16.499 12.8816C17.6799 11.7006 17.6799 9.84797 16.499 8.66697L16.3493 7.0684Z"></path></svg>,
  };
  return icons[name] || null;
};

const YourTicket = () => {
    const [tickets, setTickets] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const [infoUser, setinfoUser] = useState({});
    const [formData, setFormData] = useState({ issueType: '', title: '', message: '', images: [] });
    const [replyText, setReplyText] = useState('');
    const [replyFiles, setReplyFiles] = useState([]);
    
    const conversationEndRef = useRef(null);
    const ctrM = useMemo(() => new memeberController(), []);
    const ctrT = useMemo(() => new ticketController(), []);
    
    const userId = infoUser.id;

    useEffect(() => {
        async function GetToken() {
            const token = await authStorage.getToken();
            if (token) {
                const res = await ctrM.getInfoToken(token);
                setinfoUser(res);
            }
        }
        GetToken();
    }, [ctrM]);

	const fetchTickets = useCallback(async () => {
		if (!userId) return [];
		setIsLoading(true);
		try {
			const data = await ctrT.getUserTickets(userId);
			const formattedTickets = data.map(ticket => ({
				id: ticket.id,
				title: ticket.title,
				issueType: ticket.issueType,
				// Chỉ hiển thị 'responded' nếu status là 'Closed' (ticket đã đóng - admin đã xử lý)
				// Status 'Open' và 'Pending' đều là 'pending' (chờ admin xử lý/phản hồi)
				status: ticket.status === 'Closed' ? 'responded' : 'pending',
				createdAt: ticket.createdAt,
				conversation: [],
			})).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			setTickets(formattedTickets);
			return formattedTickets;
		} catch (error) {
			console.error("Error fetching tickets:", error);
			return [];
		} finally {
			setIsLoading(false);
		}
	}, [userId, ctrT]);

	useEffect(() => {
		(async () => {
			const list = await fetchTickets();
			if (list.length > 0) {
				handleSelectTicket(list[0]);
			}
		})();
	}, [fetchTickets]);

    useEffect(() => {
        conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedTicket?.conversation]);

    const handleSelectTicket = async (ticketToSelect) => {
        if (selectedTicket?.id === ticketToSelect.id && ticketToSelect.conversation.length > 0) {
            return;
        }
        setSelectedTicket(ticketToSelect);
        setIsDetailsLoading(true);
        try {
            const detailedTicket = await ctrT.getTicketDetails(ticketToSelect.id);
            
            const conversation = detailedTicket.messages.map(msg => ({
                id: msg.id,
                sender: msg.sender.role === 'admin' ? 'support' : 'user',
                text: msg.message,
                // Tạo URL đầy đủ cho hình ảnh nếu có
                imageUrl: msg.image ? `${API_BASE_URL}/uploads/tickets/${msg.image}` : null,
                timestamp: msg.createdAt,
            }));

            // Kiểm tra xem có message nào từ admin không
            const hasAdminReply = conversation.some(msg => msg.sender === 'support');
            const newStatus = hasAdminReply ? 'responded' : 'pending';

            const updatedTicket = { ...ticketToSelect, conversation, status: newStatus };
            setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
            setSelectedTicket(updatedTicket);
        } catch (error) {
            console.error(`Error fetching details for ticket #${ticketToSelect.id}:`, error);
        } finally {
            setIsDetailsLoading(false);
        }
    };

    const filteredTickets = useMemo(() => {
        if (activeTab === 'responded') {
            return tickets.filter(t => t.status !== 'pending');
        }
        return tickets;
    }, [activeTab, tickets]);

    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
    
    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImages = [...formData.images, ...files].slice(0, 4);
        setFormData(prev => ({ ...prev, images: newImages }));
    };
    
    const handleRemoveImage = (index) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.issueType || !formData.title || !formData.message) {
            console.warn("Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }
        try {
            const data = new FormData();
            data.append("issueType", formData.issueType);
            data.append("title", formData.title);
            data.append("message", formData.message);
            data.append("userId", userId);
            formData.images.forEach(file => data.append("image", file));
			const newTicketApi = await ctrT.createTicket(data);
			setFormData({ issueType: "", title: "", message: "", images: [] });
			const refreshed = await fetchTickets();
			const justCreated = refreshed.find(t => t.id === newTicketApi.id);
			if (justCreated) {
				handleSelectTicket(justCreated);
			}
        } catch (err) {
            console.error("Lỗi khi gửi ticket:", err);
        }
    };

    const handleReplyFileChange = (event) => {
        const files = Array.from(event.target.files);
        setReplyFiles(prev => [...prev, ...files].slice(0, 4));
    };
    
    const handleRemoveReplyFile = (index) => {
        setReplyFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if ((!replyText.trim() && replyFiles.length === 0) || !selectedTicket) return;
        
        const formData = new FormData();
        formData.append('message', replyText);
        formData.append('userId', userId.toString());
        if (replyFiles.length > 0) {
            replyFiles.forEach(file => formData.append('image', file));
        }

        try {
            const res = await fetch(`${API_BASE_URL}/tickets/${selectedTicket.id}/reply`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Lỗi server khi gửi phản hồi');
            }

			await res.json();
			const refreshed = await fetchTickets();
			const current = refreshed.find(t => t.id === selectedTicket.id);
			if (current) {
				await handleSelectTicket(current);
			}
			setReplyText('');
			setReplyFiles([]);
        } catch (err) {
            console.error("Lỗi khi gửi trả lời:", err);
        }
    };

    const createNewTicket = () => setSelectedTicket(null);

    if (isLoading) {
        return <div>Đang tải ticket của bạn...</div>;
    }
  
    return (
        <div className="your-ticket-page">
            <style>{`
              /* Your CSS styles here */
            `}</style>
            <div className="ticket-container">
                {/* Left Sidebar */}
                <div className="left-sidebar">
                   <button className="new-ticket-btn" onClick={createNewTicket}><Icon name="add-circle-line" /> Tạo Ticket Mới</button>
                   <div className="ticket-nav">
                        <button className={`nav-button ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                            <div className="nav-button-content"><Icon name="grid-line" /> Tất cả ticket</div>
                            <div className="nav-button-count">{tickets.length}</div>
                        </button>
                        <button className={`nav-button ${activeTab === 'responded' ? 'active' : ''}`} onClick={() => setActiveTab('responded')}>
                            <div className="nav-button-content"><Icon name="mail-check-line" /> Ticket đã phản hồi</div>
                            <div className="nav-button-count">{tickets.filter(t => t.status !== 'pending').length}</div>
                        </button>
                    </div>
                    <div className="ticket-list">
                        {filteredTickets.map(ticket => (
                            <div key={ticket.id} className={`ticket-item ${selectedTicket?.id === ticket.id ? 'active' : ''}`} onClick={() => handleSelectTicket(ticket)}>
                                <div className="ticket-item-header">
                                    <span className="ticket-title">{ticket.title}</span>
                                    <span className={`ticket-status ${ticket.status}`}>{ticket.status === 'responded' ? 'Đã phản hồi' : 'Đang chờ'}</span>
                                </div>
                                <div className="ticket-item-meta">
                                    <span>#{ticket.id}</span>
                                    <span>{new Date(ticket.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Right Main Area */}
                <div className="right-main">
                    {selectedTicket ? (
                        <div className="ticket-details-view">
                            <div style={{ borderBottom: '1px solid #2a2a2a', paddingBottom: '16px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{selectedTicket.title}</h2>
                                <p style={{ color: '#888' }}>Ticket #{selectedTicket.id}</p>
                            </div>
                            <div className="conversation-container">
                                {isDetailsLoading ? (
                                    <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải nội dung...</div>
                                ) : (
                                    selectedTicket.conversation.map(msg => (
                                        <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                                            {msg.text && <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>}
                                            
                                            {msg.imageUrl && (
                                                <div className="message-attachments" style={{ marginTop: '8px' }}>
                                                    <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                                                        <img 
                                                            src={msg.imageUrl} 
                                                            alt="Hình ảnh đính kèm" 
                                                            style={{ maxWidth: '200px', borderRadius: '8px', cursor: 'pointer' }} 
                                                        />
                                                    </a>
                                                </div>
                                            )}

                                            <div className="message-meta">{new Date(msg.timestamp).toLocaleString('vi-VN')}</div>
                                        </div>
                                    ))
                                )}
                                <div ref={conversationEndRef} />
                            </div>
                            <form className="reply-form-container" onSubmit={handleReplySubmit}>
                                <div className="reply-files-preview">
                                    {replyFiles.map((file, index) => (
                                       <div key={index} className="image-item" style={{width: '60px', height: '60px'}}>
                                            <img src={URL.createObjectURL(file)} alt={file.name} />
                                            <button type="button" className="remove-image" onClick={() => handleRemoveReplyFile(index)}>×</button>
                                        </div>
                                    ))}
                                </div>
                                <div className="reply-input-wrapper">
                                     <textarea 
                                        className="reply-textarea" 
                                        rows="2" 
                                        placeholder="Nhập tin nhắn..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                     />
                                     <input type="file" id="replyFile" multiple onChange={handleReplyFileChange} className="hidden-input"/>
                                     <button type="button" className="reply-button" title="Đính kèm tệp" onClick={() => document.getElementById('replyFile').click()}>
                                        <Icon name="attachment-line" size={24}/>
                                     </button>
                                     <button type="submit" className="reply-button" title="Gửi">
                                        <Icon name="send-plane-line" size={24}/>
                                     </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                            <h2 className="header-title" style={{ color: 'white' }}> Gửi yêu cầu của bạn! </h2>
                            <div className="form-group">
                                <label className="form-label">Bạn cần hỗ trợ vấn đề gì?</label>
                                <select className="form-select" value={formData.issueType} onChange={(e) => handleInputChange('issueType', e.target.value)} required>
                                    <option value="">Chọn vấn đề cần hỗ trợ</option>
                                    <option value="technical">Vấn đề kỹ thuật</option>
                                    <option value="account">Vấn đề tài khoản</option>
                                    <option value="payment">Vấn đề thanh toán</option>
                                    <option value="course">Vấn đề khóa học</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tiêu đề</label>
                                <input type="text" className="form-input" placeholder="Nhập tiêu đề" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nội dung cần hỗ trợ</label>
                                <textarea className="form-textarea" placeholder="Mô tả chi tiết..." value={formData.message} onChange={(e) => handleInputChange('message', e.target.value)} required />
                            </div>
                            <div className="image-preview">
                                {formData.images.map((image, index) => (
                                    <div key={index} className="image-item">
                                        <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
                                        <button type="button" className="remove-image" onClick={() => handleRemoveImage(index)}>×</button>
                                    </div>
                                ))}
                            </div>
                            <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <button type="button" className="add-image-btn" onClick={() => document.getElementById('imageUpload').click()} > + Thêm hình ảnh </button>
                                <input type="file" id="imageUpload" className="hidden-input" accept="image/*" multiple onChange={handleImageUpload} />
                                <button type="submit" className="new-ticket-btn" style={{marginBottom: 0}}> GỬI YÊU CẦU </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default YourTicket;