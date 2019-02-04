import React, { Component } from 'react';
import RPagination from 'react-js-pagination';
import theme from '../toolbox/theme';

class Pagination extends Component {
  render() {
    const { total = 0, current, size, onPageChange } = this.props;
    const { button, neutral, primary, flat } = theme.RTButton;
    const classname = `${button} ${neutral}  ${flat} `;
    const active = `${primary}  active`;
    return (
      <div style={{ marginBottom: 100 }}>
        <RPagination
          activePage={current}
          activeClass={active}
          itemClass={classname}
          itemsCountPerPage={size}
          totalItemsCount={total}
          pageRangeDisplayed={5}
          onChange={onPageChange}
        />
      </div>
    );
  }
}

export default Pagination;
