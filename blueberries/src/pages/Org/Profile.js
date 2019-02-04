import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Snackbar from 'react-toolbox/lib/snackbar/Snackbar';
import Dialog from 'react-toolbox/lib/dialog/Dialog';

import api from '../../api';
import ProfileForm from '../../forms/Profile';
import RiskAssessmentForm from '../../forms/Profile/RiskAssessment';
import { actions as constantsActions } from '../../redux/ducks/constants';
import { isEmpty } from '../../util';

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      savedMessage: false,
      riskAssessment: null,
      riskAssessmentModal: false,
      isUpdate: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    this.getOrganisationById();
  }

  async getOrganisationById() {
    const { orgId } = this.props;
    const { data = {} } = await api.organisations.id(orgId);
    this.setState({
      data,
      isUpdate: data.updated !== null,
    });
  }

  async getRiskAssessmentByOrganisationId() {
    const { orgId } = this.props;
    const { data = {} } = await api.assessments.id(orgId);

    // add DropDown answers
    if (data.organisationAssessmentId !== null) {
      data.questions.map(q => {
        if (q.answer !== null) {
          data[q.id] = q.answer;
        }
        return q;
      });
    }

    this.setState({
      riskAssessmentData: data,
      riskAssessmentModal: true,
    });
  }

  async save(orgId, form) {
    const resp = await api.organisations.update(orgId, form);
    if (resp.status === 200) {
      this.setState({ savedMessage: true });
    } else {
      this.setState({
        error: resp.statusText,
      });
    }
  }

  async saveRiskAssessment(organisationAssessmentId, form) {
    const resp = isEmpty(organisationAssessmentId)
      ? await api.assessments.create(form)
      : await api.assessments.update(organisationAssessmentId, form);

    if (resp.status === 200) {
      this.setState({
        riskAssessmentModal: false,
        savedMessage: true,
      });
      // refresh
      this.getOrganisationById();
    } else {
      this.setState({
        error: resp.statusText,
      });
    }
  }

  onSubmit = form => {
    const { orgId } = this.props;
    this.save(orgId, form);
  };

  onRiskAssessmentSubmit = form => {
    // build request
    let request = {
      assessmentId: form.assessmentId,
      organisationId: form.organisationId,
      answers: [],
    };

    // extract answers
    for (var key in form) {
      // only answers id (number)
      if (isNaN(key)) {
        continue;
      }
      request.answers.push({
        questionId: key,
        answerOptionId: form[key],
      });
    }
    this.saveRiskAssessment(form.organisationAssessmentId, request);
  };

  handleSnackbarTimeout = (event, instance) => {
    this.setState({ savedMessage: false });
  };

  showRiskAssessmentModal(event, value) {
    this.getRiskAssessmentByOrganisationId();
  }

  hideRiskAssessmentModal() {
    this.setState({
      riskAssessmentModal: false,
    });
  }

  render() {
    const { data, riskAssessmentData, isUpdate } = this.state;
    const { constants } = this.props;
    if (!data) {
      return <div />;
    }
    return (
      <section>
        <Grid fluid>
          <Row around="xs">
            <Col xs={12} sm={10}>
              <ProfileForm
                onSubmit={this.onSubmit}
                initialValues={data}
                showRiskAssessmentModal={this.showRiskAssessmentModal.bind(this)}
                constants={constants}
                isUpdate={isUpdate}
              />
              <Dialog
                active={this.state.riskAssessmentModal}
                onEscKeyDown={this.hideRiskAssessmentModal.bind(this)}
                onOverlayClick={this.hideRiskAssessmentModal.bind(this)}
                title="Risk Assessment"
              >
                <RiskAssessmentForm
                  onSubmit={this.onRiskAssessmentSubmit}
                  initialValues={riskAssessmentData}
                  hideRiskAssessmentModal={this.hideRiskAssessmentModal.bind(this)}
                />
              </Dialog>
              <Snackbar
                active={this.state.savedMessage}
                label="Organisation has been saved successfully!"
                timeout={3000}
                onTimeout={this.handleSnackbarTimeout}
                type="accept"
              />
            </Col>
          </Row>
        </Grid>
      </section>
    );
  }
}
export default connect(({ constants }) => ({ constants }), constantsActions)(Profile);
