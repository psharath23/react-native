import React, { Component } from 'react';
import { TouchableOpacity, FlatList, BackHandler, View, Text, StyleSheet, Image, Alert, BackAndroid } from 'react-native'
import Async from 'react-promise'
import _ from 'lodash'
import * as RNFS from 'react-native-fs';
import ListMenu from '../components/listMenu'
export class FileSystem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pathStack: this.props.pathStack,
        }
    }
    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', () => {
             this.back();
        })
    }
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', () => {
            this.back();
            
        })
    }
    back = () => {
        let _pathStack = this.state.pathStack
        if (_pathStack.length !== 1) {
            _pathStack.pop();
        }
        return this.setState({
            pathStack: _pathStack
        },()=>{
            if (this.state.pathStack.length === 1) {
                return true
            } else {
                return false;
            }
        })
    
    }
    onPress = (selected) => {
        if (selected.isDirectory()) {
            let _pathStack = this.state.pathStack
            _pathStack.push(selected.path);
            this.setState({ pathStack: _pathStack })
        }
    }
    onLongPress = (selected) => {
        if(!this.props.selectedOption){
            let isAlreadySelected = this.props.source.indexOf(selected.path);
            if(isAlreadySelected>=0){
                let _source = _.clone(this.props.source);
                _source.splice(isAlreadySelected,1);
                this.props.setPropsToState({source:_source});    
            }else{
                let _source = _.clone(this.props.source);
                _source.push(selected.path)
                this.props.setPropsToState({source:_source});
            }
        }else{
            let isAlreadySelected = this.props.destination.indexOf(selected.path);
            if(isAlreadySelected>=0){
                let _destination = _.clone(this.props.destination);
                _destination.splice(isAlreadySelected,1);
                this.props.setPropsToState({destination:_destination});    
            }else{
                let _destination = _.clone(this.props.destination);
                _destination.push(selected.path)
                this.props.setPropsToState({destination:_destination});
            }
        }
        
    }
    getFileSystem = () => {
        return RNFS.readDir(_.last(this.state.pathStack))
            .then((result) => {
                return Promise.all(result);
            });
    }
    getStyle=(item)=>{
        if(this.props.destination.indexOf(item.path)>=0){
            if(item.isDirectory()){
                return [styles.listItem,styles.destinationDirectorySelected]
            }else{
                return [styles.listItem,styles.destinationFileSelected]
            }
        }else if(this.props.source.indexOf(item.path)>=0){
            if(item.isDirectory()){
                return [styles.listItem,styles.sourceDirectorySelected]
            }else{
                return [styles.listItem,styles.sourceFileSelected]
            }
        }else{
            if(item.isDirectory()){
                return [styles.listItem,styles.directory]
            }else{
                return [styles.listItem,styles.file]
            }
        }
    }
    _keyExtractor = (item, index) => item.path;
    _renderItem = ({ item }) => (
        <TouchableOpacity onLongPress={this.onLongPress.bind(this, item)} onPress={this.onPress.bind(this, item)}>
            {
                item.isDirectory()
                    ?
                    <View style={this.getStyle(item)}>
                    <View style={styles.dirImage}>
                        <Image
                            style={styles.dirImage}
                            source={require('../res/inAppImages/folder.png')}
                        />
                        </View>
                        <Text style={[styles.directoryText]}>{_.last(item.path.split('/')) + '/'}</Text>
                    </View>
                    :
                    <View style={this.getStyle(item)}>
                    <View style={styles.fileImage}>
                        <Image
                            style={styles.fileImage}
                            source={require('../res/inAppImages/file.png')}
                        />
                        </View>
                        <Text style={[styles.fileText]}>{_.last(item.path.split('/'))}</Text>
                    </View>
            }
        </TouchableOpacity >
    )
    render() {
        return (
            <View><Async
                promise={this.getFileSystem()}
                then={
                    (fileSystem) => {
                        return <FlatList
                            data={fileSystem}
                            extraData={this.props.pathStack}
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