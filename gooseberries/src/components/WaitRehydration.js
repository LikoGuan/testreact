import React, { Component } from 'react';
import { persistStore } from 'redux-persist';

export default WrappedComponent => {
  return class extends Component {
    constructor() {
      super();
      this.state = { rehydrated: false };
    }

    componentWillMount() {
      const { store } = this.props;
      persistStore(store, { blacklist: ['form'] }, () => {
        this.setState({ rehydrated: true });
      });
    }
    render() {
      return <WrappedComponent loaded={this.state.rehydrated} {...this.props} />;
    }
  };
};
