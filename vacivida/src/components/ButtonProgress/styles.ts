import { StyleSheet } from 'react-native';
import theme from '../../global/theme';

export default StyleSheet.create({
    container: {
        borderRadius: theme.roundness,
        flexDirection: 'row',
        height: 52,
        justifyContent: 'space-between'
    },
    espacador: {
        width: 20
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
