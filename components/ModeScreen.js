import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default class ModeScreen extends React.Component {
    static navigationOptions = {
        title: 'ModeScreen'
    };

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {}

    render() {
        return (
            <View style={styles.display}>
                <View style={styles.button}>
                    <Button title="Commander" onPress={this.handleClick} />
                </View>
                <View style={styles.button}>
                    <Button title="1v1" onPress={this.handleClick} />
                </View>
                <View style={styles.button}>
                    <Button title="2-headed Giant" onPress={this.handleClick} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    display: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'yellow'
    },
    button: {
        marginBottom: 10
    }
});
