import React from 'react';

const DashboardFooter = () => {
  return (
    <div className="dashboard-footer">
      <div className="flex-between flex-wrap gap-16">
        <p className="text-gray-300 text-13 fw-normal">
          &copy; Copyright Edmate 2024, All Right Reserverd
        </p>
        <div className="flex-align flex-wrap gap-16">
          <button type="button" className="btn btn-link text-gray-300 text-13 fw-normal hover-text-main-600 hover-text-decoration-underline p-0">
            License
          </button>
          <button type="button" className="btn btn-link text-gray-300 text-13 fw-normal hover-text-main-600 hover-text-decoration-underline p-0">
            More Themes
          </button>
          <button type="button" className="btn btn-link text-gray-300 text-13 fw-normal hover-text-main-600 hover-text-decoration-underline p-0">
            Documentation
          </button>
          <button type="button" className="btn btn-link text-gray-300 text-13 fw-normal hover-text-main-600 hover-text-decoration-underline p-0">
            Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardFooter;
