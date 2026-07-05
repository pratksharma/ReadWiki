import { useFocusEffect } from "expo-router";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from "react";
import {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedScrollHandler,
    useDerivedValue,
    useSharedValue,
} from "react-native-reanimated";

// ---------------------------------------------------------------------------
// Scroll position that drives the transparent header.
//
// The header lives in the navigator (outside the screens) and needs to react to
// the *focused* screen's scroll offset: black text / no gradient at the top,
// white text / visible gradient once you scroll.
//
// Each screen owns its own shared value (so its scroll position is remembered
// when you navigate away and back), and on focus it registers that value as the
// "active" one the header reads. Screens that shouldn't drive the header (e.g.
// Search, whose list sits below a fixed bar) register a static value instead.
// ---------------------------------------------------------------------------

// How far (px) you scroll before the header fully switches from its top state
// (black text, no gradient) to its scrolled state (white text + gradient).
export const HEADER_SCROLL_DISTANCE = 60;

// Any value past HEADER_SCROLL_DISTANCE forces the "scrolled" (white) look.
const SOLID = HEADER_SCROLL_DISTANCE + 1;

type HeaderScrollContextValue = {
    active: SharedValue<number>;
    setActive: (value: SharedValue<number>) => void;
    // Shared, always-0 value → header stays in its top (black, no gradient) state.
    top: SharedValue<number>;
    // Shared, always-SOLID value → header stays in its scrolled (white) state.
    solid: SharedValue<number>;
};

const HeaderScrollContext = createContext<HeaderScrollContextValue | null>(null);

export const HeaderScrollProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const top = useSharedValue(0);
    const solid = useSharedValue(SOLID);
    const [active, setActive] = useState<SharedValue<number>>(top);

    return (
        <HeaderScrollContext.Provider value={{ active, setActive, top, solid }}>
            {children}
        </HeaderScrollContext.Provider>
    );
};

const useHeaderScrollContext = () => {
    const context = useContext(HeaderScrollContext);

    if (!context) {
        throw new Error(
            "HeaderScroll hooks must be used within HeaderScrollProvider",
        );
    }

    return context;
};

// A 0 → 1 value driving the header's appearance (0 at the top, 1 once scrolled).
// Reads the currently active screen's scroll value.
export const useHeaderProgress = () => {
    const { active } = useHeaderScrollContext();

    return useDerivedValue(
        () =>
            interpolate(
                active.value,
                [0, HEADER_SCROLL_DISTANCE],
                [0, 1],
                Extrapolation.CLAMP,
            ),
        [active],
    );
};

// Attach the returned handler to an Animated.ScrollView / Animated.FlatList
// (`onScroll` + `scrollEventThrottle={16}`). The screen's own offset is what the
// header reads while this screen is focused.
export const useScreenScroll = () => {
    const { setActive } = useHeaderScrollContext();
    const scrollY = useSharedValue(0);

    useFocusEffect(
        useCallback(() => {
            setActive(scrollY);
        }, [setActive, scrollY]),
    );

    return useAnimatedScrollHandler((event) => {
        // eslint-disable-next-line react-hooks/immutability
        scrollY.value = event.contentOffset.y;
    });
};

// Keep the header in its top state (black text, no gradient) regardless of any
// scrolling — for screens where nothing scrolls under the header (e.g. Search).
export const useStaticHeader = () => {
    const { setActive, top } = useHeaderScrollContext();

    useFocusEffect(
        useCallback(() => {
            setActive(top);
        }, [setActive, top]),
    );
};

// Keep the header in its scrolled state (white text + gradient) the whole time —
// for full-screen dark screens (e.g. Flow, the image viewer).
export const useSolidHeader = () => {
    const { setActive, solid } = useHeaderScrollContext();

    useFocusEffect(
        useCallback(() => {
            setActive(solid);
        }, [setActive, solid]),
    );
};
