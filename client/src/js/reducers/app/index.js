import { combineReducers } from 'redux';
import domainSlice from '../utils/domainSlice';

import main from './main';
import entities from '../shared/entities';
import msg from '../shared/msg';
import test from './test';

const domain = combineReducers({
  gamesList: domainSlice('GamesList'),
  charactersList: domainSlice('CharactersList'),
  singleCharacter: domainSlice('SingleCharacter'),
  test: domainSlice('Test', test.reducer, test.defaultState),
});

const rootReducer = combineReducers({
  main,
  domain,
  entities,
  msg,
});

export default rootReducer;
