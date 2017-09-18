import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';

import baseStyles from '../styles/base';

const ACTIVE_COLOR = 'red';
const NON_ACTIVE_COLOR = 'blue';

const styles = StyleSheet.create({
    active: {
        backgroundColor: ACTIVE_COLOR
    },
    passive: {
        backgroundColor: NON_ACTIVE_COLOR
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    button: {
        flex: 1,
        opacity: 0.2
    }
});

export default class PlayerView extends React.Component {
    constructor(props) {
        super(props);
    }

    renderLifeButtons() {
        return (
            <View style={styles.overlay}>
                <TouchableHighlight
                    style={styles.button}
                    onPress={() => this.props.onLifeChange('inc')}
                >
                    <View />
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.button}
                    onPress={() => this.props.onLifeChange('dec')}
                >
                    <View />
                </TouchableHighlight>
            </View>
        );
    }

    render() {
        return (
            <View style={[{ justifyContent: 'center' }, this.props.style]}>
                <Text style={[{ alignSelf: 'center' }, baseStyles.text]}>
                    {this.props.name}
                </Text>
                <Text
                    style={[
                        { alignSelf: 'center', fontSize: 40 },
                        baseStyles.text
                    ]}
                >
                    {this.props.life}
                </Text>
                {this.renderLifeButtons()}
            </View>
        );
    }
}
