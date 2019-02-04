// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Root from './Root';
import store from './redux/store';

import { unregister } from './registerServiceWorker';

ReactDOM.render(<Root store={store} />, document.getElementById('root'));
unregister();
