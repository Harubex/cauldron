declare type CommandFunction = (message: string, command: string, data: import("discord.js").Message) => string | Promise<string>;
