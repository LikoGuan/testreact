import React, { Component } from "react";

import IconButton from "../../components/IconButton";

import List from "./List";

const _STATUS = "created,pending";

class Processing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };
  }

  toggleTable = () => {
    this.setState({
      show: !this.state.show
    });
  };

  render() {
    const { show } = this.state;
    const icon = show ? "arrowup" : "arrowdown";
    const tableClass = show ? "lat-toggle-show" : "lat-toggle-hide";

    return (
      <div className="lat-content">
        <div className="page-header lat-page-header">
          <p>Pending </p>
          <div className="lat-header-op">
            <IconButton icon={icon} type="primary" onClick={this.toggleTable}>
              {show ? "HIDE" : "SHOW"}
            </IconButton>
          </div>
        </div>
        <div className={`lat-table ${tableClass}`}>
          <List status={_STATUS} />
        </div>
      </div>
    );
  }
}

export default Processing;
