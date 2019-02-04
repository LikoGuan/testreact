// @flow
import 'babel-polyfill';
import 'url-search-params-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import store from './redux/store';

import './index.css';

ReactDOM.render(<App store={store} />, document.getElementById('root'));
