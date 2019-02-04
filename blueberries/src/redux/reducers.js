import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './ducks/auth';
import constants from './ducks/constants';
import oss from './ducks/oss';
import notification from './ducks/notification';

const reducers = combineReducers({
  form: formReducer,
  auth,
  oss,
  constants,
  notification,
});
export default reducers;
