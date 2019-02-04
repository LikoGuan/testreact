import React, { Component } from "react";
import { connect } from "react-redux";
import { Dropdown, MenuItem } from "react-bootstrap";
import Alert from "react-s-alert";

import IconButton from "../../components/IconButton";
import PermissionCheck from "../../components/PermissionCheck";
import PermissionDescription from "../../components/PermissionDescription";
import { EditToggle } from "../../components/DropdownToggle";
import Modal from "../../modals";
import UserForm from "../../forms/User";
import api from "../../api";

export class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      modal: false,
      modalContent: null
    };
    this.onAddUser = this.onAddUser.bind(this);
    this.onEditUser = this.onEditUser.bind(this);
    this.onDeleteUser = this.onDeleteUser.bind(this);
    this.renderUser = this.renderUser.bind(this);
    this.onHide = this.onHide.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onToggleUser = this.onToggleUser.bind(this);
  }
  componentDidMount() {
    this.getUsers();
  }
  async getUsers() {
    const { data } = await api.users.list();
    if (data.code === 0) {
      this.setState({
        users: data.userList
      });
    }
  }
  onAddUser() {
    const { wallets } = this.props;
    this.form = {
      wallets
    };
    this.setState({
      modal: true,
      modalContent: null
    });
  }
  onHide() {
    this.setState({
      modal: false
    });
  }

  onEditUser(user) {
    const { wallets } = this.props;
    const { userId, email, userName, roleId, disabled } = user;
    this.form = {
      userId,
      email,
      userName,
      roleId,
      disabled
    };
    this.form.wallets = wallets.map(wallet => ({
      ...wallet,
      selected: user.wallets.includes(wallet.accountCode)
    }));

    this.setState({
      modal: true,
      modalContent: null
    });
  }
  async onDeleteUser(user) {
    const { userId, userName } = user;
    const confirm = window.confirm(
      `are you sure you want to delet this user: ${userName}?`
    );
    if (!confirm) return;
    const { data } = await api.users.delete(userId);
    if (data.code === 0) {
      this.getUsers();
    } else {
      Alert.warning("delete user failed");
    }
  }
  async onToggleUser(user) {
    const { disabled, userId, userName } = user;
    const confirm = window.confirm(
      `are you sure to ${
        disabled ? "enable" : "disable"
      } this user: ${userName}?`
    );
    if (!confirm) return;
    const { data } = await api.users.disable(userId, {
      disabled: !disabled
    });
    if (data.code === 0) {
      Alert.success("Succeeded");
      this.getUsers();
      this.setState({
        modal: false
      });
    } else {
      Alert.warning("Failed to change user status");
    }
  }
  async onResendEmail(user) {
    const { data } = await api.users.email(user.email);
    if (data.code === 0) {
      Alert.success("Succeeded");
      this.getUsers();
    } else {
      Alert.warning("Failed to resend email");
    }
  }
  async onSubmit(form) {
    let promise = null;
    const wallets = form.wallets
      .filter(wallet => wallet.selected)
      .map(wallet => wallet.accountCode);
    const isEdit = this.form.userId;
    if (isEdit) {
      // edit user
      promise = api.users.update(this.form.userId, { ...form, wallets });
    } else {
      // create user
      promise = api.users.create({ ...form, wallets });
    }
    const { data } = await promise;
    if (data.code === 0) {
      this.getUsers();
      Alert.success(`Succeeded`);

      if (isEdit) {
        this.setState({
          modal: false
        });
      } else {
        this.setState({
          modalContent: "createUserDoneTips"
        });
      }
    } else {
      Alert.warning(`Failed: ${data.message}`);
    }
  }
  renderUser(user) {
    const { constants: { ROLES }, me: { roleId: currRoleId } } = this.props;
    const { userId, userName, email, roleId, disabled, activate } = user;
    return (
      <tr key={userId} className={disabled ? "info" : ""}>
        <td>{userName}</td>
        <td className="hidden-xs">{email}</td>
        <td className="no-break">{ROLES[roleId] && ROLES[roleId].name}</td>
        <td className="lat-table-edit">
          {currRoleId < roleId && (
            <PermissionCheck permission="USER_OPERATE">
              <Dropdown pullRight id={`dropdown-${userId}`}>
                <EditToggle bsRole="toggle" />
                <Dropdown.Menu>
                  {!disabled && (
                    <MenuItem>
                      <div onClick={() => this.onEditUser(user)}>Edit</div>
                    </MenuItem>
                  )}
                  <MenuItem>
                    <div onClick={() => this.onToggleUser(user)}>
                      {disabled ? "Enable" : "Disable"}
                    </div>
                  </MenuItem>
                  {!activate && (
                    <MenuItem>
                      <div onClick={() => this.onResendEmail(user)}>
                        Resend email
                      </div>
                    </MenuItem>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </PermissionCheck>
          )}
        </td>
      </tr>
    );
  }

  showPermissionDescription = () => {
    this.setState(preState => {
      return {
        permissionDescriptionVisible: !preState.permissionDescriptionVisible
      };
    });
  };

  showPermissionDescriptionFromFooter = () => {
    const { modal } = this.state;
    if (modal) return;

    this.setState({
      modal: true,
      modalContent: "permissions"
    });
  };

  modalContent = () => {
    const { modalContent } = this.state;

    if (modalContent === "permissions") {
      return <PermissionDescription />;
    } else if (modalContent === "createUserDoneTips") {
      return (
        <p>
          A verification email has be sent to the email address, Please log in
          to your email account and verify it.
        </p>
      );
    } else {
      return (
        <UserForm
          onSubmit={this.onSubmit}
          initialValues={this.form}
          permissionDescriptionVisible={this.state.permissionDescriptionVisible}
          showPermissionDescription={this.showPermissionDescription}
        />
      );
    }
  };

  render() {
    const users = this.state.users
      .filter(user => user.userId !== this.props.me.userId)
      .sort((a, b) => {
        const _a =
          (a.disabled ? -2 : 0) +
          (a.activate ? 0 : -1) +
          (99 - a.roleId) +
          a.userId;
        const _b =
          (b.disabled ? -2 : 0) +
          (b.activate ? 0 : -1) +
          (99 - b.roleId) +
          b.userId;

        if (_a > _b) return -1;
        else if (_a === _b) return 0;
        else return 1;
      });

    const { modal, modalContent } = this.state;

    return (
      <div>
        <div className="page-header lat-page-header">
          <p>Users</p>
          <div className="lat-header-op">
            <PermissionCheck permission="USER_OPERATE">
              <IconButton onClick={this.onAddUser}>Add Users</IconButton>
            </PermissionCheck>
          </div>
        </div>
        <div className="lat-table">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th className="hidden-xs">Email</th>
                <th>Role</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>{users.map(this.renderUser)}</tbody>
          </table>
          <div
            className="lat-footer-op footer-tips cursor-help"
            onClick={this.showPermissionDescriptionFromFooter}
          >
            <span className="asterisk">*</span> Role permissions description
          </div>
          <Modal
            show={modal}
            onHide={this.onHide}
            title={modalContent === "permissions" ? "Role description" : "User"}
          >
            {this.modalContent()}
          </Modal>
        </div>
      </div>
    );
  }
}

export default connect(({ constants, me, wallets }) => {
  return {
    constants,
    me,
    wallets: wallets.data.filter(wallet => !wallet.disabled)
  };
})(Users);
