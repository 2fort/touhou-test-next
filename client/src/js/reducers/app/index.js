import { combineReducers } from 'redux';
import DomainSlice from '../utils/DomainSlice';

import main from './main';
import entities from './entities';
import test from './test';

const domainStore = new DomainSlice();

domainStore.addComponent('GamesList');
domainStore.addComponent('CharactersList');
domainStore.addComponent('SingleCharacter');
domainStore.addComponent('Test', test.reducer, test.defaultState);

const domain = combineReducers({
  gamesList: domainStore.getComponent('GamesList'),
  charactersList: domainStore.getComponent('CharactersList'),
  singleCharacter: domainStore.getComponent('SingleCharacter'),
  test: domainStore.getComponent('Test'),
});

const rootReducer = combineReducers({
  main,
  entities,
  domain,
});

export default rootReducer;
