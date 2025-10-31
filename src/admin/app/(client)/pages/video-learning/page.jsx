import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ClientVideoLearningPage = () => {
  const [currentVideo, setCurrentVideo] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullCourse, setShowFullCourse] = useState(true);

  const courseSections = [
    {
      id: 'core-thinking',
      title: 'GỐC TƯ DUY (CORE THINKING)',
      videoCount: 3,
      duration: '24:42',
      isExpanded: false,
      videos: [
        {
          id: 3,
          title: 'Tam Giác Kim Cương Trong Giao Dịch',
          duration: '08:11',
          isFree: true,
          thumbnail: '/images/course/03.png'
        }
      ]
    },
    {
      id: 'method-secrets',
      title: 'PHƯƠNG PHÁP VÀ BÍ MẬT ĐẰNG SAU (METHOD AND SECRETS BEHIND)',
      videoCount: 8,
      duration: '57:40',
      isExpanded: true,
      subsections: [
        {
          title: 'Phương Pháp 3 Hộp',
          videos: [
            {
              id: 1,
              title: 'Sự Khác Biệt Của Phương Pháp 3 Hộp',
              duration: '11:16',
              isFree: true,
              isCurrent: true,
              thumbnail: '/images/course/01.png'
            },
            {
              id: 2,
              title: '[Tradingview] Thực chứng sự kỳ diệu của phương pháp',
              duration: '06:16',
              isFree: true,
              thumbnail: '/images/course/02.png'
            }
          ]
        }
      ]
    },
    {
      id: 'secret-1',
      title: 'Bí Mật 1. Chiêu Trò Nhà Cái (Secret 1. The House\'s Tricks)',
      videoCount: 1,
      duration: '02:40',
      isExpanded: false,
      videos: [
        {
          id: 4,
          title: 'Bí Mật 1. Chiêu Trò Nhà Cái',
          duration: '02:40',
          isFree: true,
          thumbnail: '/images/course/04.png'
        }
      ]
    }
  ];

  const currentVideoData = {
    title: 'Sự Khác Biệt Của Phương Pháp 3 Hộp',
    duration: '11:16',
    views: '1.1k lượt xem',
    status: 'FREE',
    description: 'Khám phá bí mật đằng sau phương pháp 3 hộp - công cụ mạnh mẽ giúp bạn giao dịch hiệu quả chỉ trong 5 giây.',
    points: [
      'Chỉ mất 5s để ra quyết định MUA hoặc BÁN',
      'Có thể giao dịch TẤT CẢ CẶP TIỀN, đặc biệt là VÀNG, BTC, kể cả CHỨNG KHOÁN',
      'Xác định điểm ENTRY, TP và SL CHUẨN XÁC',
      'Tần suất ra KÈO NHIỀU, ít nhất 1-2 KÈO/NGÀY'
    ]
  };

  const handleVideoSelect = (videoId) => {
    setCurrentVideo(videoId);
    setIsPlaying(false);
  };

  return (
    <div className="video-learning-page">
      <div className="row">
        {/* Video Player Section */}
        <div className="col-lg-8">
          {/* Warning Banner */}
          <div className="alert alert-warning d-flex align-items-center mb-3" role="alert">
            <i className="bx bx-info-circle me-2"></i>
            <div className="flex-grow-1">
              Bạn đang truy cập từ nước ngoài (AU), vì vậy tốc độ xem video có thể không ổn định. 
              Để xem video mượt mà, vui lòng liên hệ giảng viên để hỗ trợ CDN hoặc truy cập từ Việt Nam.
            </div>
            <button type="button" className="btn-close" aria-label="Close"></button>
          </div>

          {/* Video Player */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-0">
              <div className="video-container position-relative" style={{ backgroundColor: '#000' }}>
                {/* Video Content */}
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                  <div className="text-center text-white">
                    <div className="mb-4">
                      {currentVideoData.points.map((point, index) => (
                        <div key={index} className="mb-2">
                          <i className="bx bx-check-circle text-warning me-2"></i>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Speaker Thumbnail */}
                <div className="position-absolute" style={{ top: '20px', right: '20px' }}>
                  <div className="bg-white rounded-circle p-2">
                    <img 
                      src="/images/users/avatar-1.jpg" 
                      alt="Lê Bá Tú" 
                      className="rounded-circle"
                      style={{ width: '40px', height: '40px' }}
                    />
                  </div>
                </div>

                {/* Video Controls */}
                <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 p-3">
                  <div className="d-flex align-items-center text-white">
                    <span className="me-3">0:00</span>
                    <div className="progress flex-grow-1 me-3" style={{ height: '4px' }}>
                      <div className="progress-bar bg-warning" style={{ width: '0%' }}></div>
                    </div>
                    <button 
                      className="btn btn-link text-white me-2"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      <i className={`bx ${isPlaying ? 'bx-pause' : 'bx-play'}`}></i>
                    </button>
                    <button className="btn btn-link text-white me-2">
                      <i className="bx bx-volume-mute"></i>
                    </button>
                    <button className="btn btn-link text-white me-2">
                      <i className="bx bx-fullscreen"></i>
                    </button>
                    <button className="btn btn-link text-white">
                      <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4 className="card-title">{currentVideoData.title}</h4>
              <div className="d-flex align-items-center mb-3">
                <span className="badge bg-warning me-2">{currentVideoData.duration}</span>
                <span className="text-muted me-3">{currentVideoData.views}</span>
                <span className="badge bg-success">Bài giảng: {currentVideoData.status}</span>
              </div>
              <p className="card-text">{currentVideoData.description}</p>
            </div>
          </div>
        </div>

        {/* Course Sidebar */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <div className="d-flex align-items-center justify-content-between">
                <h6 className="mb-0">Trải nghiệm toàn bộ 37 videos - Hơn 35 giờ</h6>
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="fullCourseToggle"
                    checked={showFullCourse}
                    onChange={(e) => setShowFullCourse(e.target.checked)}
                  />
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {courseSections.map((section) => (
                  <div key={section.id} className="list-group-item border-0">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h6 className="mb-0">{section.title}</h6>
                      <button className="btn btn-sm btn-outline-secondary">
                        <i className="bx bx-chevron-down"></i>
                      </button>
                    </div>
                    <small className="text-muted">
                      Số lượng: {section.videoCount} video • Thời lượng: {section.duration}
                    </small>
                    
                    {section.isExpanded && section.subsections && (
                      <div className="mt-3">
                        {section.subsections.map((subsection, subIndex) => (
                          <div key={subIndex} className="mb-3">
                            <h6 className="text-primary mb-2">{subsection.title}</h6>
                            {subsection.videos.map((video) => (
                              <div 
                                key={video.id}
                                className={`d-flex align-items-center p-2 rounded mb-2 cursor-pointer ${
                                  video.isCurrent ? 'bg-warning bg-opacity-10 border border-warning' : 'hover-bg-light'
                                }`}
                                onClick={() => handleVideoSelect(video.id)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" 
                                     style={{ width: '40px', height: '40px' }}>
                                  <span className="text-white fw-bold">{video.id}</span>
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="mb-1">{video.title}</h6>
                                  <small className="text-muted">{video.duration} • {video.isFree ? 'FREE' : 'PRO'}</small>
                                </div>
                                {video.isCurrent && (
                                  <i className="bx bx-play-circle text-warning"></i>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="position-fixed bottom-0 end-0 p-3">
        <div className="d-flex gap-2">
          <button className="btn btn-primary rounded-circle" style={{ width: '50px', height: '50px' }}>
            <i className="bx bx-folder"></i>
          </button>
          <button className="btn btn-primary rounded-circle" style={{ width: '50px', height: '50px' }}>
            <i className="bx bx-message"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientVideoLearningPage;
