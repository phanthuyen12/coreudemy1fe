import React from 'react';
import { Link } from 'react-router-dom';

const TopCourses = () => {
  const courses = [
    {
      id: 1,
      title: 'Full Stack Web Development',
      category: 'Development',
      categoryClass: 'bg-success-50 text-success-600',
      image: '/assets/images/thumbs/course-img1.png',
      instructor: 'Albert James',
      instructorImage: '/assets/images/thumbs/user-img1.png',
      lessons: 24,
      hours: 40,
      rating: 4.9,
      reviews: '12k'
    },
    {
      id: 2,
      title: 'Design System',
      category: 'Design',
      categoryClass: 'bg-warning-50 text-warning-600',
      image: '/assets/images/thumbs/course-img5.png',
      instructor: 'Albert James',
      instructorImage: '/assets/images/thumbs/user-img5.png',
      lessons: 24,
      hours: 40,
      rating: 4.9,
      reviews: '12k'
    },
    {
      id: 3,
      title: 'React Native Course',
      category: 'Frontend',
      categoryClass: 'bg-danger-50 text-danger-600',
      image: '/assets/images/thumbs/course-img6.png',
      instructor: 'Albert James',
      instructorImage: '/assets/images/thumbs/user-img6.png',
      lessons: 24,
      hours: 40,
      rating: 4.9,
      reviews: '12k'
    }
  ];

  return (
    <div className="card mt-24">
      <div className="card-body">
        <div className="mb-20 flex-between flex-wrap gap-8">
          <h4 className="mb-0">Top Courses Pick for You</h4>
          <Link to="/courses" className="text-13 fw-medium text-main-600 hover-text-decoration-underline">
            See All
          </Link>
        </div>
        
        <div className="row g-20">
          {courses.map((course) => (
            <div key={course.id} className="col-lg-4 col-sm-6">
              <div className="card border border-gray-100">
                <div className="card-body p-8">
                  <Link to="/course-details" className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8">
                      <img src={course.image} alt="Course" />
                  </Link>
                  <div className="p-8">
                    <span className={`text-13 py-2 px-10 rounded-pill ${course.categoryClass} mb-16`}>
                      {course.category}
                    </span>
                    <h5 className="mb-0">
                      <Link to="/course-details" className="hover-text-main-600">
                        {course.title}
                      </Link>
                    </h5>

                    <div className="flex-align gap-8 flex-wrap mt-16">
                      <img src={course.instructorImage} className="w-28 h-28 rounded-circle object-fit-cover" alt="Instructor" />
                      <div>
                        <span className="text-gray-600 text-13">
                          Created by <Link to="/profile" className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline">
                            {course.instructor}
                          </Link>
                        </span>
                      </div>
                    </div>

                    <div className="flex-align gap-8 mt-12 pt-12 border-top border-gray-100">
                      <div className="flex-align gap-4">
                        <span className="text-sm text-main-600 d-flex">
                          <i className="ph ph-video-camera"></i>
                        </span>
                        <span className="text-13 text-gray-600">{course.lessons} Lesson</span>
                      </div>
                      <div className="flex-align gap-4">
                        <span className="text-sm text-main-600 d-flex">
                          <i className="ph ph-clock"></i>
                        </span>
                        <span className="text-13 text-gray-600">{course.hours} Hours</span>
                      </div>
                    </div>
                    
                    <div className="flex-between gap-4 flex-wrap mt-24">
                      <div className="flex-align gap-4">
                        <span className="text-15 fw-bold text-warning-600 d-flex">
                          <i className="ph-fill ph-star"></i>
                        </span>
                        <span className="text-13 fw-bold text-gray-600">{course.rating}</span>
                        <span className="text-13 fw-bold text-gray-600">({course.reviews})</span>
                      </div>
                      <Link to="/course-details" className="btn btn-outline-main rounded-pill py-9">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCourses;
