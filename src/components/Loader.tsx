import { ContainedLoadingIndicator, Host } from "@expo/ui/jetpack-compose";
import { ActivityIndicator, Platform, StyleSheet } from "react-native";

const Loader = () => {
    if (Platform.OS === "ios") {
        return <ActivityIndicator size="large" />;
    }
    return (
        <Host matchContents>
            <ContainedLoadingIndicator />
        </Host>
    );
};

export default Loader;

const styles = StyleSheet.create({});
