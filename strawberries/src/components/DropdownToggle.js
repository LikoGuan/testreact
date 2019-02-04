import React from 'react';
import Icons from '../icons';

export class CustomToggle extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onClick(e);
  }

  render() {
    return (
      <a href="" onClick={this.handleClick}>
        {this.props.children}
      </a>
    );
  }
}

export const EditToggle = props =>
  <CustomToggle {...props}>
    <div className="btn-sm btn-primary">
      {props.icon ? props.icon : Icons.edit}
    </div>
  </CustomToggle>;
