import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import { setupWorker } from 'msw';
import handlers from '../mocks/handlers';

/* import Perf from 'react-addons-perf';
window.Perf = Perf;*/

import routes from './routes';
import configureStore from './store-app';

import './app.style';

const worker = setupWorker(...handlers);
worker.start();

const store = configureStore();

render(
  <Provider store={store}>
    <Router routes={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('touhou'),
);
