import { createAction, handleActions } from 'redux-actions';

// ======================================================
// Actions
// ======================================================
const AuthTokenIssued = createAction('AUTH_TOKEN_ISSUED', auth => auth);
const AuthTokenInvalid = createAction('AUTH_TOKEN_INVALID');

export const actions = {
  AuthTokenIssued,
  AuthTokenInvalid,
};

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
