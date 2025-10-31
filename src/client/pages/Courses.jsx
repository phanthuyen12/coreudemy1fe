import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, Col, Row, Container, Button, Form, InputGroup } from 'react-bootstrap';

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "Phương Pháp 3 Hộp - Giao Dịch Thành Công",
      instructor: "Lê Bá Tú",
      duration: "35 giờ",
      videos: 37,
      level: "Cơ bản",
      price: "FREE",
      rating: 4.8,
      students: 1250,
      thumbnail: "📊",
      description: "Học cách sử dụng phương pháp 3 hộp để giao dịch thành công trên thị trường tài chính",
      features: [
        "Chỉ mất 5s để ra quyết định MUA hoặc BÁN",
        "Giao dịch TẤT CẢ CẶP TIỀN, đặc biệt là VÀNG, BTC",
        "Xác định điểm ENTRY, TP và SL CHUẨN XÁC",
        "Tần suất ra KÈO NHIỀU, ít nhất 1-2 KÈO/NGÀY"
      ]
    },
    {
      id: 2,
      title: "Tam Giác Kim Cương Trong Giao Dịch",
      instructor: "Nguyễn Văn A",
      duration: "24 giờ",
      videos: 20,
      level: "Trung cấp",
      price: "299,000 ₫",
      rating: 4.6,
      students: 850,
      thumbnail: "💎",
      description: "Khám phá bí mật của tam giác kim cương trong phân tích kỹ thuật",
      features: [
        "Phân tích kỹ thuật nâng cao",
        "Tín hiệu giao dịch chính xác",
        "Quản lý rủi ro hiệu quả"
      ]
    },
    {
      id: 3,
      title: "Bí Mật Chiêu Trò Nhà Cái",
      instructor: "Trần Thị B",
      duration: "15 giờ",
      videos: 12,
      level: "Nâng cao",
      price: "499,000 ₫",
      rating: 4.9,
      students: 650,
      thumbnail: "🎯",
      description: "Hiểu rõ cách thức hoạt động của thị trường và tận dụng cơ hội",
      features: [
        "Tâm lý giao dịch",
        "Đọc hiểu thị trường",
        "Chiến lược dài hạn"
      ]
    }
  ];

  const categories = [
    { name: "Tất cả", count: 3, active: true },
    { name: "Cơ bản", count: 1 },
    { name: "Trung cấp", count: 1 },
    { name: "Nâng cao", count: 1 }
  ];

  return (
    <Container fluid className="p-4" style={{backgroundColor: '#141414', minHeight: '100vh'}}>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="display-4 fw-bold text-white mb-2">KHÓA HỌC</h1>
          <p className="text-muted">Khám phá các khóa học chất lượng cao để nâng cao kỹ năng giao dịch</p>
        </Col>
      </Row>

      {/* Categories Filter */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex gap-2 flex-wrap">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={category.active ? "warning" : "outline-secondary"}
                size="sm"
                className="px-3 py-2"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col md={10}>
          <InputGroup>
            <InputGroup.Text style={{backgroundColor: '#1E1E1E', borderColor: '#333', color: 'white'}}>
              <i className="ri-search-line"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm khóa học..."
              style={{backgroundColor: '#1E1E1E', borderColor: '#333', color: 'white'}}
            />
          </InputGroup>
        </Col>
        <Col md={2}>
          <Button 
            variant="outline-secondary" 
            className="w-100"
            style={{borderColor: '#333', color: 'white'}}
          >
            <i className="ri-filter-line me-2"></i>
            Bộ lọc
          </Button>
        </Col>
      </Row>

      {/* Courses Grid */}
      <Row className="g-4">
        {courses.map((course) => (
          <Col key={course.id} xs={12} sm={6} lg={4} xl={3}>
            <Card 
              className="h-100 course-card" 
              style={{
                backgroundColor: '#1E1E1E', 
                borderColor: '#333',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Course Thumbnail */}
              <div 
                className="d-flex align-items-center justify-content-center" 
                style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #ffc107, #fd7e14)'
                }}
              >
                <span className="display-1">{course.thumbnail}</span>
              </div>

              <CardBody>
                {/* Course Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <CardTitle className="text-white fw-bold mb-2">{course.title}</CardTitle>
                    <p className="text-muted small mb-0">Giảng viên: {course.instructor}</p>
                  </div>
                  <div className="text-end">
                    <span 
                      className={`badge px-3 py-2 fw-bold
                        ${course.price === 'FREE' 
                          ? 'bg-success text-white' 
                          : 'bg-warning text-dark'
                        }
                      `}
                    >
                      {course.price}
                    </span>
                  </div>
                </div>

                {/* Course Description */}
                <p className="card-text text-light small mb-3">{course.description}</p>

                {/* Course Features */}
                <div className="mb-3">
                  {course.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="d-flex align-items-center gap-2 text-muted small mb-1">
                      <i className="ri-check-line text-warning"></i>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Course Stats */}
                <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <span><i className="ri-time-line"></i> {course.duration}</span>
                    <span><i className="ri-video-line"></i> {course.videos} video</span>
                    <span><i className="ri-bar-chart-line"></i> {course.level}</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <i className="ri-star-fill text-warning"></i>
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Course Footer */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-muted small">
                    <i className="ri-group-line"></i> {course.students.toLocaleString()} học viên
                  </div>
                  <Link
                    to="/course"
                    className="btn btn-warning fw-bold"
                    style={{
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Load More */}
      <Row className="mt-4">
        <Col className="text-center">
          <Button variant="outline-secondary">
            Xem thêm khóa học
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Courses;