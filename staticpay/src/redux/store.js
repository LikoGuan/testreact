import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from './reducers';

const initialState = {};
// create the saga middleware
window.onerror = window.onerror || (_ => _);
const sagaMiddleware = createSagaMiddleware({
  onError: window.onerror.bind(window)
});

// Middleware Configuration
const middleware = [sagaMiddleware];

let composeEnhancers = compose;

const extension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
if (process.env === 'development' && typeof extension === 'function') {
  composeEnhancers = extension;
}

// Store Instantiation
const store = createStore(
  reducers,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
