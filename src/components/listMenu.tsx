import React, { Component } from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { IReducer } from '../interfaces/index';
export class ListMenu extends Component<any, any> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <FlatList
                style={this.props.style.menuList}
                data={this.props.data()}
                keyExtractor={(item) => item}
                renderItem={
                    ({ item }) =>
                        <TouchableOpacity onPress={this.props.onPress.bind(this, item)}>
                            <Text style={[this.props.style.listItem, { textAlign: 'center' }]}>{item}</Text>
                        </TouchableOpacity>
                }
            />
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
export default connect(mapStateToProps, mapDispatchToProps)(ListMenu);
