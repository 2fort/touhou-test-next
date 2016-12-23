import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';

import routes from './routes';
import { store } from './store/configureStore';

require('../sass/app.scss');

render(
  <Provider store={store}>
    <Router routes={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('touhou'),
);
