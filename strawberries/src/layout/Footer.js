import React from 'react';
import { Link } from 'react-router-dom';

export default ({ mode }) => (
  <div>
    {mode !== 'dark' ? (
      <div className="container" />
    ) : (
      <div className="container footer">
        <div className="col-xs-8 col-md-8">
          <h4>Contact</h4>
          <div>
            <img className="icon icon--phone" src="/icon_phone.svg" alt="" />
            <ul className="phones">
              <li>
                <a href="tel://0800003114">0800 00 3114 (NZ)</a>
              </li>
              <li>
                <a href="tel://1800269283">1800 269 283 (AU)</a>
              </li>
            </ul>
          </div>
          <p>
            <img className="icon" src="/icon_email.svg" alt="" />
            <a href="mailto:customerservice@latipay.net">
              customerservice@latipay.net
            </a>
          </p>
        </div>
        <div
          className="col-xs-4 col-md-4"
          style={{
            textAlign: 'right'
          }}
        >
          <Link to="/support">Support</Link>
        </div>
      </div>
    )}
  </div>
);
