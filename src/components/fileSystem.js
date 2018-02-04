import _ from 'lodash';
import React, { Component } from 'react';
import { BackHandler, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as RNFS from 'react-native-fs';
import Async from 'react-promise';
import { connect } from 'react-redux';
import FileManagerActions from '../actions/filemanager.action';
export class FileSystem extends Component {
    constructor(props) {
        super(props);
        this.back = () => {
            if (this.props.PathStack.length !== 1) {
                this.props.Dispatch(FileManagerActions.closeDir());
                return true;
            }
            else {
                return false;
            }
        };
        this.onPress = (selected) => {
            if (selected.isDirectory()) {
                this.props.Dispatch(FileManagerActions.openDir(selected.path));
            }
            console.log('selected', this.props);
        };
        this.onLongPress = (selected) => {
            if (!this.props.SelectedAction) {
                let isAlreadySelected = this.props.Source.indexOf(selected.path);
                if (isAlreadySelected >= 0) {
                    this.props.Dispatch(FileManagerActions.deSelectSource(selected.path));
                }
                else {
                    this.props.Dispatch(FileManagerActions.selectSource(selected.path));
                }
            }
            else {
                let isAlreadySelected = this.props.Destination.indexOf(selected.path);
                if (isAlreadySelected >= 0) {
                    this.props.Dispatch(FileManagerActions.deSelectDestination(selected.path));
                }
                else {
                    this.props.Dispatch(FileManagerActions.selectDestination(selected.path));
                }
            }
        };
        this.getFileSystem = () => {
            console.log('PATH', this.props.PathStack);
            return RNFS.readDir(_.last(this.props.PathStack))
                .then((result) => {
                return Promise.all(result);
            });
        };
        this.getStyle = (item) => {
            if (this.props.Destination.indexOf(item.path) >= 0) {
                if (item.isDirectory()) {
                    return [styles.listItem, styles.destinationDirectorySelected];
                }
                else {
                    return [styles.listItem, styles.destinationFileSelected];
                }
            }
            else if (this.props.Source.indexOf(item.path) >= 0) {
                if (item.isDirectory()) {
                    return [styles.listItem, styles.sourceDirectorySelected];
                }
                else {
                    return [styles.listItem, styles.sourceFileSelected];
                }
            }
            else {
                if (item.isDirectory()) {
                    return [styles.listItem, styles.directory];
                }
                else {
                    return [styles.listItem, styles.file];
                }
            }
        };
        this._keyExtractor = (item) => item.name;
        this._renderItem = ({ item }) => (React.createElement(TouchableOpacity, { onLongPress: this.onLongPress.bind(this, item), onPress: this.onPress.bind(this, item) }, item.isDirectory()
            ?
                React.createElement(View, { style: this.getStyle(item) },
                    React.createElement(View, { style: styles.dirImage },
                        React.createElement(Image, { style: styles.dirImage, source: require('./../../res/inAppImages/folder.png') })),
                    React.createElement(Text, { style: [styles.directoryText] }, _.last(item.path.split('/')) + '/'))
            :
                React.createElement(View, { style: this.getStyle(item) },
                    React.createElement(View, { style: styles.fileImage },
                        React.createElement(Image, { style: styles.fileImage, source: require('./../../res/inAppImages/file.png') })),
                    React.createElement(Text, { style: [styles.fileText] }, _.last(item.path.split('/'))))));
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            return this.back();
        });
        console.log('did mount');
    }
    componentWillUnmount() {
        console.log('un mount');
        BackHandler.removeEventListener('hardwareBackPress', () => {
            return this.back();
        });
    }
    render() {
        return (React.createElement(View, null,
            React.createElement(Async, { promise: this.getFileSystem(), then: (fileSystem) => {
                    return React.createElement(FlatList, { data: fileSystem, extraData: this.props.PathStack, keyExtractor: this._keyExtractor, renderItem: this._renderItem });
                } })));
    }
}
function mapStateToProps(state) {
    console.log('in connect');
    return {
        App: state.App,
        PathStack: state.FileManager.PathStack,
        Source: state.FileManager.Source,
        Destination: state.FileManager.Destination,
        SelectedAction: state.FileManager.SelectedAction
    };
}
function mapDispatchToProps(dispatch) {
    return { Dispatch: dispatch };
    // return bindActionCreators(ReduxActions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(FileSystem);
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        backgroundColor: '#020202'
    },
    file: {
        backgroundColor: '#020202'
    },
    sourceDirectorySelected: {
        backgroundColor: '#124599'
    },
    sourceFileSelected: {
        backgroundColor: '#124599'
    },
    destinationDirectorySelected: {
        backgroundColor: '#0b8432'
    },
    destinationFileSelected: {
        backgroundColor: '#0b8432'
    },
    dirImage: {
        paddingLeft: 10,
        height: 40,
        width: 40
    },
    fileImage: {
        paddingLeft: 10,
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
    }
});
