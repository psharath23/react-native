import _ from 'lodash';
import FileManagerActions from '../actions/filemanager.action';
import AppActions from './../actions/app.actions';
import { IAppState } from './../interfaces/app.interface';
const initialState: IAppState = {
    SelectedApp: '',
    InTask: false
};
export function App(state: IAppState = initialState, action: any) {
    switch (action.payload) {
        case FileManagerActions.SELECTED_FILE_ACTION: {
            return _.extend({}, state, { InTask: true });
        }
        case FileManagerActions.FILE_ACTION_COMPLETED: {
            return _.extend({}, state, { InTask: false });
        }
        case AppActions.IN_TASK: {
            return _.extend({}, state, { InTask: action.payload });
        }
        default:
            return state;
    }
}
export default App;
