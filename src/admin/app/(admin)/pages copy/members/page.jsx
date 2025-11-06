import PageBreadcrumb from '@/admin/components/layout/PageBreadcrumb';
import PageMetaData from '@/admin/components/PageTitle';
import { useEffect, useState } from 'react';
import { Row, Col, Card, Alert, Button, CardBody, Table, Badge, Form, Modal, Pagination } from 'react-bootstrap';
import {memeberController } from '../../../../mvc/controllers/memebersController'
import { withSwal } from 'react-sweetalert2';

import { Icon } from '@iconify/react';
import {Stats} from './components/StatCard/page'
const controller = new memeberController(); // tạo 1 instance controller
import UsersTableWithSwal from './components/UsersTable/page'; // file chứa UsersTable + withSwal

const NoticeBar = () => {
    return (
        <Alert variant="dark" className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-2">
            <div className="text-muted small">
                Nếu bạn muốn tracking thành viên đăng ký, bạn có thể chèn <strong>?utm_source=ten_chien_dich</strong> vào cuối link web để thu thập dữ liệu nơi thành viên đăng ký.
            </div>
            <div className="d-flex flex-wrap gap-2">
                <Button size="sm" variant="warning" className="text-dark fw-semibold"><i className="mdi mdi-chart-box-outline me-1" /> THỐNG KÊ UTM_SOURCE</Button>
                <Button size="sm" variant="success" className="fw-semibold"><i className="mdi mdi-download me-1" /> TẢI EMAIL USERS</Button>
                <Button size="sm" variant="info" className="text-dark fw-semibold"><i className="mdi mdi-reload me-1" /> RESET TỔNG NẠP</Button>
                <Button size="sm" variant="warning" className="fw-semibold"><i className="mdi mdi-logout-variant me-1" /> ĐĂNG XUẤT TẤT CẢ</Button>
                <Button size="sm" variant="outline-primary" className="fw-semibold"><i className="mdi mdi-key-change me-1" /> THAY ĐỔI API KEY</Button>
                <Button size="sm" variant="primary" className="fw-semibold"><i className="mdi mdi-account-plus me-1" /> Thêm thành viên</Button>
            </div>
        </Alert>
    );
};

const ToolbarButtons = () => {
    return (
        <Row className="mb-2">
            <Col className="text-end">
                <div className="d-inline-flex flex-wrap gap-2">
                    <Button size="sm" variant="danger"><i className="mdi mdi-chart-line me-1" /> THỐNG KÊ UTM_SOURCE</Button>
                    <Button size="sm" variant="success"><i className="mdi mdi-download me-1" /> TẢI EMAIL USERS</Button>
                    <Button size="sm" variant="info" className="text-dark"><i className="mdi mdi-eraser me-1" /> RESET TỔNG NẠP</Button>
                    <Button size="sm" variant="warning" className="text-dark"><i className="mdi mdi-account-cancel-outline me-1" /> ĐĂNG XUẤT TẤT CẢ</Button>
                    <Button size="sm" variant="primary"><i className="mdi mdi-key-variant me-1" /> THAY ĐỔI API KEY TOÀN BỘ THÀNH VIÊN</Button>
                </div>
            </Col>
        </Row>
    );
};


const Members = () => {
    return <>
        <PageBreadcrumb subName="Pages" title="Users" />
      
        <Stats />
        {/* <NoticeBar /> */}
        <ToolbarButtons />
        <UsersTableWithSwal />
        <PageMetaData title="Welcome" />
    </>;
};

export default Members;
