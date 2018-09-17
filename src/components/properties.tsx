import _ from 'lodash';
import React, { Component } from 'react';
import { Button, Dimensions, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import * as RNFS from 'react-native-fs';
import Async from 'react-promise';
import { connect } from 'react-redux';
import { IReducer } from '../interfaces/index';
export class Properties extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            fsInfo: null,
            fsInfoArr: []
        };
    }
    getArrayOfStat = (source) => {
        source.map(async (s) => {
            let dir;
            dir = await RNFS.readDir(s);
            await dir.map(async (d) => {
                if (await d.isFile()) {
                    let fileInfo = await RNFS.stat(s);
                    console.log('fileInfo', fileInfo);
                    await this.state.fsInfoArr.push(fileInfo);
                } else {
                    await this.getArrayOfStat(d);
                }
            });
        });
    }
    getFSInfo = async (source?) => {

        if (!source) {
            let fsInfo = await RNFS.getFSInfo();
            this.setState({ fsInfo });
        } else {
            await this.getArrayOfStat(source);
            let allFSInfo = { size: 0 };
            await this.state.fsInfoArr.map(async (fsInfo) => {
                allFSInfo = Object.assign({}, allFSInfo, { size: allFSInfo.size + fsInfo.size });
            });
            this.setState({ fsInfo: allFSInfo });
        }
    }
    componentWillMount() {
        console.log('s', this.props.Source, 'p', this.props.PathStack);
        if (this.props.Source.length === 0 && _.last(this.props.PathStack) === RNFS.ExternalStorageDirectoryPath) {
            this.getFSInfo();
        }
        if (this.props.Source.length > 0) {
            this.getFSInfo(this.props.Source);
        }
    }
    renderFSInfo = () => {

        return (
            <View>
                {
                    this.state.fsInfo && this.state.fsInfo.size &&
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Total Space : </Text><Text>{this.getFileSize(this.state.fsInfo && this.state.fsInfo.size)}
                        </Text>
                    </View>
                }
                {
                    this.state.fsInfo && this.state.fsInfo.totalSpace &&
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Total Space : </Text><Text>{this.getFileSize(this.state.fsInfo && this.state.fsInfo.totalSpace)}
                        </Text>
                    </View>
                }
                {
                    this.state.fsInfo && this.state.fsInfo.freeSpace &&
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Free Space : </Text><Text>{this.getFileSize(this.state.fsInfo && this.state.fsInfo.freeSpace)}
                        </Text>
                    </View>
                }
                {
                    this.state.fsInfo && this.state.fsInfo.totalSpace && this.state.fsInfo.freeSpace &&
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Occupied Space : </Text><Text>{this.getFileSize(this.state.fsInfo && this.state.fsInfo.totalSpace - this.state.fsInfo.freeSpace)}
                        </Text>
                    </View>
                }
            </View>);
    }
    getFileSize = (size) => {

        if (size <= 1024) {
            return size + ' Kb';
        }
        if (size > 1024) {
            console.log(size, size / 1024);
            return (size / 1024) + ' Mb';
        }
        if (size > 1024 * 1024) {
            return ((size / 1024) / 1024) + ' Gb';
        }

    }
    renderMultiList = () => {
        return (
            <View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                    <View><Text>Name</Text></View>
                    <View><Text>Path</Text></View>
                    <View><Text>Created</Text></View>
                    <View><Text>Modified</Text></View>
                    <View><Text>Size</Text></View>
                    <View><Text>Type</Text></View>
                </View>
                <View>
                    {
                        _.map(this.props.Source, (source) => {

                            return (
                                <View style={{
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}>
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
                    <View style={styles.modalTitle}>
                        <Text style={styles.modalTitleText}>{this.props.title}</Text>
                    </View>
                    <View>
                        {/* {
                            this.props.Source.length > 0 && this.renderMultiList()
                        } */}
                        {
                            this.props.Source.length === 0 && _.last(this.props.PathStack) === RNFS.ExternalStorageDirectoryPath && this.renderFSInfo()
                        }
                    </View>
                    <View style={styles.button}>
                        <View style={styles.confirmButton}>
                            <Button
                                title='Ok'
                                color='#4a9b3e'
                                onPress={() => this.props.onSubmit()}
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
        // width: '80%',
        position: 'absolute',
        // top: Dimensions.get('screen').height - 450,
        // left: Dimensions.get('screen').width - 310
        top: '30%',
        left: '10%'
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
        width: '80%',
        margin: 4,
        flexDirection: 'row',
        backgroundColor: '#a9c1e8'
    },
    modalTitleText: {
        color: '#020202',
        fontWeight: 'bold'
    },
    modalTitle: {
        padding: 2
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
