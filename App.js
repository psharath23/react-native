/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import * as RNFS from 'react-native-fs';
import _ from 'lodash'
import ListMenu from './components/listMenu'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  ToolbarAndroid,
  TouchableOpacity,
  TouchableHighlight,
  BackHandler,
  Modal,
  Image,
  Alert,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import FileSystem from './components/fileSystem'
import ConfirmAction from './components/confirmAction'
import { validStyles } from './validstyleprops'
import Prompt from './components/prompt';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
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
      isPromptVisible: false
    }
  }
  onPromptCancel = () => {
    this.setState({ isPromptVisible: false })
  }
  onPromptSubmit = (value) => {
    console.log('value', value)
    if (!value) {
      ToastAndroid.show(`No folder(s) name(s) entered`, ToastAndroid.SHORT);
      return;
    }
    this.setState({ isPromptVisible: false, newFolder: value.split(',') },
      () => {
        console.log('statenewfolder', this.state.newFolder)
        if (_.isEmpty(this.state.newFolder)) {
          ToastAndroid.show(`No folder(s) name(s) entered`, ToastAndroid.SHORT);
          return;
        }
      });
  }
  promptTitle = 'New Folder'
  promptPlaceHolder = 'foldername (or) folder1 name,folder2 name,...'
  _toolbarActions = () => [
    { title: 'menu', icon: require('./res/toolbar/menu.png'), show: 'always' }
  ];
  _onActionSelected = (position) => {
    switch (position) {
      case 0: this.setState({ isMenuClicked: !this.state.isMenuClicked })
        break;
    }
  }
  fileSystemProps = () => ({
    setPropsToState: this.setPropsToState,
    source: this.state.source,
    destination: this.state.destination,
    selectedOption: this.state.selectedOption,
    pathStack: this.state.pathStack
  });
  promptProps = () => ({
    title: this.promptTitle,
    placeholder: this.promptPlaceHolder,
    visible: this.state.isPromptVisible,
    onCancel: this.onPromptCancel,
    onSubmit: this.onPromptSubmit
  })
  actions = () => {
    switch (this.state.selectedOption) {
      case 'copy': return this.copy
      case 'move': return this.move
      case 'delete': return this.delete;
      case '': return this.initialState
    }
  }
  initialState = () => {
    this.setState({
      pathStack: [RNFS.ExternalStorageDirectoryPath],
      source: [],
      destination: [],
      isMenuClicked: false,
      selectedOption: '',
      isActionConfirmed: false
    })
  }
  confirmActionProps = () => ({
    setPropsToState: this.setPropsToState,
    selectedOption: this.state.selectedOption,
    action: this.actions()
  })
  menuDataList = () => {
    if (!_.isEmpty(this.state.source) && this.state.selectedOption && this.state.selectedOption !== 'delete') {
      return [`${this.state.selectedOption} here`]
    } else if (!_.isEmpty(this.state.source)) {
      return ['copy', 'move', 'delete', 'properties']
    } else {
      return ['new folder', 'properties']
    }
  }
  menuData = {
    data: this.menuDataList.bind(this),
    style: styles,
    onPress: (option) => this.onOptionSelected(option)
  }
  back = () => {
    let _pathStack = this.state.pathStack
    if (_pathStack.length !== 1) {
      _pathStack.pop();
    }
    this.setState({
      pathStack: _pathStack
    })

  }
  onOptionSelected = (option) => {
    this.setState({ selectedOption: option, isMenuClicked: false });
    switch (option) {
      case 'delete': {
        this.delete();
      }
      case 'new folder': {
        this.createNewFolder();
      }
    }
  }
  createNewFolder = () => {
    this.setState({ isPromptVisible: true });
    console.log('pp->', this.state);
    if (!_.isEmpty(this.state.source)) {
      _.each(this.state.source, (path) => {
        _.each(this.state.newFolder, (name) => {
          RNFS.mkdir(path + '/' + name)
            .then((dir) => {
              ToastAndroid.show(`new folder ${name} created at ${path}/`, ToastAndroid.SHORT);
            })
            .catch((dir) => {
              ToastAndroid.show(`failed to create new folder ${name} at ${path}/`, ToastAndroid.SHORT);
            })
        })
      })
    } else {
      _.each(this.state.newFolder, (name) => {
        RNFS.mkdir(_.last(this.state.pathStack) + '/' + name)
          .then((dir) => {
            ToastAndroid.show(`new folder ${name} created at ${path}/`, ToastAndroid.SHORT);
          })
          .catch((dir) => {
            ToastAndroid.show(`failed to create new folder ${name} at ${path}/`, ToastAndroid.SHORT);
          })
      })
    }
    this.setState({ source: [], destination: [], selectedOption: '', newFolder: [] });
  }
  copy = () => {
    if (this.state.source.length === 0) {
      ToastAndroid.show(`No file(s)/folder(s) selected`, ToastAndroid.SHORT);
      return;
    }
    let copyCount = 0;
    _.each(this.state.source, (source) => {
      _.each(this.state.destination, (destination) => {
        RNFS.copyFile(source, destination + '/' + _.last(source.split('/')))
          .then((copy) => {
            ToastAndroid.show(`${_.last(source.split('/'))} copied to ${destination}`, ToastAndroid.SHORT);
            copyCount++;
          })
          .catch((err) => {
            ToastAndroid.show(`failed to copy ${_.last(source.split('/'))} to ${destination}`, ToastAndroid.SHORT);
          })
      });
    });
    ToastAndroid.show(`total ${copyCount} file(s)/folder(s) copied out of ${this.state.source.length}`, ToastAndroid.SHORT);
    this.setState({ source: [], destination: [], selectedOption: '' });
  }
  move = () => {
    if (this.state.source.length === 0) {
      ToastAndroid.show(`No file(s)/folder(s) selected`, ToastAndroid.SHORT);
      return;
    }
    let moveCount = 0;
    _.each(this.state.source, (source) => {
      _.each(this.state.destination, (destination) => {
        RNFS.moveFile(source, destination + '/' + _.last(source.split('/')))
          .then((move) => {
            ToastAndroid.show(`${_.last(source.split('/'))} moved to ${destination}`, ToastAndroid.SHORT);
            moveCount++;
          })
          .catch((err) => {
            ToastAndroid.show(`failed to move ${_.last(source.split('/'))} to ${destination}`, ToastAndroid.SHORT);
          })
      });
    });
    ToastAndroid.show(`total ${moveCount} file(s)/folder(s) moved out of ${this.state.source.length}`, ToastAndroid.SHORT);
    this.setState({ source: [], destination: [], selectedOption: '' });
  }
  delete = () => {
    if (this.state.source.length === 0) {
      ToastAndroid.show(`No file(s)/folder(s) selected`, ToastAndroid.SHORT);
      return;
    }
    let deletedCount = 0;
    _.each(this.state.source, (source) => {
      RNFS.unlink(source)
        .then((res) => {
          ToastAndroid.show(`${source} deleted`, ToastAndroid.SHORT);
          deletedCount++;
        })
        .catch((err) => {
          ToastAndroid.show(`failed to delete ${source}`, ToastAndroid.SHORT);
        })
    });
    ToastAndroid.show(`total ${deletedCount} file(s)/folder(s) deleted`, ToastAndroid.SHORT);
    this.setState({ source: [], destination: [], selectedOption: '' });
  }
  modalVisibilityHandler = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible })
  }
  setPropsToState = (props, callback) => {
    this.setState(props, callback && callback());
  }
  render() {
    return (
      <View style={styles.container}>
        <View>
          <ToolbarAndroid style={styles.toolbar}
            title='File Manager'
            actions={this._toolbarActions()}
            onActionSelected={this._onActionSelected}
            navIcon={require('./res/toolbar/back.png')}
            onIconClicked={this.back}
          />
        </View>
        <View>
          {
            this.state.isMenuClicked === true && <ListMenu  {...this.menuData} />
          }
        </View>
        <View style={
          this.state.selectedOption !== '' && !_.isEmpty(this.state.destination) ?
            styles.fileSystemAfterOption :
            styles.fileSystemBeforeOption
        }>
          <FileSystem {...this.fileSystemProps() } />
        </View>
        <View style={styles.confirmAction}>
          {
            this.state.selectedOption !== '' && !_.isEmpty(this.state.destination) && <ConfirmAction {...this.confirmActionProps() } />
          }
        </View>
        <View>
          {
            this.state.isPromptVisible && <Prompt {...this.promptProps() } />
          }
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
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
