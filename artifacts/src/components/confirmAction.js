import React, { Component } from 'react';
import { View, StyleSheet, Button } from 'react-native';
export class ConfirmAction extends Component {
    constructor(props) {
        super(props);
        this.cancelAction = () => {
            this.props.setPropsToState({
                selectedOption: '',
                destination: [],
                source: [],
                isActionConfirmed: false
            }, () => {
                this.props.action();
            });
        };
        this.confirmAction = () => {
            this.props.setPropsToState({
                isActionConfirmed: true
            }, () => {
                this.props.action();
            });
        };
    }
    render() {
        return (React.createElement(View, { style: styles.actionBar },
            React.createElement(View, { style: styles.cancelButton },
                React.createElement(Button, { title: 'cancel', color: '#f44242', onPress: this.cancelAction.bind(this) })),
            React.createElement(View, { style: styles.confirmButton },
                React.createElement(Button, { title: 'confirm', color: '#4a9b3e', onPress: this.confirmAction.bind(this) }))));
    }
}
const styles = StyleSheet.create({
    cancelButton: {
        width: '50%',
        backgroundColor: '#f44242',
    },
    confirmButton: {
        width: '50%',
        backgroundColor: '#4a9b3e',
    },
    cancelButtonText: {
        color: '#ffffff',
    },
    confirmButtonText: {
        color: '#ffffff',
    },
    actionBar: {
        flexDirection: 'row',
        backgroundColor: '#a9c1e8'
    }
});
export default ConfirmAction;
//# sourceMappingURL=confirmAction.js.map