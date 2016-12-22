import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import Index from './containers/Index';
import Home from './components/Index/Home';
import Test from './containers/Test';
import Characters from './containers/Characters';
import GamesList from './containers/Characters/GamesList';
import CharactersList from './containers/Characters/CharactersList';
import Character from './components/Characters/Character';
import Route404 from './components/404';

module.exports = (
  <Route path="/" component={Index}>
    <IndexRoute component={Home} />
    <Route path="test" component={Test} />
    <Route path="characters" component={Characters}>
      <IndexRoute component={GamesList} />
      <Route path=":game" component={CharactersList} />
      <Route path=":game/:char" component={Character} />
    </Route>
    <Route path="admin" onEnter={() => { window.location = '/admin'; }} />
    <Route path="*" component={Route404} />
  </Route>
);
