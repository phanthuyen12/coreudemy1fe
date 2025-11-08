import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, Col, Row, Container, Form, Button } from 'react-bootstrap';
import { Icon as IconifyIcon } from '@iconify/react';
import {coursesController} from '../../admin/mvc/controllers/coursesController'
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../../config/config';
// === BẮT ĐẦU PHẦN DỮ LIỆU MẪU VÀ CONTROLLER GIẢ LẬP ===
// Trong dự án thật, bạn sẽ xóa phần này và import controller thật của mình
const mockApiResponse = {
    "data": {
        "id": 3,
        "title": "TƯ DUY ĐÚNG ĐỂ BÁN HÀNG & QUẢNG CÁO TIKTOK HIỆU QUẢ",
        "description": "TƯ DUY ĐÚNG ĐỂ BÁN HÀNG & QUẢNG CÁO TIKTOK HIỆU QUẢ",
        "thumbnail": "thumbnail-1759291304335-808282968.jpg",
        "active": 1,
        "code": "TDUYNGBN",
        "categories": [
            {
                "id": 3,
                "title": "PHƯƠNG PHÁP HAY NHẤT ĐỂ LÀM NỘI DUNG BÁN HÀNG & VIDEO VIRAL",
                "description": "PHƯƠNG PHÁP HAY NHẤT ĐỂ LÀM NỘI DUNG BÁN HÀNG & VIDEO VIRAL",
                "courseId": 3,
                "createdAt": "2025-10-01T04:02:14.763Z",
                "updatedAt": "2025-10-01T04:02:40.000Z",
                "active": true,
                "videos": [
                    {
                        "id": 10,
                        "title": "Cẩm Nang Làm Content Bán Hàng Chuẩn TikTok",
                        "url": null,
                        "fileName": null,
                        "duration": 870,
                        "order": 1,
                        "access": "Free",
                        "description": "Học cách tạo ra nội dung thu hút, đúng insight khách hàng trên TikTok.",
                        "status": "1",
                        "categoryId": 3,
                        "courseId": 3,
                        "createdAt": "2025-10-01T04:09:10.100Z",
                        "updatedAt": "2025-10-01T04:09:10.100Z"
                    }
                ]
            },
            {
                "id": 4,
                "title": "XÂY DỰNG CHIẾN LƯỢC QUẢNG CÁO HIỆU QUẢ",
                "description": "XÂY DỰNG CHIẾN LƯỢC QUẢNG CÁO HIỆU QUẢ",
                "courseId": 3,
                "createdAt": "2025-10-01T04:02:32.098Z",
                "updatedAt": "2025-10-01T04:02:40.000Z",
                "active": true,
                "videos": [
                    {
                        "id": 11,
                        "title": "Quảng Cáo LIVESTREAM GMV Max hiệu quả",
                        "url": "video-1759292353801-65032234.mp4",
                        "fileName": null,
                        "duration": 532,
                        "order": 2,
                        "access": "Free",
                        "description": "Tối ưu quảng cáo cho livestream để đạt doanh thu cao nhất.",
                        "status": "1",
                        "categoryId": 4,
                        "courseId": 3,
                        "createdAt": "2025-10-01T04:19:13.861Z",
                        "updatedAt": "2025-10-01T04:19:13.861Z"
                    }
                ]
            },
            {
                "id": 5,
                "title": "TARGET QUẢNG CÁO HIỆU QUẢ (AUDIENCE & TARGETING)",
                "description": "TARGET QUẢNG CÁO HIỆU QUẢ (AUDIENCE & TARGETING)",
                "courseId": 3,
                "createdAt": "2025-10-01T04:02:55.310Z",
                "updatedAt": "2025-10-01T04:03:11.000Z",
                "active": true,
                "videos": [
                    {
                        "id": 12,
                        "title": "Xác Định Target Chuẩn Tệp Khi Chạy Ads",
                        "url": "video-1759292456832-620210011.mp4",
                        "fileName": null,
                        "duration": 899,
                        "order": 1,
                        "access": "Free",
                        "description": "Các phương pháp xác định đối tượng mục tiêu chính xác để tối ưu chi phí quảng cáo.",
                        "status": "1",
                        "categoryId": 5,
                        "courseId": 3,
                        "createdAt": "2025-10-01T04:20:56.949Z",
                        "updatedAt": "2025-10-01T04:20:56.949Z"
                    }
                ]
            },
            {
                "id": 6,
                "title": "QUẢNG CÁO CHUYỂN ĐỔI (WEB ADS, LEAD ADS)",
                "description": "QUẢNG CÁO CHUYỂN ĐỔI (WEB ADS, LEAD ADS)",
                "courseId": 3,
                "createdAt": "2025-10-01T04:03:09.235Z",
                "updatedAt": "2025-10-01T04:03:11.000Z",
                "active": true,
                "videos": [
                    {
                        "id": 13,
                        "title": "Quảng Cáo Thu Lead Từ Trang Tức Thì (Instant Page)",
                        "url": "video-1759293825528-508030420.mp4",
                        "fileName": null,
                        "duration": 899,
                        "order": 6,
                        "access": "Premium",
                        "description": "Hướng dẫn chi tiết cách set up và tối ưu quảng cáo Lead Ads hiệu quả.",
                        "status": "1",
                        "categoryId": 6,
                        "courseId": 3,
                        "createdAt": "2025-10-01T04:43:45.578Z",
                        "updatedAt": "2025-10-01T04:43:45.578Z"
                    }
                ]
            }
        ]
    },
    "statusCode": 200,
    "message": "Cource updated successfully"
};

