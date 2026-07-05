import { Directory, File, Paths } from "expo-file-system";

// A tiny synchronous JSON store built on top of expo-file-system.
// Each "key" is saved as its own <key>.json file inside a `wikiatlas`
// folder in the app's document directory (which is safe from being
// cleared by the system). We keep it simple: read the whole file,
// parse it, write the whole file back.

const DIR = new Directory(Paths.document, "wikiatlas");

const getFile = (key: string) => new File(DIR, `${key}.json`);

// Make sure the folder exists before we touch any file.
const ensureDir = () => {
    if (!DIR.exists) {
        DIR.create({ intermediates: true });
    }
};

export const readJSON = <T>(key: string, fallback: T): T => {
    try {
        const file = getFile(key);

        if (!file.exists) {
            return fallback;
        }

        const text = file.textSync();

        if (!text) {
            return fallback;
        }

        return JSON.parse(text) as T;
    } catch (error) {
        console.log("Failed to read storage:", key, error);
        return fallback;
    }
};

export const writeJSON = (key: string, value: unknown) => {
    try {
        ensureDir();

        const file = getFile(key);

        if (!file.exists) {
            file.create();
        }

        file.write(JSON.stringify(value));
    } catch (error) {
        console.log("Failed to write storage:", key, error);
    }
};
