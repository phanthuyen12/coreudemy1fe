
import { useEffect, useState } from 'react';
import { Row, Col, Card, Alert, Button, CardBody, Table, Badge, Form, Modal, Pagination } from 'react-bootstrap';
import { Icon } from '@iconify/react';

const IconifyIcon = ({ icon, ...props }) => {
    return <Icon icon={icon} {...props} />;
};
const StatCard = ({ amount, icon, variant, name }) => (
    <Card className="h-100">
        <CardBody>
            <Row className="align-items-center">
                <Col xs={6}>
                    <div className={`avatar-md bg-opacity-10 rounded flex-centered bg-${variant}`}>
                        <IconifyIcon icon={icon} height={32} width={32} className={`text-${variant}`} />
                    </div>
                </Col>
                <Col xs={6} className="text-end">
                    <p className="text-muted mb-0 text-truncate">{name}</p>
                    <h3 className="text-dark mt-1 mb-0">{amount}</h3>
                </Col>
            </Row>
        </CardBody>
    </Card>
);
export const Stats = () => {
    const [stats, setStats] = useState({});

    useEffect(() => {
        // Fetch hoặc đặt dữ liệu giả lập ở đây
        const fakeData = {
            total_users_all: '17', total_orders_all: '5', total_pay_all: '10.297đ', profit_all: '1.787đ',
            new_users_month: '1', total_orders_month: '0', total_pay_month: '0đ', profit_month: '0đ',
        };
        setStats(fakeData);
    }, []);

    const cardConfig = [
        { name: 'TỔNG THÀNH VIÊN', icon: 'mdi:account-group', variant: 'primary', amount: stats.total_users_all },
        { name: 'SỐ DƯ CÒN LẠI', icon: 'mdi:cart-outline', variant: 'info', amount: stats.total_orders_all },
        { name: 'ADMIN', icon: 'mdi:chart-bar', variant: 'warning', amount: stats.total_pay_all },
        { name: 'BANNED', icon: 'mdi:cash-multiple', variant: 'danger', amount: stats.profit_all }
    ];

    return (
        <Row>
            {cardConfig.map((card, idx) => (
                <Col xxl={3} lg={6} md={6} key={idx} className="mb-3">
                    <StatCard {...card} amount={card.amount || '0'} />
                </Col>
            ))}
            {/* Lặp lại cho các khoảng thời gian khác nếu cần */}
        </Row>
    );
};
export { StatCard };