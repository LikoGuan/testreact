import React from 'react';
import ReactDOM from 'react-dom';

// import styling
import 'blackberries';
// import './blackberries/index.css';

import { unregister } from './registerServiceWorker';
import Root from './Root';
import api from './api';
import createStore from './redux/store';

require('intl')

const store = createStore();
/*
** can not import store in api.js
** as it will cause circular dependencies
** store -> saga -> api -> store
*/
api.init(store);

ReactDOM.render(<Root store={store} />, document.getElementById('root'));

unregister();
