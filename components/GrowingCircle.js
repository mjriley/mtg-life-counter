// TODO -- figure out how to display a containing border
import React from 'react';
import { View, Animated, Text, StyleSheet, Easing } from 'react-native';
import _ from 'lodash';

export default class GrowingCircle extends React.Component {
    constructor(props) {
        super(props);

        const { scale, animation } = this.createAnimation();

        this.state = { scale, animation };
        animation.start();
    }

    componentWillReceiveProps(nextProps) {
        const { lastUpdate } = nextProps;
        if (this.props.lastUpdate !== lastUpdate) {
            this.resetAnimation();
        }
    }

    resetAnimation() {
        this.state.scale.setValue(MIN_SCALE);
        this.state.animation.start();
    }

    createAnimation() {
        const scale = new Animated.Value(MIN_SCALE);
        const animation = Animated.timing(scale, {
            toValue: MAX_SCALE,
            duration: ANIMATION_DURATION_MS,
            easing: Easing.linear,
            useNativeDriver: true
        });

        return { scale, animation };
    }

    render() {
        const x = (this.props.x || 0) - CIRCLE_SIZE / 2.0;
        const y = (this.props.y || 0) - CIRCLE_SIZE / 2.0;

        const containerStyle = [
            styles.container,
            {
                transform: [{ translateX: x }, { translateY: y }]
            }
        ];

        const innerStyle = [
            styles.circle,
            {
                transform: [{ scale: this.state.scale }],
                backgroundColor: this.props.isWinner ? 'yellow' : 'purple'
            }
        ];

        return (
            <View style={containerStyle}>
                <View style={styles.maxStyle} />
                <Animated.View style={innerStyle}>
                    <Text>
                        {_.isNumber(this.props.angle) ? this.props.angle : ''}
                    </Text>
                </Animated.View>
            </View>
        );
    }
}

const CIRCLE_SIZE = 80;
const MIN_SCALE = 1.0;
const MAX_SCALE = 1.5;
const ANIMATION_DURATION_MS = 3000;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        height: CIRCLE_SIZE * MAX_SCALE,
        width: CIRCLE_SIZE * MAX_SCALE
    },
    maxStyle: {
        position: 'absolute',
        borderRadius: CIRCLE_SIZE * MAX_SCALE / 2.0,
        borderWidth: 3,
        borderColor: 'black',
        width: CIRCLE_SIZE * MAX_SCALE,
        height: CIRCLE_SIZE * MAX_SCALE
    },
    circle: {
        position: 'absolute',
        borderRadius: CIRCLE_SIZE / 2.0,
        borderWidth: 5,
        borderColor: 'black',
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
