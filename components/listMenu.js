import React, { Component } from 'react';
import { TouchableOpacity, FlatList, Text } from 'react-native'
export class ListMenu extends Component {
    constructor(props) {
        super(props);
        console.log('this.props', this.props)
    }
    render() {
        return (
            <FlatList
                style={this.props.style.menuList}
                data={this.props.data}
                keyExtractor={(item) => item}
                renderItem={
                    ({ item }) =>
                        <TouchableOpacity onPress={this.props.onPress.bind(this, item)}>
                            <Text style={[this.props.style.listItem,{textAlign:'center'}]}>{item}</Text>
                        </TouchableOpacity>
                }
            />
        );
    }
}
export default ListMenu