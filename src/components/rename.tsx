import React, { Component } from 'react';
import { Button, Dimensions, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { connect } from 'react-redux';
import { IReducer } from '../interfaces/index';
export class Rename extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            renameValue: ''
        };
    }
    componentWillMount() {
        this.setState({ renameValue: this.props.reName });
    }
    render() {

        return (
            <Modal
                visible={this.props.visible}
                transparent={true}
                onRequestClose={this.props.onCancel}
            >
                <View style={styles.modal}>
                    <View style={styles.modalTitle}>
                        <Text style={styles.modalTitleText}>{this.props.title}</Text>
                    </View>
                    <View style={styles.inputField}>
                        <TextInput
                            placeholder={this.props.placeholder}
                            onChangeText={(text) => this.setState({ renameValue: text })}
                            value={this.state.renameValue}
                        />
                    </View>
                    <View style={styles.button}>
                        <View style={styles.confirmButton}>
                            <Button
                                title='submit'
                                color='#4a9b3e'
                                onPress={() => this.props.onSubmit(this.state.renameValue)}
                            />
                        </View>
                        <View style={styles.cancelButton}>
                            <Button
                                title='cancel'
                                color='#f44242'
                                onPress={this.props.onCancel}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}
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
function mapStateToProps(state: IReducer) {
    return {
        App: state.App,
        FileManager: state.FileManager,
        reName: state.FileManager.ReName
    };
}
function mapDispatchToProps(dispatch: any) {
    return { Dispatch: dispatch };
}
export default connect(mapStateToProps, mapDispatchToProps)(Rename);
