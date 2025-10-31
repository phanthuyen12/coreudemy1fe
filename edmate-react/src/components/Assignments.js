import React from 'react';
import { Link } from 'react-router-dom';

const Assignments = () => {
  const assignments = [
    {
      id: 1,
      title: 'Do The Research',
      dueDate: 'Due in 9 days',
      icon: 'ph-fill ph-graduation-cap'
    },
    {
      id: 2,
      title: 'PHP Development',
      dueDate: 'Due in 2 days',
      icon: 'ph ph-code'
    },
    {
      id: 3,
      title: 'Graphic Design',
      dueDate: 'Due in 5 days',
      icon: 'ph ph-bezier-curve'
    }
  ];

  return (
    <div className="card mt-24">
      <div className="card-body">
        <div className="mb-20 flex-between flex-wrap gap-8">
          <h4 className="mb-0">Assignments</h4>
          <Link to="/assignments" className="text-13 fw-medium text-main-600 hover-text-decoration-underline">
            See All
          </Link>
        </div>
        
        {assignments.map((assignment) => (
          <div key={assignment.id} className="p-xl-4 py-16 px-12 flex-between gap-8 rounded-8 border border-gray-100 hover-border-gray-200 transition-1 mb-16">
            <div className="flex-align flex-wrap gap-8">
              <span className="text-main-600 bg-main-50 w-44 h-44 rounded-circle flex-center text-2xl flex-shrink-0">
                <i className={assignment.icon}></i>
              </span>
              <div>
                <h6 className="mb-0">{assignment.title}</h6>
                <span className="text-13 text-gray-400">{assignment.dueDate}</span>
              </div>
            </div>
            <Link to="/assignments" className="text-gray-900 hover-text-main-600">
              <i className="ph ph-caret-right"></i>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;

