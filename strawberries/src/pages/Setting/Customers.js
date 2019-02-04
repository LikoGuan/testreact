import React, { Component } from "react";
import { connect } from "react-redux";
import { Dropdown, MenuItem } from "react-bootstrap";
import Alert from "react-s-alert";

import IconButton from "../../components/IconButton";
import PermissionCheck from "../../components/PermissionCheck";
import { EditToggle } from "../../components/DropdownToggle";
import Modal from "../../modals";
import CustomersForm from "../../forms/Customers";
import api from "../../api";

export class Customers extends Component {
  constructor() {
    super();
    this.state = {
      customers: [],
      modal: false
    };
    this.onAddCustomers = this.onAddCustomers.bind(this);
    this.onEditCustomers = this.onEditCustomers.bind(this);
    this.onDeleteCustomers = this.onDeleteCustomers.bind(this);
    this.renderCustomers = this.renderCustomers.bind(this);
    this.onHide = this.onHide.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onToggleCustomers = this.onToggleCustomers.bind(this);
  }
  componentDidMount() {
    this.getCustomerss();
  }
  async getCustomerss() {
    const { data } = await api.customers.list();
    if (data.code === 0) {
      this.setState({
        customers: data.customersList
      });
    }
  }
  onAddCustomers() {
    const { wallets } = this.props;
    this.form = {};
    this.form.wallets = wallets.map(wallet => ({ ...wallet, selected: true }));
    this.setState({ modal: true });
  }
  onHide() {
    this.setState({ modal: false });
  }

  onEditCustomers(customers) {
    const { wallets } = this.props;
    const { customersId, email, customersName, roleId, disabled } = customers;
    this.form = {
      customersId,
      email,
      customersName,
      roleId,
      disabled
    };
    this.form.wallets = wallets.map(wallet => ({
      ...wallet,
      selected: customers.wallets.includes(wallet.accountCode)
    }));

    this.setState({ modal: true });
  }
  async onDeleteCustomers(customers) {
    const { customersId, customersName } = customers;
    const confirm = window.confirm(
      `are you sure you want to delet this customers: ${customersName}?`
    );
    if (!confirm) return;
    const { data } = await api.customers.delete(customersId);
    if (data.code === 0) {
      this.getCustomerss();
    } else {
      Alert.warning("delete customers failed");
    }
  }
  async onToggleCustomers(customers) {
    const { disabled, customersId, customersName } = customers;
    const confirm = window.confirm(
      `are you sure to ${
        disabled ? "enable" : "disable"
      } this customers: ${customersName}?`
    );
    if (!confirm) return;
    const { data } = await api.customers.disable(customersId, {
      disabled: !disabled
    });
    if (data.code === 0) {
      Alert.success("Succeeded");
      this.getCustomerss();
      this.setState({
        modal: false
      });
    } else {
      Alert.warning("Failed to change customers status");
    }
  }
  async onResendEmail(customers) {
    const { data } = await api.customers.email(customers.email);
    if (data.code === 0) {
      Alert.success("Succeeded");
      this.getCustomerss();
    } else {
      Alert.warning("Failed to resend email");
    }
  }
  async onSubmit(form) {
    let promise = null;
    const wallets = form.wallets
      .filter(wallet => wallet.selected)
      .map(wallet => wallet.accountCode);
    if (this.form.customersId) {
      // edit customers
      promise = api.customers.update(this.form.customersId, {
        ...form,
        wallets
      });
    } else {
      // create customers
      promise = api.customers.create({ ...form, wallets });
    }
    const { data } = await promise;
    if (data.code === 0) {
      this.getCustomerss();
      Alert.success(`Succeeded`);
    } else {
      Alert.warning(`Failed: ${data.message}`);
    }
    this.setState({
      modal: false
    });
  }
  renderCustomers(customers) {
    const { constants: { ROLES }, me: { roleId: currRoleId } } = this.props;
    const {
      customersId,
      customersName,
      email,
      roleId,
      disabled,
      activate
    } = customers;
    return (
      <tr key={customersId} className={disabled ? "info" : ""}>
        <td>{customersName}</td>
        <td className="hidden-xs">{email}</td>
        <td className="no-break">{ROLES[roleId] && ROLES[roleId].name}</td>
        <td className="lat-table-edit">
          {currRoleId < roleId && (
            <PermissionCheck permission="USER_OPERATE">
              <Dropdown pullRight id={`dropdown-${customersId}`}>
                <EditToggle bsRole="toggle" />
                <Dropdown.Menu>
                  {!disabled && (
                    <MenuItem>
                      <div onClick={() => this.onEditCustomers(customers)}>
                        Edit
                      </div>
                    </MenuItem>
                  )}
                  <MenuItem>
                    <div onClick={() => this.onToggleCustomers(customers)}>
                      {disabled ? "Enable" : "Disable"}
                    </div>
                  </MenuItem>
                  {!activate && (
                    <MenuItem>
                      <div onClick={() => this.onResendEmail(customers)}>
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

  render() {
    const { me } = this.props;
    return (
      <div>
        <div className="page-header lat-page-header">
          <p>Customers</p>
          <div className="lat-header-op">
            <PermissionCheck permission="USER_OPERATE">
              <IconButton onClick={this.onAddCustomers}>
                Add Customers
              </IconButton>
            </PermissionCheck>
          </div>
        </div>
        <div className="lat-table">
          <table className="table  table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th className="hidden-xs">Email</th>
                <th>Role</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {this.state.customers
                .sort((a, b) => {
                  const _a = (a.disabled ? -2 : 0) + (a.activate ? 0 : -1);
                  const _b = (b.disabled ? -2 : 0) + (b.activate ? 0 : -1);
                  if (_a > _b) return -1;
                  else if (_a === _b) return 0;
                  else return 1;
                })
                .filter(customers => customers.customersId !== me.customersId)
                .map(this.renderCustomers)}
            </tbody>
          </table>
          <div className="lat-footer-op" />
          <Modal show={this.state.modal} onHide={this.onHide} title="Customers">
            <CustomersForm onSubmit={this.onSubmit} initialValues={this.form} />
          </Modal>
        </div>
      </div>
    );
  }
}
export default connect(({ constants, me, wallets }) => ({
  constants,
  me,
  wallets: wallets.data.filter(wallet => !wallet.disabled)
}))(Customers);
