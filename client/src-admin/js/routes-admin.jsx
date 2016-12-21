import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import Index from './containers/Index';
import Home from './components/Index/Home';

import GamesIndex from './containers/GamesIndex';
import GamesList from './components/Games/GamesList';
import GamesNew from './components/Games/GamesNew';

import CharactersIndex from './containers/CharactersIndex';
import CharactersList from './components/Characters/CharactersList';
import CharactersNew from './components/Characters/CharactersNew';


module.exports = (
  <Route path="/admin" component={Index}>
    <IndexRoute component={Home} />
    <Route path="games" component={GamesIndex}>
      <IndexRoute component={GamesList} />
      <Route path="new" component={GamesNew} />
    </Route>
    <Route path="characters" component={CharactersIndex}>
      <IndexRoute component={CharactersList} />
      <Route path="new" component={CharactersNew} />
    </Route>
  </Route>
);
