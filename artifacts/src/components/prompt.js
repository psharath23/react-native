import React, { Component } from 'react';
import { Button, Dimensions, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { connect } from 'react-redux';
export class Prompt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promptValue: ''
        };
    }
    render() {
        console.log('change', this.state.promptValue);
        return (React.createElement(Modal, { visible: this.props.visible, transparent: true, onRequestClose: this.props.onCancel },
            React.createElement(View, { style: styles.modal },
                React.createElement(Text, { style: styles.modalTitle }, this.props.title),
                React.createElement(TextInput, { placeholder: this.props.placeholder, onChangeText: (text) => this.setState({ promptValue: text }), value: this.state.promptValue }),
                React.createElement(View, { style: styles.button },
                    React.createElement(View, { style: styles.confirmButton },
                        React.createElement(Button, { title: 'submit', color: '#4a9b3e', onPress: () => this.props.onSubmit(this.state.promptValue) })),
                    React.createElement(View, { style: styles.cancelButton },
                        React.createElement(Button, { title: 'cancel', color: '#f44242', onPress: this.props.onCancel }))))));
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
        width: '50%',
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
function mapStateToProps(state) {
    return {
        App: state.App,
        FileManager: state.FileManager
    };
}
function mapDispatchToProps(dispatch) {
    return { Dispatch: dispatch };
}
export default connect(mapStateToProps, mapDispatchToProps)(Prompt);
//# sourceMappingURL=prompt.js.map