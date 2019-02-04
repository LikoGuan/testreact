import { sagas } from './ducks/data';
import { all } from 'redux-saga/effects';

export default function* root() {
  yield all(sagas);
}
