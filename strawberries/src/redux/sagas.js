import { sagas as AuthSagas } from './ducks/auth';
import { sagas as MeSagas } from './ducks/me';
import { sagas as ConstantsSagas } from './ducks/constants';
import { sagas as WalletsSagas } from './ducks/wallets';
import { sagas as BankaccountsSagas } from './ducks/bankaccounts';
import { sagas as OSSSagas } from './ducks/oss';
import { sagas as OSSSagasTemp } from './ducks/ossTemp';
import { sagas as nzbnSagas } from './ducks/nzbn';

import { all } from 'redux-saga/effects';

export default function* root() {
  yield all([
    ...AuthSagas,
    ...MeSagas,
    ...ConstantsSagas,
    ...WalletsSagas,
    ...BankaccountsSagas,
    ...OSSSagas,
    ...OSSSagasTemp,
    ...nzbnSagas
  ]);
}
