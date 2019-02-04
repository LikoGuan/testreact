import { createAction, handleActions } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';

import api from '../../api';
import { isOnboardOrSupport } from '../../util';
// ======================================================
// Actions
// ======================================================
const FETCH = 'BANKACCOUNTS/FETCH';
const FETCHED = 'BANKACCOUNTS/FETCHED';

const fetchBankaccounts = createAction(FETCH);
const bankaccountsFetched = createAction(FETCHED, data => data);

const AUTOWITHDRAWAL_FETCH = 'AUTOWITHDRAWAL/FETCH';
const AUTOWITHDRAWAL_FETCHED = 'AUTOWITHDRAWAL/FETCHED';
const fetchAutoWithdraw = createAction(AUTOWITHDRAWAL_FETCH);
const autoWithdrawFetched = createAction(AUTOWITHDRAWAL_FETCHED, data => data);

export const actions = {
  fetchBankaccounts,
  fetchAutoWithdraw
};

// ======================================================
// Reducers
// ======================================================
const initState = {
  data: [],
  withdrawEmail: null,
  withdrawConfigs: [],
  walletBankBinds: []
};

export default handleActions(
  {
    [FETCHED]: (state, action) => ({
      ...state,
      data: action.payload
    }),
    [AUTOWITHDRAWAL_FETCHED]: (state, action) => {
      return {
        ...state,
        withdrawEmail: action.payload.withdrawEmail,
        withdrawConfigs: action.payload.withdrawConfigs,
        walletBankBinds: action.payload.walletBankBinds
      };
    }
  },
  initState
);

// ======================================================
// Sagas
// ======================================================

function* sagaFetchBankaccounts() {
  if (isOnboardOrSupport()) {
    return;
  }

  const { data } = yield call(api.bankaccounts.list);
  if (data.code === 0) {
    yield put(bankaccountsFetched(data.bankAccountList));
  }
}

function* sagaFetchAuthwithdrawal() {
  if (isOnboardOrSupport()) {
    return;
  }

  const { data } = yield call(api.bankaccounts.withdrawSetting);
  if (data.code === 0) {
    yield put(autoWithdrawFetched(data));
  }
}

export const sagas = [
  takeLatest(FETCH, sagaFetchBankaccounts),
  takeLatest(AUTOWITHDRAWAL_FETCH, sagaFetchAuthwithdrawal)
];
