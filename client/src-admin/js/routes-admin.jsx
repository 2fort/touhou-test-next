import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import Index from './containers/Index';
import Home from './components/Index/Home';

import GamesList from './components/Games/GamesList';
import GamesNew from './components/Games/GamesNew';

import CharactersList from './components/Characters/CharactersList';
import CharactersNew from './components/Characters/CharactersNew';


module.exports = (
  <Route path="/admin" component={Index}>
    <IndexRoute component={Home} />
    <Route path="games">
      <IndexRoute component={GamesList} />
      <Route path="new" component={GamesNew} />
    </Route>
    <Route path="characters">
      <IndexRoute component={CharactersList} />
      <Route path="new" component={CharactersNew} />
    </Route>
    <Route path="*" onEnter={() => { window.location = '/404'; }} />
  </Route>
);
