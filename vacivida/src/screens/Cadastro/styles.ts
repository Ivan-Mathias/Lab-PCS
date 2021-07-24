import { StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import theme from '../../global/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        flexDirection: 'column'
    },
    titulo: {
        marginTop: getStatusBarHeight() + 40,
        marginBottom: 15,
        fontSize: 36,
        textAlign: 'center'
    },
    subtitulo: {
        fontSize: 24,
        color: theme.colors.accent,
        textAlign: 'center',
        marginBottom: 18
    },
    campos: {
        flex: 1
    },
    linha: {
        flexDirection: 'row',
        marginBottom: 12
    },
    espacador: {
        width: 20
    },
    botoesRodape: {
        paddingTop: 12
    }
})
