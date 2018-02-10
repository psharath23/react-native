import _ from 'lodash';
import React, { Component } from 'react';
import { Button, Dimensions, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import * as RNFS from 'react-native-fs';
import Async from 'react-promise';
import { connect } from 'react-redux';
import { IReducer } from '../interfaces/index';
export class Properties extends Component<any, any> {
    renderFSInfo = () => {

        return (<View>
            <Async
                promise={RNFS.getFSInfo()}
                then={
                    (fsInfo: any) => {
                        console.log('FS IN:', fsInfo);
                        return (
                            <View>
                                <View style={{ flexDirection: 'row' }}><Text>Total Space : </Text><Text>{fsInfo.totalSpace}</Text></View>
                                <View style={{ flexDirection: 'row' }}><Text>Free Space : </Text><Text>{fsInfo.freeSpace}</Text></View>
                                <View style={{ flexDirection: 'row' }}><Text>Occupied Space : </Text><Text>{fsInfo.totalSpace - fsInfo.freeSpace}</Text></View>
                            </View>
                        );
                    }
                } />
        </View>);
    }
    getFileSize = (size) => {
        console.log('in get file size');
        if (size <= 1024) {
            return size + ' Kb';
        }
        if (size > 1024) {
            return (size / 1024) + ' Mb';
        }
        if (size > 1024 * 1024) {
            return ((size / 1024) / 1024) + ' Gb';
        }

    }
    renderMultiList = () => {
        return (
            <View>
                <View>
                    <View><Text>Name</Text></View>
                    <View><Text>Path</Text></View>
                    <View><Text>Created</Text></View>
                    <View><Text>Modified</Text></View>
                    <View><Text>Size</Text></View>
                    <View><Text>Type</Text></View>
                </View>
                <View>
                    {
                        _.each(this.props.Source, (source) => {

                            return (<View>
                                <View>
                                    <Text>{_.last(source.split('/'))}</Text>
                                </View>
                                <View>
                                    <Text>{source}</Text>
                                </View>
                                <View>
                                    <Text>{RNFS.stat(source).ctime}</Text>
                                </View>
                                <View>
                                    <Text>{RNFS.stat(source).mtime}</Text>
                                </View>
                                <View>
                                    <Async
                                        promise={RNFS.stat(source)}
                                        then={(StatResult: any) => {
                                            return <Text>
                                                {this.getFileSize(StatResult.size)}
                                            </Text>;
                                        }}
                                    />

                                </View>
                                <View>
                                    <Text>{RNFS.stat(source).isFile ? 'File' : 'Directory'}</Text>
                                </View>
                            </View>);
                        })
                    }
                </View>
            </View>
        );
    }
    render() {
        return (
            <Modal
                visible={this.props.visible}
                transparent={true}
                onRequestClose={this.props.onCancel}>
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>{this.props.title}</Text>
                    <View>
                        {
                            this.props.Source.length > 0 && this.renderMultiList()
                        }
                        {
                            this.props.Source.length === 0 && _.last(this.props.PathStack) === RNFS.ExternalStorageDirectoryPath && this.renderFSInfo()
                        }
                    </View>
                    <View style={styles.button}>
                        <View style={styles.confirmButton}>
                            <Button
                                title='Ok'
                                color='#4a9b3e'
                                onPress={() => this.props.onSubmit(this.state.promptValue)}
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
        borderRadius: 20,
        padding: 20,
        backgroundColor: '#ffffff',
        height: Dimensions.get('window').height - 400,
        width: Dimensions.get('window').width - 100,
        position: 'absolute',
        top: Dimensions.get('window').height - 450,
        left: Dimensions.get('window').width - 310
    },
    cancelButton: {
        width: '50%',
        backgroundColor: '#f44242'
    },
    confirmButton: {
        width: '100%',
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
    modalTitle: {
        color: '#020202'
    }
});
function mapStateToProps(state: IReducer) {
    return {
        PathStack: state.FileManager.PathStack,
        Source: state.FileManager.Source,
        Destination: state.FileManager.Destination
    };
}
function mapDispatchToProps(dispatch: any) {
    return { Dispatch: dispatch };
}
export default connect(mapStateToProps, mapDispatchToProps)(Properties);
