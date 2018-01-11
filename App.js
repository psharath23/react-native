/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import * as RNFS from 'react-native-fs';
import _ from 'lodash'
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
  Alert
} from 'react-native';
import ListMenu from './components/listMenu'
import FileSystem from './components/fileSystem'
import LongPressInfo from './components/longPressInfo'
import { validStyles } from './validstyleprops'
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
      longPressOption: '',
      longPressed: '',
      source: '',
      destination: '',
      isModalVisible: false
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
  data = [];
  _toolbarActions = () => [
    { title: 'back', icon: require('./res/toolbar/back.png'), show: 'always' },
    { title: 'menu', icon: require('./res/toolbar/menu.png'), show: 'always' }
  ];
  _onActionSelected = (position) => {
    switch (position) {
      case 0: this.back();
        break;
    }
  }
  cancelOperation = () => {

    this.setState({
      longPressOption: '',
      longPressed: '',
      source: '',
      destination: ''
    }, () => {
    })
  }
  fileSystemProps = {
    setPropsToState: this.setPropsToState,
    modalVisibilityHandler: this.modalVisibilityHandler,
    style: styles, onOptionSelected: this.onOptionSelected,
    onLongPress: this.onLongPress,
    onPress: this.onPress,
    longPressOption: this.state.longPressOption,
    longPressed: this.state.longPressed,
    source: this.state.source,
    destination: this.state.destination
  }
  longPressInfoProps = {
    setPropsToState: this.setPropsToState,
    cancelOperation: this.cancelOperation,
    longPressOption: this.state.longPressOption,
    source: this.state.source,
    destination: this.state.destination
  }
  modalVisibilityHandler = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible })
  }
  setPropsToState = (props) => {
    this.setState(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <View>
          <ToolbarAndroid style={styles.toolbar}
            title='File Manager'
            actions={this._toolbarActions()}
            onActionSelected={this._onActionSelected}
          />
        </View>
        <View>
          <Modal
            style={styles.modal}
            visible={this.state.isModalVisible}
            onRequestClose={() => { this.setState({ isModalVisible: false }) }}
            transparent={true}
          >
            <LongPressInfo {...this.longPressInfoProps} />
          </Modal>
        </View>
        <View>
          <FileSystem {...this.fileSystemProps} />
        </View>
      </View >
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
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7021a',
    padding: 100
  },
});
