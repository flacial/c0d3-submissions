import { Image, SafeAreaView, FlatList, Text, View, Linking, StatusBar as StatusBarClass } from "react-native";
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar'

const getAllImages = async () => {
    const r = await fetch("https://laicalf.freedomains.dev/p8/api/images");

    const imagesArr = await r.json();

    return imagesArr;
}

const Gallery = () => {
    const [imagesLinks, setimagesLinks] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(async () => setimagesLinks(await getAllImages()), []);

    const renderItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image style={styles.stretch} source={{ uri: item }} />
            <Text style={styles.linkOpenText} onPress={() => Linking.openURL(item)}>VIEW IMAGE</Text>
        </View>
    );

    const refreshImagesLink = async () => {
        const newImages = await getAllImages();
        setimagesLinks(newImages);
        setRefresh(false);
    };

    const getTitle = !imagesLinks || refresh ? 'Fetching...' : imagesLinks.length ? 'Gallery' : 'No Snaps Yet :)';

    return (
        <>
            <StatusBar backgroundColor="#9879f8" />
            <SafeAreaView style={styles.container}>
                <Text style={styles.heading}>{getTitle}</Text>
                {
                    <FlatList onRefresh={() => {
                        setRefresh(true);
                        refreshImagesLink();
                    }} refreshing={refresh} data={imagesLinks} renderItem={renderItem} keyExtractor={item => item} />
                }
            </SafeAreaView>
        </>
    )
}

export default Gallery;

const styles = {
    stretch: {
        resizeMode: 'stretch',
        height: 400,
        borderRadius: 10,
        marginRight: 20,
        marginLeft: 20,
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        justifyItems: 'center',
        alignContent: 'center',
        flex: 1,
        marginTop: StatusBarClass.currentHeight
    },
    heading: {
        fontSize: 34,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 15
    },
    linkOpenText: {
        color: "#6768f3",
        fontWeight: "bold",
        textDecorationLine: "underline",
        textAlign: 'center',
        marginTop: 10
    },
    imageContainer: {
        marginBottom: 40,
    }
}