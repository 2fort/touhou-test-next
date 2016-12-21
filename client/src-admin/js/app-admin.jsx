import React from 'react';
import { render } from 'react-dom';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';

import routes from './routes-admin';

require('../sass/app.scss');

render(
  <Router routes={routes} history={browserHistory} />,
  document.getElementById('example'),
);
