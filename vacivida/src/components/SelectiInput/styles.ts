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
    wrapper: {
        borderColor :  theme.colors.fields.border,
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderRadius: 8
    },
    picker: {
        height: 56
    }
})
