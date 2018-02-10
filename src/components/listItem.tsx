import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { IReducer } from 'src/interfaces';
import FileManagerActions from './../actions/filemanager.action';
interface IListItem {
    item: any;
    Destination: any;
    Source: any;
    SelectedAction: any;
    Dispatch: any;
}
export class ListItem extends Component<IListItem, any> {
    constructor(props) {
        super(props);
        console.log('LISTITEM--->', this.props.item.path);
    }
    render() {
        return (
            <TouchableOpacity onLongPress={this.onLongPress.bind(this, this.props.item)} onPress={this.onPress.bind(this, this.props.item)}>
                {
                    this.props.item.isDirectory()
                        ?
                        <View style={this.getStyle(this.props.item)}>
                            <View style={styles.dirImage}>
                                <Image
                                    style={styles.dirImage}
                                    source={require('./../../res/inAppImages/folder.png')}
                                />
                            </View>
                            <Text style={[styles.directoryText]}>{_.last(this.props.item.path.split('/')) + '/'}</Text>
                        </View>
                        :
                        <View style={this.getStyle(this.props.item)}>
                            <View style={styles.fileImage}>
                                <Image
                                    style={styles.fileImage}
                                    source={require('./../../res/inAppImages/file.png')}
                                />
                            </View>
                            <Text style={[styles.fileText]}>{_.last(this.props.item.path.split('/'))}</Text>
                        </View>
                }
            </TouchableOpacity >
        );
    }
    getStyle = (item) => {
        if (this.props.Destination.indexOf(item.path) >= 0) {
            if (item.isDirectory()) {
                return [styles.listItem, styles.destinationDirectorySelected];
            } else {
                return [styles.listItem, styles.destinationFileSelected];
            }
        } else if (this.props.Source.indexOf(item.path) >= 0) {
            if (item.isDirectory()) {
                return [styles.listItem, styles.sourceDirectorySelected];
            } else {
                return [styles.listItem, styles.sourceFileSelected];
            }
        } else {
            if (item.isDirectory()) {
                return [styles.listItem, styles.directory];
            } else {
                return [styles.listItem, styles.file];
            }
        }
    }
    onPress = (selected) => {
        if (selected.isDirectory()) {
            this.props.Dispatch(FileManagerActions.openDir(selected.path));
        }
        console.log('selected', this.props);
    }
    onLongPress = (selected) => {
        if (!this.props.SelectedAction) {
            let isAlreadySelected = this.props.Source.indexOf(selected.path);
            if (isAlreadySelected >= 0) {
                this.props.Dispatch(FileManagerActions.deSelectSource(selected.path));
            } else {
                this.props.Dispatch(FileManagerActions.selectSource(selected.path));
            }
        } else {
            let isAlreadySelected = this.props.Destination.indexOf(selected.path);
            if (isAlreadySelected >= 0) {
                this.props.Dispatch(FileManagerActions.deSelectDestination(selected.path));
            } else {
                this.props.Dispatch(FileManagerActions.selectDestination(selected.path));
            }
        }

    }
}
function mapStateToProps(state: IReducer) {
    console.log('in connect');
    return {
        App: state.App,
        PathStack: state.FileManager.PathStack,
        Source: state.FileManager.Source,
        Destination: state.FileManager.Destination,
        SelectedAction: state.FileManager.SelectedAction,
        TimeStamp: new Date().getTime()
    };
}
function mapDispatchToProps(dispatch: any) {
    return { Dispatch: dispatch };
    // return bindActionCreators(ReduxActions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(ListItem);
const styles: any = StyleSheet.create({
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
        backgroundColor: '#020202'
    },
    file: {
        backgroundColor: '#020202'
    },
    sourceDirectorySelected: {
        backgroundColor: '#124599'
    },
    sourceFileSelected: {
        backgroundColor: '#124599'
    },
    destinationDirectorySelected: {
        backgroundColor: '#0b8432'
    },
    destinationFileSelected: {
        backgroundColor: '#0b8432'
    },
    dirImage: {
        paddingLeft: 10,
        height: 40,
        width: 40
    },
    fileImage: {
        paddingLeft: 10,
        height: 40,
        width: 40
    }
});
