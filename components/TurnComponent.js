import React from 'react';
import { View, Text, Button, TouchableWithoutFeedback } from 'react-native';
import styles from '../styles/base';

export default function TurnComponent({
    style,
    time,
    isPaused,
    onPass,
    onPause
}) {
    return (
        <View style={style}>
            <Button title="Pass" onPress={onPass} />
            <Text
                style={[
                    {
                        textAlign: 'center',
                        backgroundColor: 'black',
                        width: '100%'
                    },
                    styles.text
                ]}
            >
                {time}
            </Text>
            <Button title={isPaused ? 'Resume' : 'Pause'} onPress={onPause} />
        </View>
    );
}
