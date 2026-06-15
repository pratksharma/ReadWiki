import { parseDocument } from "htmlparser2";

export const parseArticle = (html: string) => {
    const document = parseDocument(html);

    const blocks: any[] = [];

    const getText = (node: any): string => {
        if (!node) return "";

        if (node.type === "text") {
            return node.data ?? "";
        }

        if (!Array.isArray(node.children)) {
            return "";
        }

        return node.children.map(getText).join("");
    };

    const walk = (node: any) => {
        if (!node) return;

        if (node.type === "tag") {
            if (node.name === "p") {
                const text = getText(node).trim();

                if (text) {
                    blocks.push({
                        type: "paragraph",
                        text,
                    });
                }
            }

            if (node.name === "h2" || node.name === "h3") {
                const text = getText(node).trim();

                if (text) {
                    blocks.push({
                        type: "heading",
                        text,
                    });
                }
            }
        }

        if (Array.isArray(node.children)) {
            node.children.forEach(walk);
        }
    };

    if (Array.isArray(document.children)) {
        document.children.forEach(walk);
    }

    return blocks;
};
