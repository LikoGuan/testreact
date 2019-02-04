// https://github.com/react-toolbox/react-toolbox/issues/974
import React, { Component } from 'react';
import Autocomplete from 'react-toolbox/lib/autocomplete/Autocomplete';

class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      simple: props.value,
      multiple: props.value,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      simple: nextProps.value,
      multiple: nextProps.value,
    });
  }

  handleMultipleChange = value => {
    this.setState({ multiple: value }, () => {
      this.props.onChange(value);
    });
  };

  handleSimpleChange = value => {
    this.setState({ simple: value }, () => {
      this.props.onChange(value);
    });
  };

  render() {
    return (
      <Autocomplete
        label={this.props.label}
        source={this.props.source}
        multiple={this.props.multiple}
        showSelectedWhenNotInSource={this.props.showSelectedWhenNotInSource}
        showSuggestionsWhenValueIsSet={this.props.showSuggestionsWhenValueIsSet}
        value={this.props.multiple ? this.state.multiple : this.state.simple}
        onChange={this.props.multiple ? this.handleMultipleChange : this.handleSimpleChange}
      />
    );
  }
}

export default AutoComplete;
