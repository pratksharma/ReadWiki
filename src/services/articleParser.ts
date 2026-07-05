import { parseDocument } from "htmlparser2";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// An inline run of text inside a paragraph or list item. `link` holds the
// Wikipedia article title to open when the run is a tappable link.
export type Span = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    link?: string;
};

// The building blocks the article screen knows how to render.
export type Block =
    | { type: "heading"; level: number; text: string }
    | { type: "paragraph"; spans: Span[] }
    | { type: "list"; ordered: boolean; items: Span[][] }
    | {
          type: "image";
          src: string;
          caption?: string;
          width?: number;
          height?: number;
      };

// ---------------------------------------------------------------------------
// What to ignore
// ---------------------------------------------------------------------------

// Elements with any of these classes are noise (references, navboxes,
// info boxes, edit links, hidden descriptions, etc.) and are skipped whole.
const SKIP_CLASSES = [
    "reference",
    "reflist",
    "mw-references-wrap",
    "navbox",
    "vertical-navbox",
    "navbox-styles",
    "hatnote",
    "shortdescription",
    "metadata",
    "mw-empty-elt",
    "infobox",
    "sistersitebox",
    "portal",
    "mw-editsection",
    "noprint",
    "toc",
    "catlinks",
    "printfooter",
    "gallery",
    "thumbinner-hidden",
    "ambox",
    "mbox-small",
    "mw-authority-control",
];

// Headings after which the rest of the page is just references / links,
// so we stop parsing once we reach one of them for a clean ending.
const STOP_HEADINGS = [
    "references",
    "notes",
    "citations",
    "footnotes",
    "sources",
    "bibliography",
    "further reading",
    "external links",
    "works cited",
    "explanatory notes",
];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const getClasses = (node: any): string[] => {
    const className = node?.attribs?.class;
    return className ? className.split(/\s+/) : [];
};

const shouldSkip = (node: any): boolean => {
    if (node?.type !== "tag") return false;

    const role = node.attribs?.role;
    if (role === "navigation" || role === "note") return true;

    if (node.attribs?.style?.includes("display:none")) return true;

    const classes = getClasses(node);
    return classes.some((cls) => SKIP_CLASSES.includes(cls));
};

// Turns a Wikipedia href into an article title we can open in the app,
// or null when the link is not an internal article (files, anchors,
// special pages, external URLs, etc.).
const articleFromHref = (href?: string): string | null => {
    if (!href || !href.startsWith("/wiki/")) return null;

    const raw = href.slice("/wiki/".length).split("#")[0];
    if (!raw) return null;

    let title: string;
    try {
        title = decodeURIComponent(raw);
    } catch {
        title = raw;
    }

    // Skip everything that lives in a namespace (File:, Category:, Help:, …).
    if (
        /^(File|Image|Media|Special|Help|Category|Template|Wikipedia|Portal|Talk|Draft|Module):/i.test(
            title,
        )
    ) {
        return null;
    }

    return title.replace(/_/g, " ");
};

// Plain text of a node and all its children (used for headings/captions).
const getText = (node: any): string => {
    if (!node) return "";
    if (node.type === "text") return node.data ?? "";
    if (!Array.isArray(node.children)) return "";
    return node.children.map(getText).join("");
};

// Collapses adjacent runs that share the same formatting so we render
// fewer <Text> nodes, and drops empty runs.
const mergeSpans = (spans: Span[]): Span[] => {
    const merged: Span[] = [];

    for (const span of spans) {
        if (!span.text) continue;

        const last = merged[merged.length - 1];

        if (
            last &&
            !!last.bold === !!span.bold &&
            !!last.italic === !!span.italic &&
            last.link === span.link
        ) {
            last.text += span.text;
        } else {
            merged.push({ ...span });
        }
    }

    // Trim the very start and end of the whole run.
    if (merged.length) {
        merged[0].text = merged[0].text.replace(/^\s+/, "");
        merged[merged.length - 1].text = merged[merged.length - 1].text.replace(
            /\s+$/,
            "",
        );
    }

    return merged.filter((span) => span.text.length > 0);
};

