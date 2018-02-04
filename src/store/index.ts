
import * as RNFS from 'react-native-fs';
import {
    applyMiddleware, createStore
} from 'redux';
import {createLogger} from 'redux-logger';
import promise from 'redux-promise';
import thunk from 'redux-thunk';
import { IAppState } from 'src/interfaces/app.interface';
import { IFileManagerState } from 'src/interfaces/filemanager.interface';
import { FileManager } from 'src/reducers/filemanager.reducer';
import { IReducer } from './../interfaces/index';
import {Reducer} from './../reducers/index';
const logger = createLogger();
function configureStore(initialState: any) {
    const _store = createStore(
        Reducer,
        applyMiddleware(thunk, promise));
    return _store;
}
export const store: any = configureStore({});

export const persistStore = require('redux-persist').persistStore;

export function initReduxStore(cb?) {
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
