import fetch from "node-fetch";

const endpoint = "https://classicguildbankapi.azurewebsites.net/api";

let token: string;

export const bankOwners = {
    Duskhoard: "Oshosi",
    Nightcloth: "Lolworth",
    Nightenchant: "Lolworth",
    Nightdank: "Meliora",
    Nightcook: "Aronova",
    Nightdrank: "Meliora",
    Nightprot: "Meliora",
    Nightstone: "Larm",
    Nightfur: "Arala",
    Nightraid: "Dadmomcat",
    Nightbox: "Larm",
    Nightsapper: "Aronova",
    Nightscale: "Arala"
}

async function login(): Promise<string> {
    const resp = await fetch(`${endpoint}/auth/login`, {
        method: "POST",
        body: JSON.stringify({
            UserName: process.env.CGB_LOGIN,
            Password: process.env.CGB_PASSWORD,
            RememberMe: true
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (!resp.ok) {
        throw new Error("Unable to log in.");
    }
    const body = await resp.json();
    return body?.token?.token as string;
}

async function apiCall(path: string) {
    if (!token) {
        token = await login();
    }
    const resp = await fetch(`${endpoint}${path}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept-Encoding": "gzip, deflate"
        }
    });
    if (!resp.ok) {
        if (token) {
            token = "";
            apiCall(path); // Try again.
        } else {
            throw new Error("Unable to refresh credentials.");
        }
    }
    return resp;
}

type ItemMap = { [itemName: string]: { [bankCharName: string]: number } };

let cachedItems: ItemMap;

export default async () => {
    try {
        const resp = await apiCall("/guild/GetCharacters/b445b65e-3df1-47ab-b991-7c74f2d76f0e");
        const characters: BankCharacter[] = await resp.json();
        const items: ItemMap = {};
        characters.forEach((char) => {
            char.bags.forEach((bag) => {
                bag.bagSlots.forEach((slot) => {
                    const itemName = slot.item.name;
                    if (!items[itemName]) {
                        items[itemName] = {};
                    }
                    items[itemName][char.name] = (items[itemName][char.name] || 0) + slot.quantity
                });
            });
        });
        cachedItems = items;
    } catch (err) {
        console.error("Unable to do new API request: returning cached data.");
        console.error(err);
    }
    return cachedItems;
}

