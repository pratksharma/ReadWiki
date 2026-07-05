import { useScreenScroll } from "@/components/HeaderScroll";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated from "react-native-reanimated";
import RemixIcon from "react-native-remix-icon";

const GITHUB_USER = "https://api.github.com/users/pratksharma";
const GITHUB_REPO = "https://api.github.com/repos/pratksharma/WikiAtlas";

type GithubUser = {
    avatar_url: string;
    name: string;
    login: string;
    bio: string;
    blog: string;
};

type GithubRepo = {
    html_url: string;
    homepage: string | null;
    description: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    license: {
        name: string;
    } | null;
};

export default function About() {
    const [author, setAuthor] = useState<GithubUser | null>(null);
    const [repo, setRepo] = useState<GithubRepo | null>(null);
    const [loading, setLoading] = useState(true);
    const onScroll = useScreenScroll();

    useEffect(() => {
        async function load() {
            try {
                const [userRes, repoRes] = await Promise.all([
                    fetch(GITHUB_USER),
                    fetch(GITHUB_REPO),
                ]);

                const [user, repository] = await Promise.all([
                    userRes.json(),
                    repoRes.json(),
                ]);

                setAuthor(user);
                setRepo(repository);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return (
        <Animated.ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
        >
            <View style={styles.header}>
                <Image
                    source={require("@/assets/images/icon.png")}
                    style={styles.icon}
                />

                <Text style={styles.title}>WikiAtlas</Text>

                <Text style={styles.version}>Version 1.0.0</Text>

                <Text style={styles.description}>
                    {repo?.description ??
                        "A clean and modern Wikipedia reader."}
                </Text>

                <View style={styles.appLinks}>
                    {repo && (
                        <Pressable
                            style={styles.linkChip}
                            onPress={() => Linking.openURL(repo.html_url)}
                        >
                            <RemixIcon
                                name="github-fill"
                                size={16}
                                color={Colors.text}
                            />
                            <Text style={styles.linkChipText}>GitHub</Text>
                        </Pressable>
                    )}

                    {repo?.homepage ? (
                        <Pressable
                            style={styles.linkChip}
                            onPress={() =>
                                Linking.openURL(repo.homepage as string)
                            }
                        >
                            <RemixIcon
                                name="global-line"
                                size={16}
                                color={Colors.text}
                            />
                            <Text style={styles.linkChipText}>Homepage</Text>
                        </Pressable>
                    ) : null}
                </View>
            </View>

            <Text style={styles.sectionTitle}>Author</Text>

            {loading ? (
                <ActivityIndicator color={Colors.primary} />
            ) : (
                author && (
                    <View style={styles.card}>
                        <Image
                            source={author.avatar_url}
                            style={styles.avatar}
                        />

                        <View style={styles.cardContent}>
                            <Text style={styles.name}>{author.name}</Text>

                            <Text style={styles.username}>@{author.login}</Text>

                            {!!author.bio && (
                                <Text style={styles.bio}>{author.bio}</Text>
                            )}

                            {!!author.blog && (
                                <Pressable
                                    style={styles.portfolio}
                                    onPress={() => Linking.openURL(author.blog)}
                                >
                                    <RemixIcon
                                        name="global-line"
                                        size={16}
                                        color={Colors.primary}
                                    />

                                    <Text style={styles.portfolioText}>
                                        {author.blog.replace(
                                            /^https?:\/\//,
                                            "",
                                        )}
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                )
            )}

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    WikiAtlas is open source and uses the Wikimedia APIs to
                    provide access to Wikipedia content.
                </Text>

                <Text style={styles.copyright}>
                    © {new Date().getFullYear()} {author?.name}
                </Text>
            </View>
        </Animated.ScrollView>
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
        paddingBottom: 32,
    },
    header: {
        alignItems: "center",
        marginBottom: 32,
    },
    icon: {
        width: 88,
        height: 88,
        borderRadius: 22,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontFamily: "DMSans-Bold",
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
        lineHeight: 22,
        color: Colors.textSecondary,
        fontFamily: "DMSans-Regular",
    },
    appLinks: {
        flexDirection: "row",
        gap: 12,
        marginTop: 18,
    },
    linkChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: Colors.surface,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
    },
    linkChipText: {
        fontFamily: "DMSans-Medium",
        color: Colors.text,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 12,
        fontFamily: "DMSans-Bold",
        color: Colors.text,
    },
    card: {
        flexDirection: "row",
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontFamily: "DMSans-Bold",
        color: Colors.text,
    },
    username: {
        marginTop: 2,
        marginBottom: 8,
        fontFamily: "DMSans-Regular",
        color: Colors.textSecondary,
    },
    bio: {
        lineHeight: 20,
        color: Colors.text,
        fontFamily: "DMSans-Regular",
    },
    portfolio: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 12,
        alignSelf: "flex-start",
    },
    portfolioText: {
        color: Colors.primary,
        fontFamily: "DMSans-Medium",
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: Colors.surface,
        borderRadius: 16,
        paddingVertical: 20,
    },
    stat: {
        flex: 1,
        alignItems: "center",
        gap: 4,
    },
    statValue: {
        fontSize: 18,
        fontFamily: "DMSans-Bold",
        color: Colors.text,
    },
    statLabel: {
        fontFamily: "DMSans-Regular",
        color: Colors.textSecondary,
    },
    footer: {
        marginTop: 32,
        alignItems: "center",
    },
    footerText: {
        textAlign: "center",
        lineHeight: 22,
        color: Colors.textSecondary,
        fontFamily: "DMSans-Regular",
    },
    copyright: {
        marginTop: 16,
        fontFamily: "DMSans-Medium",
        color: Colors.textSecondary,
    },
});
