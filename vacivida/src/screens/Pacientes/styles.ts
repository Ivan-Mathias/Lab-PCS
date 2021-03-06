import { StyleSheet } from 'react-native';
import theme from '../../global/theme';

export const styles = StyleSheet.create({
    titulo:{
        marginTop: 92,
        paddingHorizontal: 92,
        fontSize: 36,
        textAlign: 'center',
        alignSelf: 'center',
        marginBottom: 25
    },
    busca:{
        marginTop: 5,
        height: 50,
        width: 360,
        paddingLeft: 20,
        alignSelf: 'center',
        backgroundColor: theme.colors.fields.background,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: theme.colors.fields.border,
    },
    botao: {
        marginTop: 10,
        marginBottom: 40,
        paddingVertical: 5,
        width: 260,
        alignSelf: 'center',
        backgroundColor: theme.colors.accent,
    },
    botaoContent:{
        justifyContent: 'center',
        color: "#fff",
        fontSize: 24,
    },
    nomeSecao:{
        marginTop: 20,
        marginLeft: 16,
        color: "#909090",
        fontSize: 14,
    },
    searchIcon:{
        position: 'absolute',
        top: 43,
        left: 310,
    }
});
