'use strict';

import React from 'react';
import { View, Button } from 'react-native';
import PlayerView from './PlayerView';
import TurnComponent from './TurnComponent';
import _ from 'lodash';
import styles from '../styles/base';

import NameEntry from './NameEntry';

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
            turnTime: 0,
            showNameEntry: false,
            horizontal: false
        };

        this.passTurn = this.passTurn.bind(this);
        this.resumeTimer = this.resumeTimer.bind(this);
        this.tickPlayer = this.tickPlayer.bind(this);
        this.togglePause = this.togglePause.bind(this);

        this.toggleNameEntry = this.toggleNameEntry.bind(this);

        this.handleLayout = this.handleLayout.bind(this);
    }

    handleLayout(e) {
        // determine if we're horizontal or vertical
        const { width, height } = e.nativeEvent.layout;
        const horizontal = width > height;

        this.setState({ horizontal });
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

    toggleNameEntry() {
        this.setState({ showNameEntry: !this.state.showNameEntry });
    }

    renderPlayers() {
        // render two main 'rows' -- if we're horizontal, then our flexdirection should be column, otherwise it should be row
        // each row then receives the players, using the inverse flex direction
        const mainDirection = this.state.horizontal ? 'column' : 'row';
        const subDirection = this.state.horizontal ? 'row' : 'column';

        const containerStyle = { flex: 1, flexDirection: mainDirection };
        const rowStyle = { flex: 1, flexDirection: subDirection };

        // generate an array of player indices
        const playerIndices = _.range(this.props.numPlayers);
        let topRow = _.slice(playerIndices, 0, playerIndices.length / 2);
        let botRow = _.slice(playerIndices, playerIndices.length / 2);

        // different orientations change clockwise behavior
        this.state.horizontal ? botRow.reverse() : topRow.reverse();

        return (
            <View style={containerStyle}>
                <View style={rowStyle}>
                    {_.map(topRow, player => (
                        <PlayerView
                            key={player}
                            style={styles.passive}
                            name={player}
                            life={40}
                            active={false}
                        />
                    ))}
                </View>
                <View style={rowStyle}>
                    {_.map(botRow, player => (
                        <PlayerView
                            key={player}
                            style={styles.passive}
                            name={player}
                            life={40}
                            active={false}
                        />
                    ))}
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.main} onLayout={this.handleLayout}>
                {this.renderPlayers()}
                {/* <View style={{ flex: 1, flexDirection: 'row' }}>
                    {this.renderPlayer(0)}
                    {this.renderPlayer(1)}
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    {this.renderPlayer(3)}
                    {this.renderPlayer(2)}
                </View> */}
                {/* <TurnComponent
                    style={styles.timer}
                    time={this.state.turnTime}
                    isPaused={this.state.isPaused}
                    onPass={this.passTurn}
                    onPause={this.togglePause}
                /> */}
            </View>
        );
    }
}
