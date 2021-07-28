import { StyleSheet } from 'react-native';
import theme from '../../global/theme';

export const styles = StyleSheet.create({
    titulo:{
        marginTop: 92,
        fontSize: 36,
        alignSelf: 'center',
        marginBottom: 25
    },
    secao:{
        marginTop: 20,
        width: 357,
        alignSelf: 'center',
    },
    nomeSecao:{
        marginTop: 20,
        marginBottom: 5,
        marginLeft: 16,
        color: theme.colors.fields.label,
        fontSize: 12,
    },
    conteudoSecao:{
        marginTop: 6,
        marginLeft: 16,
        color: "#000",
        fontSize: 18,
    },
    conteudoUnico:{
        marginVertical: 10,
        marginLeft: 16,
        color: "#000",
        fontSize: 18,
    },
    nPendentes:{
        position: 'absolute',
        top: 9,
        left: 250,
        paddingVertical: 4,
        borderWidth: 0,
        borderRadius: 15,
        backgroundColor: theme.colors.accent,
        color: "#fff",
        textAlign: 'center',
        width: 50,
    },
    botaoCadastro:{
        marginTop: 60,
        marginBottom: 10,
        paddingVertical: 10,
        width: 260, 
        alignSelf: 'center',
        backgroundColor: theme.colors.accent,
    },
    botaoFoto:{
        marginTop: 10,
        marginBottom: 40,
        paddingVertical: 10,
        width: 260, 
        alignSelf: 'center',
        backgroundColor: theme.colors.accent,
    },
    botaoContent:{
        justifyContent: 'center',
        color: "#fff",
        fontSize: 24,
    },
    botaoSecudario:{
        position: 'absolute',
        top: 4,
        width: 360,
        alignSelf: 'center'
    }
});
