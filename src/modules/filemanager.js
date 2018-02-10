import _ from 'lodash';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, ToastAndroid, ToolbarAndroid, View } from 'react-native';
import * as RNFS from 'react-native-fs';
import { connect } from 'react-redux';
import AppActions from '../actions/app.actions';
import FileManagerActions from '../actions/filemanager.action';
import ConfirmAction from '../components/confirmAction';
import CustomActivityIndicator from '../components/customActivityIndicator';
import FileSystem from '../components/fileSystem';
import Prompt from '../components/prompt';
import Properties from './../components/properties';
export class FileManager extends Component {
    constructor(props) {
        super(props);
        this.onPromptCancel = () => {
            this.props.Dispatch(FileManagerActions.togglePrompt(false));
            // this.setState({ isPromptVisible: false });
        };
        this.onPromptSubmit = (value) => {
            console.log('valueSSS', value);
            if (!value) {
                ToastAndroid.show(`No folder(s) name(s) entered`, ToastAndroid.SHORT);
                return;
            }
            this.props.Dispatch(FileManagerActions.togglePrompt(false));
            this.props.Dispatch(FileManagerActions.folderName(value.split(',')));
            setTimeout(() => { this.createNewFolder(); }, 10);
            // this.setState({ isPromptVisible: false, newFolder: value.split(',') },
            //     () => {
            //         console.log('statenewfolder', this.state.newFolder);
            //         if (_.isEmpty(this.state.newFolder)) {
            //             ToastAndroid.show(`No folder(s) name(s) entered`, ToastAndroid.SHORT);
            //             return;
            //         } else {
            //             this.createNewFolder();
            //         }
            //     });
        };
        this.promptTitle = 'New Folder';
        this.promptPlaceHolder = 'foldername (or) folder1 name,folder2 name,...';
        this._toolbarActions = () => [
            { title: 'menu', icon: require('./../../res/toolbar/menu.png'), show: 'always' }
        ];
        this._onActionSelected = (position) => {
            let menu = this._menuDataList();
            this.onActionSelected(menu[position].title);
        };
        this.fileSystemProps = () => ({
            setPropsToState: this.setPropsToState,
            source: this.props.Source,
            destination: this.props.Destination,
            selectedOption: this.props.SelectedAction,
            pathStack: this.props.PathStack
        });
        this.promptProps = () => ({
            title: this.promptTitle,
            placeholder: this.promptPlaceHolder,
            visible: this.props.IsPromptVisible,
            onCancel: this.onPromptCancel,
            onSubmit: this.onPromptSubmit
        });
        this.actions = () => {
            switch (this.props.SelectedAction) {
                case 'copy': return this.copy;
                case 'move': return this.move;
                case 'copy here': return this.copy;
                case 'move here': return this.move;
                case 'delete': return this.delete;
                case '': return this.initialState;
                default:
            }
        };
        this.initialState = () => {
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
        };
        this.confirmActionProps = () => ({
            setPropsToState: this.setPropsToState,
            selectedOption: this.props.SelectedAction,
            action: this.actions()
        });
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
        this._menuDataList = () => {
            if (!_.isEmpty(this.props.Source) && this.props.SelectedAction && this.props.SelectedAction !== 'delete') {
                return [
                    { title: `${this.props.SelectedAction} here`, show: 'never' }
                ];
            }
            else if (!_.isEmpty(this.props.Source)) {
                return [
                    { title: 'copy', show: 'never' },
                    { title: 'move', show: 'never' },
                    { title: 'delete', show: 'never' },
                    { title: 'properties', show: 'never' },
                    { title: 'new folder', show: 'never' }
                ];
            }
            else if (this.props.Source.length === 1) {
                return [
                    { title: 'copy', show: 'never' },
                    { title: 'move', show: 'never' },
                    { title: 'delete', show: 'never' },
                    { title: 'properties', show: 'never' },
                    { title: 'rename', show: 'never' },
                    { title: 'new folder', show: 'never' }
                ];
            }
            else {
                return [
                    { title: 'properties', show: 'never' },
                    { title: 'rename', show: 'never' },
                    { title: 'new folder', show: 'never' }
                ];
            }
        };
        // menuData = {
        //     data: this.menuDataList.bind(this),
        //     style: styles,
        //     onPress: (option) => this.onActionSelected(option)
        // };
        this.back = () => {
            console.log('back clicked', this.props);
            if (this.props.PathStack.length !== 1) {
                this.props.Dispatch(FileManagerActions.closeDir());
                return true;
            }
            else {
                return false;
            }
        };
        this.onActionSelected = (option) => {
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
                case 'rename': this.setState({ isRenameClicked: true });
                case 'move here':
                case 'copy here': {
                    this.props.Dispatch(FileManagerActions.selectDestination(_.last(this.props.PathStack)));
                    // let _destination = this.props.Destination;
                    // _destination.push(_.last(this.props.PathStack));
                    // this.setState({ destination: _destination });
                }
                default:
            }
        };
        this.createNewFolder = () => {
            console.log('in newfolder', this.props.NewFolderName);
            if (!_.isEmpty(this.props.Source)) {
                this.props.Dispatch(AppActions.setTaskStatus(true));
                // this.setState({ inTask: true });
                _.each(this.props.Source, (path) => {
                    _.each(this.props.NewFolderName, (name) => {
                        RNFS.mkdir(path + '/' + name)
                            .then((dir) => {
                            console.log(dir);
                            ToastAndroid.show(`new folder ${name} created at ${path}/`, ToastAndroid.SHORT);
                            Promise.resolve();
                        })
                            .catch((dir) => {
                            console.log(dir);
                            ToastAndroid.show(`failed to create new folder ${name} at ${path}/`, ToastAndroid.SHORT);
                        });
                    });
                });
            }
            else {
                _.each(this.props.NewFolderName, (name) => {
                    RNFS.mkdir(_.last(this.props.PathStack) + '/' + name)
                        .then((dir) => {
                        console.log(dir);
                        ToastAndroid.show(`new folder ${name} created at ${_.last(this.props.PathStack)}/`, ToastAndroid.SHORT);
                        Promise.resolve();
                    })
                        .catch((dir) => {
                        console.log(dir);
                        ToastAndroid.show(`failed to create new folder ${name} at ${_.last(this.props.PathStack)}/`, ToastAndroid.SHORT);
                    });
                });
            }
            this.props.Dispatch(FileManagerActions.setInitialState(1));
            // this.setState({ source: [], destination: [], selectedOption: '', newFolder: [], inTask: false });
        };
        this.copy = () => {
            this.setState({ isTaskRunning: true });
            if (this.props.Source.length === 0) {
                ToastAndroid.show(`No file(s)/folder(s) selected`, ToastAndroid.SHORT);
                this.setState({ isTaskRunning: false });
                return;
            }
            this.setState({ inTask: true });
            let copyCount = 0;
            _.each(this.props.Source, (source) => {
                _.each(this.props.Destination, (destination) => {
                    RNFS.copyFile(source, destination + '/' + _.last(source.split('/')))
                        .then((copy) => {
                        console.log(copy);
                        ToastAndroid.show(`${_.last(source.split('/'))} copied to ${destination}`, ToastAndroid.SHORT);
                        copyCount++;
                        Promise.resolve(copyCount);
                    })
                        .catch((err) => {
                        console.log(err);
                        ToastAndroid.show(`failed to copy ${_.last(source.split('/'))} to ${destination}`, ToastAndroid.SHORT);
                    });
                });
            });
            ToastAndroid.show(`total ${copyCount} file(s)/folder(s) copied out of ${this.props.Source.length}`, ToastAndroid.SHORT);
            this.props.Dispatch(FileManagerActions.setInitialState());
            // this.setState({ source: [], destination: [], selectedOption: '', inTask: false });
        };
        this.move = () => {
            if (this.props.Source.length === 0) {
                ToastAndroid.show(`No file(s)/folder(s) selected`, ToastAndroid.SHORT);
                return;
            }
            this.setState({ inTask: true });
            let moveCount = 0;
            _.each(this.props.Source, (source) => {
                _.each(this.props.Destination, (destination) => {
                    RNFS.moveFile(source, destination + '/' + _.last(source.split('/')))
                        .then((move) => {
                        console.log(move);
                        ToastAndroid.show(`${_.last(source.split('/'))} moved to ${destination}`, ToastAndroid.SHORT);
                        moveCount++;
                        Promise.resolve();
                    })
                        .catch((err) => {
                        console.log(err);
                        ToastAndroid.show(`failed to move ${_.last(source.split('/'))} to ${destination}`, ToastAndroid.SHORT);
                    });
                });
            });
            ToastAndroid.show(`total ${moveCount} file(s)/folder(s) moved out of ${this.props.Source.length}`, ToastAndroid.SHORT);
            // this.setState({ source: [], destination: [], selectedOption: '', inTask: false });
            this.props.Dispatch(FileManagerActions.setInitialState());
        };
        this.delete = () => {
            if (this.props.Source.length === 0) {
                ToastAndroid.show(`No file(s)/folder(s) selected`, ToastAndroid.SHORT);
                return;
            }
            this.setState({ inTask: true });
            let deletedCount = 0;
            _.each(this.props.Source, (source) => {
                RNFS.unlink(source)
                    .then((res) => {
                    console.log(res);
                    ToastAndroid.show(`${source} deleted`, ToastAndroid.SHORT);
                    deletedCount++;
                })
                    .catch((err) => {
                    console.log(err);
                    ToastAndroid.show(`failed to delete ${source}`, ToastAndroid.SHORT);
                });
            });
            ToastAndroid.show(`total ${deletedCount} file(s)/folder(s) deleted`, ToastAndroid.SHORT);
            this.props.Dispatch(FileManagerActions.setInitialState());
            // this.setState({ source: [], destination: [], selectedOption: '', inTask: false });
        };
        // modalVisibilityHandler = () => {
        //     this.setState({ isModalVisible: !this.state.isModalVisible });
        // }
        this.setPropsToState = (props, callback) => {
            this.setState(props, callback && callback());
        };
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
            inTask: false
        };
    }
    render() {
        console.log('PROPS', this.props);
        return (React.createElement(View, { style: styles.container },
            React.createElement(View, null,
                React.createElement(ToolbarAndroid, { style: styles.toolbar, title: 'File Manager', actions: this._menuDataList(), onActionSelected: this._onActionSelected, navIcon: require('./../../res/toolbar/back.png'), onIconClicked: this.back })),
            React.createElement(View, { style: this.props.SelectedAction !== '' && !_.isEmpty(this.props.Destination) ?
                    styles.fileSystemAfterOption :
                    styles.fileSystemBeforeOption },
                React.createElement(FileSystem, Object.assign({}, this.fileSystemProps()))),
            React.createElement(View, { style: styles.confirmAction }, this.props.SelectedAction !== '' && !_.isEmpty(this.props.Destination) && React.createElement(ConfirmAction, Object.assign({}, this.confirmActionProps()))),
            React.createElement(View, null, this.props.IsPromptVisible && this.props.SelectedAction === 'new folder' && React.createElement(Prompt, Object.assign({}, this.promptProps()))),
            React.createElement(View, null, this.props.IsPromptVisible && this.props.SelectedAction === 'properties' && React.createElement(Properties, null)),
            React.createElement(View, null, this.props.InTask && React.createElement(CustomActivityIndicator, { isVisible: this.props.InTask }))));
    }
}
function mapStateToProps(state) {
    return {
        PathStack: state.FileManager.PathStack,
        Source: state.FileManager.Source,
        Destination: state.FileManager.Destination,
        SelectedAction: state.FileManager.SelectedAction,
        IsPromptVisible: state.FileManager.IsPromptVisible,
        InTask: state.App.InTask,
        NewFolderName: state.FileManager.NewFolderName,
        TimeStamp: new Date().getTime()
    };
}
function mapDispatchToProps(dispatch) {
    return { Dispatch: dispatch };
}
export default connect(mapStateToProps, mapDispatchToProps)(FileManager);
// export default FileManager
const styles = StyleSheet.create({
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
    longPressMenu: {},
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
