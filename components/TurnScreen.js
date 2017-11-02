import React from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';

import { Button } from 'react-native'; // comment out -- for testing

import GrowingCircle from './GrowingCircle';

import _ from 'lodash';

function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * The purpose of this screen is to record the number of users that want to play in a game.
 * Each player will touch the screen, and after a specified period of time, we will then examine the number of touches
 * to figure out the final game layout.
 */
export default class TurnScreen extends React.Component {
    constructor(props) {
        super(props);

        this._handleResponderGrant = this._handleResponderGrant.bind(this);
        this._handleResponderMove = this._handleResponderMove.bind(this);
        this._handleResponderRelease = this._handleResponderRelease.bind(this);

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
            touches: {},
            winnerFound: false,
            lastTouch: 0
        };
    }

    reset() {
        this.setState({
            winnerFound: false,
            touches: {},
            lastTouch: 0
        });
    }

    startTimer() {
        this.timer = setTimeout(this.calculateTurns, TIME_TO_PICK);
        this.setState({ lastTouch: new Date().getTime() });
    }

    resetTimer() {
        clearTimeout(this.timer);
        this.startTimer();
    }

    _handleResponderGrant(e, gestureState) {
        if (this.state.winnerFound) {
            return;
        }

        const { pageX: x, pageY: y, identifier } = e.nativeEvent;
        // start a timer for when the turns are locked in
        this.timer = setTimeout(this.calculateTurns, TIME_TO_PICK);

        this.setState({
            touches: {
                [identifier]: { x, y, winner: false }
            }
        });
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

        // determine if a new identifier was added to the touches
        // if so, we need to reset the duration for the circle
        const oldIds = _.keys(this.state.touches);
        const pendingIds = _.map(e.nativeEvent.touches, touch =>
            touch.identifier.toString()
        );
        const newIds = _.filter(pendingIds, id => !_.includes(oldIds, id));

        if (newIds.length) {
            // a new touch began, so we need to reset the animation
            this.resetTimer();
        }

        this.setState({ touches });
    }

    _handleResponderRelease(e, gestureState) {
        if (this.state.winnerFound) {
            return; // preserve what is displayed
        }

        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        this.setState({ winnerFound: false, touches: {} });
    }

    calculateTurns() {
        const identifiers = _.keys(this.state.touches);
        const winningIndex = getRandomNumberBetween(0, identifiers.length);
        const winningId = identifiers[winningIndex];
        let winningEntry = this.state.touches[winningId];

        const finalTouches = _.mapValues(this.state.touches, (touch, key) => {
            if (key === winningId) {
                return _.assign(winningEntry, { winner: true, angle: 0 });
            }

            return touch;
        });

        this.setState({ winnerFound: true, touches: finalTouches });
    }

    drawCircles() {
        return _.map(this.state.touches, (touch, id) => {
            const { x, y, winner, angle } = touch;
            return (
                <GrowingCircle
                    key={id}
                    x={x}
                    y={y}
                    lastUpdate={this.state.lastTouch}
                    duration={TIME_TO_PICK}
                />
            );
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.main} {...this._panResponder.panHandlers}>
                    {this.drawCircles()}
                </View>
                <Button title="Reset" onPress={this.reset} />
            </View>
        );
    }
}

const MAX_CIRCLE_SCALE = 1.75;
const CIRCLE_SIZE = 80;
const TIME_TO_PICK = 5000; // amount of time before turn-order is locked in.

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'blue'
    },
    container: {
        flex: 1
    }
});
