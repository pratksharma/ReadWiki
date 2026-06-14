import { Image as ExpoImage } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Image = () => {
    const { image, title } = useLocalSearchParams<{
        image: string;
        title: string;
    }>();

    const insets = useSafeAreaInsets();

    return (
        <>
            <Stack.Screen options={{ title: title }} />
            <View
                style={[
                    styles.container,
                    {
                        paddingTop: insets.top,
                    },
                ]}
            >
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
        </>
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
        borderRadius: 20,
    },
});
