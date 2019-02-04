import { createAction, handleActions } from 'redux-actions';

// ======================================================
// Actions
// ======================================================
const NotificationSet = createAction('NOTIFICATION_SET');
const NotificationReset = createAction('NOTIFICATION_RESET');

export const actions = {
  NotificationSet,
  NotificationReset
};

// ======================================================
// Reducers
// ======================================================
const initState = {};

export default handleActions(
  {
    [NotificationSet]: (state, action) => {
      return { active: true, ...action.payload };
    },
    [NotificationReset]: (state, action) => {
      return { active: false, isError:true };
    }
  },
  initState
);
