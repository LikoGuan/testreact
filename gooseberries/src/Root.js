// @flow
import React from 'react';
import { Provider } from 'react-redux';

import App from './App';
import WaitHydration from './components/WaitRehydration';

/*::
type RootProps = {
  loaded: boolean,
  store: {},
};
*/

export const Root = ({ loaded, store } /*: RootProps */) =>
  <Provider store={store}>
    {loaded ? <App /> : <div />}
  </Provider>;

export default WaitHydration(Root);
