import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Base from './containers/Base';
import Home from './containers/Base/Home';
import test from './containers/Test';
import Characters from './containers/Characters';
import { GamesList, CharactersList } from './containers/Characters/List';
import SingleCharacter from './containers/Characters/SingleCharacter';
import Route404 from './containers/Base/Page404';

// import AdminIndex from './containers/Admin/Index/Index';
import AdminGames from './containers/Admin/Games';
import AdminCharacters from './containers/Admin/Characters';
import AdminHome from './containers/Admin/Index/Home';

export default (
  <Route path="/">
    <Route component={Base}>
      <IndexRoute component={Home} />
      <Route path="test" component={test} />
      <Route path="characters" component={Characters}>
        <IndexRoute component={GamesList} />
        <Route path=":game" component={CharactersList} />
        <Route path=":game/:char" component={SingleCharacter} />
      </Route>
    </Route>

    <Route
      path="/admin"
      getComponent={(nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers/Admin/Index/Index').default);
        });
      }}
    >
      <IndexRoute component={AdminHome} />
      <Route path="games(/:page)">
        <IndexRoute component={AdminGames.List} />
        <Route path="new" component={AdminGames.New} />
        <Route path="show/:id" />
        <Route path="edit/:id" component={AdminGames.Edit} />
        <Route path="delete/:id" />
      </Route>
      <Route path="characters(/:page)">
        <IndexRoute component={AdminCharacters.List} />
        <Route path="new" component={AdminCharacters.New} />
        <Route path="show/:id" />
        <Route path="edit/:id" component={AdminCharacters.Edit} />
        <Route path="delete/:id" />
      </Route>
    </Route>
    <Route path="*" component={Route404} />
  </Route>
);
