import React from 'react';
import { View, Modal, Text, TextInput, StyleSheet } from 'react-native';

export default class NameEntry extends React.Component {
    constructor() {
        this.state = {
            playerName: ''
        };

        this.handleNameEntry = this.handleNameEntry.bind(this);
    }

    handleNameEntry(name) {
        this.setState({ playerName: name });
    }

    render() {
        return (
            <Modal
                transparent={true}
                visible={this.props.visible}
                onRequestClose={this.props.onClose}
            >
                <View style={styles.view}>
                    <Text style={styles.title}>Player Name</Text>
                    <TextInput defaultValue="PlayerName" onChangeText={this.handleNameEntry} />
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        position: 'absolute',
        left: '15%',
        right: '15%',
        top: '10%',
        bottom: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black'
    },
    title: {
        color: 'yellow'
    }
});
