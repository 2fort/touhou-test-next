import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import Index from './containers-admin/Base';
import Home from './containers-admin/Base/Home';

import Games from './containers-admin/Games';
import Characters from './containers-admin/Characters';

module.exports = (
  <Route path="/admin" component={Index}>
    <IndexRoute component={Home} />
    <Route path="games">
      <IndexRoute component={Games.List} />
      <Route path="new" component={Games.New} />
      <Route path="show/:id" />
      <Route path="edit/:id" component={Games.Edit} />
      <Route path="delete/:id" />
    </Route>
    <Route path="characters">
      <IndexRoute component={Characters.List} />
      <Route path="new" component={Characters.New} />
      <Route path="show/:id" />
      <Route path="edit/:id" component={Characters.Edit} />
      <Route path="delete/:id" />
    </Route>
    <Route path="*" onEnter={() => { window.location = '/404'; }} />
  </Route>
);
