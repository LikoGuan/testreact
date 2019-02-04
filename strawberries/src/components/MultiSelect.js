import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

class MultiSelect extends Component {
  render() {
    const { options, title, values, onChange } = this.props;
    const isSelected = Object.keys(values).some((key) => {
      return values[key];
    });
    return (
      <div className={`lat-dropdown-container${isSelected ? ' lat-daypicker-selected' : ''}`}>
        <DropdownButton title={title} id="dd-type">
          {options.map((option, index) =>
            <MenuItem key={index} eventKey={index} onClick={() => onChange(option)}>
              <input type="checkbox" checked={values[option]||false} />
              &nbsp; {option}
            </MenuItem>
          )}
        </DropdownButton>
      </div>
    );
  }
}

export default MultiSelect;
