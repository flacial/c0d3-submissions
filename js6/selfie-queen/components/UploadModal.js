import { View, Image } from 'react-native';
import Modal from "react-native-modal";
import MainButton from './MainButton';
import SecondaryButton from './SecondaryButton';

const UploadModal = ({ isModalVisible, onUpload, onRetake, snapResult }) => {
    return (
        <Modal isVisible={isModalVisible}>
            <View style={styles.modalView} >
                <Image
                    style={styles.snapPreview}
                    source={snapResult?.uri && {
                        uri: snapResult.uri,
                    }}
                />
                <View style={styles.modalButtons}>
                    <SecondaryButton options={{
                        onPress: () => onRetake(),
                        buttonStyle: styles.button,
                        buttonTextStyle: styles.text,
                        buttonText: "Retake"
                    }} />
                    <MainButton options={{
                        gradientColors: ['#79dbf8', '#67adf3'],
                        gradientStyle: styles.uploadButtonContainer,
                        buttonStyle: styles.uploadButton,
                        onPress: () => onUpload(),
                        buttonText: "UPLOAD",
                        buttonTextStyle: styles.uploadButtonText
                    }} />
                </View>
            </View>
        </Modal>
    )
}

export default UploadModal;

const styles = {
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
    modalText: {
        fontSize: 18,
        fontWeight: '500',
    },
    modalView: {
        width: 350,
        height: 550,
        borderRadius: 10,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingBottom: 20,
        display: 'flex',
    },
    uploadButton: {
        borderRadius: 10,
        height: 70,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        width: 150,
    },
    uploadButtonContainer: {
        borderRadius: 10,
        height: 70,
        flex: 1,
        maxWidth: 150,
        shadowColor: "hsl(239.6, 90.4%, 60.8%)",
        elevation: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    uploadButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    },
    modalButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    snapPreview: {
        resizeMode: 'stretch',
        flex: 1,
        marginVertical: 40,
        borderRadius: 10
    }
}