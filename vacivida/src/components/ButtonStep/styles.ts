import { StyleSheet } from 'react-native';
import theme from '../../global/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        height: 52,
        borderRadius: theme.roundness,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    texto: {
        textAlign: 'center',
        fontSize: 20,
        lineHeight: 50
    },
    primary: {
        backgroundColor: theme.colors.accent
    },
    secondary: {
        backgroundColor: theme.colors.basic
    }
})
