import { useSolidHeader } from "@/components/HeaderScroll";
import { Image as ExpoImage } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";

const Image = () => {
    const { image } = useLocalSearchParams<{
        image: string;
    }>();

    // Full-screen dark viewer, so keep the header's back button white.
    useSolidHeader();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ExpoImage
                source={image}
                style={styles.backgroundImage}
                contentFit="cover"
                blurRadius={30}
            />
            <View style={styles.overlay} />
            <View style={styles.imageContainer}>
                <ExpoImage
                    source={image}
                    style={styles.mainImage}
                    contentFit="contain"
                    transition={200}
                />
            </View>
        </View>
    );
};

export default Image;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },

    backgroundImage: {
        ...StyleSheet.absoluteFill,
    },

    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.75)",
    },

    safeArea: {
        flex: 1,
    },

    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    mainImage: {
        width: "100%",
        height: "80%",
    },
});
