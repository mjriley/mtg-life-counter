import { StyleSheet, StatusBar } from 'react-native';

export default (styles = StyleSheet.create({
    main: {
        marginTop: StatusBar.currentHeight,
        flex: 1
    },
    active: {
        flex: 1,
        backgroundColor: 'pink',
        borderWidth: 2,
        borderColor: 'black'
    },
    passive: {
        flex: 1,
        backgroundColor: 'blue',
        borderWidth: 2,
        borderColor: 'black'
    },
    timer: {
        position: 'absolute',
        left: '40%',
        right: '40%',
        top: 0,
        bottom: 0,
        justifyContent: 'center'
    },
    text: {
        color: 'white'
    }
}));
