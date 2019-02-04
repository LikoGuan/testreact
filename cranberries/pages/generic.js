import React from 'react';
import Page from '../components/Page';
import { makeForm } from '../server/util';

class Generic extends React.Component {
  componentDidMount() {
    const { transaction } = this.props.url.query;
    makeForm(this.form, transaction.gateway_url, transaction.gatewaydata);
  }

  render() {
    return (
      <Page>
        <div ref={ref => (this.form = ref)}>
          <style jsx>{`
            div {
              margin-top: 5rem;
            }
          `}</style>
        </div>
      </Page>
    );
  }
}
export default Generic;
