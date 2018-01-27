export default class FileManagerActions {
    static SELECT_SOURCE = 'SELECT_SOURCE';
    static selectSource = (selectedSource) => {
        return {
            type: FileManagerActions.SELECT_SOURCE,
            payload: selectedSource
        };
    }
    static DESELECT_SOURCE = 'DESELECT_SOURCE';
    static deSelectSource = (deselectedSource) => {
        return {
            type: FileManagerActions.DESELECT_SOURCE,
            payload: deselectedSource
        };
    }
    static SELECT_DESTINATION = 'SELECT_DESTINATION';
    static selectDestination = (selectedDestination) => {
        return {
            type: FileManagerActions.SELECT_DESTINATION,
            payload: selectedDestination
        };
    }
    static DESELECT_DESTINATION = 'DESELECT_DESTINATION';
    static deSelectDestination = (deselectedDestination) => {
        return {
            type: FileManagerActions.DESELECT_DESTINATION,
            payload: deselectedDestination
        };
    }
    static SELECTED_FILE_ACTION = 'SELECTED_FILE_ACTION';
    static selectedFileAction = (selectedFileAction) => {
        return {
            type: FileManagerActions.SELECTED_FILE_ACTION,
            payload: selectedFileAction
        };
    }
    static FILE_ACTION_CONFIRMED = 'FILE_ACTION_CONFIRMED';
    static fileActionConfirmed = () => {
        return {
            type: FileManagerActions.FILE_ACTION_CONFIRMED
        };
    }
    static FILE_ACTION_COMPLETED = 'FILE_ACTION_COMPLETED';
    static fileActionCompleted = () => {
        return {
            type: FileManagerActions.FILE_ACTION_COMPLETED
        };
    }
    static OPEN_DIR = 'OPEN_DIR';
    static openDir = (dir) => {
        return {
            type: FileManagerActions.OPEN_DIR,
            payload: dir
        };
    }
    static CLOSE_DIR = 'CLOSE_DIR';
    static closeDir = () => {
        return {
            type: FileManagerActions.CLOSE_DIR
        };
    }
    static FILE_ACTION_CANCELLED = 'FILE_ACTION_CANCELLED';
    static cancelFileAction = () => {
        return {
            type: FileManagerActions.FILE_ACTION_CANCELLED
        };
    }
}
