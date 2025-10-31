import React, { useEffect } from 'react';

const ProgressBar = () => {
  useEffect(() => {
    const createRadialChart = () => {
      if (typeof window !== 'undefined' && window.ApexCharts) {
        const options = {
          series: [100, 60, 25],
          chart: {
            height: 172,
            type: 'radialBar',
          },
          colors: ['#3D7FF9', '#27CFA7', '#020203'], 
          stroke: {
            lineCap: 'round',
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '30%',
              },
              dataLabels: {
                name: {
                  fontSize: '16px',
                },
                value: {
                  fontSize: '16px',
                },
                total: {
                  show: true,
                  formatter: function (w) {
                    return '82%'
                  }
                }
              }
            }
          },
          labels: ['Completed', 'In Progress', 'Not Started'],
        };

        const chart = new window.ApexCharts(document.querySelector("#radialMultipleBar"), options);
        chart.render();
      }
    };

    const timer = setTimeout(() => {
      createRadialChart();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="card mt-24">
      <div className="card-header border-bottom border-gray-100">
        <h5 className="mb-0">My Progress</h5>
      </div>
      <div className="card-body">
        <div id="radialMultipleBar"></div>

        <div className="">
          <h6 className="text-lg mb-16 text-center">
            <span className="text-gray-400">Total hour:</span> 6h 32 min
          </h6>
          <div className="flex-between gap-8 flex-wrap">
            <div className="flex-align flex-column">
              <h6 className="mb-6">60/60</h6>
              <span className="w-30 h-3 rounded-pill bg-main-600"></span>
              <span className="text-13 mt-6 text-gray-600">Completed</span>
            </div>
            <div className="flex-align flex-column">
              <h6 className="mb-6">60/60</h6>
              <span className="w-30 h-3 rounded-pill bg-main-two-600"></span>
              <span className="text-13 mt-6 text-gray-600">Completed</span>
            </div>
            <div className="flex-align flex-column">
              <h6 className="mb-6">60/60</h6>
              <span className="w-30 h-3 rounded-pill bg-gray-500"></span>
              <span className="text-13 mt-6 text-gray-600">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

