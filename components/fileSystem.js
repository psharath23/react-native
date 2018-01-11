import React, { Component } from 'react';
import { TouchableOpacity, FlatList, BackHandler, View, Text, StyleSheet, Image, Alert } from 'react-native'
import Async from 'react-promise'
import _ from 'lodash'
import * as RNFS from 'react-native-fs';
import ListMenu from '../components/listMenu'
export class FileSystem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pathStack: [RNFS.ExternalStorageDirectoryPath],
        }
        BackHandler.addEventListener('hardwareBackPress', () => {
            console.log('back clicked')
            this.back();
            if (this.state.pathStack.length === 1) {
                BackHandler.exitApp();
            } else {
                return true;
            }
        })
    }
    onPress = (selected) => {
        if (selected.isDirectory()) {
            let _pathStack = this.state.pathStack
            let _destination = '';
            _pathStack.push(selected.path);
            if (this.props.source !== '') {
                _destination = _.last(_pathStack);
            }
            this.setState({ pathStack: _pathStack }, () => {
                this.props.setPropsToState({
                    destination: _destination
                });
            })
        }
    }
    folderOptions = () => {
        return <FlatList
            style={styles.longPressMenu}

            keyExtractor={(item) => item}
            renderItem={(item) => <Text style={styles.longPressMenuItem}>item</Text>}
        />
    }
    longPressData = {
        data: ['copy', 'delete', 'move'],
        style: styles,
        onPress: (option) => this.onOptionSelected(option)
    }
    onLongPress = (selected) => {
        this.props.setPropsToState({ longPressed: selected.path })
    }
    getFileSystem = () => {
        console.log('current--->', _.last(this.state.pathStack));
        return RNFS.readDir(_.last(this.state.pathStack))
            .then((result) => {
                return Promise.all(result);
            });
    }
    onOptionSelected = (option) => {
        console.log('option', option)
        let _destination;
        switch (option) {
            case 'copy':
                _destination = (_.filter(_.last(this.state.pathStack).split('/'), (path) => {
                    return path !== this.props.longPressed
                })).join('/');
                this.props.setPropsToState({ longPressOption: option, source: this.props.longPressed, longPressed: '', destination: _destination });
                this.props.modalVisibilityHandler();
                break;
            case 'move':
                _destination = (_.filter(_.last(this.state.pathStack).split('/'), (path) => {
                    return path !== this.props.longPressed
                })).join('/');
                this.props.setPropsToState({ longPressOption: option, source: this.props.longPressed, longPressed: '', destination: _destination });
                this.props.modalVisibilityHandler();
                break;
            case 'delete':
                _destination = (_.filter(_.last(this.state.pathStack).split('/'), (path) => {
                    return path !== this.props.longPressed
                })).join('/')
                this.props.setPropsToState({ longPressOption: option, source: this.props.longPressed, longPressed: '', destination: _destination }, () => {
                    Alert.alert(
                        `Are you sure you want to Delete ${_.last(this.props.source.split('/'))}`,
                        '(This cannot be Undone)',
                        [{ text: 'OK', onPress: () => this.delete() }, { text: 'Cancel', onPress: () => this.cancelOperation() }]
                    )
                });
        }
    }
    copy = () => {
        console.log('s', this.props.source, 'd', decodeURIComponent(this.props.destination + '/'))
        RNFS.copyFile(this.props.source.toString(), this.props.destination + '/' + _.last(this.props.source.split('/')))
            .then((copy) => {
                console.log('copy', copy)
                Alert.alert(
                    'Success',
                    `${_.last(this.props.source.split('/'))} copied to ${this.props.destination}/ successfully`
                    [{ text: 'Ok', onPress: () => this.cancelOperation() }]
                )
            })
            .catch((err) => {
                console.log('error', err)
                Alert.alert(
                    'Failed',
                    `Unable to copy ${_.last(this.props.source.split('/'))} to ${this.props.destination}`,
                    [{ text: 'Ok', onPress: () => this.cancelOperation() }]
                )
            })
    }
    move = () => {
        RNFS.moveFile(this.props.source.toString(), this.props.destination + '/' + _.last(this.props.source.split('/')))
            .then((copy) => {
                Alert.alert(
                    'Success',
                    `${_.last(this.props.source.split('/'))} moved to ${this.props.destination}/ successfully`
                    [{ text: 'Ok', onPress: () => this.cancelOperation() }]
                )
            })
            .catch((err) => {
                Alert.alert(
                    'Failed',
                    `Unable to move ${_.last(this.props.source.split('/'))} to ${this.props.destination}`,
                    [{ text: 'Ok', onPress: () => this.cancelOperation() }]
                )
            })
    }
    delete = () => {
        RNFS.unlink(this.props.source)
            .then((res) => {
                Alert.alert(
                    'Success',
                    `${this.props.source} deleted`,
                    [{ text: 'Ok', onPress: () => this.cancelOperation() }]
                );
            })
            .catch((err) => {
                Alert.alert(
                    'Failed',
                    `Unable to delete ${_.last(this.props.source.split('/'))}`
                    [{ text: 'Ok', onPress: () => this.cancelOperation() }]
                )
            })
    }
    cancelOperation = () => {

        this.props.setPropsToState({
            longPressOption: '',
            longPressed: '',
            source: '',
            destination: ''
        }, () => {
            console.log('cancel op', this.state)
        })
    }
    _keyExtractor = (item, index) => item.path;
    _renderItem = ({ item }) => (
        <TouchableOpacity onLongPress={this.onLongPress.bind(this, item)} onPress={this.onPress.bind(this, item)}>
            {
                item.isDirectory()
                    ?
                    <View style={[styles.listItem, styles.directory]}>
                        <Image
                            style={styles.dirImage}
                            source={require('../res/inAppImages/folder.png')}
                        />
                        <Text style={[styles.directoryText]}>{_.last(item.path.split('/')) + '/'}</Text>
                    </View>
                    :
                    <View style={[styles.listItem, styles.file]}>
                        <Image
                            style={styles.fileImage}
                            source={require('../res/inAppImages/file.png')}
                        />
                        <Text style={[styles.fileText]}>{_.last(item.path.split('/'))}</Text>
                    </View>
            }
            {
                this.props.longPressed === item.path && <ListMenu  {...this.longPressData} />
            }
        </TouchableOpacity >
    )
    back = () => {
        let _pathStack = this.state.pathStack
        if (_pathStack.length !== 1) {
            _pathStack.pop();
        }
        this.setState({
            pathStack: _pathStack
        })

    }

    _onActionSelected = (position) => {
        switch (position) {
            case 0: this.back();
                break;
        }
    }
    longPressData = {
        data: ['copy', 'delete', 'move'],
        style: styles,
        onPress: (option) => this.onOptionSelected(option)
    }

    render() {
        console.log('filesystemprops', this.props)
        return (
            <View><Async
                promise={this.getFileSystem()}
                then={
                    (fileSystem) => {
                        return <FlatList
                            data={fileSystem}
                            extraData={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                        />
                    }
                } />
            </View>
        );
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
export default FileSystem