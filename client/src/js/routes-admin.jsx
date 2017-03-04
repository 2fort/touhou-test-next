import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import Index from './containers-admin/Base';
import Home from './containers-admin/Base/Home';

import GamesTable from './containers-admin/Games/GamesTable';
import Characters from './containers-admin/Characters/CharactersTable';
import GameCharacters from './containers-admin/Games/GameCharacters';

export default (
  <Route path="/admin" component={Index}>
    <IndexRoute component={Home} />
    <Route path="games">
      <IndexRoute component={GamesTable} />
      <Route path=":id/characters" component={GameCharacters} />
    </Route>
    <Route path="characters" component={Characters} />
    <Route path="*" onEnter={() => { window.location = '/404'; }} />
  </Route>
);
