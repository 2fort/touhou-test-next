import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Base from './containers/Base';
import Home from './containers/Base/Home';
import test from './containers/Test';
import Characters from './containers/Characters';
import { GamesList, CharactersList } from './containers/Characters/List';
import SingleCharacter from './containers/Characters/SingleCharacter';
import Route404 from './containers/Base/Page404';

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
      path="admin"
      getComponent={(nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./containers-admin/Base').default);
        });
      }}
    >
      <IndexRoute
        getComponent={(nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./containers-admin/Base/Home').default);
          });
        }}
      />
      <Route path="games">
        <IndexRoute
          getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./containers-admin/Games').List);
            });
          }}
        />
        <Route
          path="new"
          getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./containers-admin/Games').New);
            });
          }}
        />
        <Route path="show/:id" />
        <Route
          path="edit/:id"
          getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./containers-admin/Games').Edit);
            });
          }}
        />
        <Route path="delete/:id" />
      </Route>
      <Route path="characters">
        <IndexRoute
          getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./containers-admin/Characters').List);
            });
          }}
        />
        <Route
          path="new"
          getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./containers-admin/Characters').New);
            });
          }}
        />
        <Route path="show/:id" />
        <Route
          path="edit/:id"
          getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./containers-admin/Characters').Edit);
            });
          }}
        />
        <Route path="delete/:id" />
      </Route>
    </Route>

    <Route path="*" component={Route404} />
  </Route>
);
