import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    PanResponder,
    Animated,
    Easing
} from 'react-native';

import _ from 'lodash';

export default class TurnScreen extends React.Component {
    constructor(props) {
        super(props);

        this._handleResponderGrant = this._handleResponderGrant.bind(this);
        this._handleResponderMove = this._handleResponderMove.bind(this);
        this._handleResponderRelease = this._handleResponderRelease.bind(this);
        this._handleLayout = this._handleLayout.bind(this);

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: this._handleResponderGrant,
            onPanResponderMove: this._handleResponderMove,
            onPanResponderRelease: this._handleResponderRelease
        });

        this.state = {
            init: false,
            baseOffsetX: 0,
            baseOffsetY: 0,
            x: 0,
            y: 0,
            circleScale: new Animated.Value(1),
            numTouches: 0,
            trackedTouches: {}
        };

        this.upscale = Animated.timing();
    }

    _handleResponderGrant(e, gestureState) {
        // account for the previous offset
        // const prevX = this.state.x;
        // const prevY = this.state.y;
        // let circleScale = new Animated.Value(1);
        // let { locationX: x, locationY: y } = e.nativeEvent;
        // let { dx: x, dy: y } = gestureState;
        // console.log(`x is: ${x} and y is: ${y}`);
        // this.setState({ trackedTouches: [{ x, y }] });
        // this.setState({
        //     baseOffsetX: this.state.x,
        //     baseOffsetY: this.state.y,
        //     circleScale
        // });
        // const anim = Animated.timing(circleScale, {
        //     toValue: MAX_CIRCLE_SCALE,
        //     duration: CIRCLE_SCALE_DURATION,
        //     easing: Easing.linear
        // });
        // anim.start();
    }

    _handleLayout(e) {
        // const { x, y } = e.nativeEvent.layout;
        // this.setState({ x, y, init: true });
        this.setState({ init: true });
    }

    _handleResponderMove(e, gestureState) {
        // const { moveX: x, moveY: y, numActiveTouches, stateID } = gestureState;
        // const { locationX: x, locationY: y } = e.nativeEvent;
        // if (numTouches !== this.state.numTouches) {
        // console.log('touches are: ', e.nativeEvent.touches);
        // console.log('changed touches are: ', e.nativeEvent.changedTouches);

        touches = _.fromPairs(
            _.map(e.nativeEvent.touches, touch => [
                touch.identifier,
                {
                    x: touch.pageX,
                    y: touch.pageY
                }
            ])
        );
        // }

        this.setState({ trackedTouches: touches });

        // const { dx, dy } = gestureState;
        // const numTouches = e.nativeEvent.touches.length;
        // // const touchMap = _.map(e.nativeEvent.touches, (touch => [touch.identifier, touch.);
        // if (numTouches !== this.state.numTouches) {
        //     console.log('change in number of touches: ', numTouches);
        //     console.log('identifier of touch is: ', e.nativeEvent.touches[0]);
        //     console.log('dx and dy is: ', dx, dy);
        // }
        // this.setState({
        //     x: this.state.baseOffsetX + dx,
        //     y: this.state.baseOffsetY + dy,
        //     numTouches
        // });
    }

    _handleResponderRelease(e, gestureState) {
        this.setState({ trackedTouches: {} });
    }

    drawCircles() {
        const radius = CIRCLE_SIZE / 2.0;

        return _.map(this.state.trackedTouches, (touch, id) => {
            const { x, y } = touch;
            const circleStyle = [
                styles.circle,
                {
                    transform: [
                        { translateX: x - radius },
                        { translateY: y - radius }
                    ]
                }
            ];
            return <View key={id} style={circleStyle} />;
        });
        // if (this.state.trackedTouches.length) {
        //     const circleStyle = [
        //         styles.circle,
        //         {
        //             transform: [
        //                 {
        //                     translateX:
        //                         this.state.trackedTouches[0].x -
        //                         CIRCLE_SIZE / 2.0
        //                 },
        //                 {
        //                     translateY:
        //                         this.state.trackedTouches[0].y -
        //                         CIRCLE_SIZE / 2.0
        //                 },
        //                 { rotate: '0deg' },
        //                 { scale: 1 }
        //             ]
        //         }
        //     ];
        //     return <View style={circleStyle} />;
        // }
    }

    render() {
        // const circleStyle = this.state.init
        //     ? [
        //           styles.circle,
        //           {
        //               transform: [
        //                   { translateX: this.state.x },
        //                   { translateY: this.state.y },
        //                   { rotate: '0deg' },
        //                   { scale: this.state.circleScale }
        //               ],
        //               backgroundColor: 'yellow'
        //           }
        //       ]
        //     : styles.circle;

        return (
            <View style={styles.main} {...this._panResponder.panHandlers}>
                {/* <Animated.View
                    onLayout={this._handleLayout}
                    style={circleStyle}
                    {...this._panResponder.panHandlers}
                /> */}
                {this.drawCircles()}
                {/* <View style={styles.touch} /> */}
            </View>
        );
    }
}

const MAX_CIRCLE_SCALE = 1.75;
const CIRCLE_SCALE_DURATION = 3000; // in milliseconds
const CIRCLE_SIZE = 80;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'blue'
    },
    touch: {
        flex: 1,
        backgroundColor: 'red'
    },
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderColor: 'black',
        borderWidth: 5,
        borderRadius: CIRCLE_SIZE / 2,
        position: 'absolute',
        backgroundColor: 'purple'
    }
});
