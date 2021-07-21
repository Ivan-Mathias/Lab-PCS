import { StyleSheet } from 'react-native';
import theme from '../../global/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: theme.roundness,
        borderWidth: 1,
        borderColor: theme.colors.fields.border,
        backgroundColor: theme.colors.fields.background,
        padding: 10
    }
})
