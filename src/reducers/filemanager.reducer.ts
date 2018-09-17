import _ from 'lodash';
import * as RNFS from 'react-native-fs';
import FileManagerActions from '../actions/filemanager.action';
import { IFileManagerState } from './../interfaces/index';
const initialState: IFileManagerState = {
    Source: [],
    Destination: [],
    SelectedAction: '',
    PathStack: [RNFS.ExternalStorageDirectoryPath],
    IsMenuClicked: false,
    IsPromptVisible: false,
    NewFolderName: [],
    ReName: ''
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
        case FileManagerActions.TOGGLE_PROMPT: {
            return _.extend({}, state, {
                IsPromptVisible: action.payload
            });
        }
        case FileManagerActions.NEW_FOLDER_NAME: {
            return _.extend({}, state, {
                NewFolderName: action.payload
            });
        }
        case FileManagerActions.RENAME: {
            return _.extend({}, state, {
                ReName: action.payload
            });
        }
        case FileManagerActions.SET_INITIAL_STATE: {
            switch (action.payload) {
                case 1: {
                    return _.extend({}, state, {
                        Source: [],
                        Destination: [],
                        SelectedAction: '',
                        IsMenuClicked: false,
                        IsPromptVisible: false,
                        NewFolderName: []
                    });
                }
                default:
                    return _.extend({}, state, initialState);
            }
            // return _.extend({}, state, initialState);
        }
        default:
            return state;
    }
}
export default FileManager;
