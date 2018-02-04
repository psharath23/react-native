import React, { Component } from 'react';
import { Dimensions, Image, Modal, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { IReducer } from '../interfaces/index';
export class CustomActivityIndicator extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        console.log('custom', this.props);
        return (
            <View>
                <Modal
                    visibile={this.props.isVisible}
                    transparent={true}
                >
                    <View>
                        <Image
                            style={styles.modal}
                            source={require('./../../res/inAppImages/loading.gif')}
                        />
                    </View>
                </Modal>
            </View>
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
