import React, { useEffect } from 'react';

const StudyStatistics = () => {
  useEffect(() => {
    const createLineChart = (chartId, chartColor) => {
      if (typeof window !== 'undefined' && window.ApexCharts) {
        const options = {
          series: [
            {
              name: 'Study',
              data: [8, 15, 9, 20, 10, 33, 13, 22, 8, 17, 10, 15],
            },
            {
              name: 'Test',
              data: [8, 24, 18, 40, 18, 48, 22, 38, 18, 30, 20, 28],
            },
          ],
          chart: {
            type: 'area',
            width: '100%',
            height: 300,
            sparkline: {
              enabled: false
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
          colors: ['#3D7FF9', chartColor],
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: 'smooth',
            width: 1,
            colors: ["#3D7FF9", chartColor],
            lineCap: 'round',
          },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.9,
              opacityTo: 0.2,
              stops: [0, 100]
            }
          },
          grid: {
            show: true,
            borderColor: '#E6E6E6',
            strokeDashArray: 3,
            position: 'back',
            xaxis: {
              lines: {
                show: false
              }
            },
            yaxis: {
              lines: {
                show: true
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
          markers: {
            colors: ["#3D7FF9", chartColor],
            strokeWidth: 3,
            size: 0,
            hover: {
              size: 8
            }
          },
          xaxis: {
            labels: {
              show: false,
              formatter: function (value) {
                return value;
              },
              style: {
                fontSize: "14px"
              }
            },
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            tooltip: {
              enabled: false,
            }
          },
          yaxis: {
            labels: {
              formatter: function (value) {
                return "$" + value + "Hr";
              },
              style: {
                fontSize: "14px"
              }
            },
          },
          tooltip: {
            x: {
              format: 'dd/MM/yy HH:mm'
            },
          },
          legend: {
            show: false,
            position: 'top',
            horizontalAlign: 'right',
            offsetX: -10,
            offsetY: -0
          }
        };

        const chart = new window.ApexCharts(document.querySelector(`#${chartId}`), options);
        chart.render();
      }
    };

    const timer = setTimeout(() => {
      createLineChart('doubleLineChart', '#27CFA7');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="card mt-24">
      <div className="card-body">
        <div className="mb-20 flex-between flex-wrap gap-8">
          <h4 className="mb-0">Study Statistics</h4>
          <div className="flex-align gap-16 flex-wrap">
            <div className="flex-align flex-wrap gap-16">
              <div className="flex-align flex-wrap gap-8">
                <span className="w-8 h-8 rounded-circle bg-main-600"></span>
                <span className="text-13 text-gray-600">Study</span>
              </div>
              <div className="flex-align flex-wrap gap-8">
                <span className="w-8 h-8 rounded-circle bg-main-two-600"></span>
                <span className="text-13 text-gray-600">Test</span>
              </div>
            </div>
            <select className="form-select form-control text-13 px-8 pe-24 py-8 rounded-8 w-auto">
              <option value="1">Yearly</option>
              <option value="1">Monthly</option>
              <option value="1">Weekly</option>
              <option value="1">Today</option>
            </select>
          </div>
        </div>
        
        <div id="doubleLineChart" className="tooltip-style y-value-left"></div>
      </div>
    </div>
  );
};

export default StudyStatistics;
