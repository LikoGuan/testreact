import React from 'react';
import { DropdownButton } from 'react-bootstrap';
import DayPicker from 'react-day-picker';

const DateSelect = ({ from, to, resetDatePicker, handleDayClick }) => {
  const isSelected = from || to;

  return (
    <div className={`lat-dropdown-container${isSelected ? ' lat-daypicker-selected' : ''}`}>
      <DropdownButton title="Date" id="dd-date">
        <div className="lat-datepicker">
          <button className="btn btn-primary" onClick={resetDatePicker}>
            Reset
          </button>
          <DayPicker 
            numberOfMonths={2}
            selectedDays={[from, { from, to }]}
            onDayClick={handleDayClick}
            fixedWeeks />
        </div>
      </DropdownButton>
    </div>
  );
}

export default DateSelect;
