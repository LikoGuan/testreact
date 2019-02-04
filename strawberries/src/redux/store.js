import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { autoRehydrate } from "redux-persist";
import { createLogger } from "redux-logger";
import reducers from "./reducers";
import sagas from "./sagas";

export default (initialState = {}) => {
  // create the saga middleware
  window.onerror = window.onerror || (_ => _);
  const sagaMiddleware = createSagaMiddleware({
    onError: window.onerror.bind(window)
  });

  // Middleware Configuration
  const middleware = [];

  // Store Enhancers
  const enhancers = [autoRehydrate()];

  let composeEnhancers = compose;

  if (process.env.NODE_ENV !== "production") {
    middleware.push(
      createLogger({
        collapsed: (getState, action) =>
          action.type.indexOf("@@redux-form") === 0
      })
    );

    if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === "function") {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
  }

  // Store Instantiation
  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware, sagaMiddleware),
      ...enhancers
    )
  );

  sagaMiddleware.run(sagas);

  return store;
};
