import React from "react";
import PropTypes from "prop-types";

import IconButton from "./IconButton";

class SearchInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.fuzzy
    };
  }

  onTextChange = e => {
    const value = e.target.value;
    console.log(value);

    this.setState({
      value: value
    });

    const { onChange } = this.props;
    onChange(value);
  };

  onSearch = () => {
    const { value } = this.state;

    this.props.onChange(value);
  };

  render() {
    const { placeholder = "WALLET/TRANSACTION ID/ORDER ID" } = this.props;
    const { value } = this.state;

    return (
      <div className="lat-search-input">
        <input
          type="text"
          value={value}
          className="form-control"
          onChange={this.onTextChange}
          placeholder={placeholder}
        />
        <IconButton icon="search" type="primary" onClick={this.onSearch}>
          <span className="lat-search-text">Search</span>
        </IconButton>
      </div>
    );
  }
}

IconButton.propTypes = {
  onChange: PropTypes.func
};

export default SearchInput;
