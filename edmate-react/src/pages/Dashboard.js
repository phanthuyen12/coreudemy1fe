import React, { useEffect } from 'react';
import StatsCards from '../components/StatsCards';
import StudyStatistics from '../components/StudyStatistics';
import TopCourses from '../components/TopCourses';
import Calendar from '../components/Calendar';
import Assignments from '../components/Assignments';
import ProgressBar from '../components/ProgressBar';

const Dashboard = () => {
  useEffect(() => {
    // 加载必要的JavaScript库
    const loadScripts = async () => {
      // 这里可以加载ApexCharts等库
    };
    loadScripts();
  }, []);

  return (
    <div className="row gy-4">
      <div className="col-lg-9">
        {/* Stats Cards */}
        <StatsCards />
        
        {/* Study Statistics */}
        <StudyStatistics />
        
        {/* Top Courses */}
        <TopCourses />
      </div>

      <div className="col-lg-3">
        {/* Calendar */}
        <Calendar />
        
        {/* Assignments */}
        <Assignments />
        
        {/* Progress Bar */}
        <ProgressBar />
      </div>
    </div>
  );
};

export default Dashboard;

