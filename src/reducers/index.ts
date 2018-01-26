import {combineReducers, createStore} from 'redux'
import {FileManager} from './filemanager.reducer'
import {App} from './app.reducer'
const Reducer = combineReducers({
    FileManager, App
})
export default function configureStore(initialState: any) {
    const store: any = createStore(Reducer, initialState)
    return store
}