// Collects the inline spans inside a block element, carrying bold /
// italic / link formatting down through nested tags.
const getSpans = (node: any): Span[] => {
    const spans: Span[] = [];

    const walkInline = (n: any, ctx: Omit<Span, "text">) => {
        if (!n) return;

        if (n.type === "text") {
            const text = (n.data ?? "").replace(/\s+/g, " ");
            if (text) spans.push({ text, ...ctx });
            return;
        }

        if (n.type !== "tag" || shouldSkip(n)) return;

        if (n.name === "br") {
            spans.push({ text: " " });
            return;
        }

        const next = { ...ctx };

        if (n.name === "b" || n.name === "strong") next.bold = true;
        if (n.name === "i" || n.name === "em") next.italic = true;
        if (n.name === "a") {
            const link = articleFromHref(n.attribs?.href);
            if (link) next.link = link;
        }

        (n.children ?? []).forEach((child: any) => walkInline(child, next));
    };

    (node.children ?? []).forEach((child: any) => walkInline(child, {}));

    return mergeSpans(spans);
};

// Pulls an image block out of a <figure> element.
const parseFigure = (node: any): Block | null => {
    let img: any = null;

    const findImg = (n: any) => {
        if (img || !n) return;
        if (n.type === "tag" && n.name === "img") {
            img = n;
            return;
        }
        (n.children ?? []).forEach(findImg);
    };
    findImg(node);

    if (!img) return null;

    let src: string | undefined = img.attribs?.src;
    if (!src) return null;

    // Wikipedia serves protocol-relative URLs like "//upload.wikimedia.org/…".
    if (src.startsWith("//")) src = `https:${src}`;

    const width = Number(img.attribs?.width) || undefined;
    const height = Number(img.attribs?.height) || undefined;

    // The caption lives in a <figcaption> sibling.
    let caption = "";
    const findCaption = (n: any) => {
        if (caption || !n) return;
        if (n.type === "tag" && n.name === "figcaption") {
            caption = getText(n).replace(/\s+/g, " ").trim();
            return;
        }
        (n.children ?? []).forEach(findCaption);
    };
    findCaption(node);

    return {
        type: "image",
        src,
        caption: caption || undefined,
        width,
        height,
    };
};

// Pulls a list block out of a <ul>/<ol> element.
const parseList = (node: any, ordered: boolean): Block | null => {
    const items: Span[][] = [];

    for (const child of node.children ?? []) {
        if (child.type === "tag" && child.name === "li" && !shouldSkip(child)) {
            const spans = getSpans(child);
            if (spans.length) items.push(spans);
        }
    }

    if (!items.length) return null;

    return { type: "list", ordered, items };
};

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export const parseArticle = (html: string): Block[] => {
    const document = parseDocument(html);
    const blocks: Block[] = [];

    let stopped = false;

    const walk = (node: any) => {
        if (stopped || !node || node.type !== "tag" || shouldSkip(node)) return;

        switch (node.name) {
            case "style":
            case "link":
            case "sup":
            case "table": // info boxes / data tables are skipped for now
            case "img": // stray inline icons; real images come from <figure>
                return;

            case "h2":
            case "h3":
            case "h4": {
                const text = getText(node).replace(/\s+/g, " ").trim();

                if (STOP_HEADINGS.includes(text.toLowerCase())) {
                    stopped = true;
                    return;
                }

                if (text) {
                    const level = Number(node.name.slice(1));
                    blocks.push({ type: "heading", level, text });
                }
                return;
            }

            case "p": {
                const spans = getSpans(node);
                if (spans.length) blocks.push({ type: "paragraph", spans });
                return;
            }

            case "figure": {
                const block = parseFigure(node);
                if (block) blocks.push(block);
                return;
            }

            case "ul":
            case "ol": {
                const block = parseList(node, node.name === "ol");
                if (block) blocks.push(block);
                return;
            }

            default:
                // Containers (divs, sections, …) — walk into their children.
                (node.children ?? []).forEach(walk);
        }
    };

    if (Array.isArray(document.children)) {
        document.children.forEach(walk);
    }

    return blocks;
};
