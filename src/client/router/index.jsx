import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import Courses from '../pages/Courses';
import CourseDetail from '../pages/CourseDetail';
import CourseProfile from '../pages/CourseProfile';
import LandingLDH from '../pages/LandingLDH';
import  Profile from '../pages/Profile'
import YourTicket from '../pages/YourTicket'
import ChangePassword from '../pages/ChangePassword'
import Notifications from '../pages/Notifications'
import Affiliate from '../pages/Affiliate'
import LandingLearn from '../pages/LandingLearn';
import LeanStudy from '../pages/LeanStudy';
import ProtectedRoute from './ProtectedRoute';
// import "./client/assets/css/course-theme.css";      // client dark theme
// moved CSS injection into Layout to avoid leaking styles into admin
const ClientRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingLearn />} />
        {/* Shortcut to admin login with redirect */}
        <Route
          path="wp-admin"
          element={<Navigate to={`/auth/sign-in?redirectTo=${encodeURIComponent('/admin')}&module=admin`} replace />}
        />
        {/* Public pages above. Protected pages go under ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="courses" element={<Courses />} />
          <Route path="course" element={<CourseDetail />} />
          {/* <Route path="course-profile" element={<CourseProfile />} /> */}
          <Route path="learn/study" element={<LeanStudy />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="tickets" element={<YourTicket />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="notifications" element={<Notifications />} />
          {/* <Route path="affiliate" element={<Affiliate />} /> */}
        </Route>
        <Route path="learn/landing" element={<LandingLearn />} />
      </Route>
    </Routes>
  );
};

export default ClientRouter;
