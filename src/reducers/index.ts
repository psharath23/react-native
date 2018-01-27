import { combineReducers, createStore } from 'redux';
import { App } from './app.reducer';
import { FileManager } from './filemanager.reducer';
const Reducer = combineReducers({
    FileManager, App
});
export default function configureStore(initialState: any) {
    const store: any = createStore(Reducer, initialState);
    return store;
}
