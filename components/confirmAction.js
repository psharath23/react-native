import React, { Component } from 'react';
import { TouchableOpacity, FlatList, BackHandler, View, Text, StyleSheet, Image, Alert, Button, Dimensions } from 'react-native'
import Async from 'react-promise'
import _ from 'lodash'
import * as RNFS from 'react-native-fs';
import ListMenu from '../components/listMenu'
export class ConfirmAction extends Component {
    constructor(props) {
        super(props);
    }
    cancelAction = () => {
        this.props.setPropsToState({
            selectedOption: '',
            destination: [],
            source: [],
            isActionConfirmed: false
        }, () => {
            this.props.action();
        });
    }
    confirmAction = () => {
        this.props.setPropsToState({
            isActionConfirmed: true
        }, () => {
            this.props.action();
        });
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
const styles = StyleSheet.create({
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
    actionBar: {
        flexDirection: 'row',
        backgroundColor: '#a9c1e8'
    }
});

export default ConfirmAction