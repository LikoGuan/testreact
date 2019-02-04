import store from '../redux/store';
import history from '../history';
import { actions as authActions } from '../redux/ducks/auth';
import { actions as notificationActions } from '../redux/ducks/notification';

export default [
  // auth interceptor
  {
    request: [
      config => {
        // Add JWT  to http request header
        const { jwt, userId } = store.getState().auth;
        config.headers.common.Authorization = jwt;
        config.headers.common['X-USER-ID'] = userId;

        return config;
      },
      undefined,
    ],
    response: [
      undefined,
      error => {
        if (error.response && 401 === error.response.status) {
          // JWT not valid or expired
          store.dispatch(authActions.AuthTokenInvalid());
          history.push('/', { from: history.location });
        }
        return Promise.reject(error);
      },
    ],
  },
  // loading status interceptor
  {
    request: [
      config => {
        store.dispatch(
          notificationActions.NotificationSet({
            message: `Running ${config.method} ${config.url}`,
            active: true
          })
        );
        return config;
      },
    ],
    response: [
      response => {
        const { config , data: { code,message,stack } , status } = response;
        const isSuccess = (status===200 && (code===undefined || code===0)) ;
        const successOrFailure = isSuccess ? "Success" : "Failure" ;
        const finalMessage = isSuccess ? "" : (message?message:response.statusText) ;
        store.dispatch(
          notificationActions.NotificationSet({
            message: `${successOrFailure} ${config.method} ${config.url} ${finalMessage}`,
            isError:  status!==200,
            stack: stack
          })
        );
        return response;
      },
    ],
  }
];
