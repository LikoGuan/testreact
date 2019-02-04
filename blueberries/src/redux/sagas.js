import { sagas as AuthSagas } from './ducks/auth';
import { sagas as OSSSagas } from './ducks/oss';
import { sagas as ConstantsSagas } from './ducks/constants';

export default [AuthSagas,OSSSagas,ConstantsSagas];
