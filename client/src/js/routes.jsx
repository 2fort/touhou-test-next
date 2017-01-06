import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Base from './containers/Base';
import Home from './containers/Base/Home';
import test from './containers/Test';
import Characters from './containers/Characters';
import { GamesList, CharactersList } from './containers/Characters/List';
import SingleCharacter from './containers/Characters/SingleCharacter';
import Route404 from './containers/Base/404';

export default (
  <Route path="/" component={Base}>
    <IndexRoute component={Home} />
    <Route path="test" component={test} />
    <Route path="characters" component={Characters}>
      <IndexRoute component={GamesList} />
      <Route path=":game" component={CharactersList} />
      <Route path=":game/:char" component={SingleCharacter} />
    </Route>
    <Route path="*" component={Route404} />
  </Route>
);
