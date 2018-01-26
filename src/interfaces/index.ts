import { IFileManagerState, FileManagerProps, FileSystemProps } from './filemanager.interface'
import { IAppState } from './app.interface'
import {Dispatch, Action} from 'redux'
export  {IAppState} from './app.interface'
export {IFileManagerState, FileManagerProps, FileSystemProps} from './filemanager.interface'
export interface IReducer {
    App: IAppState
    FileManager: IFileManagerState
}
export type _Dispatch= Dispatch<Action>
export let dispatch: _Dispatch