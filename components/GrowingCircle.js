// TODO -- figure out how to display a containing border
import React from 'react';
import { View, Animated, Text, StyleSheet, Easing } from 'react-native';

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
            easing: Easing.linear
        });

        return { scale, animation };
    }

    render() {
        const x = (this.props.x || 0) - CIRCLE_SIZE / 2.0;
        const y = (this.props.y || 0) - CIRCLE_SIZE / 2.0;

        // const containerStyle = [
        //     styles.container,
        //     { transform: [
        //         {translateX: x },
        //         {translateY: y}
        //     ]}
        // ];

        // const innerStyle = [
        //     styles.circle,
        //     {
        //         transform: [ {scale: this.state.scale }],
        //         backgroundColor: this.props.isWinner ? 'yellow' : 'purple'
        //     }
        // ];

        const style = [
            styles.circle,
            {
                transform: [
                    { translateX: x },
                    { translateY: y },
                    { scale: this.state.scale }
                ],
                backgroundColor: this.props.isWinner ? 'yellow' : 'purple'
            }
        ];

        return (
            // <View style={containerStyle}>
            //     <View style={styles.maxStyle} />
            <Animated.View style={style}>
                <Text>{this.props.angle || 'T'}</Text>
            </Animated.View>
            // </View>
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
        position: 'absolute'
    },
    maxStyle: {
        position: 'absolute',
        borderRadius: CIRCLE_SIZE / 2.0,
        borderWidth: 3,
        borderColor: 'black',
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        transform: [{ scale: MAX_SCALE }]
    },
    circle: {
        position: 'absolute',
        borderRadius: CIRCLE_SIZE / 2.0,
        backgroundColor: 'purple',
        borderWidth: 5,
        borderColor: 'black',
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
