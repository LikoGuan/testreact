import React, { Component } from "react";
import { connect } from "react-redux";
import Alert from "react-s-alert";

import api from "../../api";
import Modal from "../../modals";
import SetPwdForm from "../../forms/SetPwd";
import NotificationForm from "../../forms/Notifications";
import MeForm from "../../forms/Me";
import OnlineStoreForm from "../../forms/OnlineStore";
import { actions as meActions } from "../../redux/ducks/me";

import IconButton from "../../components/IconButton";

class Me extends Component {
  constructor() {
    super();
    this.state = {
      pwdmodal: false,
      ntfmodal: false,
      memodal: false,
      hvmodal: false,
      notifications: {
        invoice: true,
        settlement: false,
        online: true,
        system: false,
        activity: true,
        account: false
      }
    };
    this.onShowChangePwd = this.onShowChangePwd.bind(this);
    this.onShowNotification = this.onShowNotification.bind(this);
    this.onShowChangeMe = this.onShowChangeMe.bind(this);
    this.onShowHiddenValue = this.onShowHiddenValue.bind(this);

    this.onHide = this.onHide.bind(this);
    this.fetchNotifications = this.fetchNotifications.bind(this);

    this.onChangePwd = this.onChangePwd.bind(this);
    this.onChangeNotification = this.onChangeNotification.bind(this);
    this.onChangeMe = this.onChangeMe.bind(this);
  }
  componentDidMount() {
    this.fetchNotifications();
  }
  onShowChangePwd() {
    this.setState({
      pwdmodal: true
    });
  }
  onShowNotification() {
    this.setState({
      ntfmodal: true
    });
  }
  onShowHiddenValue() {
    this.setState({
      hvmodal: true
    });
  }
  onShowChangeMe() {
    const { me: { userName } } = this.props;
    this.me = {
      userName
    };
    this.setState({
      memodal: true
    });
  }
  onHide() {
    this.setState({
      pwdmodal: false,
      ntfmodal: false,
      memodal: false,
      hvmodal: false
    });
  }
  async fetchNotifications() {
    const { data } = await api.notifications.get();
    if (data.code === 0) {
      this.setState({
        notifications: data.notifications
      });
    }
  }
  async onChangePwd(form) {
    const { password } = form;
    const { data } = await api.me.changePwd({
      password
    });
    if (data.code === 0) {
      Alert.success("Password changed");
    } else {
      Alert.warning("Failed, Please try it later");
    }
    this.setState({
      pwdmodal: false
    });
  }
  async onChangeNotification(form) {
    const { data } = await api.notifications.update({ notifications: form });
    if (data.code === 0) {
      this.setState({
        notifications: form,
        ntfmodal: false
      });

      Alert.success("Notification settings changed");
    } else {
      Alert.warning("Failed to change Notification settings!");
    }
  }
  async onChangeMe(form) {
    const { data } = await api.me.username(form);
    if (!data.code) {
      this.props.fetchMe();
      Alert.success("Profile changed!");
    } else {
      Alert.warning("Failed to change profile!");
    }
    this.setState({
      memodal: false
    });
  }
  render() {
    const {
      me: { userName, userId, email, roleId, secretKey },
      constants: { ROLES }
    } = this.props;
    return (
      <div>
        <div className="page-header lat-page-header">
          <p>Your Details</p>
          <div className="lat-header-op">
            <IconButton
              type="primary"
              icon="edit"
              onClick={this.onShowChangeMe}
            >
              Edit
            </IconButton>
          </div>
        </div>
        <div className="lat-table">
          <table className="table  table-hover ">
            <tbody>
              <tr>
                <td>Name</td>
                <td>{userName}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{email}</td>
              </tr>
              <tr>
                <td>Role</td>
                <td>{ROLES[roleId] && ROLES[roleId].name}</td>
              </tr>
              <tr>
                <td>API Key</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm "
                    onClick={this.onShowHiddenValue}
                  >
                    Show Hidden Values
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <button
              className="btn btn-primary btn-sm "
              onClick={this.onShowChangePwd}
            >
              Change Password >
            </button>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm "
              onClick={this.onShowNotification}
            >
              Notifications >
            </button>
          </div>
          <Modal
            show={this.state.hvmodal}
            onHide={this.onHide}
            title="Your online store"
          >
            <OnlineStoreForm initialValues={{ secretKey, userId }} />
          </Modal>
          <Modal show={this.state.memodal} onHide={this.onHide} title="Profile">
            <MeForm onSubmit={this.onChangeMe} initialValues={this.me} />
          </Modal>
          <Modal
            show={this.state.pwdmodal}
            onHide={this.onHide}
            title="Change Password"
          >
            <SetPwdForm onSubmit={this.onChangePwd} />
          </Modal>
          <Modal
            show={this.state.ntfmodal}
            onHide={this.onHide}
            title="Notifications"
          >
            <NotificationForm
              onSubmit={this.onChangeNotification}
              initialValues={this.state.notifications}
            />
          </Modal>
        </div>
      </div>
    );
  }
}

export default connect(({ me, constants }) => ({ me, constants }), meActions)(
  Me
);
