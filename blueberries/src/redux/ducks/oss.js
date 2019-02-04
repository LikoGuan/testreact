import { createAction, handleActions } from 'redux-actions';
import { call, put, takeEvery } from 'redux-saga/effects';

import api from '../../api';

// ======================================================
// Actions
// ======================================================
const OSSToFetch = createAction('OSS_TO_FETCH');
const OSSRolesFetched = createAction('OSS_ROLES_FETCHED');

export const actions = {
  OSSToFetch,
  OSSRolesFetched,
};

// ======================================================
// Sagas
// ======================================================

function* FetchOSS() {
  const { data } = yield call(api.documents.prepare);
  if (data.code === 0) {
    yield put(OSSRolesFetched(data));
  }
}

export const sagas = function*() {
  yield takeEvery([OSSToFetch], FetchOSS);
};

// ======================================================
// Reducers
// ======================================================
const initState = {};

export default handleActions(
  {
    [OSSRolesFetched]: (state, action) => {
      const { host, dir, signature, policy, accessid } = action.payload;
      return {
        ...state,
        host,
        form: {
          dir,
          policy,
          OSSAccessKeyId: accessid,
          success_action_status: '200',
          signature,
        },
      };
    },
  },
  initState
);
