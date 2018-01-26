import React, { Component } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { connect } from 'react-redux';
import FileManagerActions from '../actions/filemanager.action';
export class ConfirmAction extends Component {
    constructor(props) {
        super(props);
        this.cancelAction = () => {
            this.props.Dispatch(FileManagerActions.cancelFileAction());
            this.props.action();
        };
        this.confirmAction = () => {
            this.props.Dispatch(FileManagerActions.selectedFileAction(''));
            this.props.action();
            this.props.Dispatch(FileManagerActions.fileActionCompleted());
        };
    }
    render() {
        return (React.createElement(View, { style: styles.actionBar },
            React.createElement(View, { style: styles.cancelButton },
                React.createElement(Button, { title: 'cancel', color: '#f44242', onPress: this.cancelAction.bind(this) })),
            React.createElement(View, { style: styles.confirmButton },
                React.createElement(Button, { title: 'confirm', color: '#4a9b3e', onPress: this.confirmAction.bind(this) }))));
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
export default connect(mapStateToProps, mapDispatchToProps)(ConfirmAction);
const styles = StyleSheet.create({
    cancelButton: {
        width: '50%',
        backgroundColor: '#f44242'
    },
    confirmButton: {
        width: '50%',
        backgroundColor: '#4a9b3e'
    },
    cancelButtonText: {
        color: '#ffffff'
    },
    confirmButtonText: {
        color: '#ffffff'
    },
    actionBar: {
        flexDirection: 'row',
        backgroundColor: '#a9c1e8'
    }
});
//# sourceMappingURL=confirmAction.js.map