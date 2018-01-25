import React, { Component } from 'react';
import { TouchableOpacity, FlatList, BackHandler, View, Text, StyleSheet, Image } from 'react-native';
import Async from 'react-promise';
import _ from 'lodash';
import * as RNFS from 'react-native-fs';
export class FileSystem extends Component {
    constructor(props) {
        super(props);
        this.back = () => {
            let _pathStack = this.state.pathStack;
            if (_pathStack.length !== 1) {
                _pathStack.pop();
                this.setState({
                    pathStack: _pathStack
                });
                return true;
            }
            else {
                return false;
            }
        };
        this.onPress = (selected) => {
            if (selected.isDirectory()) {
                let _pathStack = this.state.pathStack;
                _pathStack.push(selected.path);
                this.setState({ pathStack: _pathStack });
            }
        };
        this.onLongPress = (selected) => {
            if (!this.props.selectedOption) {
                let isAlreadySelected = this.props.source.indexOf(selected.path);
                if (isAlreadySelected >= 0) {
                    let _source = _.clone(this.props.source);
                    _source.splice(isAlreadySelected, 1);
                    this.props.setPropsToState({ source: _source }, () => {
                        if (_.isEmpty(this.props.source)) {
                            this.props.setPropsToState({
                                selectedOption: ''
                            });
                        }
                    });
                }
                else {
                    let _source = _.clone(this.props.source);
                    _source.push(selected.path);
                    this.props.setPropsToState({ source: _source });
                }
            }
            else {
                let isAlreadySelected = this.props.destination.indexOf(selected.path);
                if (isAlreadySelected >= 0) {
                    let _destination = _.clone(this.props.destination);
                    _destination.splice(isAlreadySelected, 1);
                    this.props.setPropsToState({ destination: _destination });
                }
                else {
                    let _destination = _.clone(this.props.destination);
                    _destination.push(selected.path);
                    this.props.setPropsToState({ destination: _destination });
                }
            }
        };
        this.getFileSystem = () => {
            return RNFS.readDir(_.last(this.state.pathStack))
                .then((result) => {
                return Promise.all(result);
            });
        };
        this.getStyle = (item) => {
            if (this.props.destination.indexOf(item.path) >= 0) {
                if (item.isDirectory()) {
                    return [styles.listItem, styles.destinationDirectorySelected];
                }
                else {
                    return [styles.listItem, styles.destinationFileSelected];
                }
            }
            else if (this.props.source.indexOf(item.path) >= 0) {
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
                        React.createElement(Image, { style: styles.dirImage, source: require('../res/inAppImages/folder.png') })),
                    React.createElement(Text, { style: [styles.directoryText] }, _.last(item.path.split('/')) + '/'))
            :
                React.createElement(View, { style: this.getStyle(item) },
                    React.createElement(View, { style: styles.fileImage },
                        React.createElement(Image, { style: styles.fileImage, source: require('../res/inAppImages/file.png') })),
                    React.createElement(Text, { style: [styles.fileText] }, _.last(item.path.split('/'))))));
        this.state = {
            pathStack: this.props.pathStack,
        };
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
                    return React.createElement(FlatList, { data: fileSystem, extraData: this.state.pathStack, keyExtractor: this._keyExtractor, renderItem: this._renderItem });
                } })));
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#303a4c',
    },
    listItem: {
        flexDirection: 'row',
        height: 50,
        borderStyle: 'solid',
        borderColor: 'black',
        borderRadius: 5,
        margin: 2,
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
        opacity: 5,
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
export default FileSystem;
//# sourceMappingURL=fileSystem.js.map