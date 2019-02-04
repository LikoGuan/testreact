import { createAction, handleActions } from 'redux-actions';
import { delay } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';

import api from '../../api';
import { isOnboard } from '../../util';

// ======================================================
// Actions
// ======================================================

const FETCH_LIST = 'NZBN/LIST/FETCH';
const FETCHED_LIST = 'NZBN/LIST/FETCHED';

// const redux = [
//   {
//     name: FETCH_LIST,
//     action: createAction(FETCH_LIST, text => text),
//     reducer: (state, action) => ({
//       ...state,
//       text: action.payload
//     }),
//     saga: function* sagaFetch(action) {
//       if (!isOnboard()) {
//         return;
//       }
//
//       yield call(delay, 500); //debounce by 500ms
//
//       const { data } = yield call(api.nzbn.entities, action.payload);
//       const items = data.items || [];
//
//       const result = items.map(item => ({
//         entityName: item.entityName,
//         nzbn: item.nzbn,
//         sourceRegisterUniqueId: item.sourceRegisterUniqueId
//       }));
//
//       yield put(fetchedList(result));
//     }
//   }
// ];

const fetchList = createAction(FETCH_LIST, text => text);
const fetchedList = createAction(FETCHED_LIST);

const FETCH_COMPANY = 'NZBN/COMPANY/FETCH';
const FETCHED_COMPANY = 'NZBN/COMPANY/FETCHED';

const fetchCompany = createAction(FETCH_COMPANY, nzbn => nzbn);
const fetchedCompany = createAction(FETCHED_COMPANY);

export const actions = {
  fetchList,
  fetchedList,
  fetchCompany,
  fetchedCompany
};

// ======================================================
// Reducers
// ======================================================
const initState = {
  searchType: '',
  text: '',
  list: [],
  company: {}
};

export default handleActions(
  {
    [fetchList]: (state, action) => ({
      ...state,
      text: action.payload.text,
      searchType: action.payload.searchType
    }),
    [fetchedList]: (state, action) => ({
      ...state,
      list: action.payload
    }),
    [fetchedCompany]: (state, action) => ({
      ...state,
      company: action.payload
    })
  },
  initState
);

// ======================================================
// Sagas
// ======================================================

function* sagaFetch(action) {
  if (!isOnboard()) {
    return;
  }

  yield call(delay, 500); //debounce by 500ms

  const { data } = yield call(api.nzbn.entities, action.payload.text);
  const items = data.items || [];

  const result = items.map(item => ({
    entityName: item.entityName,
    nzbn: item.nzbn,
    sourceRegisterUniqueId: item.sourceRegisterUniqueId
  }));

  yield put(fetchedList(result));
}

function* sagaFetchCompany(action) {
  if (!isOnboard()) {
    return;
  }

  const { data } = yield call(api.nzbn.entitiesBy, action.payload);
  yield put(fetchedCompany(data));
}

export const sagas = [
  takeLatest(FETCH_LIST, sagaFetch),
  takeLatest(FETCH_COMPANY, sagaFetchCompany)
];
