import { useFocusEffect } from "expo-router";
import { createContext, ReactNode, useCallback, useContext } from "react";
import {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedScrollHandler,
    useDerivedValue,
    useSharedValue,
} from "react-native-reanimated";

// How far (in px) the user scrolls before the header fully switches from its
// top state (black text, no gradient) to its scrolled state (white text + gradient).
export const HEADER_SCROLL_DISTANCE = 60;

// ---------------------------------------------------------------------------
// Shared scroll position for the transparent header.
//
// The header lives in the navigator (outside the screens) yet needs to react to
// each screen's scroll offset: black text / no gradient at the top, white text /
// visible gradient once you scroll. We keep a single Reanimated shared value in
// context; screens push their offset into it and the Header reads it.
// ---------------------------------------------------------------------------

const HeaderScrollContext = createContext<SharedValue<number> | null>(null);

export const HeaderScrollProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const scrollY = useSharedValue(0);

    return (
        <HeaderScrollContext.Provider value={scrollY}>
            {children}
        </HeaderScrollContext.Provider>
    );
};

// Used by the Header to drive its gradient / colour transitions.
export const useHeaderScroll = () => {
    const scrollY = useContext(HeaderScrollContext);

    if (!scrollY) {
        throw new Error("useHeaderScroll must be used within HeaderScrollProvider");
    }

    return scrollY;
};

// A 0 → 1 value driving the header's appearance (0 at the top, 1 once scrolled).
export const useHeaderProgress = () => {
    const scrollY = useHeaderScroll();

    return useDerivedValue(() =>
        interpolate(
            scrollY.value,
            [0, HEADER_SCROLL_DISTANCE],
            [0, 1],
            Extrapolation.CLAMP,
        ),
    );
};

// Attach the returned handler to an Animated.ScrollView / Animated.FlatList
// (`onScroll` + `scrollEventThrottle={16}`). The offset is reset to 0 whenever
// the screen gains focus so every screen's header starts in its top state.
export const useScreenScroll = () => {
    const scrollY = useHeaderScroll();

    useFocusEffect(
        useCallback(() => {
            // Reanimated shared values are meant to be mutated via `.value`.
            // eslint-disable-next-line react-hooks/immutability
            scrollY.value = 0;
        }, [scrollY]),
    );

    return useAnimatedScrollHandler((event) => {
        // eslint-disable-next-line react-hooks/immutability
        scrollY.value = event.contentOffset.y;
    });
};

// For full-screen immersive screens (e.g. Flow) that are always dark: keep the
// header in its "scrolled" state (white text + gradient) the whole time.
export const useSolidHeader = () => {
    const scrollY = useHeaderScroll();

    useFocusEffect(
        useCallback(() => {
            // eslint-disable-next-line react-hooks/immutability
            scrollY.value = 999;
        }, [scrollY]),
    );
};
