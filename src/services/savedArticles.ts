import { useSyncExternalStore } from "react";
import { readJSON, writeJSON } from "./storage";

// Shape of a single saved article. We keep just enough to render a
// nice card in the Saved tab and to open the full article again.
export type SavedArticle = {
    title: string;
    description?: string;
    thumbnail?: string;
    savedAt: number;
};

const STORAGE_KEY = "saved-articles";

// In-memory copy of the saved list. Loaded once from disk and kept in
// sync on every change so reads are instant.
let savedArticles: SavedArticle[] = readJSON<SavedArticle[]>(STORAGE_KEY, []);

// Simple subscription system so React components re-render when the
// saved list changes (used by useSyncExternalStore below).
const listeners = new Set<() => void>();

const emit = () => {
    listeners.forEach((listener) => listener());
};

const persist = () => {
    writeJSON(STORAGE_KEY, savedArticles);
    emit();
};

export const isArticleSaved = (title: string) => {
    return savedArticles.some((article) => article.title === title);
};

export const saveArticle = (article: SavedArticle) => {
    if (isArticleSaved(article.title)) {
        return;
    }

    // Newest saved articles go to the top of the list.
    savedArticles = [article, ...savedArticles];
    persist();
};

export const removeArticle = (title: string) => {
    savedArticles = savedArticles.filter((article) => article.title !== title);
    persist();
};

export const clearSavedArticles = () => {
    savedArticles = [];
    persist();
};

export const toggleSavedArticle = (article: SavedArticle) => {
    if (isArticleSaved(article.title)) {
        removeArticle(article.title);
    } else {
        saveArticle(article);
    }
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

// Returns the full saved list and re-renders on change.
export const useSavedArticles = () => {
    return useSyncExternalStore(
        subscribe,
        () => savedArticles,
        () => savedArticles,
    );
};

// Returns whether a single article is saved and re-renders on change.
export const useIsSaved = (title: string) => {
    return useSyncExternalStore(
        subscribe,
        () => isArticleSaved(title),
        () => isArticleSaved(title),
    );
};
