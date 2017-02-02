import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import { stringify, parse } from 'qs';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import routes from './routes-admin';
import configureStore from './store-admin';

const history = useRouterHistory(createBrowserHistory)({ parseQueryString: parse, stringifyQuery: stringify });
const store = configureStore();

require('../sass/app-admin.scss');

render(
  <Provider store={store}>
    <Router routes={routes} history={history} />
  </Provider>,
  document.getElementById('example'),
);
