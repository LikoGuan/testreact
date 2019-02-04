import React, { Component } from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';
import Alert from 'react-s-alert';
import numeral from 'numeral';

import Modal from '../modals';
import api from '../api';
import Icons from '../icons';
import IconButton from '../components/IconButton';
import PermissionCheck from '../components/PermissionCheck';
import { EditToggle } from '../components/DropdownToggle';
import WalletForm from '../forms/Wallet';
import WithdrawalForm from '../forms/Withdrawal';
import { scrollToHistory } from './Transaction';

import { CURRENCIES } from '../constants';

import eurIcon from '../assets/icon_eur.svg';

export class CurrencyWallets extends Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      wdmodal: false,
      withdrawAccountCode: '',
      wallets: []
    };

    this.onEditWallet = this.onEditWallet.bind(this);
    // this.onAddWallet = this.onAddWallet.bind(this);
    this.onWithdraw = this.onWithdraw.bind(this);

    this.onHide = this.onHide.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
    this.onWithdrawalSubmit = this.onWithdrawalSubmit.bind(this);
    this.renderWallet = this.renderWallet.bind(this);
  }

  onEditWallet(wallet) {
    this.form = wallet;
    this.setState({
      modal: true
    });
  }

  onWalletHistory(wallet) {
    scrollToHistory();
    this.props.walletsToHistory(wallet.accountName);
  }

  // onAddWallet() {
  //   this.form = {
  //     currency: this.props.closeCurrency,
  //     alipay: true,
  //     wechat: true
  //   };
  //   this.props.fetchWallets();
  //   this.setState({
  //     modal: true
  //   });
  // }

  onWithdraw(accountCode) {
    return () => {
      this.setState({
        wdmodal: true,
        withdrawAccountCode: accountCode
      });
    };
  }

  onHide() {
    this.setState({
      modal: false,
      wdmodal: false
    });
  }

  async onWithdrawalSubmit(form) {
    const { data } = await api.withdrawals.create(form);
    if (!data.code) {
      Alert.success('Succeeded');
    } else {
      Alert.warning(`Failed to withdraw: ${data.message}`);
    }
    // To fetch transcation request again, and reset all the filters
    this.props.walletsToHistory('');
    this.props.fetchWallets();
    this.setState({
      wdmodal: false
    });
  }

  async onSubmit(form) {
    let promise = null;
    if (this.form.accountCode) {
      // update wallet
      promise = api.wallets.update(this.form.accountCode, form);
    } else {
      // create wallet
      promise = api.wallets.create(form);
    }
    const { data } = await promise;
    if (data.code === 0) {
      this.props.fetchWallets();
      this.setState({
        modal: false
      });
    } else {
      Alert.warning(`${data.message}`);
    }
  }

  renderWallet(wallet) {
    const {
      accountCode,
      accountName,
      balanceAmt,
      availableAmt,
      progressAmt,
      disabled,
      currency
    } = wallet;
    const sign = CURRENCIES[currency].sign;

    const balance = `${sign}${numeral(balanceAmt).format('0,0.00')}`;
    const availableAmount = `${sign}${numeral(availableAmt).format('0,0.00')}`;
    const progressAmount = `${sign}${numeral(progressAmt).format('0,0.00')}`;

    return (
      <tr key={accountCode} className={disabled ? 'info' : ''}>
        <td>{accountName}</td>
        <td>{balance}</td>
        <td className="hidden-xs">{availableAmount}</td>
        <td className="hidden-xs">{progressAmount}</td>
        <PermissionCheck permission="WALLET_OPERATE">
          <td>
            <Dropdown pullRight id={`dropdown-${accountCode}`}>
              <EditToggle icon={Icons.walletActions} bsRole="toggle" />
              <Dropdown.Menu>
                {!disabled && (
                  <MenuItem>
                    <div onClick={() => this.onEditWallet(wallet)}>Edit</div>
                  </MenuItem>
                )}
                <MenuItem>
                  <div onClick={() => this.onWalletHistory(wallet)}>
                    History
                  </div>
                </MenuItem>
                {!disabled && (
                  <PermissionCheck permission="WITHDRAW_OPERATE">
                    <MenuItem>
                      <div onClick={this.onWithdraw(accountCode)}>Withdraw</div>
                    </MenuItem>
                  </PermissionCheck>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </td>
        </PermissionCheck>
      </tr>
    );
  }

  render() {
    const { wallets = [], currency, currencyString, total } = this.props;

    const displayCurrency =
      currencyString === CURRENCIES[currency].code
        ? currencyString
        : `${currencyString}(${CURRENCIES[currency].code})`;
    const sign = CURRENCIES[currency].sign;

    const currencyStr = currencyString.toLowerCase();

    //eur图片使用dangerouslySetInnerHTML无法正常显示
    const icon =
      currencyStr === 'eur' ? <img src={eurIcon} alt="" /> : Icons[currencyStr];

    return (
      <div>
        <div className="page-header lat-page-header">
          <p className="lat-currency-header">
            {icon}
            <span className="lat-currency-total">
              {`${displayCurrency} - ${sign}${numeral(total).format(
                '0,0.00'
              )} `}
            </span>
            <span className="lat-currency-total hidden-xs">
              available in total
            </span>
          </p>
          <div className="lat-header-op">
            <PermissionCheck permission="WITHDRAW_OPERATE">
              <IconButton
                className="inline-block-container"
                onClick={this.onWithdraw()}
                icon="withdraw"
              >
                <span className="hidden-xs">Withdraw</span>
              </IconButton>
            </PermissionCheck>
          </div>
        </div>
        <div className="lat-table">
          <table className="table  table-hover ">
            <thead>
              <tr>
                <th width="30%">
                  <div className="btn btn-default btn-nullify">WALLET NAME</div>
                </th>
                <th width="20%">
                  <div className="btn btn-default btn-nullify">BALANCE</div>
                </th>
                <th className="hidden-xs" width="20%">
                  <div className="btn btn-default btn-nullify">AVAILABLE</div>
                </th>
                <th className="hidden-xs" width="20%">
                  <div className="btn btn-default btn-nullify">PROGRESS</div>
                </th>
                <PermissionCheck permission="WALLET_OPERATE">
                  <th width="10%">
                    <div className="btn btn-default btn-nullify">ACTION</div>
                  </th>
                </PermissionCheck>
              </tr>
            </thead>
            <tbody>
              {wallets
                .sort((a, b) => {
                  let aId = a.disabled + '' + a.accountCode;
                  let bId = b.disabled + '' + b.accountCode;

                  if (aId > bId) return 1;
                  else if (aId < bId) return -1;
                  else return 0;
                })
                .map(this.renderWallet)}
            </tbody>
          </table>
        </div>
        <Modal show={this.state.modal} title="Wallet" onHide={this.onHide}>
          <WalletForm onSubmit={this.onSubmit} initialValues={this.form} />
        </Modal>
        <Modal
          show={this.state.wdmodal}
          title="Withdrawal"
          onHide={this.onHide}
        >
          <WithdrawalForm
            onSubmit={this.onWithdrawalSubmit}
            withdrawAccountCode={this.state.withdrawAccountCode}
          />
        </Modal>
      </div>
    );
  }
}

export default CurrencyWallets;
