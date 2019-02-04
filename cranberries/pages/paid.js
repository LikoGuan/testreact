import React from 'react';
import Page from '../components/Page';

class Invoice extends React.Component {
  render() {
    return (
      <Page>
        <div>
          <h2>Congratulation, Your invoice has been paid</h2>
          <p>Please contact the recipient to create a new invoice.</p>
          <button className="btn btn-success" type="submit">
            <a href="http://www.latipay.net/">
              &nbsp; &nbsp; &nbsp;What is Latipay &nbsp; &nbsp; &nbsp;
            </a>
          </button>
          <div className="placeholder" />
        </div>

        <style jsx>{`
          h2,
          p,
          div {
            text-align: center;
          }
          .placeholder {
            height: 100px;
          }
        `}</style>
      </Page>
    );
  }
}
export default Invoice;
