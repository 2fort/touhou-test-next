import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

export default function configureStore(rootReducer) {
  let store = '';
  const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

  /* eslint-disable global-require */
  if (process.env.NODE_ENV === 'development') {
    store = createStoreWithMiddleware(rootReducer, undefined,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('../reducers/app', () => {
        const nextReducer = require('../reducers/app').default;
        store.replaceReducer(nextReducer);
      });
    }
  } else {
    store = createStoreWithMiddleware(rootReducer, undefined);
  }
  /* eslint-enable global-require */

  return store;
}
