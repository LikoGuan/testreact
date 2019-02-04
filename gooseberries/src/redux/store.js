import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { autoRehydrate } from 'redux-persist';

import reducers from './reducers';
import sagas from './sagas';

const initialState = {};
// create the saga middleware
window.onerror = window.onerror || (_ => _);
const sagaMiddleware = createSagaMiddleware({
  onError: window.onerror.bind(window)
});

// Middleware Configuration
const middlewares = [];
if (process.env.NODE_ENV !== 'production') {
  const { createLogger } = require('redux-logger');
  middlewares.push(createLogger());
}

// Store Enhancers
const enhancers = [autoRehydrate()];

let composeEnhancers = compose;

if (
  process.env.NODE_ENV === 'development' &&
  typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function'
) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}

// Store Instantiation
const store = createStore(
  reducers,
  initialState,
  composeEnhancers(
    applyMiddleware(...middlewares, sagaMiddleware),
    ...enhancers
  )
);

sagaMiddleware.run(sagas);

export default store;
