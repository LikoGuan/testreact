import { createAction, handleActions } from 'redux-actions';
import { put, all, select, takeLatest } from 'redux-saga/effects';
import * as constants from 'redux-persist/constants';

import { actions as meActions } from './me';
import { actions as constantsActions } from './constants';
import { actions as walletssActions } from './wallets';
import { actions as bankaccountsActions } from './bankaccounts';
import { isOnboardOrSupport } from '../../util';

// ======================================================
// Actions
// ======================================================
const authTokenIssued = createAction('AUTH_TOKEN_ISSUED', auth => auth);
const authTokenInvalid = createAction('AUTH_TOKEN_INVALID');

export const actions = {
  authTokenIssued,
  authTokenInvalid
};

// ======================================================
// Reducers
// ======================================================
const initState = { jwt: '', userId: '' };

export default handleActions(
  {
    [authTokenIssued]: (state, action) => ({
      ...state,
      ...action.payload
    }),
    [authTokenInvalid]: (state, action) => ({
      ...state,
      ...initState
    })
  },
  initState
);

// ======================================================
// Sagas
// ======================================================

function* sagaAuthed() {
  if (isOnboardOrSupport()) {
    return;
  }

  const auth = yield select(state => state.auth);
  if (auth.jwt) {
    yield all([
      put(meActions.fetchMe()),
      put(constantsActions.fetchConstants()),
      put(walletssActions.fetchWallets()),
      put(bankaccountsActions.fetchBankaccounts()),
      put(bankaccountsActions.fetchAutoWithdraw())
    ]);
  } else {
    //clear
  }
}

export const sagas = [
  takeLatest(
    [authTokenIssued, constants.REHYDRATE, authTokenInvalid],
    sagaAuthed
  )
];
