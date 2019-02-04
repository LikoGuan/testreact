import React, { Component } from 'react';
import PricingPlanForm from '../../forms/PricingPlan/PricingPlanForm';
import ProgressBar from 'react-toolbox/lib/progress_bar/ProgressBar';
import api from '../../api';

class PricingPlan extends Component {
  constructor(props) {
    super(props);
    this.state = { pricingPlan: undefined, fxRates: [] };
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
  }
  componentWillMount() {
    this.load();
  }
  async load() {
    // get dependencies first
    let resp = await api.fx_rate.list({ orgId: this.props.orgId });
    if (resp.status === 200) {
      // N.B. better to get fxRates from redux store.
      this.setState({ fxRates: resp.data });
    }
    resp = await api.pricing_plan.id(this.props.orgId);
    if (resp.status === 200) {
      this.setState({ pricingPlan: resp.data });
    }
  }
  async save(pricingPlan) {
    const resp = await api.pricing_plan.update(pricingPlan.merchantId, pricingPlan);
    if (resp.status === 200) {
      this.setState({ pricingPlan: resp.data });
    }
  }
  render() {
    const { fxRates, pricingPlan } = this.state;
    if (!(fxRates && pricingPlan)) {
      return <ProgressBar type="circular" mode="indeterminate" />;
    }
    pricingPlan.gatewayPricingPlans.map(gw =>
      gw.pricingPlans.map(function(pp) {
        let fxRate = fxRates.find(fx => fx.fxRateName === pp.merchantCcy + 'CNY' && fx.sourceType === pp.paymentMethod && fx.subType === pp.payType);
        if (!fxRate) {
          throw new Error('fx rate not found : ' + pp.merchantCcy + 'CNY');
        }
        return (pp.fxRate = fxRate.rate);
      })
    );
    return <PricingPlanForm onSubmit={this.save} initialValues={pricingPlan} fxRates={fxRates} />;
  }
}
// PricingPlan = connect(({constants})=>({constants}))(PricingPlan);
export default PricingPlan;
