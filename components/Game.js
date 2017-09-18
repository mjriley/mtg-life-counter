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

    renderPlayer(index) {
        const isActive = index === this.state.activePlayerIndex;
        const style = isActive ? styles.active : styles.passive;
        const name = this.state.players[index];

        return <PlayerView style={style} name={name} active={isActive} />;
    }

    render() {
        return (
            <View style={styles.main}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {this.renderPlayer(0)}
                    {this.renderPlayer(1)}
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    {this.renderPlayer(3)}
                    {this.renderPlayer(2)}
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
