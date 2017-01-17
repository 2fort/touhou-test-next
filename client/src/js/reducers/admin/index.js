import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import domainSlice from '../utils/domainSlice';

import entities from '../shared/entities';
import msg from '../shared/msg';

const domain = combineReducers({
  gamesTable: domainSlice('GamesTable'),
  gameEdit: domainSlice('GameEdit'),
  charactersTable: domainSlice('CharactersTable'),
  characterEdit: domainSlice('CharacterEdit'),
});

const rootReducer = combineReducers({
  domain,
  entities,
  msg,
  form: formReducer,
});

export default rootReducer;
