const BASE_URL = "https://api.wikimedia.org";

export const getFeaturedArticle = async () => {
    try {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        const url = `${BASE_URL}/feed/v1/wikipedia/en/featured/${year}/${month}/${day}`;

        const response = await fetch(url, {
            headers: {
                "User-Agent": "WikiAtlas/1.0",
                "Api-User-Agent": "WikiAtlas/1.0",
            },
        });

        return response.json();
    } catch (error) {
        console.log(error);
    }
};

export const getFullArticle = async (title: string) => {
    try {
        const encodedTitle = encodeURIComponent(title);

        const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=parse&page=${encodedTitle}&prop=text&format=json`,
            {
                headers: {
                    "User-Agent": "WikiAtlas/1.0",
                    "Api-User-Agent": "WikiAtlas/1.0",
                },
            },
        );
        const data = await response.json();
        console.log(data.parse.text["*"]);

        return await data.parse.text["*"];
    } catch (error) {
        console.log(error);
    }
};

export const searchArticles = async (query: string) => {
    try {
        if (!query.trim()) {
            return [];
        }

        const encodedQuery = encodeURIComponent(query);

        const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&generator=prefixsearch&description&prop=pageprops%7Cpageimages%7Cdescription&piprop=thumbnail&pithumbsize=128&gpslimit=6&format=json&formatversion=2&maxage=900&smaxage=900&gpssearch=${encodeURIComponent(encodedQuery)}`,
            {
                headers: {
                    "User-Agent": "WikiAtlas/1.0",
                    "Api-User-Agent": "WikiAtlas/1.0",
                },
            },
        );

        const data = await response.json();

        return data.query.pages ?? [];
    } catch (error) {
        console.log(error);
        return [];
    }
};
