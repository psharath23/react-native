
import {
    createStore
} from 'redux';
import { IReducer } from './../interfaces/index';
import Reducer from './../reducers/index';
function configureStore(initialState: any) {
    const _store = createStore(
        Reducer,
        initialState);
    return _store;
}
export const store: {
    dispatch: any,
    getState: () => IReducer
    subscribe: any;
} = configureStore({});

export const persistStore = require('redux-persist').persistStore;

export function initReduxStore(cb) {
    persistStore(store, {}, (err: any, state?: any) => {
        if (err) {
            console.log(err, state);
        } else {
            cb();
        }
    });
}

// Listen to store changes and wanr user if offline storage is used abovce 4 MB
// After JSON stringify each char in string will occupy 1 byte space. Verified by exporing complete store to json file
store.subscribe(function () {
    // retrieve latest store state here
    // Ex:
    try {
        let storeSize = (JSON.stringify(store.getState()).length / 1000000);
        if (storeSize > 4) {
            window.alert({ message: 'Low offline storage space. Please go online to free space.' });
        }
        //  logger.info(`Store size is ${storeSize} Mega Bytes`, storeSize);

    } catch (e) {
        // Exception occurs when circular reference is present in store.
        window.alert({ message: 'Very low offline storage space. Please go online to free space.' });
    }
});
