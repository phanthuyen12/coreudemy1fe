import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Assignments from './pages/Assignments';
// import Mentors from './pages/Mentors';
// import Resources from './pages/Resources';
import Messages from './pages/Messages';
import Analytics from './pages/Analytics';
import Events from './pages/Events';
import Library from './pages/Library';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import TwoStepVerification from './pages/TwoStepVerification';
import CourseDetails from './pages/CourseDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 认证页面 */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/two-step-verification" element={<TwoStepVerification />} />
          
          {/* 主应用布局 */}
          <Route path="/" element={<Layout />}>
            <Route index element={<CourseDetails />} />
            <Route path="students" element={<Students />} />
            <Route path="courses" element={<Courses />} />
            <Route path="assignments" element={<Assignments />} />
            {/* <Route path="mentors" element={<Mentors />} /> */}
            {/* <Route path="resources" element={<Resources />} /> */}
            <Route path="messages" element={<Messages />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="events" element={<Events />} />
            <Route path="library" element={<Library />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="settings" element={<Settings />} />
            <Route path="course-details" element={<CourseDetails />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
