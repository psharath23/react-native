import React, { Component } from 'react';
import { TouchableOpacity, FlatList, BackHandler, View, Text, StyleSheet, Image, Alert } from 'react-native'
import Async from 'react-promise'
import _ from 'lodash'
import * as RNFS from 'react-native-fs';
import ListMenu from '../components/listMenu'
export class LongPressInfo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log('longpressprops', this.props)
        return (
            <View style={styles.longPressActionInfo}>
                <Text style={styles.operationText}>{this.props.longpressOption} :
            </Text>
                <Text style={styles.pathText}>{_.last(this.props.source.split('/'))}</Text>
                <Text style={styles.operationText}>{this.props.longpressOption === 'delete' ? 'from' : 'to'} :
            </Text><Text style={styles.pathText}>{this.props.destination}</Text>
                <Text style={styles.cancelOperation} onPress={this.props.cancelOperation}>Cancel</Text>
                <Text style={styles.proceedOperation} onPress={this.props.longpressOption === 'copy' ? this.props.copy : this.props.move}>{this.props.longpressOption === 'copy' ? 'copy' : 'move'}</Text>
            </View>
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
    }
});

export default LongPressInfo