import { IAppState } from './app.interface';
import { FileManagerProps, FileSystemProps, IFileManagerState } from './filemanager.interface';
export { IAppState } from './app.interface';
export { IFileManagerState, FileManagerProps, FileSystemProps };
export interface IReducer {
    App: IAppState;
    FileManager: IFileManagerState;
}
