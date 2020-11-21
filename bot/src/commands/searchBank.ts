import Fuse from "fuse.js";

import bank, { bankOwners } from "../bank/api";

export const searchBank: CommandFunction = async (message) => {
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

    const itemName = matches[0].item;
    const item = items[itemName];
    const total = (Object.values(item) as number[]).reduce((tot, qty) => tot + qty, 0);
    const bankStrings = Object.keys(item).map((bank) => {
        const bankOwner = bankOwners[bank] ? ` (${bankOwners[bank]})` : "";
        return `${bank}${bankOwner}: ${item[bank]}`;
    });
    return `${total} total ${itemName} found:\n` + bankStrings.join("\n");
}
