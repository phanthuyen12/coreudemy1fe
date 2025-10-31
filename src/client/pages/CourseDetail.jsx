import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Row, Container, Button, Form } from 'react-bootstrap';
import { Icon as IconifyIcon } from '@iconify/react';

const CourseDetail = () => {
  const accentColor = '#ffc107';
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedSections, setExpandedSections] = useState(new Set());
  
  // Expand all sections by default; clicking will collapse
  useEffect(() => {
    setExpandedSections(new Set(courseSections.map((_, index) => index)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSection = (sectionIndex) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionIndex)) {
        next.delete(sectionIndex);
      } else {
        next.add(sectionIndex);
      }
      return next;
    });
  };

  // Mock data for course content
  const courseData = {
    title: "Sự Khác Biệt Của Phương Pháp 3 Hộp",
    duration: "11:16",
    views: "1.2k lượt xem",
    status: "FREE",
    currentTime: "1:42",
    totalTime: "11:16"
  };

  const courseSections = [
    {
      title: "GỐC TƯ DUY",
      subtitle: "Số lượng: 3 video • Thời lượng: 24:42",
      icon: "ri:brain-line",
      color: "#28a745",
      videos: [
        {
          id: 1,
          title: "Hành trình CHUNG của mọi Trader",
          duration: "10:46",
          status: "FREE",
          thumbnail: "01",
          icon: "ri:compass-3-line",
          color: "#17a2b8"
        },
        {
          id: 2,
          title: "Tư Duy Ngược Để Kiếm Tiền Từ Thị Trường",
          duration: "05:45",
          status: "PREMIUM",
          thumbnail: "02",
          icon: "ri:refresh-line",
          color: "#ffc107"
        },
        {
          id: 3,
          title: "Tam Giác Kim Cương Trong Giao Dịch",
          duration: "08:11",
          status: "FREE",
          thumbnail: "03",
          icon: "ri:diamond-line",
          color: "#6f42c1"
        }
      ]
    },
    {
      title: "PHƯƠNG PHÁP VÀ BÍ MẬT ĐẰNG SAU",
      subtitle: "Số lượng: 8 video • Thời lượng: 57:40",
      icon: "ri:magic-line",
      color: "#dc3545",
      subsections: [
        {
          title: "Phương Pháp 3 Hộp",
          videos: [
            {
              id: 4,
              title: "Sự Khác Biệt Của Phương Pháp 3 Hộp",
              duration: "11:16",
              status: "FREE",
              thumbnail: "01",
              icon: "ri:layout-3-line",
              color: "#fd7e14",
              isActive: true
            },
            {
              id: 5,
              title: "[Tradingview] Thực chứng sự kỳ diệu của phương pháp",
              duration: "06:16",
              status: "PREMIUM",
              thumbnail: "02",
              icon: "ri:eye-line",
              color: "#20c997"
            }
          ]
        },
        {
          title: "Bí Mật 1. Chiêu Trò Nhà Cái",
          videos: [
            {
              id: 6,
              title: "Bí Mật 1. Chiêu Trò Nhà Cái",
              duration: "02:40",
              status: "PREMIUM",
              thumbnail: "01",
              icon: "ri:spy-line",
              color: "#e83e8c"
            }
          ]
        }
      ]
    }
  ];

  const videoFeatures = [
    "Chỉ mất 5s để ra quyết định MUA hoặc BÁN",
    "Có thể giao dịch TẤT CẢ CẶP TIỀN, đặc biệt là VÀNG, BTC, kể cả CHỨNG KHOÁN",
    "Xác định điểm ENTRY, TP và SL CHUẨN XÁC",
    "Tần suất ra KÈO NHIỀU, ít nhất 1-2 KÈO/NGÀY"
  ];

  return (
    <div className="course-detail-page" style={{backgroundColor: '#0f0f0f', minHeight: '100vh', overflowX: 'hidden'}}>
      <style>{`
        /* Hide scrollbar but keep scroll behavior */
        #course-category { scrollbar-width: none; -ms-overflow-style: none; }
        #course-category::-webkit-scrollbar { display: none; }
        /* Collapse animation */
        .collapse-wrap { overflow: hidden; transition: max-height 0.3s ease; }
        .section-header { transition: background-color .2s ease, border-color .2s ease, transform .12s ease; }
        .section-header:hover { background-color: #222 !important; border-color: #3a3a3a !important; transform: translateY(-1px); }
        .section-header:active { transform: translateY(0); }
      `}</style>
      <Container fluid className="p-0">
        <Row className="g-0">
          {/* Main Video Player */}
          <Col lg={8} md={12}>
            <div className="p-4">
              <Card className="hover-lift" style={{
                backgroundColor: '#141414',
                borderRadius: '16px',
                border: '1px solid #2a2a2a',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
              }}>
              <CardBody className="p-4">
                {/* Video Player */}
                <div 
                  className="position-relative rounded mb-4 video-player-container" 
                  style={{
                    aspectRatio: '16/9',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    overflow: 'hidden'
                  }}
                >
                  {/* Video Content - Trading Chart Simulation */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                      <div 
                        className="mb-3 fw-bold"
                        style={{
                          fontSize: '2.2rem',
                          color: '#fff'
                        }}
                      >
                        PHƯƠNG PHÁP 3 HỘP
                      </div>
                      <div className="d-flex gap-3 justify-content-center">
                        <div 
                          className="px-3 py-2 rounded fw-bold"
                          style={{backgroundColor: '#2a2a2a', color: '#fff'}}
                        >
                          ENTRY
                        </div>
                        <div 
                          className="px-3 py-2 rounded fw-bold"
                          style={{backgroundColor: '#2a2a2a', color: '#fff'}}
                        >
                          TP 1
                        </div>
                        <div 
                          className="px-3 py-2 rounded fw-bold"
                          style={{backgroundColor: '#2a2a2a', color: '#fff'}}
                        >
                          TP 2
                        </div>
                        <div 
                          className="px-3 py-2 rounded fw-bold"
                          style={{backgroundColor: '#2a2a2a', color: '#fff'}}
                        >
                          SL
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Play/Pause Button */}
                  {!isPlaying ? (
                    <div className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center">
                      <button 
                        onClick={() => setIsPlaying(true)}
                        className="btn btn-light btn-lg rounded-circle d-flex align-items-center justify-content-center play-button"
                        style={{
                          width: '80px', 
                          height: '80px',
                          boxShadow: '0 0 24px rgba(255,255,255,0.2)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                          e.target.style.boxShadow = '0 0 32px rgba(255,255,255,0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 0 24px rgba(255,255,255,0.2)';
                        }}
                      >
                        <IconifyIcon icon="ri:play-fill" className="fs-2" />
                      </button>
                    </div>
                  ) : (
                    <div className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center">
                      <button 
                        onClick={() => setIsPlaying(false)}
                        className="btn btn-light btn-lg rounded-circle d-flex align-items-center justify-content-center play-button"
                        style={{
                          width: '80px', 
                          height: '80px',
                          boxShadow: '0 0 24px rgba(255,255,255,0.2)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                          e.target.style.boxShadow = '0 0 32px rgba(255,255,255,0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 0 24px rgba(255,255,255,0.2)';
                        }}
                      >
                        <IconifyIcon icon="ri:pause-fill" className="fs-2" />
                      </button>
                    </div>
                  )}
                  
                  {/* Instructor Info */}
                  <div className="position-absolute top-0 end-0 m-3">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center instructor-avatar"
                      style={{
                        width: '48px', 
                        height: '48px',
                        background: 'linear-gradient(135deg, #ffc107, #ff8c00)',
                        boxShadow: '0 4px 15px rgba(255, 193, 7, 0.3)'
                      }}
                    >
                      <IconifyIcon icon="ri:user-line" className="text-dark fs-5" />
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-white fw-bold small">Lê Bá Tú</div>
                      <div className="text-muted small">ROVA-661</div>
                    </div>
                  </div>
                  
                  {/* Video Features Overlay */}
                  <div className="position-absolute bottom-0 start-0 end-0 p-4">
                    <div className="d-flex flex-column gap-2">
                      {videoFeatures.map((feature, index) => (
                        <div 
                          key={index} 
                          className="text-white small fw-medium feature-item"
                          style={{
                            opacity: 0.9,
                            animation: `fadeInUp 0.6s ease ${index * 0.1}s both`
                          }}
                        >
                          • {feature}
                        </div>
                      ))}
                      <div className="text-white text-center fw-bold fs-4 mt-3">TỰ TIN GỒNG LỜI</div>
                    </div>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="d-flex align-items-center gap-3 text-muted small">
                  <span className="fw-medium">{courseData.currentTime}</span>
                  <div 
                    className="flex-grow-1 rounded progress-bar-container"
                    style={{
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.15)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div 
                      className="rounded progress-fill"
                      style={{
                        height: '8px', 
                        width: '25%',
                        background: '#fff',
                        boxShadow: '0 0 6px rgba(255,255,255,0.3)',
                        transition: 'width 0.3s ease'
                      }}
                    ></div>
                  </div>
                  <span className="fw-medium">{courseData.totalTime}</span>
                  <div className="d-flex align-items-center gap-2">
                    <IconifyIcon icon="ri:volume-up-line" className="fs-6" />
                    <div 
                      className="rounded"
                      style={{
                        width: '64px', 
                        height: '4px',
                        background: 'rgba(255, 255, 255, 0.15)'
                      }}
                    >
                      <div 
                        className="rounded"
                        style={{
                          height: '4px', 
                          width: '75%',
                          background: '#fff'
                        }}
                      ></div>
                    </div>
                  </div>
                  <button 
                    className="btn btn-link text-muted p-1 control-btn"
                    style={{borderRadius: '6px'}}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <IconifyIcon icon="ri:fullscreen-line" className="fs-6" />
                  </button>
                  <button 
                    className="btn btn-link text-muted p-1 control-btn"
                    style={{borderRadius: '6px'}}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <IconifyIcon icon="ri:settings-3-line" className="fs-6" />
                  </button>
                </div>
              </CardBody>
            </Card>

            {/* Video Information */}
            <div className="mt-4">
              <h2 
                className="text-white fw-bold mb-3"
                style={{
                  fontSize: '2rem'
                }}
              >
                {courseData.title}
              </h2>
              <div className="d-flex align-items-center gap-3 text-muted">
                <div className="d-flex align-items-center gap-1">
                  <IconifyIcon icon="ri:time-line" className="fs-6" />
                  <span className="fw-medium">{courseData.duration}</span>
                </div>
                <span>•</span>
                <div className="d-flex align-items-center gap-1">
                  <IconifyIcon icon="ri:eye-line" className="fs-6" />
                  <span className="fw-medium">{courseData.views}</span>
                </div>
                <span>•</span>
                <div className="d-flex align-items-center gap-1">
                  <IconifyIcon icon="ri:lock-unlock-line" className="fs-6 text-success" />
                  <span className="text-success fw-medium">Bài giảng: {courseData.status}</span>
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* Course Navigation Sidebar */}
        <Col lg={4} md={12}>
          <div className="p-4 h-100 course-detail-panel" style={{
            backgroundColor: '#141414', 
            minHeight: '100vh',
            borderLeft: '1px solid #2a2a2a',
            overflowX: 'hidden'
          }}>
            {/* Toggle Switch */}
            <div className="mb-3">
              <Form.Check
                type="switch"
                id="toggleAll"
                label={<span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>Trải nghiệm toàn bộ 37 videos - Hơn 35 giờ</span>}
                className="text-light"
              />
            </div>

            {/* Course Sections */}
            <div id="course-category" className="d-flex flex-column gap-1" style={{maxHeight: 'calc(100vh - 220px)', overflowY: 'auto', overflowX: 'hidden', rowGap: '8px'}}>
              {courseSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="course-section">
                  <div 
                    className="d-flex align-items-center gap-2 mb-1 section-header"
                    style={{
                      padding: '10px 14px',
                      background: expandedSections.has(sectionIndex) ? '#222' : '#1f1f1f',
                      borderRadius: '10px',
                      border: '1px solid #2a2a2a',
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleSection(sectionIndex)}
                  >
                    <div 
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: '28px',
                        height: '28px',
                        background: '#2a2a2a',
                        borderRadius: '8px',
                        boxShadow: 'none'
                      }}
                    >
                      <IconifyIcon icon={section.icon} className="text-white" style={{fontSize: '18px'}} />
                    </div>
                    <div className="flex-grow-1">
                      <h5 
                        className="text-white fw-bold mb-1"
                        style={{fontSize: '1rem', lineHeight: 1.5}}
                      >
                        {section.title}
                      </h5>
                      <p className="text-muted small mb-0" style={{fontSize: '0.82rem'}}>{section.subtitle}</p>
                    </div>
                    <div className="ms-2 d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px'}}>
                      <IconifyIcon 
                        icon="ri:arrow-down-s-line" 
                        className="text-light" 
                        style={{transition: 'transform .2s', transform: expandedSections.has(sectionIndex) ? 'rotate(180deg)' : 'rotate(0deg)'}}
                      />
                    </div>
                  </div>
                  <div className="collapse-wrap" style={{maxHeight: expandedSections.has(sectionIndex) ? '800px' : '0px'}}>
                  
                  {section.videos && (
                    <div className="d-flex flex-column gap-1">
                      {section.videos.map((video) => (
                        <div 
                          key={video.id} 
                          className="d-flex align-items-center gap-3 p-3 rounded video-item"
                          style={{
                            backgroundColor: '#1e1e1e',
                            border: '1px solid #2a2a2a',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#252525';
                            e.target.style.borderColor = '#3a3a3a';
                            e.target.style.transform = 'translateX(4px)';
                            e.target.style.boxShadow = 'none';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#1e1e1e';
                            e.target.style.borderColor = '#2a2a2a';
                            e.target.style.transform = 'translateX(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <div 
                            className="rounded d-flex align-items-center justify-content-center fw-bold"
                            style={{
                              width: '40px', 
                              height: '40px',
                              background: '#2a2a2a',
                              boxShadow: 'none'
                            }}
                          >
                            <IconifyIcon icon={video.icon} className="text-white" style={{fontSize: '18px'}} />
                          </div>
                            <div className="flex-grow-1">
                              <h6 className="text-white fw-medium mb-1" style={{fontSize: '0.92rem', lineHeight: 1.5}}>{video.title}</h6>
                              <div className="d-flex align-items-center gap-2 text-muted small" style={{fontSize: '0.78rem'}}>
                                <IconifyIcon icon="ri:time-line" className="fs-7" />
                                <span>{video.duration}</span>
                                <span>•</span>
                                {video.status === 'FREE' ? (
                                  <span className="badge" style={{backgroundColor: '#28a745', color: '#fff', fontSize: '0.7rem', padding: '2px 6px'}}>FREE</span>
                                ) : (
                                  <span className="badge" style={{backgroundColor: '#ffc107', color: '#000', fontSize: '0.7rem', padding: '2px 6px'}}>PREMIUM</span>
                                )}
                              </div>
                            </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.subsections && (
                    <div className="d-flex flex-column gap-3">
                      {section.subsections.map((subsection, subIndex) => (
                        <div key={subIndex}>
                          <h6 
                            className="text-light fw-semibold mb-3"
                            style={{
                              fontSize: '1rem',
                              paddingLeft: '8px',
                              borderLeft: '3px solid #3a3a3a'
                            }}
                          >
                            {subsection.title}
                          </h6>
                          <div className="d-flex flex-column gap-2">
                            {subsection.videos.map((video) => (
                              <div 
                                key={video.id} 
                                className={`d-flex align-items-center gap-3 p-3 rounded video-item
                                  ${video.isActive ? 'active-video' : ''}
                                `}
                                style={{
                                  backgroundColor: video.isActive ? '#222' : '#1f1f1f',
                                  border: video.isActive ? '2px solid #3a3a3a' : '1px solid #2a2a2a',
                                  position: 'relative',
                                  transition: 'all 0.3s ease',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                  if (!video.isActive) {
                                    e.target.style.backgroundColor = '#262626';
                                    e.target.style.borderColor = '#3a3a3a';
                                    e.target.style.transform = 'translateX(4px)';
                                    e.target.style.boxShadow = 'none';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!video.isActive) {
                                    e.target.style.backgroundColor = '#1f1f1f';
                                    e.target.style.borderColor = '#2a2a2a';
                                    e.target.style.transform = 'translateX(0)';
                                    e.target.style.boxShadow = 'none';
                                  }
                                }}
                              >
                                {video.isActive && (
                                  <div 
                                    className="position-absolute start-0 top-0 bottom-0 rounded-start"
                                    style={{
                                      width: '4px',
                                      background: '#fff',
                                      boxShadow: '0 0 8px rgba(255,255,255,0.2)'
                                    }}
                                  />
                                )}
                                <div 
                                  className="rounded d-flex align-items-center justify-content-center fw-bold"
                                  style={{
                                    width: '48px', 
                                    height: '48px',
                                    background: '#2a2a2a',
                                    boxShadow: 'none'
                                  }}
                                >
                                  <IconifyIcon icon={video.icon} className="text-white fs-5" />
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="text-white fw-medium mb-1" style={{fontSize: '0.95rem'}}>{video.title}</h6>
                                  <div className="d-flex align-items-center gap-2 text-muted small" style={{fontSize: '0.8rem'}}>
                                    <IconifyIcon icon="ri:time-line" className="fs-7" />
                                    <span>{video.duration}</span>
                                    <span>•</span>
                                    {video.status === 'FREE' ? (
                                      <span className="badge" style={{backgroundColor: '#28a745', color: '#fff', fontSize: '0.7rem', padding: '2px 6px'}}>FREE</span>
                                    ) : (
                                      <span className="badge" style={{backgroundColor: '#ffc107', color: '#000', fontSize: '0.7rem', padding: '2px 6px'}}>PREMIUM</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Tabs */}
            <div className="mt-4 pt-4" style={{borderTop: '1px solid #333'}}>
              <div className="btn-group w-100" role="group">
                <Button 
                  variant="warning" 
                  className="fw-bold d-flex align-items-center gap-2"
                  style={{
                    borderRadius: '12px 0 0 12px',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(255, 193, 7, 0.3)'
                  }}
                  onClick={() => document.getElementById('course-category')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <IconifyIcon icon="ri:list-check" />
                  <span>Danh mục</span>
                </Button>
                <Button 
                  variant="outline-secondary" 
                  className="text-light d-flex align-items-center gap-2"
                  style={{
                    borderRadius: '0 12px 12px 0',
                    borderColor: '#333',
                    backgroundColor: 'transparent'
                  }}
                  onClick={() => document.getElementById('course-comments')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#333';
                    e.target.style.borderColor = '#555';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = '#333';
                  }}
                >
                  <IconifyIcon icon="ri:chat-3-line" />
                  <span>Bình luận</span>
                </Button>
              </div>
            </div>

            {/* Comments Anchor */}
            <div id="course-comments" className="pt-5"></div>
          </div>
        </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CourseDetail;