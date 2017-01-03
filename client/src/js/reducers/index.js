import { combineReducers } from 'redux';
import main from './main';
import store from './store';

const rootReducer = combineReducers({
  main,
  store,
});

export default rootReducer;
