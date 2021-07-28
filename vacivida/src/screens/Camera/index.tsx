import React from "react";
import { useState, useEffect } from "react";
import { View, Text, ImageBackground } from "react-native";
import { Camera, CameraCapturedPicture } from 'expo-camera';
import * as ScreenOrientation from 'expo-screen-orientation';

import { styles } from "./styles";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { OCR } from "../../image-processing/ocr";
import { Image as RNImage } from "react-native";

export default function Foto() {
    const navigation = useNavigation();
    const ocr = useRef<OCR>();

    if (ocr.current == null) {
        ocr.current = new OCR();
    }

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [processing, setProcessing] = useState<number | null>(null);
    const [pictureUri, setPictureUri] = useState<string | null>(null);
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
        setProcessing(0);
        const opts: CameraCapturedPicture = await refCamera.current.takePictureAsync();
        setPictureUri(opts.uri);
        const img = new Image();
        img.src = opts.uri;
        ocr.current.onWorkerProgress = (progress) => setProcessing(progress);
        img.onload = async () => {
            const results = await ocr.current.processFile(img, [[0, 0], [0, img.height - 1], [img.width - 1, img.height - 1], [img.width - 1, 0]])
            navigation.navigate('Cadastro', { dados: results });
        }
    };

    return (
        <View style={styles.container}>
            {pictureUri == null && (
                <Camera ref={refCamera} style={styles.camera} type={Camera.Constants.Type.back} autoFocus={Camera.Constants.AutoFocus.on}>
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
            ) || (
                    <ImageBackground source={pictureUri} style={styles.foto}>
                        <Text style={styles.processingOverlayText}>Processando... {processing == null ? '' : `(${(processing * 100).toFixed(1)}%)`}</Text>
                    </ImageBackground>
                )}
        </View>
    );
}
