import React from 'react';
import { Provider } from 'react-redux';

import WaitHydration from './components/WaitRehydration';
import App from './App';

export const Root = ({ loaded, store }) =>
  <Provider store={store}>
    {loaded ? <App /> : <div />}
  </Provider>;

export default WaitHydration(Root);
