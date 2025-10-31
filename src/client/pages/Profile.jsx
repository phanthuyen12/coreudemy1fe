import React, { useState } from 'react';
import { Card, CardBody, Col, Row, Container, Button, Form } from 'react-bootstrap';
import { Icon as IconifyIcon } from '@iconify/react';

const Profile = () => {
  const [formData, setFormData] = useState({
    // Basic Information
    lastName: 'Phan',
    firstName: 'Maxwell',
    gender: 'Khác',
    email: 'phangiathuyendev@gmail.com',
    birthYear: '',
    location: '',
    phone: '123 456 7890',
    specializedField: '',
    professionDescription: '',
    experienceYears: '',
    
    // Bank Information
    accountHolder: '',
    bank: '',
    accountNumber: ''
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSave = () => {
    console.log('Saving profile data:', formData);
    // Handle save logic here
  };

  return (
    <div className="profile-page" style={{ padding: '20px' }}>
      <style>{`
        .profile-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .profile-title {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .profile-container {
          background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%);
          border: 1px solid #2a2a2a;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        //   max-width: 1000px;
          margin: 0 auto;
        }
        
        .section-title {
          color: #fff;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 24px;
        }
        
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #333 50%, transparent 100%);
          margin: 32px 0;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-label {
          color: #fff;
          font-weight: 600;
          margin-bottom: 8px;
          display: block;
        }
        
        .form-input {
          width: 100%;
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 8px;
          padding: 12px 16px;
          color: #fff;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #FFD700;
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
        }
        
        .form-input::placeholder {
          color: #888;
        }
        
        .form-select {
          width: 100%;
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 8px;
          padding: 12px 16px;
          color: #fff;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .form-select:focus {
          outline: none;
          border-color: #FFD700;
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
        }
        
        .form-textarea {
          width: 100%;
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 8px;
          padding: 12px 16px;
          color: #fff;
          font-size: 14px;
          min-height: 100px;
          resize: vertical;
          transition: all 0.3s ease;
        }
        
        .form-textarea:focus {
          outline: none;
          border-color: #FFD700;
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
        }
        
        .form-textarea::placeholder {
          color: #888;
        }
        
        .image-upload-area {
          border: 2px dashed #444;
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          background: #1a1a1a;
          transition: all 0.3s ease;
          cursor: pointer;
          margin-bottom: 24px;
        }
        
        .image-upload-area:hover {
          border-color: #FFD700;
          background: #1f1f1f;
        }
        
        .image-upload-area.dragover {
          border-color: #FFD700;
          background: rgba(255, 215, 0, 0.1);
        }
        
        .upload-icon {
          font-size: 48px;
          color: #FFD700;
          margin-bottom: 16px;
        }
        
        .upload-text {
          color: #fff;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .upload-subtitle {
          color: #888;
          font-size: 0.9rem;
        }
        
        .hidden-input {
          display: none;
        }
        
        .save-button {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          border: none;
          border-radius: 12px;
          padding: 16px 32px;
          color: #000;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          float: right;
        }
        
        .save-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .form-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
        }
        
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
          font-size: 16px;
        }
        
        .profile-image-preview {
          width: 120px;
          height: 120px;
          border-radius: 12px;
          object-fit: cover;
          margin: 0 auto 16px;
          display: block;
        }
        
        @media (max-width: 768px) {
          .profile-title {
            font-size: 2rem;
          }
          
          .profile-container {
            padding: 20px;
          }
          
          .form-row,
          .form-row-3,
          .form-row-2 {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .save-button {
            width: 100%;
            float: none;
            margin-top: 20px;
          }
        }
      `}</style>

      {/* Profile Title */}
      <h1 className="profile-title">PROFILE</h1>

      {/* Main Profile Container */}
      <div className="profile-container">
        {/* Basic Information Section */}
        <div>
          <h2 className="section-title">Thông tin cơ bản</h2>
          
          <Row>
            {/* Profile Image Upload */}
            <Col md={4} className="mb-4">
              <div 
                className="image-upload-area"
                onClick={() => document.getElementById('imageUpload').click()}
              >
                {profileImage ? (
                  <img 
                    src={URL.createObjectURL(profileImage)} 
                    alt="Profile" 
                    className="profile-image-preview"
                  />
                ) : (
                  <>
                    <IconifyIcon icon="ri:cloud-upload-line" className="upload-icon" />
                    <div className="upload-text">Chọn ảnh tải lên</div>
                    <div className="upload-subtitle">Định dạng ảnh PNG hoặc JPG</div>
                  </>
                )}
              </div>
              <input
                type="file"
                id="imageUpload"
                className="hidden-input"
                accept="image/png,image/jpeg"
                onChange={handleImageUpload}
              />
            </Col>

            {/* Personal Details */}
            <Col md={8}>
              <Row>
                <Col md={6}>
                  <div className="form-group">
                    <label className="form-label">Họ</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label className="form-label">Tên</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="form-group">
                    <label className="form-label">Giới tính</label>
                    <select
                      className="form-select"
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label className="form-label">Năm sinh</label>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Năm sinh"
                        value={formData.birthYear}
                        onChange={(e) => handleInputChange('birthYear', e.target.value)}
                      />
                      <IconifyIcon icon="ri:calendar-line" className="input-icon" />
                    </div>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label className="form-label">Đang sống tại</label>
                    <select
                      className="form-select"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    >
                      <option value="">Chọn tỉnh thành</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                    </select>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label className="form-label">Số năm kinh nghiệm</label>
                    <select
                      className="form-select"
                      value={formData.experienceYears}
                      onChange={(e) => handleInputChange('experienceYears', e.target.value)}
                    >
                      <option value="">Số năm kinh nghiệm</option>
                      <option value="0-1">0-1 năm</option>
                      <option value="1-3">1-3 năm</option>
                      <option value="3-5">3-5 năm</option>
                      <option value="5-10">5-10 năm</option>
                      <option value="10+">10+ năm</option>
                    </select>
                  </div>
                </Col>
              </Row>

              <div className="form-group">
                <label className="form-label">Lĩnh vực chuyên môn</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nhập lĩnh vực"
                  value={formData.specializedField}
                  onChange={(e) => handleInputChange('specializedField', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả về nghề nghiệp của bạn</label>
                <textarea
                  className="form-textarea"
                  placeholder="Nhập mô tả về nghề nghiệp của bạn"
                  value={formData.professionDescription}
                  onChange={(e) => handleInputChange('professionDescription', e.target.value)}
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Divider */}
        <div className="section-divider"></div>

        {/* Bank Information Section */}
        <div>
          <h2 className="section-title">Thông tin ngân hàng</h2>
          
          <Row>
            <Col md={4}>
              <div className="form-group">
                <label className="form-label">Chủ tài khoản</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nhập tên tài khoản"
                  value={formData.accountHolder}
                  onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                />
              </div>
            </Col>
            <Col md={4}>
              <div className="form-group">
                <label className="form-label">Ngân hàng</label>
                <select
                  className="form-select"
                  value={formData.bank}
                  onChange={(e) => handleInputChange('bank', e.target.value)}
                >
                  <option value="">Chọn ngân hàng</option>
                  <option value="Vietcombank">Vietcombank</option>
                  <option value="BIDV">BIDV</option>
                  <option value="VietinBank">VietinBank</option>
                  <option value="Agribank">Agribank</option>
                  <option value="Techcombank">Techcombank</option>
                  <option value="ACB">ACB</option>
                  <option value="Sacombank">Sacombank</option>
                  <option value="MB Bank">MB Bank</option>
                </select>
              </div>
            </Col>
            <Col md={4}>
              <div className="form-group">
                <label className="form-label">Số tài khoản</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nhập số tài khoản"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                />
              </div>
            </Col>
            <Button className="save-button" onClick={handleSave}>
          LƯU LẠI
        </Button>
          </Row>
           
        </div>

        {/* Save Button */}
       
      </div>
    </div>
  );
};

export default Profile;
