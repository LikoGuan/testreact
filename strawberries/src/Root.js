import React from "react";
import { Provider } from "react-redux";
import { IntlProvider } from "react-intl";
import { Router, Route } from "react-router-dom";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import Alert from "react-s-alert";

import { locale, messages } from "./i18n";
import WaitHydration from "./components/WaitRehydration";
import App from "./App";
import history from "./history";

import "./css/merchant.css";
import "./css/invoice.css";
import "./css/coupon.css";

export const Root = ({ loaded, store }) => (
  <Provider store={store}>
    <IntlProvider locale={locale} messages={messages[locale]}>
      <Router history={history}>
        <Route
          render={({ location }) => {
            let key = location.pathname.split("/")[1] || "";
            return (
              <div>
                <CSSTransitionGroup
                  transitionName="fade"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={500}
                >
                  {!loaded ? (
                    <div className="fullscreen dark" />
                  ) : (
                    <Route key={key} location={location} component={App} />
                  )}
                </CSSTransitionGroup>
                <Alert
                  stack={{ limit: 3, spacing: 10 }}
                  timeout={3000}
                  effect={"scale"}
                  position={"top-right"}
                  offset={10}
                />
              </div>
            );
          }}
        />
      </Router>
    </IntlProvider>
  </Provider>
);

export default WaitHydration(Root);
