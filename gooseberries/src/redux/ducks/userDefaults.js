import { createAction, handleActions } from 'redux-actions';

// ======================================================
// Actions
// ======================================================
const UPDATE_DEFAULT_ACCOUNT_CODE = 'UPDATE_DEFAULT_ACCOUNT_CODE';
const updateDefaultAccountCode = createAction(
  UPDATE_DEFAULT_ACCOUNT_CODE,
  item => item
);

export const actions = {
  updateDefaultAccountCode
};

// ======================================================
// Reducers
// ======================================================
const initState = { accountCode: '' };

export default handleActions(
  {
    UPDATE_DEFAULT_ACCOUNT_CODE: (state, action) => {
      return {
        ...state,
        ...action.payload
      };
    }
  },
  initState
);
