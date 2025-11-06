import React, { useState, useEffect } from 'react';
import { Card, CardBody, Row, Col, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import PageMetaData from '@/admin/components/PageTitle';
import WebsiteConfigDisplay from '@/components/WebsiteConfigDisplay';
import { validateImageQuality, validateImageDimensions, validateFormData, showValidationErrors } from '@/utils/imageValidation';
import ImageValidationInfo from '@/components/ImageValidationInfo';
import { websiteConfigController } from '@/config/config';

const WebsiteConfigPage = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    url: '',
    domain: '',
    title: '',
    description: '',
    author: '',
    site_name: '',
    published_time: '',
    logo: null,
    cover_image: null,
    favicon: null,
    hashtags: [],
    tags: [],
    metadata: {
      ogTitle: '',
      og_title: '',
      og_description: ''
    }
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  // Load website config
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const response = await websiteConfigController.get();
        
        if (response.success && response.data) {
          setConfig(response.data);
          setEditData({
            ...response.data,
            logo: null,
            cover_image: null,
            favicon: null,
            hashtags: response.data.hashtags || [],
            tags: response.data.tags || [],
            metadata: response.data.metadata || {
              ogTitle: '',
              og_title: '',
              og_description: ''
            }
          });
        } else {
          setError(response.message || 'Failed to load config');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading website config:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Handle input change
  const handleInputChange = async (e) => {
    const { name, value, files, type } = e.target;
    
    if (files) {
      const file = files[0];
      if (file) {
        // Validate image quality
        const qualityValidation = validateImageQuality(file);
        if (!qualityValidation.isValid) {
          showValidationErrors(qualityValidation.errors);
          e.target.value = '';
          return;
        }

        // Validate image dimensions
        const dimensionValidation = await validateImageDimensions(file);
        if (!dimensionValidation.isValid) {
          showValidationErrors(dimensionValidation.errors);
          e.target.value = '';
          return;
        }

        setEditData(prev => ({ ...prev, [name]: file }));
        
        // Set preview
        const reader = new FileReader();
        reader.onloadend = () => {
          if (name === 'logo') setLogoPreview(reader.result);
          else if (name === 'cover_image') setCoverImagePreview(reader.result);
          else if (name === 'favicon') setFaviconPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (type === 'checkbox') {
      setEditData(prev => ({ ...prev, [name]: e.target.checked }));
    } else {
      setEditData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle array input (hashtags, tags)
  const handleArrayInputChange = (name, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setEditData(prev => ({ ...prev, [name]: array }));
  };

  // Handle metadata change
  const handleMetadataChange = (key, value) => {
    setEditData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value
      }
    }));
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Validate required fields
      const requiredFields = ['title', 'description', 'url', 'domain'];
      const formValidation = validateFormData(editData, requiredFields);
      
      if (!formValidation.isValid) {
        showValidationErrors(formValidation.errors);
        return;
      }

      const response = await websiteConfigController.update(config.id, editData);
      
      if (response.success) {
        alert('Cập nhật cấu hình website thành công!');
        setShowEditModal(false);
        // Reload config
        window.location.reload();
      } else {
        alert('Có lỗi xảy ra khi cập nhật cấu hình');
      }
    } catch (error) {
      console.error('Error updating website config:', error);
      alert('Có lỗi xảy ra khi cập nhật cấu hình');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Lỗi!</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <>
      <PageMetaData title="Cấu hình Website" />
      
      <div className="page-content">
        <div className="container-fluid">
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="flex-grow-1">
                      <h4 className="card-title mb-0">
                        <i className="mdi mdi-web me-2"></i>
                        Cấu hình Website
                      </h4>
                      <p className="text-muted mb-0">
                        Thông tin cấu hình website được lấy từ API
                      </p>
                    </div>
                    <Button 
                      variant="primary" 
                      onClick={() => setShowEditModal(true)}
                    >
                      <i className="mdi mdi-pencil me-1"></i>
                      Cập nhật cấu hình
                    </Button>
                  </div>
                  
                  <WebsiteConfigDisplay />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật cấu hình Website</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL *</Form.Label>
                  <Form.Control
                    type="url"
                    name="url"
                    value={editData.url}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Domain *</Form.Label>
                  <Form.Control
                    type="url"
                    name="domain"
                    value={editData.domain}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={editData.title}
                    onChange={handleInputChange}
                    placeholder="Website title"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={editData.description}
                    onChange={handleInputChange}
                    placeholder="Website description"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    name="author"
                    value={editData.author}
                    onChange={handleInputChange}
                    placeholder="Author name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Site Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="site_name"
                    value={editData.site_name}
                    onChange={handleInputChange}
                    placeholder="Site name"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <ImageValidationInfo />
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Logo</Form.Label>
                  <Form.Control
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                  {logoPreview && (
                    <div className="mt-2">
                      <img src={logoPreview} alt="Logo Preview" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} className="rounded border" />
                    </div>
                  )}
                  {config?.logo && !logoPreview && (
                    <div className="mt-2">
                      <p className="text-muted mb-1">Logo hiện tại:</p>
                      <img src={`https://api.vscape.tw${config.logo}`} alt="Current Logo" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} className="rounded border" />
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cover Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="cover_image"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                  {coverImagePreview && (
                    <div className="mt-2">
                      <img src={coverImagePreview} alt="Cover Preview" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} className="rounded border" />
                    </div>
                  )}
                  {config?.cover_image && !coverImagePreview && (
                    <div className="mt-2">
                      <p className="text-muted mb-1">Cover hiện tại:</p>
                      <img src={`https://api.vscape.tw${config.cover_image}`} alt="Current Cover" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} className="rounded border" />
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Favicon</Form.Label>
                  <Form.Control
                    type="file"
                    name="favicon"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                  {faviconPreview && (
                    <div className="mt-2">
                      <img src={faviconPreview} alt="Favicon Preview" style={{ maxWidth: '50px', maxHeight: '50px', objectFit: 'cover' }} className="rounded border" />
                    </div>
                  )}
                  {config?.favicon && !faviconPreview && (
                    <div className="mt-2">
                      <p className="text-muted mb-1">Favicon hiện tại:</p>
                      <img src={`https://api.vscape.tw${config.favicon}`} alt="Current Favicon" style={{ maxWidth: '50px', maxHeight: '50px', objectFit: 'cover' }} className="rounded border" />
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hashtags (cách nhau bởi dấu phẩy)</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.hashtags.join(', ')}
                    onChange={(e) => handleArrayInputChange('hashtags', e.target.value)}
                    placeholder="#tag1, #tag2, #tag3"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tags (cách nhau bởi dấu phẩy)</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.tags.join(', ')}
                    onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                    placeholder="tag1, tag2, tag3"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <h6>Metadata</h6>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>OG Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.metadata.ogTitle}
                    onChange={(e) => handleMetadataChange('ogTitle', e.target.value)}
                    placeholder="OG Title"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>OG Title (Alt)</Form.Label>
                  <Form.Control
                    type="text"
                    value={editData.metadata.og_title}
                    onChange={(e) => handleMetadataChange('og_title', e.target.value)}
                    placeholder="OG Title Alt"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>OG Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={editData.metadata.og_description}
                    onChange={(e) => handleMetadataChange('og_description', e.target.value)}
                    placeholder="OG Description"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Đang cập nhật...
                </>
              ) : (
                'Cập nhật'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default WebsiteConfigPage;