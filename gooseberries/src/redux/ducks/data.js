import { createAction, handleAction } from 'redux-actions';
import { put, takeLatest, all, select, call } from 'redux-saga/effects';
import * as constants from 'redux-persist/constants';
import { actions as AuthActions } from './auth';
import api from '../../api';
import { actions as userDefaultsActions } from './userDefaults';

// ======================================================
// Actions
// ======================================================
const UPDATE_DATA = 'UPDATE_DATA';
const updateData = createAction(UPDATE_DATA, payload => payload);

// ======================================================
// Reducers
// ======================================================
const initState = {
  profile: {
    api_key: '',
    user_id: '',
    org_id: ''
  },
  wallets: [],
  walletMaps: {},
  rateAndCharge: {}
};

export default handleAction(
  UPDATE_DATA,
  (state, action) => {
    const { rateAndCharge, ...payload } = action.payload;
    if (rateAndCharge) {
      return {
        ...state,
        ...payload,
        rateAndCharge: {
          ...state.rateAndCharge,
          ...rateAndCharge
        }
      };
    } else {
      return {
        ...state,
        ...action.payload
      };
    }
  },
  initState
);

// ======================================================
// Sagas
// ======================================================
function* sagaFetchMe() {
  const { data } = yield call(api.me.profile);
  if (data.code === 0) {
    const {
      secretKey: api_key,
      userId: user_id,
      organisationId: org_id
    } = data;
    yield put(updateData({ profile: { api_key, user_id, org_id } }));
  }
}

function* sagaFetchWallets() {
  const { data } = yield call(api.wallet.list);
  if (data.code === 0) {
    const wallets =
      data.walletList.filter(
        item => item.disabled === 0 && (item.wechat || item.alipay)
      ) || [];

    yield put(
      updateData({
        wallets: wallets,
        walletMaps: data.walletList.reduce((result, item) => {
          result[item.accountCode] = {
            currencyString: item.currencyString,
            accountName: item.accountName,
            wechat: item.wechat,
            alipay: item.alipay
          };
          return result;
        }, {})
      })
    );

    const { accountCode } = yield select(state => state.userDefaults);
    if (wallets.length > 0) {
      if (!accountCode) {
        yield put(
          userDefaultsActions.updateDefaultAccountCode({
            accountCode: wallets[0].accountCode
          })
        );
      }else {
        const existed = wallets.filter(item=>item.accountCode === accountCode);
        if (existed && existed.length === 0) {
          yield put(
            userDefaultsActions.updateDefaultAccountCode({
              accountCode: wallets[0].accountCode
            })
          );
        }
      }
    } else {
      yield put(
        userDefaultsActions.updateDefaultAccountCode({
          accountCode: ''
        })
      );
    }
  }
}

function* sagaAuthed() {
  const auth = yield select(state => state.auth);
  if (auth.jwt) {
    yield all([call(sagaFetchWallets), call(sagaFetchMe)]);
  }
}

function* sagaFee() {
  const { profile, wallet_id } = yield select(state => ({
    profile: state.data.profile,
    wallet_id: state.userDefaults.accountCode
  }));

  if (!wallet_id || wallet_id === '') return;

  const { user_id } = profile;
  if (!user_id) return;

  const { data } = yield call(
    api.wallet.rateAndCharge({
      wallet_id,
      user_id
    })
  );

  //result:[{"gateway":"ALIPAY","margin":0,"rate":4.88810},{"gateway":"WECHAT","margin":0,"rate":4.90420}]
  if (data.code === 0) {
    const { result } = data;

    yield put(
      updateData({
        rateAndCharge: {
          [user_id + '' + wallet_id]: result.reduce((r, item) => {
            r[item.gateway.toLowerCase()] = item;
            return r;
          }, {})
        }
      })
    );
  }
}

export const sagas = [
  takeLatest([AuthActions.AuthTokenIssued, constants.REHYDRATE], sagaAuthed),
  takeLatest(
    [userDefaultsActions.updateDefaultAccountCode, constants.REHYDRATE],
    sagaFee
  )
];
