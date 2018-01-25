import React, { Component } from 'react';
import { TouchableOpacity, FlatList, Text } from 'react-native';
export class ListMenu extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement(FlatList, { style: this.props.style.menuList, data: this.props.data(), keyExtractor: (item) => item, renderItem: ({ item }) => React.createElement(TouchableOpacity, { onPress: this.props.onPress.bind(this, item) },
                React.createElement(Text, { style: [this.props.style.listItem, { textAlign: 'center' }] }, item)) }));
    }
}
export default ListMenu;
//# sourceMappingURL=listMenu.js.map