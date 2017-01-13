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
  gamesList: (state, action) => domainStore.getComponent(state, action, 'GamesList'),
  charactersList: (state, action) => domainStore.getComponent(state, action, 'CharactersList'),
  singleCharacter: (state, action) => domainStore.getComponent(state, action, 'SingleCharacter'),
  test: (state, action) => domainStore.getComponent(state, action, 'Test'),
});

const rootReducer = combineReducers({
  main,
  entities,
  domain,
});

export default rootReducer;
