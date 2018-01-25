import React, { Component } from 'react';
import { TouchableOpacity, FlatList, Text } from 'react-native'
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
export default ListMenu