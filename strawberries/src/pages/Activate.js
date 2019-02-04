import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import api from '../api';

class Activate extends Component {
  constructor() {
    super();
    this.state = {};
  }
  async componentDidMount() {
    const { nonce } = this.props.match.params;
    const { data } = await api.me.activate(nonce);
    if (data.code) {
      this.setState({
        activated: false,
        message: data.message,
      });
    } else {
      this.setState({
        activated: true,
      });
    }
  }

  render() {
    const { activated, message } = this.state;
    return (
      <div className="row">
        <div className="col-sm-4 col-sm-offset-4 col-xs-10 col-xs-offset-1">
          <h2 className="lat-login-title">Welcome to Latipay</h2>
          {activated === true &&
            <div>
              <p>
                Your account has been verified. <br />
                You're now ready to explore Latipay
              </p>
              <Link className="btn btn-primary btn-sm lat-links" to="/login">
                Start your Latipay journey >
              </Link>
            </div>}
          {activated === false &&
            <p>
              {message}
            </p>}
        </div>
      </div>
    );
  }
}

export default Activate;
