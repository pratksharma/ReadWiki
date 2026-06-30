import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

const GITHUB_USER = "https://api.github.com/users/pratksharma";

type GithubUser = {
    avatar_url: string;
    name: string;
    login: string;
    bio: string;
    blog: string;
};

export default function About() {
    const [author, setAuthor] = useState<GithubUser | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(GITHUB_USER);
                const data = await res.json();
                setAuthor(data);
            } catch (e) {
                console.log(e);
            }
        }

        load();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Image
                    source={require("@/assets/images/icon.png")}
                    style={styles.icon}
                />

                <Text style={styles.title}>WikiAtlas</Text>

                <Text style={styles.version}>Version 1.0.0</Text>

                <Text style={styles.description}>
                    A clean and modern Wikipedia reader built with React Native
                    and Expo.
                </Text>
            </View>

            <Text style={styles.sectionTitle}>Developer</Text>

            {!author ? (
                <ActivityIndicator color={Colors.primary} />
            ) : (
                <View style={styles.card}>
                    <Image source={author.avatar_url} style={styles.avatar} />

                    <View style={{ flex: 1 }}>
                        <Text style={styles.name}>{author.name}</Text>
                        <Text style={styles.username}>@{author.login}</Text>
                        <Text style={styles.bio}>{author.bio}</Text>
                    </View>
                </View>
            )}

            <Text style={styles.sectionTitle}>Links</Text>

            <Pressable
                style={styles.item}
                onPress={() =>
                    Linking.openURL("https://github.com/pratksharma/WikiAtlas")
                }
            >
                <Text style={styles.itemText}>Source Code</Text>

                <RemixIcon
                    name="external-link-line"
                    size={20}
                    color={Colors.textSecondary}
                />
            </Pressable>

            <Pressable
                style={styles.item}
                onPress={() => Linking.openURL(author?.blog as string)}
            >
                <Text style={styles.itemText}>Developer Website</Text>

                <RemixIcon
                    name="external-link-line"
                    size={20}
                    color={Colors.textSecondary}
                />
            </Pressable>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    WikiAtlas is open source and uses Wikimedia APIs to provide
                    access to Wikipedia content.
                </Text>

                <Text style={styles.copyright}>© 2026 Prateek Sharma</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 20,
        paddingTop: 120,
    },
    header: {
        alignItems: "center",
        marginBottom: 32,
    },
    icon: {
        width: 88,
        height: 88,
        borderRadius: 24,
        marginBottom: 16,
    },
    title: {
        fontFamily: "DMSans-Bold",
        fontSize: 28,
        color: Colors.text,
    },
    version: {
        marginTop: 4,
        fontFamily: "DMSans-Medium",
        color: Colors.textSecondary,
    },
    description: {
        marginTop: 16,
        textAlign: "center",
        fontFamily: "DMSans-Regular",
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    sectionTitle: {
        fontFamily: "DMSans-Bold",
        fontSize: 18,
        color: Colors.text,
        marginBottom: 12,
        marginTop: 12,
    },
    card: {
        flexDirection: "row",
        gap: 16,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    name: {
        fontFamily: "DMSans-Bold",
        fontSize: 18,
        color: Colors.text,
    },
    username: {
        fontFamily: "DMSans-Regular",
        color: Colors.textSecondary,
        marginBottom: 6,
    },
    bio: {
        fontFamily: "DMSans-Regular",
        color: Colors.text,
        lineHeight: 20,
    },
    item: {
        height: 56,
        backgroundColor: Colors.surface,
        borderRadius: 14,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    itemText: {
        fontFamily: "DMSans-Medium",
        color: Colors.text,
        fontSize: 16,
    },
    footer: {
        marginTop: 32,
        alignItems: "center",
    },
    footerText: {
        textAlign: "center",
        color: Colors.textSecondary,
        fontFamily: "DMSans-Regular",
        lineHeight: 22,
    },
    copyright: {
        marginTop: 16,
        color: Colors.textSecondary,
        fontFamily: "DMSans-Medium",
    },
});
