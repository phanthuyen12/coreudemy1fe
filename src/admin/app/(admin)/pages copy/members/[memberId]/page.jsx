import {useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';

import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import { Row, Col, Card, Badge, Button, Form, Tabs, Tab, Table, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import {memeberController} from '../../../../../mvc/controllers/memebersController';
const memeberCtrl = new memeberController();
const MemberDetail = () => {
  const { memberId } = useParams();
  const [key, setKey] = useState('overview');
  const [memberData, setMemberData] = useState(null);
  useEffect(() => {
    if (!memberId) return;
    const fetchMember = async () => {
      try {
        const data = await memeberCtrl.getDetailMemebers(memberId);
        setMemberData(data.data);
      } catch (error) {
        console.error('Error fetching member data:', error);
      }
    };
    fetchMember();
  }, [memberId]);

const LoadingDataUser = async (id) => {
  try {
    const data = await memeberCtrl.getDetailMemebers(id);
    setMemberData(data);
  } catch (error) {
    console.error('Error fetching member data:', error);
  }
}
  // Fetch member details when component mounts or memberId changes
const user = memberData || {
    username: 'Loading...',
    email: '',
    gender: '',
    joinDate: '',
    id: memberId || '#',
    role: '',
    status: '',
    wallet: '0đ',
    totalDeposit: '0đ',
    used: '0đ',
    debt: '0đ'
  };


  return (
    <>
      <PageBreadcrumb subName="Users" title="Chi tiết thành viên" />
      <PageMetaData title="User Detail" />

      <Row>
        {/* Left profile column */}
        <Col xl={4} lg={5} className="mb-3">
          {/* Gradient profile banner */}
          <Card className="mb-3 border-0 shadow-sm" style={{
            background: 'linear-gradient(135deg, #5E60CE 0%, #6930C3 40%, #7400B8 100%)',
            color: '#fff',
            overflow: 'hidden'
          }}>
            <Card.Body className="d-flex align-items-center gap-3 position-relative">
              <div style={{
                position: 'absolute',
                right: -40,
                top: -40,
                width: 140,
                height: 140,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '50%'
              }} />
              <div className="avatar rounded-circle bg-white text-dark d-flex align-items-center justify-content-center fw-bold" style={{width: 56, height: 56}}>
                {user.username.slice(0,2).toUpperCase()}
              </div>
              <div className="flex-grow-1">
                <h5 className="mb-1 text-white">{user.username} <Badge bg="success">{user.status}</Badge></h5>
                <div className="small" style={{opacity: .9}}>ID: {memberId || user.id} • Tham gia: {user.joinDate}</div>
                <div className="small" style={{opacity: .9}}>{user.email}</div>
              </div>
            </Card.Body>
          </Card>

          <Row className="g-2">
            <Col md={6}>
              <Card className="text-center border-0 shadow-sm" style={{background:'#E3F2FD'}}>
                <Card.Body>
                  <div className="text-muted">Ví chính</div>
                  <h5 className="mb-0 mt-1 text-primary">{user.wallet}</h5>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="text-center border-0 shadow-sm" style={{background:'#FFF3E0'}}>
                <Card.Body>
                  <div className="text-muted">Tổng nạp</div>
                  <h5 className="mb-0 mt-1" style={{color:'#FB8C00'}}>{user.totalDeposit}</h5>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="text-center border-0 shadow-sm" style={{background:'#E8F5E9'}}>
                <Card.Body>
                  <div className="text-muted">Đã sử dụng</div>
                  <h5 className="mb-0 mt-1 text-success">{user.used}</h5>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="text-center border-0 shadow-sm" style={{background:'#FFEBEE'}}>
                <Card.Body>
                  <div className="text-muted">Số tiền nợ</div>
                  <h5 className="mb-0 mt-1 text-danger">{user.debt}</h5>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="mt-3 border-0 shadow-sm">
            <Card.Header className="fw-semibold">Tác vụ nhanh</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <span><Icon icon="mdi:cash-plus" className="me-2"/>Cộng tiền</span>
                <Button size="sm" variant="success">Thực hiện</Button>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <span><Icon icon="mdi:cash-minus" className="me-2"/>Trừ tiền</span>
                <Button size="sm" variant="danger">Thực hiện</Button>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <span><Icon icon="mdi:ticket-outline" className="me-2"/>Tạo ticket</span>
                <Button size="sm" variant="info" className="text-dark">Thực hiện</Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        {/* Right content column */}
        <Col xl={8} lg={7}>
          <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
            <Tab eventKey="overview" title="Tổng quan">
              <Card className="border-0 shadow-sm mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                  <span className="fw-semibold">Hoạt động gần đây</span>
                  <OverlayTrigger placement="left" overlay={<Tooltip>Đồng bộ</Tooltip>}>
                    <Button size="sm" ><Icon icon="mdi:refresh"/></Button>
                  </OverlayTrigger>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table hover responsive className="mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Thời gian</th>
                        <th>Hành động</th>
                        <th className="text-end">Giá trị</th>
                        <th>Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>08/09/2025 10:02</td>
                        <td><Badge bg="success">Nạp</Badge></td>
                        <td className="text-end text-success">+0đ</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>08/09/2025 09:12</td>
                        <td><Badge bg="secondary">Đăng nhập</Badge></td>
                        <td className="text-end">-</td>
                        <td>Web</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              <Row className="g-3">
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Icon icon="mdi:account-check" className="text-success" />
                        <div className="fw-semibold">Trạng thái</div>
                      </div>
                      <Badge bg="success">{user.status}</Badge>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Icon icon="mdi:crown-outline" className="text-warning" />
                        <div className="fw-semibold">Cấp bậc</div>
                      </div>
                      <Badge bg="warning" text="dark">{user.role}</Badge>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Icon icon="mdi:email-outline" className="text-primary" />
                        <div className="fw-semibold">Email</div>
                      </div>
                      <div className="text-muted small">{user.email}</div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="basic" title="Thông tin cơ bản">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-semibold"><Icon icon="mdi:card-account-details-outline" className="me-1"/> Hồ sơ</Card.Header>
            <Card.Body>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control defaultValue={user.username} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" defaultValue={user.email} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Giới tính</Form.Label>
                      <Form.Select defaultValue={user.gender}>
                        <option>Nam</option>
                        <option>Nữ</option>
                        <option>Khác</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Ngày tham gia</Form.Label>
                      <Form.Control defaultValue={user.joinDate} />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary">Lưu thay đổi</Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="security" title="Bảo mật">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-semibold"><Icon icon="mdi:shield-key-outline" className="me-1"/> Bảo mật tài khoản</Card.Header>
            <Card.Body>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Mật khẩu mới</Form.Label>
                      <Form.Control type="password" placeholder="Nhập mật khẩu mới" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nhập lại mật khẩu</Form.Label>
                      <Form.Control type="password" placeholder="Nhập lại mật khẩu" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Token</Form.Label>
                      <div className="d-flex gap-2">
                        <Form.Control type="password" defaultValue="••••••••" />
                        <Button ><Icon icon="mdi:content-copy" /></Button>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>API Key</Form.Label>
                      <div className="d-flex gap-2">
                        <Form.Control type="password" defaultValue="••••••••" />
                        <Button ><Icon icon="mdi:content-copy" /></Button>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary">Cập nhật bảo mật</Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="role" title="Quyền hạn">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-semibold"><Icon icon="mdi:account-key-outline" className="me-1"/> Phân quyền</Card.Header>
            <Card.Body>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Admin Role</Form.Label>
                      <Form.Select defaultValue={user.role}>
                        <option>User (Khách hàng)</option>
                        <option>Admin</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Trạng thái tài khoản</Form.Label>
                      <Form.Select defaultValue={user.status}>
                        <option>Hoạt động (Active)</option>
                        <option>Khoá</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary">Lưu thay đổi</Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
        </Col>
      </Row>
    </>
  );
};

export default MemberDetail;
