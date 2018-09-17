
import * as RNFS from 'react-native-fs';
import {
    applyMiddleware, compose, createStore, Middleware
} from 'redux';
import { createLogger } from 'redux-logger';
import promise from 'redux-promise';
import thunk from 'redux-thunk';
import { IAppState } from 'src/interfaces/app.interface';
import { IFileManagerState } from 'src/interfaces/filemanager.interface';
import { FileManager } from 'src/reducers/filemanager.reducer';
import { IReducer } from './../interfaces/index';
import { Reducer } from './../reducers/index';
const logger = createLogger();
function configureStore(initialState: any): any {
    const _store = createStore(
        Reducer,
        compose(
            applyMiddleware(..._getMiddleware()))
    );
    return _store;
}
function _getMiddleware(): Middleware[] {
    let middleware = [
        promise,
        thunk

    ];

    if (__DEV__) {
        middleware = [...middleware, logger];
    }

    return middleware;
}
export const store: {
    dispatch: any,
    getState: () => IReducer
    subscribe: any;
} = configureStore({});

export const persistStore = require('redux-persist').persistStore;

export function initReduxStore(cb?) {

    persistStore(store, {}, (err: any, state?: any) => {
        if (err) {

        } else {
            cb();
        }
    });
}

// Listen to store changes and wanr user if offline storage is used abovce 4 MB
// After JSON stringify each char in string will occupy 1 byte space. Verified by exporing complete store to json file
