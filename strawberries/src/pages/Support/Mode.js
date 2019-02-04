import React from "react";

import Header from "./Header";
import Footer from "./Footer";

export default ({ mode, header }) => Component => props => (
  <div className={"fullscreen " + mode}>
    <Header header={header} {...props} />

    <div className="container lat-main-container">
      <Component {...props} />
    </div>
    <Footer mode={mode} />
  </div>
);
