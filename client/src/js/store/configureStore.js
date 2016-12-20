import { createStore } from 'redux';
import rootReducer from '../reducers';

export default function configureStore() {
  let store = '';

  /* eslint-disable global-require */
  /* eslint-disable no-underscore-dangle */
  if (process.env.NODE_ENV === 'development') {
    store = createStore(rootReducer, undefined,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('../reducers', () => {
        const nextReducer = require('../reducers').default;
        store.replaceReducer(nextReducer);
      });
    }
  } else {
    store = createStore(rootReducer, undefined);
  }
  /* eslint-enable global-require */
  /* eslint-enable no-underscore-dangle */

  return store;
}
