import React, { Component } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
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
            <Modal
                visible={this.props.visible}
                transparent={true}
                onRequestClose={this.cancelAction}
            >
                <View style={styles.modal}>
                    <View style={styles.modalTitle}>
                        <Text style={styles.modalTitleText}>{this.props.title}</Text>
                    </View>
                    <View style={styles.button}>
                        <View style={styles.confirmButton}>
                            <Button
                                title='Confirm'
                                color='#4a9b3e'
                                onPress={this.confirmAction.bind(this)}
                            />
                        </View>
                        <View style={styles.cancelButton}>
                            <Button
                                title='cancel'
                                color='#f44242'
                                onPress={this.cancelAction.bind(this)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

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
    modal: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        padding: 20,
        backgroundColor: '#ffffff',
        // height: `60%`,
        width: '80%',
        position: 'absolute',
        // top: Dimensions.get('screen').height - 450,
        // left: Dimensions.get('screen').width - 310
        top: '30%',
        left: '10%'
    },
    cancelButton: {
        // width: '25%',
        backgroundColor: '#f44242'
    },
    confirmButton: {
        // width: '25%',
        backgroundColor: '#4a9b3e'
    },
    cancelButtonText: {
        color: '#ffffff'
    },
    confirmButtonText: {
        color: '#ffffff'
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#a9c1e8'
    },
    modalTitleText: {
        color: '#020202',
        fontWeight: 'bold'
    },
    modalTitle: {
        padding: 2
    },
    inputField: {
        width: '100%'
    }
});