// class coursesController {
//   const ctrc = new coursesController ();
//   async fechDataCoursesAndVideos(id) {
//     console.log(`Đang giả lập gọi API cho course ID: ${id}`);
//     await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập độ trễ mạng
//     return Promise.resolve(mockApiResponse);
//   }
// }
// === KẾT THÚC PHẦN DỮ LIỆU MẪU ===

// Hàm format duration (seconds -> mm:ss)
const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const LeanStudy = () => {
  const ctrC = new coursesController();
  const { token } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [courseData, setCourseData] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('danhmuc'); // 'danhmuc', 'mota', 'binhluan'
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [headOfficeCourse, setHeadOfficeCourse] = useState(null);
  const [canAccessPremium, setCanAccessPremium] = useState(false);

  useEffect(() => {
    const fetchDataCourse = async () => {
      try {
        // Bước 1: Lấy khóa học chính (head office)
        const headOfficeRes = await ctrC.getHeadOfficeCourse();
        if (headOfficeRes?.data?.id) {
          setHeadOfficeCourse(headOfficeRes.data);
          const courseId = headOfficeRes.data.id;
          
          // Bước 2: Lấy danh mục videos với id của khóa học chính
          const res = await ctrC.fechDataCoursesAndVideos(courseId);
          setCourseData(res.data);
          if (res.data?.categories?.length > 0) {
            // Mở sẵn tất cả các section
            setExpandedSections(new Set(res.data.categories.map((_, i) => i)));
            // Chọn video đầu tiên làm video mặc định
            setCurrentVideo(res.data.categories[0]?.videos[0] || null);
          }

          // Bước 3: Kiểm tra quyền truy cập Premium nếu có token
          if (token) {
            try {
              // Lấy user_id từ /auth/me với Bearer token
              const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              });
              const meData = await meRes.json();
              // Hỗ trợ cả 2 dạng response: { id, ... } hoặc { data: { id, ... } }
              const me = meData?.data ? meData.data : meData;
              if (meRes.ok && me?.id) {
                const userId = me.id;
                // Gọi enrollments/check
                const checkRes = await fetch(`${API_BASE_URL}/enrollments/check?user_id=${userId}&course_id=${courseId}`);
                const checkData = await checkRes.json();
                setCanAccessPremium(!!(checkRes.ok && checkData?.data?.canAccess === true));
              } else {
                setCanAccessPremium(false);
              }
            } catch (err) {
              setCanAccessPremium(false);
            }
          } else {
            setCanAccessPremium(false);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu khóa học:", error);
      }
    };
    fetchDataCourse();
  }, [token]);

  const toggleSection = (sectionIndex) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionIndex)) next.delete(sectionIndex);
      else next.add(sectionIndex);
      return next;
    });
  };

  const handleVideoSelect = (video) => {
    if (video.access === 'Premium' && !canAccessPremium) {
      alert('Bạn cần mua/đăng ký khóa học để xem nội dung Premium.');
      return;
    }
    setCurrentVideo(video);
    setIsPlaying(false); // Dừng phát khi chuyển video
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        text: comment.trim(),
        author: 'Bạn',
        avatar: '👤',
        timestamp: new Date().toLocaleString('vi-VN'),
        likes: 0
      };
      setComments(prev => [newComment, ...prev]);
      setComment('');
    }
  };

  const handleLikeComment = (commentId) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  // Tính tổng thời lượng khóa học, chỉ tính lại khi courseData thay đổi
  const totalCourseDuration = useMemo(() => {
    const categories = Array.isArray(courseData?.categories) ? courseData.categories : [];
    const totalSeconds = categories.reduce((total, category) => {
      const videos = Array.isArray(category?.videos) ? category.videos : [];
      const sumCategory = videos.reduce((catTotal, video) => {
        const seconds = Number(video?.duration ?? 0);
        return catTotal + (Number.isFinite(seconds) ? seconds : 0);
      }, 0);
      return total + sumCategory;
    }, 0);
    return formatDuration(totalSeconds);
  }, [courseData]);

  // Hiển thị trạng thái loading khi chưa có dữ liệu
  if (!courseData || !currentVideo) {
    return <div className="d-flex justify-content-center align-items-center" style={{height: '100vh', color: 'white'}}>Đang tải dữ liệu khóa học...</div>;
  }

  return (
    <div className="course-detail-page" style={{minHeight: '100vh', overflowX: 'hidden'}}>
      <style>{`
        .course-detail-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        /* Custom scrollbar */
        #course-category { 
          scrollbar-width: thin; 
          scrollbar-color: #444 #1a1a1a;
        }
        #course-category::-webkit-scrollbar { 
          width: 6px;
        }
        #course-category::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 3px;
        }
        #course-category::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 3px;
        }
        #course-category::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        /* Enhanced animations */
        .collapse-wrap { 
          overflow: hidden; 
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .section-header { 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 8px;
          margin-bottom: 4px;
        }
        .section-header:hover { 
          background-color: #2a2a2a !important; 
          border-color: #444 !important; 
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .video-item { 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 8px;
          border: 1px solid transparent;
        }

        /* Ensure long titles don't push layout; make items visually shorter */
        .video-title {
          display: -webkit-box;
          -webkit-line-clamp: 1; /* single line with ellipsis */
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
        }
        .video-item.active-video { 
          background: linear-gradient(135deg, #2a2a2a 0%, #333 100%) !important; 
          border-color: #FFD700 !important; 
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(255, 215, 0, 0.2);
        }
        
        /* Video player enhancements */
        .video-player-container {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        
        .video-player-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }
        
        /* Progress bar styling */
        .progress-bar-custom {
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        
        /* Badge enhancements */
        .badge-enhanced {
          font-weight: 600;
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .badge-free {
          background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
          color: #000;
          box-shadow: 0 2px 8px rgba(0, 212, 170, 0.3);
        }
        
        .badge-premium {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #000;
          box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
        }
        
        .badge-important {
          background: linear-gradient(135deg, #FFD700 0%, #FF8C00 100%);
          color: #000;
          box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
        }
        
        /* Button enhancements */
        .btn-enhanced {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
          border-radius: 8px;
        }
        
        .btn-enhanced:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        
        .btn-warning-enhanced {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          border: none;
          color: #000;
        }
        
        .btn-warning-enhanced:hover {
          background: linear-gradient(135deg, #FFC700 0%, #FF8C00 100%);
          color: #000;
        }
        
        /* Card enhancements */
        .card-enhanced {
          background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%);
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        
        .card-enhanced:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }
        
        /* Typography enhancements */
        .title-enhanced {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }
        
        .subtitle-enhanced {
          color: #888;
          font-weight: 500;
        }
        
        /* Navigation tabs */
        .nav-tab-enhanced {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .nav-tab-enhanced.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
          border-radius: 2px;
        }
        
        /* Loading animation */
        .loading-enhanced {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid #333;
          border-radius: 50%;
          border-top-color: #FFD700;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Tab Navigation */
        .tab-navigation {
          display: flex;
          background: #1a1a1a;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 20px;
        }
        
        .tab-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #888;
          text-decoration: none;
        }
        
        .tab-item.active {
          background: #2a2a2a;
          color: #fff;
        }
        
        .tab-item:hover {
          background: #333;
          color: #fff;
        }
        
        .tab-item.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 3px;
          background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
          border-radius: 2px;
        }
        
        .tab-icon {
          font-size: 18px;
          margin-bottom: 4px;
        }
        
        .tab-text {
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        /* Comment Section */
        .comment-section {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 16px;
          margin-top: 16px;
        }
        
        .comment-input-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .comment-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        
        .comment-input {
          flex: 1;
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 8px;
          padding: 10px 14px;
          color: #fff;
          font-size: 14px;
        }
        
        .comment-input:focus {
          outline: none;
          border-color: #FFD700;
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
        }
        
        .comment-input::placeholder {
          color: #888;
        }
        
        .comment-submit-btn {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          border: none;
          border-radius: 8px;
          padding: 10px 16px;
          color: #000;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .comment-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }
        
        .comment-list {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .comment-item {
          display: flex;
          gap: 12px;
          padding: 16px 0;
          border-bottom: 1px solid #333;
        }
        
        .comment-item:last-child {
          border-bottom: none;
        }
        
        .comment-content {
          flex: 1;
        }
        
        .comment-author {
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }
        
        .comment-text {
          color: #ccc;
          margin-bottom: 8px;
          line-height: 1.5;
        }
        
        .comment-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 0.8rem;
          color: #888;
        }
        
        .comment-like-btn {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.3s ease;
        }
        
        .comment-like-btn:hover {
          color: #FFD700;
        }
        
        .comment-like-btn.liked {
          color: #FFD700;
        }
        
        /* Description Section */
        .description-section {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
        }
        
        .description-content {
          color: #ccc;
          line-height: 1.6;
          font-size: 14px;
        }
        
        .description-content h4 {
          color: #fff;
          margin-bottom: 12px;
          font-size: 16px;
        }
        
        .description-content p {
          margin-bottom: 16px;
        }
        
        .description-content ul {
          margin-left: 20px;
          margin-bottom: 16px;
        }
        
        .description-content li {
          margin-bottom: 8px;
        }
        
        /* Responsive improvements */
        @media (max-width: 768px) {
          .video-player-container {
            border-radius: 8px;
          }
          
          .card-enhanced {
            border-radius: 12px;
          }
          
          .tab-navigation {
            flex-direction: column;
            gap: 8px;
          }
          
          .tab-item {
            flex-direction: row;
            justify-content: center;
            gap: 8px;
          }
          
          .tab-icon {
            margin-bottom: 0;
          }
        }
      `}</style>
      <Container >
        <Row className="gx-3">
          {/* Cột trái: Player và thông tin video */}
          <Col lg={8} md={12}>
            <div className="p-3">
              <Card className="card-enhanced">
                <CardBody className="p-3">
                  <div className="video-player-container position-relative rounded mb-4" style={{ aspectRatio: '16/9', background: '#1a1a1a', border: '1px solid #333' }}>
  {currentVideo?.url ? (
    <video 
      key={currentVideo.id} // để reset khi đổi video
      src={`https://api.3hstation.com/uploads/videos/${currentVideo.url}`} 
      controls 
      autoPlay={isPlaying}
      style={{ width: "100%", height: "100%", borderRadius: "12px", objectFit: "cover" }}
    />
  ) : (
    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-5">
      <div className="text-center">
        <h2 className="mb-3 fw-bold text-white title-enhanced">{currentVideo.title}</h2>
        <p className="text-white-50 subtitle-enhanced">{currentVideo.description}</p>
      </div>
    </div>
  )}
</div>

                  {/* <div className="d-flex align-items-center gap-3 text-muted small">
                    <span className="fw-medium">0:00</span>
                    <div className="flex-grow-1 rounded" style={{ height: '8px', background: 'rgba(255, 255, 255, 0.15)' }}>
                      <div className="rounded" style={{ height: '8px', width: '0%', background: '#fff' }}></div>
                    </div>
                    <span className="fw-medium">{formatDuration(currentVideo.duration)}</span>
                  </div> */}
                </CardBody>
              </Card>
              <div className="mt-3">
                <h2 className="title-enhanced fw-bold mb-2" style={{ fontSize: '1.25rem' }}>{currentVideo.title}</h2>
                <div className="d-flex align-items-center gap-3 text-muted">
                  <div className="d-flex align-items-center gap-1">
                    <IconifyIcon icon="ri:time-line" style={{ color: '#FFD700' }} />
                    <span className="subtitle-enhanced">Tổng: {totalCourseDuration}</span>
                  </div>
                  <span style={{ color: '#555' }}>•</span>
                  <div className="d-flex align-items-center gap-1">
                    <IconifyIcon icon="ri:movie-2-line" style={{ color: '#FFD700' }} />
                    <span className="subtitle-enhanced">{courseData.categories.reduce((acc, cat) => acc + cat.videos.length, 0)} bài giảng</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Cột phải: Danh sách bài giảng */}
          <Col lg={4} md={12}>
            <div className="p-3 h-100 course-detail-panel card-enhanced" style={{ borderLeft: '1px solid #2a2a2a' }}>
              {/* Tab Navigation */}
              <div className="tab-navigation">
                <div 
                  className={`tab-item ${activeTab === 'danhmuc' ? 'active' : ''}`}
                  onClick={() => setActiveTab('danhmuc')}
                >
                  <IconifyIcon icon="ri:list-check" className="tab-icon" />
                  <span className="tab-text">Danh mục</span>
                </div>
                {/* <div 
                  className={`tab-item ${activeTab === 'mota' ? 'active' : ''}`}
                  onClick={() => setActiveTab('mota')}
                >
                  <IconifyIcon icon="ri:file-text-line" className="tab-icon" />
                  <span className="tab-text">Mô tả</span>
                </div> */}
                {/* <div 
                  className={`tab-item ${activeTab === 'binhluan' ? 'active' : ''}`}
                  onClick={() => setActiveTab('binhluan')}
                >
                  <IconifyIcon icon="ri:chat-3-line" className="tab-icon" />
                  <span className="tab-text">Bình luận</span>
                </div> */}
              </div>

              {/* Tab Content */}
              {activeTab === 'danhmuc' && (
                <div id="course-category" className="d-flex flex-column gap-2" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                  {courseData.categories.map((category, sectionIndex) => (
                    <div key={category.id} className="course-section">
                      <div onClick={() => toggleSection(sectionIndex)} className="d-flex align-items-center gap-2 mb-1 section-header p-2 rounded" style={{ cursor: 'pointer', background: '#1f1f1f', border: '1px solid #2a2a2a' }}>
                        <div className="flex-grow-1">
                          <h5 className="text-white fw-bold mb-1" style={{ fontSize: '0.9rem' }}>{category.title}</h5>
                        </div>
                        <IconifyIcon icon="ri:arrow-down-s-line" className="text-light fs-5" style={{ transition: 'transform .2s', transform: expandedSections.has(sectionIndex) ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                      </div>
                      <div className="collapse-wrap ps-2" style={{ maxHeight: expandedSections.has(sectionIndex) ? `${category.videos.length * 76 + 24}px` : '0px' }}>
                        <div className="d-flex flex-column gap-2 py-2">
                          {category.videos.map((video, videoIndex) => (
                            <div key={video.id} onClick={() => handleVideoSelect(video)} className={`d-flex align-items-center gap-3 p-2 rounded video-item ${currentVideo?.id === video.id ? 'active-video' : ''}`} style={{ cursor: 'pointer' }}>
                              <div className="d-flex align-items-center gap-3 flex-grow-1">
                                <div className="rounded d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', flexShrink: 0, background: currentVideo?.id === video.id ? '#fff' : '#2a2a2a' }}>
                                  <IconifyIcon icon={currentVideo?.id === video.id ? "ri:play-circle-fill" : "ri:play-circle-line"} className={currentVideo?.id === video.id ? "text-dark" : "text-white"} style={{ fontSize: '18px' }} />
                                </div>
                                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                  <div className="d-flex align-items-center gap-2 mb-1">
                                    <span className="badge badge-enhanced" style={{ background: '#333', color: '#fff', fontSize: '0.7rem', minWidth: '24px', textAlign: 'center' }}>
                                      {String(videoIndex + 1).padStart(2, '0')}
                                    </span>
                                    <h6 className="text-white fw-medium mb-1 video-title" style={{ fontSize: '0.85rem' }}>{video.title}</h6>
                                  </div>
                                  <div className="d-flex align-items-center gap-2 text-muted small">
                                    <IconifyIcon icon="ri:time-line" style={{ color: '#FFD700' }} />
                                    <span style={{ color: '#888' }}>{formatDuration(video.duration)}</span>
                                    <span style={{ color: '#555' }}>•</span>
                                    {video.access === 'Free' ? (
                                      <span className="badge badge-enhanced badge-free">FREE</span>
                                    ) : (
                                      <span className="badge badge-enhanced badge-premium">PREMIUM</span>
                                    )}
                                    {videoIndex === 0 && (
                                      <span className="badge badge-enhanced badge-important">NỔI BẬT</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'mota' && (
                <div className="description-section">
                  <div className="description-content">
                    <h4>📚 Giới thiệu khóa học</h4>
                    <p>
                      Khóa học <strong>"TƯ DUY ĐÚNG ĐỂ BÁN HÀNG & QUẢNG CÁO TIKTOK HIỆU QUẢ"</strong> sẽ giúp bạn:
                    </p>
                    <ul>
                      <li>Hiểu rõ tư duy đúng để bán hàng hiệu quả trên TikTok</li>
                      <li>Nắm vững các phương pháp tạo nội dung viral</li>
                      <li>Xây dựng chiến lược quảng cáo TikTok Ads tối ưu</li>
                      <li>Target đúng đối tượng khách hàng</li>
                      <li>Thiết lập và vận hành quảng cáo chuyển đổi</li>
                    </ul>
                    
                    <h4>🎯 Nội dung khóa học</h4>
                    <p>Khóa học bao gồm 4 chương chính:</p>
                    <ul>
                      <li><strong>Chương 1:</strong> Phương pháp hay nhất để làm nội dung bán hàng & video viral</li>
                      <li><strong>Chương 2:</strong> Xây dựng chiến lược quảng cáo hiệu quả</li>
                      <li><strong>Chương 3:</strong> Target quảng cáo hiệu quả (Audience & Targeting)</li>
                      <li><strong>Chương 4:</strong> Quảng cáo chuyển đổi (Web Ads, Lead Ads)</li>
                    </ul>

                    <h4>👨‍🏫 Giảng viên</h4>
                    <p>Đội ngũ giảng viên giàu kinh nghiệm trong lĩnh vực marketing và quảng cáo TikTok.</p>

                    <h4>📋 Yêu cầu</h4>
                    <ul>
                      <li>Có tài khoản TikTok Business</li>
                      <li>Hiểu biết cơ bản về marketing online</li>
                      <li>Máy tính có kết nối internet ổn định</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'binhluan' && (
                <div className="comment-section">
                  <div className="comment-input-container">
                    <div className="comment-avatar">👤</div>
                    <form onSubmit={handleCommentSubmit} className="d-flex align-items-center gap-2 flex-grow-1">
                      <input
                        type="text"
                        className="comment-input"
                        placeholder="Bình luận của bạn..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button type="submit" className="comment-submit-btn">
                        Gửi
                      </button>
                    </form>
                  </div>
                  
                  {comments.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📮</div>
                        <h5 className="text-white mb-2">Hãy để lại bình luận đầu tiên về bài học!</h5>
                        <p className="text-muted">Chia sẻ suy nghĩ và kinh nghiệm của bạn với cộng đồng học viên.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="comment-list">
                      {comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                          <div className="comment-avatar">{comment.avatar}</div>
                          <div className="comment-content">
                            <div className="comment-author">{comment.author}</div>
                            <div className="comment-text">{comment.text}</div>
                            <div className="comment-meta">
                              <span>{comment.timestamp}</span>
                              <button 
                                className="comment-like-btn"
                                onClick={() => handleLikeComment(comment.id)}
                              >
                                <IconifyIcon icon="ri:heart-line" />
                                {comment.likes}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>
        
   
      </Container>
    </div>
  );
};
 
export default LeanStudy;