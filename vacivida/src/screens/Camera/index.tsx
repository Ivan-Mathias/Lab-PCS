import React from "react";
import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Camera, CameraCapturedPicture } from 'expo-camera';
import * as ScreenOrientation from 'expo-screen-orientation';

import { styles } from "./styles";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { OCR } from "../../image-processing/ocr";

export default function Foto() {
    const navigation = useNavigation();
    const ocr = new OCR();

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const refCamera = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
        (async () => {
            if (await ScreenOrientation.supportsOrientationLockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)) {
                navigation.addListener('focus', async () => {
                    await ScreenOrientation.unlockAsync();
                });
                navigation.addListener('blur', async () => {
                    try {
                        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                    } catch {
                        // Ignore lock errors
                    }
                });
            }
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>Sem acesso à camera</Text>;
    }

    const handlePhoto = async () => {
        setProcessing(true);
        const opts: CameraCapturedPicture = await refCamera.current.takePictureAsync();
        const img = new Image();
        img.src = opts.uri;
        img.onload = async () => {
            const results = await ocr.processFile(img, [[0, 0], [0, img.height - 1], [img.width - 1, img.height - 1], [img.width - 1, 0]])
            navigation.navigate('Cadastro', { results: results });
        }
    };

    return (
        <View style={styles.container}>
            <Camera ref={refCamera} style={styles.camera} type={Camera.Constants.Type.back}>
                {processing && (
                    <View style={styles.processingOverlay}>
                        <Text style={styles.processingOverlayText}>Processando...</Text>
                    </View>
                )}
                <IconButton style={styles.botaoCamera}
                    icon={require('../../assets/camera.png')}
                    size={25}
                    onPress={handlePhoto}
                    color="#909090"
                />
            </Camera>
        </View>
    );
}
