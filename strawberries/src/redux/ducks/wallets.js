import { createAction, handleActions } from 'redux-actions';
import { debounceFor } from '../saga-helpers';

import { call, put } from 'redux-saga/effects';

import api from '../../api';
import { isOnboardOrSupport } from '../../util';

// ======================================================
// Actions
// ======================================================
const FETCH = 'WALLETS/FETCH';
const FETCHED = 'WALLETS/FETCHED';

const fetchWallets = createAction(FETCH);
const walletsFetched = createAction(FETCHED);
const walletsToHistory = createAction('WALLETS_TO_HISTORY');

export const actions = {
  fetchWallets,
  walletsToHistory
};

// ======================================================
// Reducers
// ======================================================
const initState = {
  loading: false,
  fuzzyString: '',
  data: []
};

export default handleActions(
  {
    [fetchWallets]: state => ({
      ...state,
      loading: true
    }),
    [walletsFetched]: (state, action) => ({
      loading: false,
      data: action.payload,
      fuzzyString: ''
    }),
    [walletsToHistory]: (state, action) => ({
      ...state,
      fuzzyString: action.payload
    })
  },
  initState
);

// ======================================================
// Sagas
// ======================================================

function* sagaFetchWallets() {
  if (isOnboardOrSupport()) {
    return;
  }

  const { data } = yield call(api.wallets.list);
  if (data.code === 0) {
    yield put(walletsFetched(data.walletList));
  }
}

export const sagas = [debounceFor(FETCH, sagaFetchWallets, 200)];
