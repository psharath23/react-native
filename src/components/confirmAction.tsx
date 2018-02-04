import React, { Component } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import FileManagerActions from '../actions/filemanager.action';
import { IReducer } from '../interfaces/index';
export class ConfirmAction extends Component<any, any> {
    constructor(props) {
        super(props);
    }
    cancelAction = () => {
        this.props.Dispatch(FileManagerActions.cancelFileAction());
        this.props.action();
    }
    confirmAction = () => {
        this.props.Dispatch(FileManagerActions.selectedFileAction(''));
        this.props.action();
        this.props.Dispatch(FileManagerActions.fileActionCompleted());
    }

    render() {
        return (
            <View style={styles.actionBar}>
                <View style={styles.cancelButton}>
                    <Button
                        title='cancel'
                        color='#f44242'
                        onPress={this.cancelAction.bind(this)}
                    />
                </View>
                <View style={styles.confirmButton}>
                    <Button
                        title='confirm'
                        color='#4a9b3e'
                        onPress={this.confirmAction.bind(this)}
                    />
                </View>
            </View>
        );
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
