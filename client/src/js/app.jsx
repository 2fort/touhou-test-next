import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';

/* import Perf from 'react-addons-perf';
window.Perf = Perf;*/

import routes from './routes';
import appRootReducer from './reducers/app';
import configureStore from './store/configureStore';

const store = configureStore(appRootReducer);

require('../sass/app.scss');

render(
  <Provider store={store}>
    <Router routes={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('touhou'),
);
