import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import auth from './ducks/auth';
import me from './ducks/me';
import constants from './ducks/constants';
import wallets from './ducks/wallets';
import bankaccounts from './ducks/bankaccounts';
import oss from './ducks/oss';
import ossTemp from './ducks/ossTemp';
import nzbn from './ducks/nzbn';

export default combineReducers({
  form: formReducer,
  auth,
  me,
  constants,
  wallets,
  bankaccounts,
  oss,
  ossTemp, //no need to login for getting oss info
  nzbn
});
