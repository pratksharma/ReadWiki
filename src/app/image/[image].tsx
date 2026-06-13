import Colors from "@/constants/Colors";
import { Image as ExpoImage } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Image = () => {
    const { image } = useLocalSearchParams<{
        image: string;
    }>();

    const insets = useSafeAreaInsets();

    return (
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
            <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [
                    { top: insets.top + 8 },
                    styles.backButton,
                    pressed && styles.backButtonPressed,
                ]}
            >
                <RemixIcon
                    name="arrow-left-long-fill"
                    size={16}
                    color="#fff"
                    fallback={null}
                />
                <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
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

    backButton: {
        position: "absolute",
        left: 16,
        borderRadius: 100,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(10px)",
    },

    backButtonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.95 }],
    },
    backButtonText: {
        color: Colors.textInverse,
        fontSize: 12,
        fontFamily: "DMSans-Medium",
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
