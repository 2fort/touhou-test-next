import { combineReducers } from 'redux';
import test from './test';
import characters from './characters';

const rootReducer = combineReducers({
  test,
  characters,
});

export default rootReducer;
