import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import auth from './ducks/auth';
import data from './ducks/data';
import userDefaults from './ducks/userDefaults';

const reducers = combineReducers({
  form: formReducer,
  auth,
  data,
  userDefaults
});
export default reducers;
