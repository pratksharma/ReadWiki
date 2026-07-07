// The Wikipedia "In the news" stories arrive as HTML fragments (wiki links,
// bold/italic tags and an HTML comment date marker). This strips them down to
// plain text for display in cards.
export const stripHtml = (html: string): string => {
    if (!html) {
        return "";
    }

    return html
        .replace(/<!--.*?-->/g, "") // leading date comment, e.g. <!--Jul 03-->
        .replace(/<[^>]+>/g, "") // any remaining tags
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
};
