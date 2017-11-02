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

import { Button } from 'react-native'; // comment out -- for testing

import GrowingCircle from './GrowingCircle';

import _ from 'lodash';

function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export default class TurnScreen extends React.Component {
    constructor(props) {
        super(props);

        this._handleResponderGrant = this._handleResponderGrant.bind(this);
        this._handleResponderMove = this._handleResponderMove.bind(this);
        this._handleResponderRelease = this._handleResponderRelease.bind(this);
        this._handleLayout = this._handleLayout.bind(this);

        this.calculateTurns = this.calculateTurns.bind(this);
        this.reset = this.reset.bind(this);

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
            trackedTouches: {},
            winnerFound: false,
            lastUpdate: 0,
            center: null
        };

        this.upscale = Animated.timing();
    }

    reset() {
        this.setState({
            winnerFound: false,
            trackedTouches: {}
        });
    }

    _handleResponderGrant(e, gestureState) {
        if (this.state.winnerFound) {
            return;
        }

        const { pageX: x, pageY: y, identifier } = e.nativeEvent;
        // start a timer for when the turns are locked in
        this.timer = setTimeout(this.calculateTurns, TIME_TO_PICK);

        this.setState({
            trackedTouches: {
                [identifier]: { x, y, winner: false }
            }
        });
    }

    _handleLayout(e) {
        // const { x, y } = e.nativeEvent.layout;
        // this.setState({ x, y, init: true });
        // this.setState({ init: true });

        const { width, height } = e.nativeEvent.layout;
        this.setState({ center: [width / 2.0, height / 2.0] });
    }

    _handleResponderMove(e, gestureState) {
        if (this.state.winnerFound) {
            // no point in tracking anything if we're already done
            return;
        }

        touches = _.fromPairs(
            _.map(e.nativeEvent.touches, touch => [
                touch.identifier,
                {
                    x: touch.pageX,
                    y: touch.pageY,
                    winner: false
                }
            ])
        );

        this.setState({ trackedTouches: touches });
    }

    _handleResponderRelease(e, gestureState) {
        if (this.state.winnerFound) {
            return; // preserve what is displayed
        }

        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        this.setState({ winnerFound: false, trackedTouches: {} });
    }

    calculateTurns() {
        const identifiers = _.keys(this.state.trackedTouches);
        const winningIndex = getRandomNumberBetween(0, identifiers.length);
        const winningId = identifiers[winningIndex];
        let winningEntry = this.state.trackedTouches[winningId];
        // winningEntry = _.assign(winningEntry, { winner: true, order: 0 });

        // const newTouches = _.assign(this.state.trackedTouches, {
        //     [winningId]: winningEntry
        // });

        // this.setState({ winnerFound: true, trackedTouches: newTouches });

        // establish the line between the center of the screen and the winning touch to be 0 degrees
        const center = { x: this.state.center[0], y: this.state.center[1] };

        const baseVector = {
            x: winningEntry.x - center.x,
            y: winningEntry.y - center.y
        };

        const baseLength = Math.sqrt(
            baseVector.x * baseVector.x + baseVector.y * baseVector.y
        );

        // const remainingTouches = _.omit(this.state.trackedTouches, [winningId]);
        // const angles = _.mapValues(remainingTouches, touch => {
        //     // calculate the vector
        //     const vector = {
        //         x: touch.x - this.state.center.x,
        //         y: touch.y - this.state.center.y
        //     };
        //     const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        //     const crossProduct =
        //         baseVector.x * vector.y + baseVector.y * vector.y;
        //     const lengthProduct = baseLength * length;
        //     const angle = Math.acos(crossProduct / lengthProduct);
        //     const angleInDegrees = angle * 180 / Math.PI;
        //     return angleInDegrees;
        // });

        const finalTouches = _.mapValues(
            this.state.trackedTouches,
            (touch, key) => {
                if (key === winningId) {
                    return _.assign(winningEntry, { winner: true, angle: 0 });
                }

                const vector = {
                    x: touch.x - center.x,
                    y: touch.y - center.y
                };
                const length = Math.sqrt(
                    vector.x * vector.x + vector.y * vector.y
                );
                const crossProduct =
                    baseVector.x * vector.x + baseVector.y * vector.y;
                const lengthProduct = baseLength * length;
                const angle = Math.acos(crossProduct / lengthProduct);
                const angleInDegrees = angle * 180 / Math.PI;

                return _.assign(touch, { angle: angleInDegrees });
            }
        );

        console.log('final touches are: ', finalTouches);

        this.setState({ winnerFound: true, trackedTouches: finalTouches });
        // for each other touch, calculate the angle relative to the base line
        // order each identier/angle combination
        // assign each touch a turn order
    }

    drawCircles() {
        return _.map(this.state.trackedTouches, (touch, id) => {
            const { x, y, winner, angle } = touch;
            return (
                <GrowingCircle
                    key={id}
                    x={x}
                    y={y}
                    lastUpdate={1}
                    isWinner={winner}
                    angle={angle}
                />
            );
        });
    }

    drawCenter() {
        if (this.state.center) {
            return (
                <GrowingCircle
                    x={this.state.center[0]}
                    y={this.state.center[1]}
                    lastUpdate={1}
                    isWinner={false}
                />
            );
        }
    }

    handlePress() {
        this.setState({ lastUpdate: this.state.lastUpdate + 1 });
    }

    render() {
        return (
            <View style={styles.container}>
                <View
                    onLayout={this._handleLayout}
                    style={styles.main}
                    {...this._panResponder.panHandlers}
                >
                    {this.drawCircles()}
                </View>
                <Button
                    title="Reset"
                    style={styles.button}
                    onPress={this.reset}
                />
            </View>
        );
    }
}

const MAX_CIRCLE_SCALE = 1.75;
const CIRCLE_SCALE_DURATION = 3000; // in milliseconds
const CIRCLE_SIZE = 80;
const TIME_TO_PICK = 5000; // amount of time before turn-order is locked in.

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'blue'
    },
    container: {
        flex: 1
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
    },
    button: {
        height: 100
    }
});
