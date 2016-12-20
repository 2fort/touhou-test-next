import { createStore } from 'redux';
import rootReducer from '../reducers';

export default function configureStore() {
    let store = '';

    if (process.env.NODE_ENV === 'development') {
        store = createStore(rootReducer, undefined,
            window.devToolsExtension ? window.devToolsExtension() : undefined
        );

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

    return store;
}
