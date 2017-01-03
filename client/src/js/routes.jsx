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

// hook (nextState, replace, cb)

function bindHook(dispatch) {
  return onAction => () => onAction(dispatch);
}

export default function getRoutes(store) {
  const hook = bindHook(store.dispatch);

  return (
    <Route path="/" component={Index}>
      <IndexRoute component={Home} />
      <Route
        path="test"
        component={Test}
        onEnter={hook(Test.onEnter)}
        onLeave={hook(Test.onLeave)}
      />
      <Route path="characters" component={Characters}>
        <IndexRoute
          component={GamesList}
          onEnter={hook(GamesList.onEnter)}
          onLeave={hook(GamesList.onLeave)}
        />
        <Route
          path=":game"
          component={CharactersList}
          onEnter={hook(CharactersList.onEnter)}
          onLeave={hook(CharactersList.onLeave)}
        />
        <Route
          path=":game/:char"
          component={Character}
          onEnter={hook(Character.onEnter)}
          onLeave={hook(Character.onLeave)}
        />
      </Route>
      <Route path="*" component={Route404} />
    </Route>
  );
}
