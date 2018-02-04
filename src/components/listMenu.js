import React, { Component } from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
export class ListMenu extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement(FlatList, { style: this.props.style.menuList, data: this.props.data(), keyExtractor: (item) => item, renderItem: ({ item }) => React.createElement(TouchableOpacity, { onPress: this.props.onPress.bind(this, item) },
                React.createElement(Text, { style: [this.props.style.listItem, { textAlign: 'center' }] }, item)) }));
    }
}
function mapStateToProps(state) {
    return {
        App: state.App,
        FileManager: state.FileManager
    };
}
function mapDispatchToProps(dispatch) {
    return { Dispatch: dispatch };
}
export default connect(mapStateToProps, mapDispatchToProps)(ListMenu);
