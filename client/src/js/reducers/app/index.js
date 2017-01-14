import { combineReducers } from 'redux';
import DomainSlice from '../utils/DomainSlice';

import main from './main';
import entities from './entities';
import test from './test';

const domain = combineReducers({
  gamesList: DomainSlice('GamesList'),
  charactersList: DomainSlice('CharactersList'),
  singleCharacter: DomainSlice('SingleCharacter'),
  test: DomainSlice('Test', test.reducer, test.defaultState),
});

const rootReducer = combineReducers({
  main,
  entities,
  domain,
});

export default rootReducer;
