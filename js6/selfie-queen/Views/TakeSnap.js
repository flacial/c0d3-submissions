import { useState, useRef } from "react";
import { Text, View, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import UploadModal from "../components/UploadModal";
import MainButton from "../components/MainButton";
import SecondaryButton from "../components/SecondaryButton";
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";

const sendImage = async (imageBuffer, sendTo) => {
    const r = await fetch(sendTo, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            imageData: imageBuffer
        })
    })

    const result = await r.json();

    return result;
}

const takeSnap = async (camera) => {
    const snapResults = await camera.current.takePictureAsync({
        quality: 1,
        base64: true,
    });

    return snapResults;
}

const TakeSnap = (ratio, sendTo) => () => {
    const camera = useRef();

    // 1 Taking image, 2 Getting link, 0 initial state
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [cameraMounted, setCameraMounted] = useState(false);
    const [snapState, setSnapState] = useState(0);
    const [snapResult, setSnapResult] = useState(null);
    const [snapLink, setSnapLink] = useState(null);
    const [imagesCount, setImagesCount] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);

    // Impure snap
    const snapTask = async (camera) => {
        setSnapLink(null);
        setSnapState(1);
        const snapResult = await takeSnap(camera);

        setModalVisible(true);
        setSnapResult(snapResult);

        return snapResult;
    }

    // Impure sendImage/Snap.
    const sendSnapTask = async (snapResult, sendTo) => {
        setModalVisible(false);
        setSnapState(2);
        const { imgUrl } = await sendImage(snapResult.base64, sendTo);

        setSnapLink(imgUrl);
        setSnapState(0);
        setImagesCount(prevCount => prevCount + 1);

        return imgUrl;
    }

    const snapStateType = (snapState) => {
        if (snapState === 1) return "TAKING SNAP...";
        if (snapState === 2) return "GETTING LINK...";

        return "SNAP";
    }

    // ⚠️ Completely impure
    const retakeSnap = () => {
        setSnapResult(null);
        setSnapState(0);
        setModalVisible(false);
    }

    // Unmount camera when screen is unfocused
    useFocusEffect(
        () => {
            const unmountCamera = (() => {
                setCameraMounted(true);
                return () => setCameraMounted(false)
            })();

            return unmountCamera;
        }
    );

    return (
        <>
            <StatusBar backgroundColor="#9879f8" />
            {
                cameraMounted ?
                    <Camera
                        ref={camera}
                        style={styles.camera}
                        type={type}
                        ratio={ratio || "4:3"}
                        autoFocus={Camera.Constants.AutoFocus.on}>
                    </Camera>
                    :
                    <View style={styles.cameraPlaceholder}></View>
            }
            <View style={styles.subContainer}>
                <View style={styles.buttonsContainer}>
                    <Text style={styles.imagesCount}>Taken images: {imagesCount}</Text>
                    <SecondaryButton options={{
                        onPress: () => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        },
                        buttonStyle: styles.button,
                        buttonTextStyle: styles.text,
                        buttonText: "FLIP"
                    }} />
                    <MainButton options={{
                        gradientColors: ['#9879f8', '#6768f3'],
                        gradientStyle: styles.snapButtonContainer,
                        buttonStyle: styles.snapButton,
                        buttonText: snapStateType(snapState),
                        buttonTextStyle: styles.snapButtonText,
                        onPress: () => snapState === 0 && snapTask(camera)
                    }} />
                    <UploadModal
                        isModalVisible={isModalVisible}
                        onRetake={retakeSnap}
                        onUpload={() => sendSnapTask(snapResult, sendTo)}
                        snapResult={snapResult}
                    />
                </View>
                {
                    snapLink && (
                        <View style={styles.linkContainer}>
                            <Text style={styles.linkOpenText} onPress={() => Linking.openURL(snapLink)}>VIEW SNAP</Text>
                        </View>
                    )
                }
            </View >
        </>
    )
}

const styles = {
    subContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        justifyItems: 'center',
        flex: 1
    },
    camera: {
        width: "100%",
        height: 500
    },
    cameraPlaceholder: {
        width: "100%",
        backgroundColor: "#000",
        height: 500
    },
    text: {
        color: "#a5a5ae",
        textAlign: "center",
        fontWeight: "bold"
    },
    button: {
        backgroundColor: "hsla(0, 0%, 90%, 0.8)",
        borderRadius: 10,
        width: 100,
        height: 70,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    snapButton: {
        borderRadius: 10,
        width: 150,
        height: 70,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonsContainer: {
        backgroundColor: "hsla(0, 0%, 90%, 0.5)",
        width: "100%",
        maxWidth: 300,
        height: "100%",
        maxHeight: 100,
        borderRadius: 10,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
    },
    snapButtonContainer: {
        borderRadius: 10,
        shadowColor: "hsl(239.6, 90.4%, 60.8%)",
        elevation: 10,
    },
    snapButtonText: {
        color: "hsl(239.6, 90.4%, 90.8%)",
        fontWeight: "bold",
        fontSize: 16
    },
    imagesCount: {
        position: "absolute",
        top: -25,
        left: 0,
        fontSize: 14,
        color: "hsla(0, 0%, 70%, 1)"
    },
    linkContainer: {
        marginTop: 40,
    },
    linkOpenText: {
        color: "#6768f3",
        fontWeight: "bold",
        textDecorationLine: "underline"
    },
}

export default TakeSnap;