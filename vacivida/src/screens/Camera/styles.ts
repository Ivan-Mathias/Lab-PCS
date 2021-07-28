import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    camera: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    botaoCamera: {
        top: '80%',
        left: '50%',
        marginLeft: -25,
        backgroundColor: 'white',
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 0,
        padding: 0,
    },
    processingOverlay: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255,255,255,.3)',
    },
    processingOverlayText: {
        paddingTop: '20%',
        left: 0,
        width: '100%',
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'black',
        fontSize: 30,
    },
    foto: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    }
})
