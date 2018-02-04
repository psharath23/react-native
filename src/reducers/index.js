import { combineReducers } from 'redux';
import { App } from './app.reducer';
import { FileManager } from './filemanager.reducer';
export const Reducer = combineReducers({
    FileManager, App
});
