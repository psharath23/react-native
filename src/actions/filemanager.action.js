export default class FileManagerActions {
}
FileManagerActions.SELECT_SOURCE = 'SELECT_SOURCE';
FileManagerActions.selectSource = (selectedSource) => {
    return {
        type: FileManagerActions.SELECT_SOURCE,
        payload: selectedSource
    };
};
FileManagerActions.DESELECT_SOURCE = 'DESELECT_SOURCE';
FileManagerActions.deSelectSource = (deselectedSource) => {
    return {
        type: FileManagerActions.DESELECT_SOURCE,
        payload: deselectedSource
    };
};
FileManagerActions.SELECT_DESTINATION = 'SELECT_DESTINATION';
FileManagerActions.selectDestination = (selectedDestination) => {
    return {
        type: FileManagerActions.SELECT_DESTINATION,
        payload: selectedDestination
    };
};
FileManagerActions.DESELECT_DESTINATION = 'DESELECT_DESTINATION';
FileManagerActions.deSelectDestination = (deselectedDestination) => {
    return {
        type: FileManagerActions.DESELECT_DESTINATION,
        payload: deselectedDestination
    };
};
FileManagerActions.SELECTED_FILE_ACTION = 'SELECTED_FILE_ACTION';
FileManagerActions.selectedFileAction = (selectedFileAction) => {
    return {
        type: FileManagerActions.SELECTED_FILE_ACTION,
        payload: selectedFileAction
    };
};
FileManagerActions.FILE_ACTION_CONFIRMED = 'FILE_ACTION_CONFIRMED';
FileManagerActions.fileActionConfirmed = () => {
    return {
        type: FileManagerActions.FILE_ACTION_CONFIRMED
    };
};
FileManagerActions.FILE_ACTION_COMPLETED = 'FILE_ACTION_COMPLETED';
FileManagerActions.fileActionCompleted = () => {
    return {
        type: FileManagerActions.FILE_ACTION_COMPLETED
    };
};
FileManagerActions.OPEN_DIR = 'OPEN_DIR';
FileManagerActions.openDir = (dir) => {
    return {
        type: FileManagerActions.OPEN_DIR,
        payload: dir
    };
};
FileManagerActions.CLOSE_DIR = 'CLOSE_DIR';
FileManagerActions.closeDir = () => {
    return {
        type: FileManagerActions.CLOSE_DIR
    };
};
FileManagerActions.FILE_ACTION_CANCELLED = 'FILE_ACTION_CANCELLED';
FileManagerActions.cancelFileAction = () => {
    return {
        type: FileManagerActions.FILE_ACTION_CANCELLED
    };
};
FileManagerActions.TOGGLE_PROMPT = 'TOGGLE_PROMPT';
FileManagerActions.togglePrompt = (promptStatus) => {
    return {
        payload: promptStatus,
        type: FileManagerActions.TOGGLE_PROMPT
    };
};
FileManagerActions.NEW_FOLDER_NAME = 'NEW_FOLDER_NAME';
FileManagerActions.folderName = (folderName) => {
    return {
        payload: folderName,
        type: FileManagerActions.NEW_FOLDER_NAME
    };
};
FileManagerActions.SET_INITIAL_STATE = 'SET_INITIAL_STATE';
FileManagerActions.setInitialState = (type) => {
    return {
        payload: type,
        type: FileManagerActions.SET_INITIAL_STATE
    };
};
