import React from "react";

import Header from "./Header";
import Footer from "./Footer";
import { hasParameter } from "../util";

export default ({ mode, header }) => Component => props => (
  <div className={"fullscreen " + mode}>
    {!hasParameter(props, "nav", "hide") && (
      <Header header={header} {...props} />
    )}

    <div className="container lat-main-container">
      <Component {...props} />
    </div>
    <Footer mode={mode} />
  </div>
);
