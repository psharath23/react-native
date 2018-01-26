import FileManagerActions from '../actions/filemanager.action'
import _ from 'lodash'
import {IAppState} from './../interfaces/app.interface'
const initialState: IAppState = {
    SelectedApp: '',
    InTask: false
}
export function App(state: IAppState= initialState, action: any) {
    switch (action.payload) {
    case FileManagerActions.SELECTED_FILE_ACTION: {
        return _.extend({}, state, {InTask: true})
    }
    case FileManagerActions.FILE_ACTION_COMPLETED: {
        return _.extend({}, state, {InTask: false})
    }
}
}
export default App