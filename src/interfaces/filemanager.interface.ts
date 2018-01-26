export interface IFileManagerState {
    Source: Array<String>
    Destination: Array<String>
    SelectedAction: String
    PathStack: Array<String>
    IsMenuClicked: boolean
}
export interface FileManagerProps {
    Source: Array<string>
    Destination: Array<string>
    PathStack: Array<string>
    SelectedAction: string
}
export interface FileSystemProps {
    Dispatch: any
    Source: Array<string>
    Destination: Array<string>
    PathStack: Array<string>
    SelectedAction: string
}