import { createAction, handleActions } from 'redux-actions';
import { put, takeEvery, all, select } from 'redux-saga/effects';
import * as constants from 'redux-persist/constants';
import { actions as constantsActions } from './constants';

// ======================================================
// Actions
// ======================================================
const AuthTokenIssued = createAction('AUTH_TOKEN_ISSUED', auth => auth);
const AuthTokenInvalid = createAction('AUTH_TOKEN_INVALID');
const AuthToLogin = createAction('AUTH_TO_LOGIN', credentials => credentials);

export const actions = {
  AuthTokenIssued,
  AuthTokenInvalid,
  AuthToLogin,
};

// ======================================================
// Sagas
// ======================================================

function* Authed() {
  const auth = yield select(state => state.auth);
  if (auth.jwt) {
    yield all([put(constantsActions.ConstantsToFetch())]);
  }
}
function* AuthSaga() {
  yield all([takeEvery([[AuthTokenIssued], constants.REHYDRATE], Authed)]);
}
export const sagas = AuthSaga;

// ======================================================
// Reducers
// ======================================================
const initState = { jwt: '', userId: '' };

export default handleActions(
  {
    [AuthTokenIssued]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthTokenInvalid]: (state, action) => ({
      ...state,
      ...initState,
    }),
  },
  initState
);
