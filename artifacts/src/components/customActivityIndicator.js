import React, { Component } from 'react';
import { Dimensions, Image, Modal, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
export class CustomActivityIndicator extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        console.log('custom', this.props);
        return (React.createElement(View, null,
            React.createElement(Modal, { visibile: this.props.isVisible, transparent: true },
                React.createElement(View, null,
                    React.createElement(Image, { style: styles.modal, source: require('@res/inAppImages/loading.gif') })))));
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
export default connect(mapStateToProps, mapDispatchToProps)(CustomActivityIndicator);
const styles = StyleSheet.create({
    modal: {
        borderRadius: 20,
        padding: 20,
        height: 100,
        width: 100,
        position: 'absolute',
        top: Dimensions.get('window').height - 450,
        left: Dimensions.get('window').width - 270
    }
});
//# sourceMappingURL=customActivityIndicator.js.map