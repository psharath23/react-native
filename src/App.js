/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileManager from './modules/filemanager';
export class App extends Component {
    render() {
        return React.createElement(FileManager, null);
    }
}
function mapStateToProps(state) {
    return {
        App: state.App,
        FileManager: state.FileManager
    };
}
function mapDispatchToProps(dispatch) {
    return { Dispatch: dispatch };
}
export default connect(mapStateToProps, mapDispatchToProps)(FileManager);
