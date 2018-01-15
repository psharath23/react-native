import React, { Component } from 'react';
import { TouchableOpacity, FlatList, BackHandler, View, Text, StyleSheet, Image, Alert, Button, Dimensions, Modal, TextInput } from 'react-native'
export class Prompt extends Component {
    constructor(props) {
        super(props);
        this.state={
            promptValue:''
        }
    }
    onChange=(e)=>{
        this.setState({promptValue:e.text})
        console.log('onChnage',e)
    }
    render() {
        return (
            <Modal
                visible={this.props.visible}
                transparent={true}
                onRequestClose={this.props.onCancel}
            ><View style={styles.modal}>
                    <Text style={styles.modalTitle}>{this.props.title}</Text>
                    <TextInput
                        placeholder={this.props.placeholder}
                        onChange={(e)=>this.onChange(e)}
                        value={this.state.promptValue}
                    />
                    <View style={styles.button}>
                        <View style={styles.confirmButton}>
                            <Button
                                title='submit'
                                color='#4a9b3e'
                                onPress={()=>this.props.onSubmit(this.state.promptValue)}
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
        )
    }
}
const styles = StyleSheet.create({
    modal: {
        borderRadius:20,
        padding:20,
        backgroundColor: '#ffffff',
        height: Dimensions.get('window').height - 400,
        width: Dimensions.get('window').width - 100,
        position: 'absolute',
        top: Dimensions.get('window').height - 450,
        left: Dimensions.get('window').width - 310,
    },
    cancelButton: {
        width: '50%',
        backgroundColor: '#f44242',
    },
    confirmButton: {
        width: '50%',
        backgroundColor: '#4a9b3e',
    },
    cancelButtonText: {
        color: '#ffffff',
    },
    confirmButtonText: {
        color: '#ffffff',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#a9c1e8'
    },
    modalTitle:{
        color:'#020202'
    }
})
export default Prompt