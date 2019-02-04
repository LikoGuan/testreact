import { createAction, handleActions } from 'redux-actions';
import { call, put, all, takeLatest } from 'redux-saga/effects';

import api from '../../api';
import { isOnboardOrSupport } from '../../util';
// ======================================================
// Actions
// ======================================================
const FETCH = 'CONSTANTS/FETCH';

const fetchConstants = createAction(FETCH);
const constantsRolesFetched = createAction('CONSTANTS_ROLES_FETCHED');
const constantsPayEaseFetched = createAction('CONSTANTS_PAYEASE_FETCHED');

export const actions = {
  fetchConstants
};

// ======================================================
// Reducers
// ======================================================
const initState = {
  ROLES: [],
  PAYEASE: {}
};

export default handleActions(
  {
    [constantsRolesFetched]: (state, action) => ({
      ...state,
      ROLES: action.payload
    }),
    [constantsPayEaseFetched]: (state, action) => ({
      ...state,
      PAYEASE: action.payload
    })
  },
  initState
);

// ======================================================
// Sagas
// ======================================================

function* sagaFetchConstants() {
  if (isOnboardOrSupport()) {
    return;
  }

  const [{ data: permissions }, { data: payease }] = yield all([
    call(api.constants.permissions),
    call(api.constants.payease)
  ]);

  if (permissions.code === 0) {
    yield put(constantsRolesFetched(permissions.roles));
  }
  if (payease.code === 0) {
    yield put(constantsPayEaseFetched(payease.payEaseCompanies));
  }
}

export const sagas = [takeLatest(FETCH, sagaFetchConstants)];
