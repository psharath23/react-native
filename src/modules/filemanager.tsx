import _ from 'lodash';
import React, { Component } from 'react';
import {
    BackHandler,
    Dimensions,
    StyleSheet,
    ToastAndroid,
    ToolbarAndroid,
    View
} from 'react-native';
import * as RNFS from 'react-native-fs';
import { connect } from 'react-redux';
import AppActions from '../actions/app.actions';
import FileManagerActions from '../actions/filemanager.action';
import ConfirmAction from '../components/confirmAction';
import CustomActivityIndicator from '../components/customActivityIndicator';
import FileSystem from '../components/fileSystem';
import ListMenu from '../components/listMenu';
import Prompt from '../components/prompt';
import { Rename } from '../components/rename';
import Properties from './../components/properties';
import { FileManagerProps, IReducer } from './../interfaces';
export class FileManager extends Component<FileManagerProps, any> {
    constructor(props) {
        super(props);
        this.state = {
            pathStack: [RNFS.ExternalStorageDirectoryPath],
            source: [],
            destination: [],
            isMenuClicked: false,
            selectedOption: '',
            isActionConfirmed: false,
            newFolder: [],
            isPromptVisible: false,
            isRenameClicked: false,
            inTask: false,
            fileSystem: []
        };
    }
    componentDidMount() {
        this.getFS();
        BackHandler.addEventListener('hardwareBackPress', () => {
            return this.back();
        });

    }
    componentWillUnmount() {

        BackHandler.removeEventListener('hardwareBackPress', () => {
            return this.back();

        });
    }
    componentWillReceiveProps(nextProps) {
        // this.getFS();
    }
    back = () => {
        if (this.props.PathStack.length !== 1) {
            this.props.Dispatch(FileManagerActions.closeDir());
            return true;
        } else {
            return false;
        }

    }
    onPromptCancel = () => {
        this.props.Dispatch(FileManagerActions.togglePrompt(false));
        // this.setState({ isPromptVisible: false });
    }
    onPromptSubmit = (value) => {
        switch (this.props.SelectedAction) {
            case 'new folder': {
                if (!value) {
                    ToastAndroid.show(`No folder(s) name(s) entered`, ToastAndroid.SHORT);
                    return;
                }
                this.props.Dispatch(FileManagerActions.togglePrompt(false));
                this.props.Dispatch(FileManagerActions.folderName(value.split(',')));
                setTimeout(() => { this.createNewFolder(); }, 10);
                break;
            }
            case 'rename': {
                if (!value) {
                    ToastAndroid.show(`No folder(s) name(s) entered`, ToastAndroid.SHORT);
                    return;
                }
                this.props.Dispatch(FileManagerActions.togglePrompt(false));
                this.props.Dispatch(FileManagerActions.reName(value));
                setTimeout(() => { this.reName(); }, 10);
                break;
            }
            default:
        }

        // this.setState({ isPromptVisible: false, newFolder: value.split(',') },
        //     () => {
        //
        //         if (_.isEmpty(this.state.newFolder)) {
        //             ToastAndroid.show(`No folder(s) name(s) entered`, ToastAndroid.SHORT);
        //             return;
        //         } else {
        //             this.createNewFolder();
        //         }
        //     });
    }
    promptTitle = 'New Folder';
    renameTitle = 'Rename';
    promptPlaceHolder = 'foldername (or) folder1 name,folder2 name,...';
    renamePlaceHolder = 'name';
    _toolbarActions = () => [
        { title: 'menu', icon: require('./../../res/toolbar/menu.png'), show: 'always' }
    ]
    _onActionSelected = (position) => {
        let menu = this._menuDataList();
        this.onActionSelected(menu[position].title);
    }
    fileSystemProps = () => ({
        setPropsToState: this.setPropsToState,
        source: this.props.Source,
        destination: this.props.Destination,
        selectedOption: this.props.SelectedAction,
        pathStack: this.props.PathStack,
        fileSystem: this.state.fileSystem
    })
    promptProps = () => ({
        title: this.promptTitle,
        placeholder: this.promptPlaceHolder,
        visible: this.props.IsPromptVisible,
        onCancel: this.onPromptCancel,
        onSubmit: this.onPromptSubmit
    })
    renameProps = () => ({
        title: this.renameTitle,
        placeholder: this.renamePlaceHolder,
        visible: this.props.IsPromptVisible,
        onCancel: this.onPromptCancel,
        onSubmit: this.onPromptSubmit,
        reName: this.props.ReName
    })
    propertiesProps = () => ({
        title: 'Properties',
        onCancel: () => { this.props.Dispatch(FileManagerActions.togglePrompt(false)); },
        onSubmit: () => { this.props.Dispatch(FileManagerActions.togglePrompt(false)); }
    })
    actions = () => {
        switch (this.props.SelectedAction) {
            case 'copy': return this.copy;
            case 'move': return this.move;
            case 'copy here': return this.copy;
            case 'move here': return this.move;
            case 'delete': return this.delete;
            case '': return this.initialState;
            default:
        }
    }
    initialState = () => {
        this.props.Dispatch(FileManagerActions.setInitialState());
        // this.setState({
        //     pathStack: [RNFS.ExternalStorageDirectoryPath],
        //     source: [],
        //     destination: [],
        //     isMenuClicked: false,
        //     selectedOption: '',
        //     isActionConfirmed: false,
        //     inTask: false
        // });
    }
    confirmActionProps = () => ({
        setPropsToState: this.setPropsToState,
        selectedOption: this.props.SelectedAction,
        action: this.actions(),
        title: 'Are you sure'
    })
    // menuDataList = () => {
    //     if (!_.isEmpty(this.state.source) && this.state.selectedOption && this.state.selectedOption !== 'delete') {
    //         return [`${this.state.selectedOption} here`];
    //     } else if (!_.isEmpty(this.state.source)) {
    //         return ['copy', 'move', 'delete', 'properties'];
    //     } else if (this.state.source.length === 1) {
    //         return ['copy', 'move', 'delete', 'properties', 'rename'];
    //     } else {
    //         return ['new folder', 'properties'];
    //     }
    // }
    _menuDataList = () => {
        if (!_.isEmpty(this.props.Source) && this.props.SelectedAction && this.props.SelectedAction !== 'delete') {
            return [
                { title: `${this.props.SelectedAction} here`, show: 'never' }
            ];
        } else if (!_.isEmpty(this.props.Source) && this.props.Source.length !== 1) {
            return [
                { title: 'copy', show: 'never' },
                { title: 'move', show: 'never' },
                { title: 'delete', show: 'never' },
                { title: 'properties', show: 'never' },
                { title: 'new folder', show: 'never' }
            ];
        } else if (this.props.Source.length === 1) {
            return [
                { title: 'copy', show: 'never' },
                { title: 'move', show: 'never' },
                { title: 'delete', show: 'never' },
                { title: 'properties', show: 'never' },
                { title: 'rename', show: 'never' },
                { title: 'new folder', show: 'never' }
            ];
        } else {
            return [
                { title: 'properties', show: 'never' },
                // { title: 'rename', show: 'never' },
                { title: 'new folder', show: 'never' }
            ];
        }
    }
    // menuData = {
    //     data: this.menuDataList.bind(this),
    //     style: styles,
    //     onPress: (option) => this.onActionSelected(option)
    // };
    onActionSelected = (option) => {
        this.props.Dispatch(FileManagerActions.selectedFileAction(option));
        // this.setState({ selectedOption: option, isMenuClicked: false });
        switch (option) {
            case 'delete': {
                this.delete();
                break;
            }
            case 'new folder': {
                this.props.Dispatch(FileManagerActions.togglePrompt(true));
                // this.setState({ isPromptVisible: true });
                break;
            }
            case 'properties': {
                this.props.Dispatch(FileManagerActions.togglePrompt(true));
                break;
            }
            case 'rename': {
                this.props.Dispatch(FileManagerActions.reName(_.last(_.last(this.props.Source).split('/'))));
                this.props.Dispatch(FileManagerActions.togglePrompt(true));
                break;
            }
            case 'move here':
            case 'copy here': {
                this.props.Dispatch(FileManagerActions.selectDestination(_.last(this.props.PathStack)));
                // let _destination = this.props.Destination;
                // _destination.push(_.last(this.props.PathStack));
                // this.setState({ destination: _destination });
            }
            default:
        }
    }
    createNewFolder = () => {
        if (!_.isEmpty(this.props.Source)) {
            this.props.Dispatch(AppActions.setTaskStatus(true));
            // this.setState({ inTask: true });
            _.each(this.props.Source, (path) => {
                _.each(this.props.NewFolderName, (name) => {
                    RNFS.mkdir(path + '/' + name)
                        .then((dir) => {

                            ToastAndroid.show(`new folder ${name} created at ${path}/`, ToastAndroid.SHORT);
                            Promise.resolve();
                        })
                        .catch((dir) => {

                            ToastAndroid.show(`failed to create new folder ${name} at ${path}/`, ToastAndroid.SHORT);
                        });
                });
            });
            this.props.Dispatch(AppActions.setTaskStatus(false));
        } else {
            this.props.Dispatch(AppActions.setTaskStatus(true));
            _.each(this.props.NewFolderName, (name) => {
                RNFS.mkdir(_.last(this.props.PathStack) + '/' + name)
                    .then((dir) => {

                        ToastAndroid.show(`new folder ${name} created at ${_.last(this.props.PathStack)}/`, ToastAndroid.SHORT);
                        Promise.resolve();
                    })
                    .catch((dir) => {

                        ToastAndroid.show(`failed to create new folder ${name} at ${_.last(this.props.PathStack)}/`, ToastAndroid.SHORT);
                    });
            });
            this.props.Dispatch(AppActions.setTaskStatus(false));
        }
        this.props.Dispatch(FileManagerActions.setInitialState(1));
        // this.setState({ source: [], destination: [], selectedOption: '', newFolder: [], inTask: false });
    }
    reName = () => {

        if (_.isEmpty(this.props.Source)) {
            ToastAndroid.show(`Please select a File/Folder`, ToastAndroid.SHORT);
            return;
        } else {

            let renameArr = _.last(this.props.Source).split('/');
            renameArr[renameArr.length - 1] = this.props.ReName;
            let newName = renameArr.join('/');
            let from = _.last(_.last(this.props.Source).split('/'));
            let to = _.last(newName.split('/'));
            RNFS.moveFile(_.last(this.props.Source), newName)
                .then((move) => {

                    ToastAndroid.show(`${from} renamed to ${to}`, ToastAndroid.SHORT);
                    Promise.resolve();
                })
                .catch((err) => {

                    ToastAndroid.show(`failed to rename ${from} to ${to}`, ToastAndroid.SHORT);
                });
        }
        this.props.Dispatch(FileManagerActions.setInitialState(1));
        // this.setState({ source: [], destination: [], selectedOption: '', newFolder: [], inTask: false });
    }
    copy = () => {

        if (this.props.Source.length === 0) {
            ToastAndroid.show(`No file(s)/folder(s) selected`, ToastAndroid.SHORT);
            this.setState({ isTaskRunning: false });
            return;
        }
        this.props.Dispatch(AppActions.setTaskStatus(true));
        let copyCount = 0;
        _.each(this.props.Source, (source) => {
            _.each(this.props.Destination, (destination) => {
                RNFS.copyFile(source, destination + '/' + _.last(source.split('/')))
                    .then((copy) => {

                        ToastAndroid.show(`${_.last(source.split('/'))} copied to ${destination}`, ToastAndroid.SHORT);
                        copyCount++;
                        Promise.resolve(copyCount);
                    })
                    .catch((err) => {

                        ToastAndroid.show(`failed to copy ${_.last(source.split('/'))} to ${destination}`, ToastAndroid.SHORT);
                    });
            });
        });
        ToastAndroid.show(`total ${copyCount} file(s)/folder(s) copied out of ${this.props.Source.length}`, ToastAndroid.SHORT);
        this.props.Dispatch(AppActions.setTaskStatus(false));
        this.props.Dispatch(FileManagerActions.setInitialState());
        // this.setState({ source: [], destination: [], selectedOption: '', inTask: false });
    }
    move = () => {
        if (this.props.Source.length === 0) {
            ToastAndroid.show(`No file(s)/folder(s) selected`, ToastAndroid.SHORT);
            return;
        }
        this.props.Dispatch(AppActions.setTaskStatus(true));
        let moveCount = 0;
        _.each(this.props.Source, (source) => {
            _.each(this.props.Destination, (destination) => {
                RNFS.moveFile(source, destination + '/' + _.last(source.split('/')))
                    .then((move) => {

                        ToastAndroid.show(`${_.last(source.split('/'))} moved to ${destination}`, ToastAndroid.SHORT);
                        moveCount++;
                        Promise.resolve();
                    })
                    .catch((err) => {

                        ToastAndroid.show(`failed to move ${_.last(source.split('/'))} to ${destination}`, ToastAndroid.SHORT);
                    });
            });
        });
        this.props.Dispatch(AppActions.setTaskStatus(false));
        ToastAndroid.show(`total ${moveCount} file(s)/folder(s) moved out of ${this.props.Source.length}`, ToastAndroid.SHORT);
        // this.setState({ source: [], destination: [], selectedOption: '', inTask: false });
        this.props.Dispatch(FileManagerActions.setInitialState());
    }
    delete = () => {
        if (this.props.Source.length === 0) {
            ToastAndroid.show(`No file(s)/folder(s) selected`, ToastAndroid.SHORT);
            return;
        }
        this.setState({ inTask: true });
        let deletedCount = 0;
        _.each(this.props.Source, (source) => {
            RNFS.unlink(source)
                .then((res) => {

                    ToastAndroid.show(`${source} deleted`, ToastAndroid.SHORT);
                    deletedCount++;
                })
                .catch((err) => {

                    ToastAndroid.show(`failed to delete ${source}`, ToastAndroid.SHORT);
                });
        });
        ToastAndroid.show(`total ${deletedCount} file(s)/folder(s) deleted`, ToastAndroid.SHORT);
        this.props.Dispatch(FileManagerActions.setInitialState());
        // this.setState({ source: [], destination: [], selectedOption: '', inTask: false });
    }
    // modalVisibilityHandler = () => {
    //     this.setState({ isModalVisible: !this.state.isModalVisible });
    // }
    setPropsToState = (props, callback) => {
        this.setState(props, callback && callback());
    }
    getFS = async () => {
        this.props.Dispatch(AppActions.setTaskStatus(true));
        let fileSystem = await RNFS.readDir(_.last(this.props.PathStack));
        this.props.Dispatch(AppActions.setTaskStatus(false));
        this.setState({ fileSystem });
    }
    render() {

        return (
            <View style={styles.container}>
                <View>
                    <ToolbarAndroid style={styles.toolbar}
                        title='File Manager'
                        actions={this._menuDataList()}
                        onActionSelected={this._onActionSelected}
                        navIcon={require('./../../res/toolbar/back.png')}
                        onIconClicked={this.back}
                    />
                </View>
                {/* <View>
                    {
                        this.state.isMenuClicked === true && <ListMenu  {...this.menuData} />
                    }
                </View> */}
                <View style={
                    this.props.SelectedAction !== '' && !_.isEmpty(this.props.Destination) ?
                        styles.fileSystemAfterOption :
                        styles.fileSystemBeforeOption
                }>
                    <FileSystem {...this.fileSystemProps()} />
                </View>
                <View style={styles.confirmAction}>
                    {
                        this.props.SelectedAction !== '' && !_.isEmpty(this.props.Destination) && <ConfirmAction {...this.confirmActionProps()} />
                    }
                </View>
                <View>
                    {
                        this.props.IsPromptVisible && this.props.SelectedAction === 'new folder' && <Prompt {...this.promptProps()} />
                    }
                </View>
                <View>
                    {
                        this.props.IsPromptVisible && this.props.SelectedAction === 'rename' && <Rename {...this.renameProps()} />
                    }
                </View>
                <View>
                    {
                        this.props.IsPromptVisible && this.props.SelectedAction === 'properties' && <Properties {...this.propertiesProps()} />
                    }
                </View>
                <View >
                    {this.props.InTask && <CustomActivityIndicator isVisible={this.props.InTask} />}
                </View>
            </View >
        );
    }
}
function mapStateToProps(state: IReducer) {
    return {
        PathStack: state.FileManager.PathStack,
        Source: state.FileManager.Source,
        Destination: state.FileManager.Destination,
        SelectedAction: state.FileManager.SelectedAction,
        IsPromptVisible: state.FileManager.IsPromptVisible,
        InTask: state.App.InTask,
        NewFolderName: state.FileManager.NewFolderName,
        ReName: state.FileManager.ReName
    };
}
function mapDispatchToProps(dispatch: any) {
    return { Dispatch: dispatch };
}
export default connect(mapStateToProps, mapDispatchToProps)(FileManager);
// export default FileManager
const styles: any = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#303a4c'
    },
    listItem: {
        flexDirection: 'row',
        height: 50,
        borderStyle: 'solid',
        borderColor: 'black',
        borderRadius: 5,
        margin: 2
    },
    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        backgroundColor: '#a9c1e8'
    },
    directoryText: {
        paddingLeft: 20,
        color: '#ffffff',
        textAlign: 'center',
        fontStyle: 'italic'
    },
    fileText: {
        paddingLeft: 20,
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    directory: {
        backgroundColor: '#124599'
    },
    file: {
        backgroundColor: '#124599'
    },
    dirImage: {
        paddingLeft: 20,
        height: 40,
        width: 40
    },
    fileImage: {
        paddingLeft: 20,
        height: 40,
        width: 40
    },
    longPressMenu: {

    },
    longPressMenuItem: {
        padding: 5,
        backgroundColor: '#ffffff',
        color: '#020202',
        textAlign: 'center'
    },
    longPressActionInfo: {
        // height: 50,
        opacity: 5
    },
    pathText: {
        color: '#f4bc42',
        fontWeight: 'bold'
    },
    cancelOperation: {
        color: '#d60000',
        fontWeight: 'bold'
    },
    proceedOperation: {
        color: '#0c872a',
        fontWeight: 'bold'
    },
    operationText: {
        color: '#ffffff',
        fontWeight: 'bold'
    },
    menuList: {
        position: 'absolute',
        right: 20,
        top: -10,
        width: 100,
        backgroundColor: '#ffffff',
        zIndex: 1
    },
    fileSystemBeforeOption: {
        overflow: 'visible', height: Dimensions.get('window').height - 70
    },
    fileSystemAfterOption: {
        overflow: 'visible', height: Dimensions.get('window').height - 100
    },
    confirmAction: {
        // height: 100,
        // position:'absolute',
        // bottom:0,
        width: '100%',
        zIndex: 2
    }

});
