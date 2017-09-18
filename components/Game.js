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
            players: [
                { name: 'Alan', life: 40 },
                { name: 'Bobby', life: 40 },
                { name: 'Carl', life: 20 },
                { name: 'David', life: 45 }
            ],
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

    // NOTE -- this doesn't actually resume the timer; each resume resets the timer back to 0.
    // implement https://stackoverflow.com/a/3969760 when able
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

    handleLifeChange(index, type) {
        const player = this.state.players[index];
        const updatedLife = type === 'inc' ? player.life + 1 : player.life - 1;

        const updatedPlayer = _.assign(player, { life: updatedLife });
        const newPlayers = [
            ...this.state.players.slice(0, index),
            updatedPlayer,
            ...this.state.players.slice(index + 1)
        ];

        this.setState({
            players: newPlayers
        });
    }

    renderPlayer(index) {
        const isActive = index === this.state.activePlayerIndex;
        const style = isActive ? styles.active : styles.passive;
        const player = this.state.players[index];

        const callback = this.handleLifeChange.bind(this, index);

        return (
            <PlayerView
                style={style}
                name={player.name}
                life={player.life}
                active={isActive}
                onLifeChange={callback}
            />
        );
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
