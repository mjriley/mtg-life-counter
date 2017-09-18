import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import baseStyles from '../styles/base';

const ACTIVE_COLOR = 'red';
const NON_ACTIVE_COLOR = 'blue';

const styles = StyleSheet.create({
    active: {
        backgroundColor: ACTIVE_COLOR
    },
    passive: {
        backgroundColor: NON_ACTIVE_COLOR
    }
});

export default class PlayerView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[{ justifyContent: 'center' }, this.props.style]}>
                <Text style={[{ alignSelf: 'center' }, baseStyles.text]}>
                    {this.props.name}
                </Text>
            </View>
        );
    }
}
