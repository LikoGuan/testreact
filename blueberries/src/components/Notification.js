import React, { Component } from 'react';
import { connect } from 'react-redux';

import Snackbar from 'react-toolbox/lib/snackbar/Snackbar';
import ProgressBar from 'react-toolbox/lib/progress_bar/ProgressBar';

class Notification extends Component {
  constructor(props) {
    super(props);
    const { active } = this.props.notification;
    this.state = {
      active,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { active } = nextProps.notification;

    this.setState({
      active,
    });
  }
  handleSnackbarClick = (event, instance) => {
    this.setState({ active: false });
  };

  handleSnackbarTimeout = (event, instance) => {
    this.setState({ active: false });
  };

  handleClick = () => {
    this.setState({ active: true });
  };
  render() {
    const { active = false } = this.state;
    const { message, progress } = this.props.notification;
    return (
      <Snackbar
        action="Dismiss"
        active={active}
        label={message}
        timeout={2000}
        onClick={this.handleSnackbarClick}
        onTimeout={this.handleSnackbarTimeout}
        type="cancel"
      >
        {progress && <ProgressBar mode="indeterminate" />}
      </Snackbar>
    );
  }
}

export default connect(({ notification }) => ({ notification }))(Notification);

