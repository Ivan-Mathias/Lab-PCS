import { StyleSheet } from 'react-native';
import theme from '../../global/theme';

export default StyleSheet.create({
    container: {
        flex: 1
    },
    legenda: {
        fontSize: 14,
        marginBottom: 8,
        color: theme.colors.fields.label
    },
    picker: {
        width: '100%',
        padding: 10,
        height: 56,
        // borderColor: theme.colors.backdrop,
        // borderRadius: theme.roundness,
        // backgroundColor: theme.colors.background,
        // borderWidth: 1,
    }
})
