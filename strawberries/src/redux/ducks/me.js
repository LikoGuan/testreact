import { createAction, handleAction } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';

import api from '../../api';
import { isOnboardOrSupport } from '../../util';
// This is not the cookie/session, it's the app state.
// shouldn't be persisted after page reload

// ======================================================
// Actions
// ======================================================
const FETCH = 'ME/FETCH';
const FETCHED = 'ME/FETCHED';

const fetchMe = createAction(FETCH);
const meFetched = createAction(FETCHED, me => me);

export const actions = {
  fetchMe
};

// ======================================================
// Reducers
// ======================================================
const initState = {
  permissions: {}
};

export default handleAction(FETCHED, (_, action) => action.payload, initState);

// ======================================================
// Sagas
// ======================================================
function* sagaFetchMe() {
  if (isOnboardOrSupport()) {
    return;
  }

  const { data } = yield call(api.me.profile);
  if (data.code === 0) {
    yield put(meFetched(data));
  }
}

export const sagas = [takeLatest(FETCH, sagaFetchMe)];
