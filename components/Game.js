import React from 'react';
import { View } from 'react-native';
import PlayerView from './PlayerView';
import TurnComponent from './TurnComponent';
import _ from 'lodash';
import styles from '../styles/base';

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: ['Alan', 'Bobby', 'Carl', 'David'],
            activePlayerIndex: 0,
            isPaused: true,
            turnTime: 0
        };

        this.passTurn = this.passTurn.bind(this);
        this.resumeTimer = this.resumeTimer.bind(this);
        this.tickPlayer = this.tickPlayer.bind(this);
        this.togglePause = this.togglePause.bind(this);
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    passTurn() {
        this.setState(prevState => {
            return {
                activePlayerIndex: (this.state.activePlayerIndex + 1) % 4,
                turnTime: 0,
                isPaused: false
            };
        }, this.resumeTimer);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    resumeTimer() {
        this.stopTimer();
        this.timer = setInterval(this.tickPlayer, 1000);
    }

    togglePause() {
        if (this.state.isPaused) {
            this.setState({ isPaused: false }, this.resumeTimer);
        } else {
            this.stopTimer();
            this.setState({ isPaused: true });
        }
    }

    tickPlayer() {
        this.setState(prevState => {
            return { turnTime: prevState.turnTime + 1 };
        });
    }

    render() {
        return (
            <View style={styles.main}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <PlayerView
                        style={
                            this.state.activePlayerIndex === 0 ? (
                                styles.active
                            ) : (
                                styles.passive
                            )
                        }
                        name={this.state.players[0]}
                    />
                    <PlayerView
                        style={
                            this.state.activePlayerIndex === 1 ? (
                                styles.active
                            ) : (
                                styles.passive
                            )
                        }
                        name={this.state.players[1]}
                        active={true}
                    />
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <PlayerView
                        style={
                            this.state.activePlayerIndex === 3 ? (
                                styles.active
                            ) : (
                                styles.passive
                            )
                        }
                        name={this.state.players[3]}
                        active={false}
                    />
                    <PlayerView
                        style={
                            this.state.activePlayerIndex === 2 ? (
                                styles.active
                            ) : (
                                styles.passive
                            )
                        }
                        name={this.state.players[2]}
                        active={false}
                    />
                </View>
                <TurnComponent
                    style={styles.timer}
                    time={this.state.turnTime}
                    isPaused={this.state.isPaused}
                    onPass={this.passTurn}
                    onPause={this.togglePause}
                />
            </View>
        );
    }
}
