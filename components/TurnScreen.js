import React from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';

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
            trackedTouches: {},
            winnerFound: false,
            lastUpdate: 0
        };
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

        const finalTouches = _.mapValues(
            this.state.trackedTouches,
            (touch, key) => {
                if (key === winningId) {
                    return _.assign(winningEntry, { winner: true, angle: 0 });
                }

                return touch;
            }
        );

        this.setState({ winnerFound: true, trackedTouches: finalTouches });
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
    }
});
