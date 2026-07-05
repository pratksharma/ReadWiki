import { BlurView, type BlurTint } from "expo-blur";
import { createContext, ReactNode, useContext, type RefObject } from "react";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

// ---------------------------------------------------------------------------
// Frosted-glass surfaces for the header pills and tab bar.
//
// iOS: <BlurView> blurs the content behind it natively — real frosted glass.
//
// Android: since SDK 54 a BlurView only produces a *true* blur when the content
// is wrapped in a <BlurTargetView> whose ref is handed to the BlurView. That
// native path (`dimezisBlurView`) is not available in Expo Go and, when the blur
// view sits inside its own target, can crash the app. So in Expo Go we fall back
// to a translucent frosted tint (see `androidFallback` below), which never
// crashes. To get real Android blur, build a dev client and we can re-enable the
// BlurTargetView wiring there.
// ---------------------------------------------------------------------------

// Kept so callers can stay unchanged; currently always undefined (no target).
const BlurTargetContext = createContext<RefObject<View | null> | undefined>(
    undefined,
);

export const useBlurTarget = () => useContext(BlurTargetContext);

export const BlurTargetProvider = ({ children }: { children: ReactNode }) => {
    return (
        <BlurTargetContext.Provider value={undefined}>
            {children}
        </BlurTargetContext.Provider>
    );
};

type GlassViewProps = {
    // Blur strength (1-100). Lower reads as a subtle frost.
    intensity?: number;
    tint?: BlurTint;
    style?: StyleProp<ViewStyle>;
    children?: ReactNode;
};

// A rounded frosted-glass surface. Callers provide the shape (padding, border
// radius) through `style`; the blur fills it behind the children. `overflow` is
// forced hidden because a BlurView doesn't clip to `borderRadius` on its own.
export const GlassView = ({
    intensity = 40,
    tint = "light",
    style,
    children,
}: GlassViewProps) => {
    return (
        <View style={[styles.clip, style]}>
            <BlurView
                style={StyleSheet.absoluteFill}
                intensity={intensity}
                tint={tint}
            />
            {/* Android's plain BlurView is barely visible, so lay a soft white
                tint under the content to keep the surface readable. */}
            {Platform.OS === "android" && (
                <View
                    style={[StyleSheet.absoluteFill, styles.androidFallback]}
                />
            )}
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    clip: {
        overflow: "hidden",
    },
    androidFallback: {
        backgroundColor: "rgba(255,255,255,0.55)",
    },
});
