import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import Index from './containers-admin/Base';
import Home from './containers-admin/Base/Home';

import Games from './containers-admin/Games/Table';
import Characters from './containers-admin/Characters';

module.exports = (
  <Route path="/admin" component={Index}>
    <IndexRoute component={Home} />
    <Route path="games" component={Games} />
    <Route path="characters">
      <IndexRoute component={Characters.Table} />
      <Route path="edit/:id" component={Characters.Edit} />
    </Route>
    <Route path="*" onEnter={() => { window.location = '/404'; }} />
  </Route>
);
