import Discord from "discord.js";
import fetch from "node-fetch";
import { getConnection } from "./middleware";
import commands from "./commands";

const disc = new Discord.Client();

disc.on("ready", async () => {
    await getConnection();
    if (disc && disc.user) {
        console.log(`Logged in as ${disc.user.tag}!`);
    }
});

disc.on("message", async (msg: Discord.Message) => {
    let content = msg.content;

    // Don't respond to yourself.
    if (msg.author.username.indexOf(process.env.BOT_NAME) >= 0) {
        return;
    }

    // If the message is too big and is read as an attachment, read out the text.
    if (msg.attachments.size > 0) {
        const file = msg.attachments.first()!;
        const resp = await fetch(file.url);
        content = await resp.text();
    }

    for (const cmd in commands) {
        if (cmd === content.substr(0, cmd.length)) {
            const response = await commands[cmd](content.substr(cmd.length), cmd, msg);
            await msg.reply(response);
            return;
        }
    }
    await msg.reply(`I'm unable to read your command. Here's a list of available commands: \n${Object.keys(commands).join(", ")}`);
});

disc.login(process.env.DISCORD_TOKEN);
