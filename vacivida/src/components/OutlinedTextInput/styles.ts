import { StyleSheet } from 'react-native';
import theme from '../../global/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    legenda: {
        fontSize: 14,
        fontFamily: theme.fonts.regular.fontFamily,
        color: theme.colors.fields.label,
        marginBottom: 4
    },
    input: {
        width: '100%',
        height: 56,
        fontSize: 16,
        borderRadius: theme.roundness,
        borderWidth: 1,
        borderColor: theme.colors.fields.border,
        backgroundColor: theme.colors.fields.background,
        paddingHorizontal: 12
    }
})
