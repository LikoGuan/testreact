import createHistory from 'history/createBrowserHistory';

const history = createHistory();

history.listen((location, action) => {
  // Google Analytics
  const { ga } = window;
  if (ga) {
    ga('set', 'page', location.pathname);
    ga('send', 'pageview');
  }
});

export default history;
