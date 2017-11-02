import React from 'react';
import { StyleSheet, Text, View, StatusBar, Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Game from './components/Game';
import ModeScreen from './components/ModeScreen';
import TurnScreen from './components/TurnScreen';

const SimpleApp = StackNavigator(
    {
        Modes: {
            screen: ModeScreen
        },
        GetPlayers: {
            screen: TurnScreen
        },
        Game: {
            screen: Game
        }
    },
    {
        headerMode: 'none',
        cardStyle: {
            paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
        }
    }
);

export default class App extends React.Component {
    render() {
        return <Game />;
        // return <SimpleApp />;
        // return <TurnScreen />;
    }
}
