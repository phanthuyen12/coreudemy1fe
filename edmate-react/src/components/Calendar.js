import React from 'react';

const Calendar = () => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="calendar">
          <div className="calendar__header">
            <button type="button" className="calendar__arrow left">
              <i className="ph ph-caret-left"></i>
            </button>
            <p className="display h6 mb-0">January 2024</p>
            <button type="button" className="calendar__arrow right">
              <i className="ph ph-caret-right"></i>
            </button>
          </div>
        
          <div className="calendar__week week">
            <div className="calendar__week-text">Su</div>
            <div className="calendar__week-text">Mo</div>
            <div className="calendar__week-text">Tu</div>
            <div className="calendar__week-text">We</div>
            <div className="calendar__week-text">Th</div>
            <div className="calendar__week-text">Fr</div>
            <div className="calendar__week-text">Sa</div>
          </div>
          <div className="days">
            {/* Calendar days will be generated here */}
            <div className="calendar__day">1</div>
            <div className="calendar__day">2</div>
            <div className="calendar__day">3</div>
            <div className="calendar__day">4</div>
            <div className="calendar__day">5</div>
            <div className="calendar__day">6</div>
            <div className="calendar__day">7</div>
            <div className="calendar__day">8</div>
            <div className="calendar__day">9</div>
            <div className="calendar__day">10</div>
            <div className="calendar__day">11</div>
            <div className="calendar__day">12</div>
            <div className="calendar__day">13</div>
            <div className="calendar__day">14</div>
            <div className="calendar__day">15</div>
            <div className="calendar__day">16</div>
            <div className="calendar__day">17</div>
            <div className="calendar__day">18</div>
            <div className="calendar__day">19</div>
            <div className="calendar__day">20</div>
            <div className="calendar__day">21</div>
            <div className="calendar__day">22</div>
            <div className="calendar__day">23</div>
            <div className="calendar__day">24</div>
            <div className="calendar__day">25</div>
            <div className="calendar__day">26</div>
            <div className="calendar__day">27</div>
            <div className="calendar__day">28</div>
            <div className="calendar__day">29</div>
            <div className="calendar__day">30</div>
            <div className="calendar__day">31</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

