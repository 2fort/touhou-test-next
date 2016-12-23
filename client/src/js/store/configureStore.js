import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import rootReducer from '../reducers';

function configureStore() {
  let store = '';
  const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

  /* eslint-disable global-require */
  /* eslint-disable no-underscore-dangle */
  if (process.env.NODE_ENV === 'development') {
    store = createStoreWithMiddleware(rootReducer, undefined,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('../reducers', () => {
        const nextReducer = require('../reducers').default;
        store.replaceReducer(nextReducer);
      });
    }
  } else {
    store = createStoreWithMiddleware(rootReducer, undefined);
  }
  /* eslint-enable global-require */
  /* eslint-enable no-underscore-dangle */

  return store;
}

const store = configureStore();
const dispatch = store.dispatch;

module.exports = {
  store,
  dispatch,
};
