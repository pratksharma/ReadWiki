import { StyleSheet, Text, View } from "react-native";

const Flow = () => {
    return (
        <View style={styles.container}>
            <Text>Flow</Text>
        </View>
    );
};

export default Flow;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
