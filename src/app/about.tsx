import { useScreenScroll } from "@/components/HeaderScroll";
import Loader from "@/components/Loader";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import RemixIcon from "react-native-remix-icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GITHUB_USER = "https://api.github.com/users/pratksharma";
const GITHUB_REPO = "https://api.github.com/repos/pratksharma/readwiki";

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
    const insets = useSafeAreaInsets();

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
            contentContainerStyle={[
                styles.content,
                {
                    paddingBottom: insets.bottom + 32,
                },
            ]}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
        >
            <View style={styles.header}>
                <Image
                    source={require("@/assets/images/icon.png")}
                    style={styles.icon}
                />

                <Text style={styles.appName}>ReadWiki</Text>

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
                <View style={{ alignItems: "center" }}>
                    <Loader />
                </View>
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
                                        color={Colors.accent}
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

            <Text style={styles.sectionTitle}>WikiPedia</Text>

            <Pressable
                style={styles.item}
                onPress={() => Linking.openURL("https://en.wikipedia.org")}
            >
                <View style={styles.left}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={require("@/assets/wikipedia-icon.png")}
                            style={{ height: 24, width: 24 }}
                        />
                    </View>

                    <View style={styles.itemTextWrap}>
                        <Text style={styles.title}>Wikipedia</Text>
                        <Text style={styles.subtitle}>
                            Visit the Wikipedia website
                        </Text>
                    </View>
                </View>

                <RemixIcon
                    name="arrow-right-s-line"
                    size={22}
                    color={Colors.textSecondary}
                    fallback={null}
                />
            </Pressable>

            <Pressable
                style={styles.item}
                onPress={() =>
                    Linking.openURL("https://wikimediafoundation.org/support")
                }
            >
                <View style={styles.left}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={require("@/assets/wikimedia-icon.png")}
                            style={{ height: 22, width: 22 }}
                        />
                    </View>

                    <View style={styles.itemTextWrap}>
                        <Text style={styles.title}>Support Wikipedia</Text>
                        <Text style={styles.subtitle}>
                            Donate or contribute to Wikipedia
                        </Text>
                    </View>
                </View>

                <RemixIcon
                    name="arrow-right-s-line"
                    size={22}
                    color={Colors.textSecondary}
                    fallback={null}
                />
            </Pressable>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    ReadWiki is open source and uses the Wikimedia APIs to
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
        gap: 12,
    },
    header: {
        alignItems: "center",
        marginBottom: 16,
    },
    icon: {
        width: 88,
        height: 88,
        borderRadius: 22,
        marginBottom: 16,
    },
    appName: {
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
        backgroundColor: Colors.backgroundMuted,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
    },
    linkChipText: {
        fontFamily: "DMSans-Medium",
        color: Colors.text,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: "DMSans-SemiBold",
        color: Colors.textSecondary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginTop: 8,
        marginLeft: 4,
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
        color: Colors.accent,
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
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderRadius: 16,
        backgroundColor: Colors.surface,
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.backgroundMuted,
        marginRight: 14,
    },
    itemTextWrap: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontFamily: "DMSans-SemiBold",
        color: Colors.text,
    },
    subtitle: {
        marginTop: 2,
        fontSize: 13,
        fontFamily: "DMSans-Regular",
        color: Colors.textSecondary,
    },
    footer: {
        marginTop: 16,
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
