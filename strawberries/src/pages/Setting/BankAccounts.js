import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, MenuItem } from 'react-bootstrap';
import Alert from 'react-s-alert';
import cronstrue from 'cronstrue';

import IconButton from '../../components/IconButton';
import PermissionCheck from '../../components/PermissionCheck';
import { EditToggle } from '../../components/DropdownToggle';
import Modal from '../../modals';
import BankAccountForm from '../../forms/BankAccount';
import { actions as bankaccontsActions } from '../../redux/ducks/bankaccounts';
import { actions as ossActions } from '../../redux/ducks/oss';
import { CURRENCIES, WITHDRAWAL_TYPE } from '../../constants';
import api from '../../api';

export class BankAccounts extends Component {
  constructor() {
    super();
    this.state = {
      bankAccounts: [],
      modal: false,
      showTips: false
    };
    this.onAddBankAccount = this.onAddBankAccount.bind(this);
    this.onEditBankAccount = this.onEditBankAccount.bind(this);
    this.onDeleteBankAccount = this.onDeleteBankAccount.bind(this);
    this.renderBankAccount = this.renderBankAccount.bind(this);
    this.onHide = this.onHide.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onAddBankAccount() {
    this.form = {
      isDefault: this.props.bankaccounts.length === 0
    };
    this.props.fetchOSS();
    this.setState({ showTips: false, modal: true });
  }
  onHide() {
    this.setState({ modal: false, showTips: false, autoModal: false });
  }

  onEditBankAccount(bankaccount) {
    this.form = { ...bankaccount, isDefault: bankaccount.defaultEnable };
    this.props.fetchOSS();
    this.setState({ showTips: false, modal: true });
  }
  async onDeleteBankAccount(bankaccount) {
    const confirm = window.confirm(
      `are you sure to remove this bank account ${bankaccount.accountNumber}?`
    );
    if (!confirm) return;
    const { data } = await api.bankaccounts.delete(bankaccount.bankAccountId);
    if (data.code === 0) {
      this.props.fetchBankaccounts();
      Alert.success('Succeeded!');
    } else {
      Alert.warning('delete bank account failed');
    }
  }

  showAutowithdrawalSettings = async () => {
    this.setState({
      autoModal: true
    });

    this.props.fetchAutoWithdraw();

    // const { data } = await api.bankaccounts.withdrawSetting();
    // if (data.code === 0) {
    //   this.setState({
    //     autoModalTips: null,
    //     withdrawalSettings: data
    //   });
    // } else {
    //   this.setState({
    //     autoModalTips: "Loading withdrawal settings failed",
    //     withdrawalSettings: null
    //   });
    // }
  };

  async onSubmit(form) {
    if (form) {
      if (form.isDefault)
        form.isDefault = 1; //fix bug, api did not support bool
      else form.isDefault = 0;
    }

    let promise = null;
    const isEdit = this.form.bankAccountId;
    if (isEdit) {
      // edit
      promise = api.bankaccounts.update(this.form.bankAccountId, form);
    } else {
      // create
      promise = api.bankaccounts.create(form);
    }
    const { data } = await promise;
    if (data.code === 0) {
      Alert.success('Succeeded!');
      this.props.fetchBankaccounts();

      if (isEdit) {
        this.setState({
          modal: false
        });
      } else {
        this.setState({
          showTips: true
        });
      }
    } else {
      Alert.warning('Failed, Please try it later');
    }
  }
  renderBankAccount(bankaccount) {
    const {
      bankAccountId,
      accountNumber,
      accountName,
      registerBank,
      status,
      defaultEnable
    } = bankaccount;
    const isVerified = status === 1;
    return (
      <tr key={bankAccountId} className={isVerified ? '' : 'info'}>
        <td>
          {accountName}
          {defaultEnable === 1 && <span className="green"> (Default)</span>}
          {!isVerified && (
            <span>
              <br />Verification Pending
            </span>
          )}
        </td>
        <td className="hidden-xs">{registerBank}</td>
        <td className="hidden-xs">{accountNumber}</td>
        <td className="lat-table-edit">
          {!isVerified && (
            <PermissionCheck permission="BANK_OPERATE">
              <Dropdown pullRight id={`dropdown-${bankAccountId}`}>
                <EditToggle bsRole="toggle" />

                <Dropdown.Menu>
                  <MenuItem>
                    <div onClick={() => this.onEditBankAccount(bankaccount)}>
                      Edit
                    </div>
                  </MenuItem>

                  <MenuItem>
                    <div onClick={() => this.onDeleteBankAccount(bankaccount)}>
                      Delete
                    </div>
                  </MenuItem>
                </Dropdown.Menu>
              </Dropdown>
            </PermissionCheck>
          )}
        </td>
      </tr>
    );
  }

  render() {
    const { modal, showTips, autoModal } = this.state;

    const {
      bankaccounts = [],
      withdrawType,
      walletsMap,
      bankaccountsMap,
      walletBankBinds,
      withdrawEmail,
      withdrawConfigsMap
    } = this.props;

    return (
      <div>
        <div className="page-header lat-page-header">
          <p>Bank Accounts</p>
          <div className="lat-header-op">
            <PermissionCheck permission="BANK_OPERATE">
              <IconButton onClick={this.onAddBankAccount}>
                Add Bank Account
              </IconButton>
            </PermissionCheck>
          </div>
        </div>
        <div className="lat-table">
          <table className="table  table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th className="hidden-xs">Bank name</th>
                <th className="hidden-xs">Account Number</th>
                <th>Edit</th>
              </tr>
            </thead>
            <PermissionCheck permission="BANK_VIEW">
              <tbody>
                {bankaccounts
                  .sort((a, b) => {
                    const statusRate = 10000000;
                    const defaultRate = 1000000;
                    const aRate =
                      a.status * statusRate +
                      a.defaultEnable * defaultRate +
                      a.bankAccountId;
                    const bRate =
                      b.status * statusRate +
                      b.defaultEnable * defaultRate +
                      b.bankAccountId;
                    if (aRate > bRate) {
                      return -1;
                    } else return 1;
                  })
                  .map(this.renderBankAccount)}
              </tbody>
            </PermissionCheck>
          </table>
          <div className="lat-footer-op footer-tips">
            <span className="asterisk">*</span> The money will be withdrawn to
            the <span className="green">Default</span> bank account when
            auto-withdrawal is set.
          </div>

          {withdrawType === WITHDRAWAL_TYPE.auto &&
            walletBankBinds &&
            Object.keys(walletsMap).length > 0 && (
              <PermissionCheck permission="BANK_OPERATE">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={this.showAutowithdrawalSettings}
                >
                  Auto withdrawal >
                </button>
              </PermissionCheck>
            )}
          <Modal show={modal} onHide={this.onHide} title="Bank Account">
            {showTips ? (
              <p>
                Your bank account has been added. It takes 24 hours for us to
                verify the account.
              </p>
            ) : (
              <BankAccountForm
                onSubmit={this.onSubmit}
                initialValues={this.form}
              />
            )}
          </Modal>

          {walletBankBinds &&
            Object.keys(walletsMap).length > 0 && (
              <PermissionCheck permission="BANK_OPERATE">
                <Modal
                  show={autoModal}
                  onHide={this.onHide}
                  title="Auto Withdrawal"
                >
                  <div>
                    <p>Emails Report to</p>
                    <p>{withdrawEmail}</p>

                    <p style={{ marginTop: '40px' }}>Bank Account Setting</p>
                    <div className="table-container">
                      <table>
                        <tbody>
                          <tr>
                            <th>Wallet</th>
                            <th>Bank</th>
                            <th>Time</th>
                          </tr>
                          {walletBankBinds
                            .filter(item => walletsMap[item.walletId])
                            .map(item => {
                              const currency =
                                walletsMap[item.walletId].currency;
                              const time = withdrawConfigsMap[currency];
                              return (
                                <tr key={item.walletId}>
                                  <th>{`${
                                    walletsMap[item.walletId].accountName
                                  } - ${CURRENCIES[currency].code}`}</th>
                                  <th>
                                    <p>{`${
                                      bankaccountsMap[item.bankAccountId]
                                        .accountName
                                    } - ${
                                      bankaccountsMap[item.bankAccountId]
                                        .registerBank
                                    }`}</p>
                                  </th>
                                  <th>
                                    {time &&
                                      time.triggerTime &&
                                      cronstrue.toString(time.triggerTime)}
                                    <br />
                                    {time && time.triggerTimeZone}
                                  </th>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                    <p style={{ marginTop: '40px' }}>
                      If you would like change the withdrawal time, emails or
                      bank account, please contact your account manager.
                    </p>
                  </div>
                </Modal>
              </PermissionCheck>
            )}
        </div>
      </div>
    );
  }
}
export default connect(
  ({ me, bankaccounts, wallets }) => {
    const bankaccountsMap = {};
    bankaccounts.data.forEach(item => {
      bankaccountsMap[item.bankAccountId] = {
        accountName: item.accountName,
        registerBank: item.registerBank
      };
    });

    const walletsMap = {};
    wallets.data.forEach(item => {
      walletsMap[item.accountCode] = {
        accountName: item.accountName,
        currency: item.currency
      };
    });

    const withdrawConfigsMap = {};
    bankaccounts.withdrawConfigs.forEach(item => {
      withdrawConfigsMap[item.currency] = item;
    });

    return {
      withdrawType: me.withdrawType,
      bankaccounts: bankaccounts.data,
      withdrawEmail: bankaccounts.withdrawEmail || 'N/A',
      withdrawConfigsMap,
      walletBankBinds: bankaccounts.walletBankBinds.filter(item => {
        return bankaccountsMap[item.bankAccountId];
      }),
      walletsMap,
      bankaccountsMap
    };
  },
  {
    ...ossActions,
    ...bankaccontsActions
  }
)(BankAccounts);
