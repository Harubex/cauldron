import { getCustomRepository } from "typeorm";
import { CharacterRepo, SkillRepo, CharacterSkillRepo, ProfessionRepo, CharacterProfessionRepo } from "../resolvers";

export const uploadProfession: CommandFunction = async (message, _, data) => {
    if (data.channel.type !== "dm") {
        return "Please send profession data through DMs.";
    }

    try {
        const raw = message.trim().replace(/ {1,}/g, " ");
        const { playerName, profession } = JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as ProfessionUpload;

        const characterRepo = getCustomRepository(CharacterRepo);

        let char = await characterRepo.characterByName(playerName);
        if (!char) {
            await data.reply(`${playerName} doesn't currently exist - adding an entry... :hourglass:`);
            char = await characterRepo.addCharacter(playerName);
        } else {
            await data.reply(`Updating ${profession.name} entry for ${playerName}... :hourglass:`);
            await characterRepo.updateModified(char);
        }

        const professionRepo = getCustomRepository(ProfessionRepo);
        let prof = await professionRepo.professionByName(profession.name);
        if (!prof) {
            prof = await professionRepo.addProfession(profession.name);
        }

        const charProfRepo = getCustomRepository(CharacterProfessionRepo);
        let charProf = await charProfRepo.getCharacterProfession(char.id!, prof.id!);
        if (!charProf) {
            charProf = await charProfRepo.addCharacterProfession(char.id!, prof.id!, profession.rank);
        } else {
            charProfRepo.updateCharacterProfession(charProf)
        }

        const skillRepo = getCustomRepository(SkillRepo);
        // all newly-added skills
        const skills = await skillRepo.addSkills(profession.skills, prof.id!);

        const charSkillRepo = getCustomRepository(CharacterSkillRepo);
        await charSkillRepo.addCharacterSkills(skills, char.id!);

        return "All done :slight_smile:";
    } catch (err) {
        return `Something went wrong when trying to upload your data. Copy the following error message and send it to Meliora. Thanks!\n${err}`;
    }
}
