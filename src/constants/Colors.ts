// constants/colors.ts

export const Colors = {
    primary: "#191919", // warm slate — filled buttons, indicators, active states
    secondary: "#6B6760", // warm gray
    accent: "#CC785C", // coral ("book cloth") — brand accent icons/links

    // Backgrounds
    background: "#f2f3e4", // unchanged — warm cream
    backgroundSecondary: "#EAEBDA",
    backgroundMuted: "#e2e3cc", // darker shade of the bg — accent chips, fallbacks, icon boxes
    surface: "#FBFBF6", // warm white card
    surfaceMuted: "#EFEFE7", // warm muted surface

    // Text
    text: "#1D1B18", // warm near-black
    textSecondary: "#57534E", // warm gray
    textMuted: "#8B857B", // warm muted gray
    textInverse: "#FBFBF6",

    // Borders
    border: "#D8D7C9", // warm border tuned to the cream
    borderStrong: "#C4C3B2",

    // Status
    success: "#4D7C0F",
    warning: "#B45309",
    error: "#B91C1C",
    info: "#57534E",

    // Interactive
    link: "#AE4B2E", // deep terracotta link
    linkHover: "#8F3D25",

    // Inputs
    inputBackground: "#FBFBF6",
    inputBorder: "#D8D7C9",
    inputPlaceholder: "#A8A296",

    // Misc
    divider: "#E4E3D6",
    shadow: "rgba(25, 25, 25, 0.08)",

    // Wikipedia-inspired subtle accent
    wiki: "#CC785C",
} as const;

export default Colors;
