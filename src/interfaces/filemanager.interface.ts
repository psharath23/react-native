export interface IFileManagerState {
    Source: Array<String>;
    Destination: Array<String>;
    SelectedAction: String;
    PathStack: Array<String>;
    IsMenuClicked: boolean;
    IsPromptVisible: boolean;
    NewFolderName: Array<string>;
    ReName: String;
}
export interface FileManagerProps {
    Source: Array<string>;
    Destination: Array<string>;
    PathStack: Array<string>;
    SelectedAction: string;
    IsPromptVisible: boolean;
    InTask: boolean;
    NewFolderName: Array<string>;
    ReName: String;
    Dispatch: any;
}
export interface FileSystemProps {
    Dispatch: any;
    Source: Array<string>;
    Destination: Array<string>;
    PathStack: Array<string>;
    SelectedAction: string;
    fileSystem: Array<any>;
}
