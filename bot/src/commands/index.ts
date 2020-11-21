import { getNeedsText } from "../bank/needs";
import { searchSkills } from "../commands/searchSkills";
import { bankStats } from "./bankStats";
import { searchBank } from "./searchBank";
import { uploadProfession } from "./uploadProfessions";

export const commands: { [command: string]: CommandFunction } = {
    "!crafters": searchSkills,
    "!upload": uploadProfession,
    "!bankneeds": getNeedsText,
    "!needs": getNeedsText,
    "!bankstats": bankStats,
    "!bank": searchBank
};

export default commands;
