import React, { useState } from 'react';

const CourseDetails = () => {
  const [activeDropdown, setActiveDropdown] = useState('program');

  const toggleDropdown = (dropdownId) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  return (
    <div className="">
      {/* Breadcrumb Start */}
      <div className="breadcrumb mb-24">
        <ul className="flex-align gap-4">
          <li><a href="/" className="text-gray-200 fw-normal text-15 hover-text-main-600">Home</a></li>
          <li><span className="text-gray-500 fw-normal d-flex"><i className="ph ph-caret-right"></i></span></li>
          <li><span className="text-main-600 fw-normal text-15">Course Details</span></li>
        </ul>
      </div>
      {/* Breadcrumb End */}

      <div className="row gy-4">
        <div className="col-md-8">
          {/* Course Card Start */}
          <div className="card">
            <div className="card-body p-lg-20 p-sm-3">
              <div className="flex-between flex-wrap gap-12 mb-20">
                <div>
                  <h3 className="mb-4">The Complete Web Development Course</h3>
                  <p className="text-gray-600 text-15">Prof. Devonne Wallbridge</p>
                </div>

                <div className="flex-align flex-wrap gap-24">
                  <span className="py-6 px-16 bg-main-50 text-main-600 rounded-pill text-15">Web Development</span>
                  <div className="share-social position-relative">
                    <button type="button" className="share-social__button text-gray-200 text-26 d-flex hover-text-main-600">
                      <i className="ph ph-share-network"></i>
                    </button>
                    <div className="share-social__icons bg-white box-shadow-2xl p-16 border border-gray-100 rounded-8 position-absolute inset-block-start-100 inset-inline-end-0">
                      <ul className="flex-align gap-8">
                        <li>
                          <a href="https://www.facebook.com" className="flex-center w-36 h-36 border border-main-600 text-white rounded-circle text-xl bg-main-600 hover-bg-main-800 hover-border-main-800">
                            <i className="ph ph-facebook-logo"></i>
                          </a>
                        </li>
                        <li>
                          <a href="https://www.google.com" className="flex-center w-36 h-36 border border-main-600 text-white rounded-circle text-xl bg-main-600 hover-bg-main-800 hover-border-main-800">
                            <i className="ph ph-twitter-logo"></i>
                          </a>
                        </li>
                        <li>
                          <a href="https://www.twitter.com" className="flex-center w-36 h-36 border border-main-600 text-white rounded-circle text-xl bg-main-600 hover-bg-main-800 hover-border-main-800">
                            <i className="ph ph-linkedin-logo"></i>
                          </a>
                        </li>
                        <li>
                          <a href="https://www.instagram.com" className="flex-center w-36 h-36 border border-main-600 text-white rounded-circle text-xl bg-main-600 hover-bg-main-800 hover-border-main-800">
                            <i className="ph ph-instagram-logo"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <button type="button" className="bookmark-icon text-gray-200 text-26 d-flex hover-text-main-600">
                    <i className="ph ph-bookmarks"></i>
                  </button>
                </div>
              </div>

              <div className="rounded-16 overflow-hidden">
                <video id="player" className="player" playsInline controls data-poster="/assets/images/thumbs/course-details.png">
                  <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4" type="video/mp4" />
                  <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4" type="video/webm" />
                </video>
              </div>
              
              <div className="mt-24">
                <div className="mb-24 pb-24 border-bottom border-gray-100">
                  <h5 className="mb-12 fw-bold">About this course</h5>
                  <p className="text-gray-300 text-15">Learn web design in 1 hour with 25+ simple-to-use rules and guidelines — tons of amazing web design resources included!</p>
                </div>
                <div className="mb-24 pb-24 border-bottom border-gray-100">
                  <h5 className="mb-12 fw-bold">Description</h5>
                  <p className="text-gray-300 text-15 mb-8">Lorem ipsum dolor sit amet consectetur. Molestie pharetra gravida morbi eget. Diam quam non pretium malesuada. Elit porta aliquam cursus id. Fermentum adipiscing et nisl dignissim lectus ornare amet metus. Eget leo aliquet diam dictum et sit enim. Diam enim in eu rutrum est. Eu tristique euismod malesuada velit amet tellus. Ornare viverra dignissim odio magna dui fermentum non scelerisque scelerisque. Non pellentesque commodo ut sagittis felis.</p>
                  <p className="text-gray-300 text-15">Aliquam pharetra a urna varius proin quis. Diam amet blandit ullamcorper diam lectus at eget. Erat molestie purus et vitae lectus aenean in cursus. Arcu gravida tellus purus ultricies tristique. Ac turpis aliquam consectetur sit cras.</p>
                </div>
                <div className="mb-24 pb-24 border-bottom border-gray-100">
                  <h5 className="mb-16 fw-bold">This Course Includes</h5>
                  <div className="row g-20">
                    <div className="col-md-4 col-sm-6">
                      <ul>
                        <li className="flex-align gap-6 text-gray-300 text-15 mb-12">
                          <span className="flex-shrink-0 text-22 d-flex text-main-600"><i className="ph ph-checks"></i></span>
                          1.3 Hours on-demand video
                        </li>
                        <li className="flex-align gap-6 text-gray-300 text-15 mb-12">
                          <span className="flex-shrink-0 text-22 d-flex text-main-600"><i className="ph ph-checks"></i></span>
                          7 Design Exercise
                        </li>
                        <li className="flex-align gap-6 text-gray-300 text-15 mb-12">
                          <span className="flex-shrink-0 text-22 d-flex text-main-600"><i className="ph ph-checks"></i></span>
                          48 Articles
                        </li>
                        <li className="flex-align gap-6 text-gray-300 text-15 mb-12">
                          <span className="flex-shrink-0 text-22 d-flex text-main-600"><i className="ph ph-checks"></i></span>
                          120 Download Resources
                        </li>
                        <li className="flex-align gap-6 text-gray-300 text-15 mb-12">
                          <span className="flex-shrink-0 text-22 d-flex text-main-600"><i className="ph ph-checks"></i></span>
                          Access on Mobile
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-4 col-sm-6">
                      <ul>
                        <li className="flex-align gap-6 text-gray-300 text-15 mb-12">
                          <span className="flex-shrink-0 text-22 d-flex text-main-600"><i className="ph ph-checks"></i></span>
                          35 Quizes
                        </li>
                        <li className="flex-align gap-6 text-gray-300 text-15 mb-12">
                          <span className="flex-shrink-0 text-22 d-flex text-main-600"><i className="ph ph-checks"></i></span>
                          Lectures: 19
                        </li>
                        <li className="flex-align gap-6 text-gray-300 text-15 mb-12">
                          <span className="flex-shrink-0 text-22 d-flex text-main-600"><i className="ph ph-checks"></i></span>
                          Captions: Yes
                        </li>
                        <li className="flex-align gap-6 text-gray-300 text-15 mb-12">
                          <span className="flex-shrink-0 text-22 d-flex text-main-600"><i className="ph ph-checks"></i></span>
                          Video: 1.5 total hours
                        </li>
                        <li className="flex-align gap-6 text-gray-300 text-15 mb-12">
                          <span className="flex-shrink-0 text-22 d-flex text-main-600"><i className="ph ph-checks"></i></span>
                          Language English
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="">
                  <h5 className="mb-12 fw-bold">Instructor</h5>
                  <div className="flex-align gap-8">
                    <img src="/assets/images/thumbs/mentor-img1.png" alt="Instructor" className="w-44 h-44 rounded-circle object-fit-cover flex-shrink-0" />
                    <div className="d-flex flex-column">
                      <h6 className="text-15 fw-bold mb-0">Brooklyn Simmons</h6>
                      <span className="text-13 text-gray-300">Web Design Instructor</span>
                      <div className="flex-align gap-4 mt-4">
                        <span className="text-15 fw-bold text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                        <span className="text-13 fw-bold text-gray-600">4.9</span>
                        <span className="text-13 fw-bold text-gray-300">(12k)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Course Card End */}
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body p-0">
              <div className="course-item">
                <button 
                  type="button" 
                  className={`course-item__button ${activeDropdown === 'program' ? 'active' : ''} flex-align gap-4 w-100 p-16 border-bottom border-gray-100`}
                  onClick={() => toggleDropdown('program')}
                >
                  <span className="d-block text-start">
                    <span className="d-block h5 mb-0 text-line-1">The Courses Program</span>
                    <span className="d-block text-15 text-gray-300">2 / 5 | 4.4 min</span>
                  </span>
                  <span className={`course-item__arrow ms-auto text-20 text-gray-500 ${activeDropdown === 'program' ? 'rotate-180' : ''}`}>
                    <i className="ph ph-arrow-right"></i>
                  </span>
                </button>
                <div className={`course-item-dropdown ${activeDropdown === 'program' ? 'active' : ''} border-bottom border-gray-100`}>
                  <ul className="course-list p-16 pb-0">
                    <li className="course-list__item flex-align gap-8 mb-16 active">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          1. Welcome to this course
                          <span className="text-gray-300 fw-normal d-block">2.4 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16 active">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          2. Watch before you start
                          <span className="text-gray-300 fw-normal d-block">4.8 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          3. Basic development theory
                          <span className="text-gray-300 fw-normal d-block">5.9 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          4. Basic front-end fundamentals
                          <span className="text-gray-300 fw-normal d-block">3.6 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          5. What is front-end development?
                          <span className="text-gray-300 fw-normal d-block">10.6 min</span>
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="course-item">
                <button 
                  type="button" 
                  className={`course-item__button ${activeDropdown === 'design' ? 'active' : ''} flex-align gap-4 w-100 p-16 border-bottom border-gray-100`}
                  onClick={() => toggleDropdown('design')}
                >
                  <span className="d-block text-start">
                    <span className="d-block h5 mb-0 text-line-1">Web Design for Web Developers</span>
                    <span className="d-block text-15 text-gray-300">0 / 4 | 4.4 min</span>
                  </span>
                  <span className={`course-item__arrow ms-auto text-20 text-gray-500 ${activeDropdown === 'design' ? 'rotate-180' : ''}`}>
                    <i className="ph ph-arrow-right"></i>
                  </span>
                </button>
                <div className={`course-item-dropdown ${activeDropdown === 'design' ? 'active' : ''} border-bottom border-gray-100`}>
                  <ul className="course-list p-16 pb-0">
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          1. Welcome to this course
                          <span className="text-gray-300 fw-normal d-block">2.4 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          2. Watch before you start
                          <span className="text-gray-300 fw-normal d-block">4.8 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          3. Basic development theory
                          <span className="text-gray-300 fw-normal d-block">5.9 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          4. Basic front-end fundamentals
                          <span className="text-gray-300 fw-normal d-block">3.6 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          5. What is front-end development?
                          <span className="text-gray-300 fw-normal d-block">10.6 min</span>
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="course-item">
                <button 
                  type="button" 
                  className={`course-item__button ${activeDropdown === 'websites' ? 'active' : ''} flex-align gap-4 w-100 p-16 border-bottom border-gray-100`}
                  onClick={() => toggleDropdown('websites')}
                >
                  <span className="d-block text-start">
                    <span className="d-block h5 mb-0 text-line-1">Build Beautiful Websites!</span>
                    <span className="d-block text-15 text-gray-300">0 / 6 | 4.4 min</span>
                  </span>
                  <span className={`course-item__arrow ms-auto text-20 text-gray-500 ${activeDropdown === 'websites' ? 'rotate-180' : ''}`}>
                    <i className="ph ph-arrow-right"></i>
                  </span>
                </button>
                <div className={`course-item-dropdown ${activeDropdown === 'websites' ? 'active' : ''} border-bottom border-gray-100`}>
                  <ul className="course-list p-16 pb-0">
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          1. Welcome to this course
                          <span className="text-gray-300 fw-normal d-block">2.4 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          2. Watch before you start
                          <span className="text-gray-300 fw-normal d-block">4.8 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          3. Basic development theory
                          <span className="text-gray-300 fw-normal d-block">5.9 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          4. Basic front-end fundamentals
                          <span className="text-gray-300 fw-normal d-block">3.6 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          5. What is front-end development?
                          <span className="text-gray-300 fw-normal d-block">10.6 min</span>
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="course-item">
                <button 
                  type="button" 
                  className={`course-item__button ${activeDropdown === 'final' ? 'active' : ''} flex-align gap-4 w-100 p-16`}
                  onClick={() => toggleDropdown('final')}
                >
                  <span className="d-block text-start">
                    <span className="d-block h5 mb-0 text-line-1">Final Project</span>
                    <span className="d-block text-15 text-gray-300">0 / 3 | 4.4 min</span>
                  </span>
                  <span className={`course-item__arrow ms-auto text-20 text-gray-500 ${activeDropdown === 'final' ? 'rotate-180' : ''}`}>
                    <i className="ph ph-arrow-right"></i>
                  </span>
                </button>
                <div className={`course-item-dropdown ${activeDropdown === 'final' ? 'active' : ''}`}>
                  <ul className="course-list p-16 pb-0">
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          1. Welcome to this course
                          <span className="text-gray-300 fw-normal d-block">2.4 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          2. Watch before you start
                          <span className="text-gray-300 fw-normal d-block">4.8 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          3. Basic development theory
                          <span className="text-gray-300 fw-normal d-block">5.9 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          4. Basic front-end fundamentals
                          <span className="text-gray-300 fw-normal d-block">3.6 min</span>
                        </button>
                      </div>
                    </li>
                    <li className="course-list__item flex-align gap-8 mb-16">
                      <span className="circle flex-shrink-0 text-32 d-flex text-gray-100"><i className="ph ph-circle"></i></span>
                      <div className="w-100">
                        <button className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block text-start">
                          5. What is front-end development?
                          <span className="text-gray-300 fw-normal d-block">10.6 min</span>
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-24">
            <div className="card-body">
              <h4 className="mb-20">Featured courses</h4>
              <div className="rounded-16 overflow-hidden">
                <video id="featuredPlayer" className="player" playsInline controls data-poster="/assets/images/thumbs/featured-course.png">
                  <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4" type="video/mp4" />
                  <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4" type="video/webm" />
                </video>
              </div>
              <h5 className="mb-16 mt-20">Development for Beginners</h5>
              <p className="text-gray-300">The Fender Acoustic Guitar is the best choice for both beginners and professionals offering a great sound.</p>
              <button className="btn btn-main rounded-pill py-11 w-100 mt-16">Upgrade Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

