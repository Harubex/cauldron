import Fuse from "fuse.js";

import bank from "../bank/api";

export const bankStats: CommandFunction = async (message) => {
    const items = await bank();
    const raw = message.trim();
    if (raw.length === 0) {
        return "Unable to search: no query provided"
    }
    const fuse = new Fuse(Object.keys(items), {
        includeMatches: true,
        includeScore: true,
        isCaseSensitive: false
    });
    const matches = fuse.search(raw);
    if (matches.length === 0) {
        return `No matches were found for "${raw}"`
    }
    const cutoff = 5;
    const matchStrings: string[] = [];
    for (let i = 0; i < cutoff; i++) {
        if (matches[i]) {
            matchStrings.push(`${matches[i].item} (Score: ${matches[i].score})`);
        }
    }
    return `Closest ${matchStrings.length} items by score:\n` + matchStrings.join("\n");
}
