import { useEffect, useState } from 'react';
import { Row, Col, Card, Alert, Button, CardBody } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Import các component layout từ cấu trúc dự án của bạn
import PageBreadcrumb from '../../../../components/layout/PageBreadcrumb';
import PageMetaData from '../../../../components/PageTitle';

// ===============================================
// ĐỊNH NGHĨA COMPONENT TÙY CHỈNH
// ===============================================
const IconifyIcon = ({ icon, ...props }) => {
    return <Icon icon={icon} {...props} />;
};

// ===============================================
// CÁC COMPONENT CON CHO TRANG DASHBOARD
// (Thay thế cho Conversions, SessionByBrowser, v.v.)
// ===============================================

//
// SECTION: THÔNG BÁO (ALERTS)
//
const AlertsSection = () => {
    // (Bao gồm logic quản lý state của các thông báo)
    const [showAlerts, setShowAlerts] = useState({ license: true, smtp: true, debug: true, cron: true });

    if (!Object.values(showAlerts).some(v => v === true)) return null; // Ẩn nếu không có alert nào

    return (
        <div className="mb-4">
            {showAlerts.license && (
                <Alert variant="secondary" className="shadow-sm" onClose={() => setShowAlerts(p => ({ ...p, license: false }))} dismissible>
                    <h5 className="mb-0 alert-heading">
                        <IconifyIcon icon="mdi:license" className="me-2" />
                        Thông báo bản quyền & Cập nhật
                    </h5>
                </Alert>
            )}
            {showAlerts.smtp && (
                <Alert variant="warning" className="shadow-sm" onClose={() => setShowAlerts(p => ({ ...p, smtp: false }))} dismissible>
                    <IconifyIcon icon="mdi:email-alert-outline" className="me-2" />
                    Vui lòng cấu hình <strong>SMTP</strong> để website hoạt động đầy đủ.
                </Alert>
            )}
            {/* Thêm các alert khác nếu cần */}
        </div>
    );
};

//
// SECTION: THỐNG KÊ (STATS)
//
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

const Stats = () => {
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
        { name: 'Thành viên', icon: 'mdi:account-group', variant: 'primary', amount: stats.total_users_all },
        { name: 'Đơn đã bán', icon: 'mdi:cart-outline', variant: 'info', amount: stats.total_orders_all },
        { name: 'Doanh thu', icon: 'mdi:chart-bar', variant: 'warning', amount: stats.total_pay_all },
        { name: 'Lợi nhuận', icon: 'mdi:cash-multiple', variant: 'danger', amount: stats.profit_all }
    ];

    return (
        <Row>
            <h5 className="mb-3">Toàn thời gian</h5>
            {cardConfig.map((card, idx) => (
                <Col xxl={3} lg={6} md={6} key={idx} className="mb-3">
                    <StatCard {...card} amount={card.amount || '0'} />
                </Col>
            ))}
            {/* Lặp lại cho các khoảng thời gian khác nếu cần */}
        </Row>
    );
};

//
// SECTION: BIỂU ĐỒ (CHARTS)
//
const AnalyticsCharts = () => {
    const [orderChartData, setOrderChartData] = useState({ labels: [], datasets: [] });
    const [depositChartData, setDepositChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
        // Fetch hoặc mock data cho biểu đồ
        const fakeChartData = {
            labels: ['T7', 'CN', 'T2', 'T3', 'T4', 'T5', 'T6'],
            revenues: [1200, 1500, 800, 2000, 1800, 2200, 3000],
            profits: [400, 500, 300, 700, 600, 800, 1100],
            deposits: [5000, 6000, 4500, 7000, 6500, 8000, 9000]
        };
        setOrderChartData({
            labels: fakeChartData.labels,
            datasets: [
                { label: 'Lợi nhuận', data: fakeChartData.profits, backgroundColor: 'rgba(73,182,245, 0.7)' },
                { label: 'Doanh thu', data: fakeChartData.revenues, backgroundColor: 'rgba(132, 90, 223, 0.7)' }
            ]
        });
        setDepositChartData({
            labels: fakeChartData.labels,
            datasets: [{ label: 'Nạp tiền', data: fakeChartData.deposits, backgroundColor: 'rgba(29, 78, 216, 0.7)' }]
        });
    }, []);

    const chartOptions = { responsive: true, maintainAspectRatio: false };

    return (
        <Row>
            <Col xl={6} className="mb-4">
                <Card>
                    <Card.Header as="h5">Thống kê đơn hàng</Card.Header>
                    <Card.Body style={{ height: '350px' }}>
                        <Bar data={orderChartData} options={chartOptions} />
                    </Card.Body>
                </Card>
            </Col>
            <Col xl={6} className="mb-4">
                <Card>
                    <Card.Header as="h5">Thống kê nạp tiền</Card.Header>
                    <Card.Body style={{ height: '350px' }}>
                        <Bar data={depositChartData} options={chartOptions} />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

// ===============================================
// COMPONENT TRANG CHỦ CHÍNH (HOME)
// ===============================================
export default function Home() {
    return (
        <>
            <PageMetaData title="Dashboard" />
            <PageBreadcrumb title="Dashboard" subName="Admin" />

            <AlertsSection />

            <Stats />

            <AnalyticsCharts />
            
            {/* Bạn có thể thêm các component như "RecentActivity" vào đây nếu cần */}
            {/* <Row>
                <RecentActivity title="Đơn hàng gần đây" />
                <RecentActivity title="Nạp tiền gần đây" />
            </Row> 
            */}
        </>
    );
}