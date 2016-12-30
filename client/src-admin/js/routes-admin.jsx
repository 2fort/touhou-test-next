import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import Index from './containers/Index';
import Home from './components/Index/Home';

import Games from './components/Games';
import Characters from './components/Characters';

module.exports = (
  <Route path="/admin" component={Index}>
    <IndexRoute component={Home} />
    <Route path="games(/:page)">
      <IndexRoute component={Games.List} />
      <Route path="new" component={Games.New} />
      <Route path="show/:id" />
      <Route path="edit/:id" component={Games.Edit} />
      <Route path="delete/:id" />
    </Route>
    <Route path="characters(/:page)">
      <IndexRoute component={Characters.List} />
      <Route path="new" component={Characters.New} />
      <Route path="show/:id" />
      <Route path="edit/:id" component={Characters.Edit} />
      <Route path="delete/:id" />
    </Route>
    <Route path="*" onEnter={() => { window.location = '/404'; }} />
  </Route>
);
