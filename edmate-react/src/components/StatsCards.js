import React, { useEffect } from 'react';

const StatsCards = () => {
  useEffect(() => {
    // 创建图表
    const createChart = (chartId, chartColor) => {
      if (typeof window !== 'undefined' && window.ApexCharts) {
        const options = {
          series: [{
            name: 'series1',
            data: [18, 25, 22, 40, 34, 55, 50, 60, 55, 65],
          }],
          chart: {
            type: 'area',
            width: 80,
            height: 42,
            sparkline: {
              enabled: true
            },
            toolbar: {
              show: false
            },
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth',
            width: 1,
            colors: [chartColor],
            lineCap: 'round'
          },
          grid: {
            show: true,
            borderColor: 'transparent',
            strokeDashArray: 0,
            position: 'back',
            xaxis: {
              lines: {
                show: false
              }
            },
            yaxis: {
              lines: {
                show: false
              }
            },
            row: {
              colors: undefined,
              opacity: 0.5
            },
            column: {
              colors: undefined,
              opacity: 0.5
            },
            padding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }
          },
          fill: {
            type: 'gradient',
            colors: [chartColor],
            gradient: {
              shade: 'light',
              type: 'vertical',
              shadeIntensity: 0.5,
              gradientToColors: [`${chartColor}00`],
              inverseColors: false,
              opacityFrom: 0.5,
              opacityTo: 0.3,
              stops: [0, 100]
            }
          },
          markers: {
            colors: [chartColor],
            strokeWidth: 2,
            size: 0,
            hover: {
              size: 8
            }
          },
          xaxis: {
            labels: {
              show: false
            },
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            tooltip: {
              enabled: false
            }
          },
          yaxis: {
            labels: {
              show: false
            }
          },
          tooltip: {
            x: {
              format: 'dd/MM/yy HH:mm'
            }
          }
        };

        const chart = new window.ApexCharts(document.querySelector(`#${chartId}`), options);
        chart.render();
      }
    };

    // 延迟执行以确保DOM已加载
    const timer = setTimeout(() => {
      createChart('complete-course', '#2FB2AB');
      createChart('earned-certificate', '#27CFA7');
      createChart('course-progress', '#6142FF');
      createChart('community-support', '#FA902F');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="row gy-4">
      <div className="col-xxl-3 col-sm-6">
        <div className="card">
          <div className="card-body">
            <h4 className="mb-2">155+</h4>
            <span className="text-gray-600">Completed Courses</span>
            <div className="flex-between gap-8 mt-16">
              <span className="flex-shrink-0 w-48 h-48 flex-center rounded-circle bg-main-600 text-white text-2xl">
                <i className="ph-fill ph-book-open"></i>
              </span>
              <div id="complete-course" className="remove-tooltip-title rounded-tooltip-value"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-sm-6">
        <div className="card">
          <div className="card-body">
            <h4 className="mb-2">39+</h4>
            <span className="text-gray-600">Earned Certificate</span>
            <div className="flex-between gap-8 mt-16">
              <span className="flex-shrink-0 w-48 h-48 flex-center rounded-circle bg-main-two-600 text-white text-2xl">
                <i className="ph-fill ph-certificate"></i>
              </span>
              <div id="earned-certificate" className="remove-tooltip-title rounded-tooltip-value"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-sm-6">
        <div className="card">
          <div className="card-body">
            <h4 className="mb-2">25+</h4>
            <span className="text-gray-600">Course in Progress</span>
            <div className="flex-between gap-8 mt-16">
              <span className="flex-shrink-0 w-48 h-48 flex-center rounded-circle bg-purple-600 text-white text-2xl">
                <i className="ph-fill ph-graduation-cap"></i>
              </span>
              <div id="course-progress" className="remove-tooltip-title rounded-tooltip-value"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-sm-6">
        <div className="card">
          <div className="card-body">
            <h4 className="mb-2">18k+</h4>
            <span className="text-gray-600">Community Support</span>
            <div className="flex-between gap-8 mt-16">
              <span className="flex-shrink-0 w-48 h-48 flex-center rounded-circle bg-warning-600 text-white text-2xl">
                <i className="ph-fill ph-users-three"></i>
              </span>
              <div id="community-support" className="remove-tooltip-title rounded-tooltip-value"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;

