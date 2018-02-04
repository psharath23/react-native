/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IReducer } from 'src/interfaces';
import FileManager from './modules/filemanager';
export  class App extends Component<any, any> {
  render() {
    return <FileManager />;
  }
}
function mapStateToProps(state: IReducer) {
  return {
      App: state.App,
      FileManager: state.FileManager
  };
}
function mapDispatchToProps(dispatch: any) {
  return { Dispatch: dispatch };
}
export default connect(mapStateToProps, mapDispatchToProps)(FileManager);
