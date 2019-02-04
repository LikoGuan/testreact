import React from "react";

import Processing from "./Processing";
import CouponTransactions from "./CouponTransactions";
import History from "./History";

export const scrollToHistory = () => {
  const historyElement = document.getElementById("lat-page-history");
  window.scrollTo(0, historyElement.offsetTop);
};

const Transation = () => {
  return (
    <div>
      <div className="lat-content">
        <div>
          <h1 className="lat-greeting">Transaction</h1>
          <Processing />
          <CouponTransactions />
          <History />
        </div>
      </div>
    </div>
  );
};

export default Transation;
