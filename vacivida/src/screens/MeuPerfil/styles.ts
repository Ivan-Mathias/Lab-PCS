import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    titulo:{
        marginTop: 92,
        fontSize: 36,
        alignSelf: 'center',
        marginBottom: 25
    },
    secao:{
        borderTopColor: "#909090",
        borderTopWidth: StyleSheet.hairlineWidth,
        marginTop: 20,
        width: 357,
        alignSelf: 'center',
    },
    nomeSecao:{
        marginTop: 20,
        marginLeft: 16,
        color: "#909090",
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
        backgroundColor: "#02C532",
        color: "#fff",
        textAlign: 'center',
        width: 50,
    }
});