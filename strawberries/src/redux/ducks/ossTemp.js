import { createAction, handleAction } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';

import api from '../../api';
import { isOnboardOrSupport } from '../../util';

// ======================================================
// Actions
// ======================================================
const FETCH = 'TEMPOSS/FETCH'; //here, is different from oss.js
const FETCHED = 'TEMPOSS/FETCHED'; //here, is different from oss.js

const fetchOSS = createAction(FETCH);
const ossFetched = createAction(FETCHED);

export const actions = {
  fetchOSS
};

// ======================================================
// Reducers
// ======================================================
const initState = {};

export default handleAction(
  FETCHED,
  (_, action) => {
    const { host, dir, signature, policy, accessid } = action.payload;
    return {
      host,
      form: {
        dir,
        policy,
        OSSAccessKeyId: accessid,
        success_action_status: '200',
        signature
      }
    };
  },
  initState
);

// ======================================================
// Sagas
// ======================================================

function* sagaFetchOSS() {
  if (!isOnboardOrSupport()) {
    //here, is different from oss.js
    return;
  }

  const { data } = yield call(api.documents.tempPrepare); //here, is different from oss.js
  if (data.code === 0) {
    yield put(ossFetched(data));
  }
}

export const sagas = [takeLatest(FETCH, sagaFetchOSS)];
