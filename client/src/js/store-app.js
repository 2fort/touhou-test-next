import { combineReducers, createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';

import { domainSlice, entities, flashMessage } from './ducks';
import charactersList from './containers/Characters/CharactersList.duck';
import singleCharacter from './containers/Characters/SingleCharacter.duck';
import base from './containers/Base/duck';
import test from './containers/Test/duck';
import reverseTest from './containers/Test/ReverseTest.duck';

const domain = combineReducers({
  gamesList: domainSlice('GamesList'),
  charactersList: domainSlice('CharactersList', charactersList.reducer, charactersList.defaultState),
  singleCharacter: domainSlice('SingleCharacter', singleCharacter.reducer, singleCharacter.defaultState),
  test: domainSlice('Test', test.reducer, test.defaultState),
  reverseTest: domainSlice('ReverseTest', reverseTest.reducer, reverseTest.defaultState),
});

const rootReducer = combineReducers({
  base,
  domain,
  entities,
  flashMessage,
  form: formReducer,
});

export default function configureStore() {
  let store = '';
  const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

  if (process.env.NODE_ENV === 'development') {
    store = createStoreWithMiddleware(rootReducer, undefined,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

    if (module.hot) {
      module.hot.accept();
      store.replaceReducer(rootReducer);
    }
  } else {
    store = createStoreWithMiddleware(rootReducer, undefined);
  }

  return store;
}
