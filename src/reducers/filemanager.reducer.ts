import _ from 'lodash';
import * as RNFS from 'react-native-fs';
import FileManagerActions from '../actions/filemanager.action';
import { IFileManagerState } from './../interfaces/index';
const initialState: IFileManagerState = {
    Source: [],
    Destination: [],
    SelectedAction: '',
    PathStack: [RNFS.ExternalStorageDirectoryPath],
    IsMenuClicked: false
};

export function FileManager(state: IFileManagerState = initialState, action: any) {
    switch (action.type) {
        case FileManagerActions.SELECT_SOURCE: {
            state.Source.push(action.payload);
            return _.extend({}, state);
        }
        case FileManagerActions.DESELECT_SOURCE: {
            state.Source = _.filter(state.Source, (source) => {
                return source !== action.payload;
            });
            if (_.isEmpty(state.Source)) {
                state.SelectedAction = '';
            }
            return _.extend({}, state);
        }
        case FileManagerActions.SELECT_DESTINATION: {
            state.Destination.push(action.payload);
            return _.extend({}, state);
        }
        case FileManagerActions.DESELECT_DESTINATION: {
            state.Destination = _.filter(state.Source, (source) => {
                return source !== action.payload;
            });
            return _.extend({}, state);
        }
        case FileManagerActions.SELECTED_FILE_ACTION: {
            return _.extend({}, state, { SelectedAction: action.payload });
        }
        case FileManagerActions.FILE_ACTION_COMPLETED: {
            return _.extend({}, state, {
                SelectedOption: '',
                Destination: [],
                Source: []
            });
        }
        case FileManagerActions.OPEN_DIR: {
            state.PathStack.push(action.payload);
            return _.extend({}, state);
        }
        case FileManagerActions.CLOSE_DIR: {
            state.PathStack.pop();
            return _.extend({}, state);
        }
        case FileManagerActions.FILE_ACTION_CANCELLED: {
            return _.extend({}, state, {
                SelectedOption: '',
                Destination: [],
                Source: []
            });
        }
        default:
        return state;
    }
}
export default FileManager;
