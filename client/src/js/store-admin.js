import { combineReducers, createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';

import { domainSlice, entities, flashMessage } from './ducks';
import gamesTable from './containers-admin/Games/GamesTable.duck';
import gameFormModal from './containers-admin/Games/GameFormModal.duck';
import charactersTable from './containers-admin/Characters/CharactersTable.duck';
import charFormModal from './containers-admin/Characters/CharFormModal.duck';


const domain = combineReducers({
  gamesTable: domainSlice('GamesTable', gamesTable.reducer, gamesTable.defaultState),
  gameFormModal: domainSlice('GameFormModal', gameFormModal.reducer, gameFormModal.defaultState),
  charactersTable: domainSlice('CharactersTable', charactersTable.reducer, charactersTable.defaultState),
  charFormModal: domainSlice('CharFormModal', charFormModal.reducer, charFormModal.defaultState),
});

const rootReducer = combineReducers({
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
