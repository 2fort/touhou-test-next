import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Base from './containers/Base';
import Home from './containers/Base/Home';
import Test from './containers/Test';
import ReverseTest from './containers/Test/ReverseTest';
import Characters from './containers/Characters';
import GamesList from './containers/Characters/GamesList';
import CharactersList from './containers/Characters/CharactersList';
import SingleCharacter from './containers/Characters/SingleCharacter';
import Route404 from './containers/Base/components/Page404';

export default (
  <Route path="/" component={Base}>
    <IndexRoute component={Home} />
    <Route path="test" component={Test} />
    <Route path="reverse-test" component={ReverseTest} />
    <Route path="browse" component={Characters}>
      <IndexRoute component={GamesList} />
      <Route path=":game" component={CharactersList} />
      <Route path=":game/:char" component={SingleCharacter} />
    </Route>
    <Route path="*" component={Route404} />
  </Route>
);
