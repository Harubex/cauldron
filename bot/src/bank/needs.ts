import fetch from "node-fetch";

export async function getNeedsText() {
    const resp = await fetch(process.env.NEEDS_ENDPOINT, {
        method: "GET"
    });
    if (!resp.ok) {
        throw new Error("Unable to get needs text file.");
    }
    const body = await resp.text();
    return "Here is the herb bank's needs atm:\n\n" + body;
}
