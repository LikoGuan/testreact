import { createAction, handleActions } from 'redux-actions';
import { call, put, takeEvery } from 'redux-saga/effects';

import api from '../../api';

// ======================================================
// Actions
// ======================================================
const ConstantsToFetch = createAction('CONSTANTS_TO_FETCH');
const ConstantsFetched = createAction('CONSTANTS_FETCHED');

export const actions = {
  ConstantsToFetch,
  ConstantsFetched,
};

// ======================================================
// Sagas
// ======================================================

function* FetchConstants() {
  const resp = yield call(api.traderConstants.list);
  const traderConstants = resp.data;
  if (traderConstants.code === 0) {
    traderConstants.isLoaded = true ;
    yield put(ConstantsFetched(traderConstants));
  }
}

export const sagas = function*() {
  yield takeEvery([ConstantsToFetch], FetchConstants);
};

// ======================================================
// Reducers
// ======================================================
const initState = {
  lookups:{
    admins:[],
    currencies:[],
    countries:[],
    languages:[],
  },
  enums:{
    MerchantType:[],
    RiskLevelType:[],
    VerificationStatusType:[],
    TaskStatus:[],
    TaskTypeCode:[]
  },
  isLoaded : false
};

export default handleActions(
  {
    [ConstantsFetched]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  initState
);
