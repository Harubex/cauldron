import { getCustomRepository } from "typeorm";
import { CharacterRepo, SkillRepo, CharacterSkillRepo } from "../resolvers";

const delimiters = ["[]", "{}", "()"]

export const searchSkills: CommandFunction = async (message, command) => {
    let delimiterIdx = -1;
    let startIdx = -1;
    let endIdx = -1;
    // Go through all delimiter options, see if any contain our match.
    for (let i = 0; i < delimiters.length; i++) {
        startIdx = message.indexOf(delimiters[i][0]);
        if (startIdx >= 0) {
            endIdx = message.lastIndexOf(delimiters[i][1]);
            delimiterIdx = i; // Mark that matching delimiters were found.
            break;
        }
    }

    // Trim the message, remove extra spaces between tokens.
    let query = message.trim().replace(/ {1,}/g, " ");
    // If delimiters are being used, grab them.
    if (delimiterIdx >= 0) {
        query = message.substr((startIdx + 1), endIdx - (startIdx + 1));
    }

    if (query.length <= 3) {
        return "I'm unable to read your query. Make sure your query is at least 3 characters long.";
    }

    const skillRepo = getCustomRepository(SkillRepo);
    const skills = await skillRepo.findSkills(query) || [];
    const matches = skills.length;

    if (matches > 1) {
        const matchString = [`There are ${matches} recipe matches for your search. Try running one of the following commands instead:`];
        skills.forEach((skill) => {
            matchString.push(`${command} ${skill.name}`);
        });
        return matchString.join("\n");
    }
    if (matches === 1) {
        const skill = skills[0];
        const charSkillRepo = getCustomRepository(CharacterSkillRepo);
        const charSkills = await charSkillRepo.findCharactersWithSkill(skill.id!);

        const characterRepo = getCustomRepository(CharacterRepo);
        const characters = await characterRepo.charactersBySkill(charSkills);

        let resp = `The following characters can craft [${skill.name}]:`;
        characters.forEach((char) => resp += "\n" + char.name);
        return resp;
    }

    return "I'm unable to find a crafter for your recipe. Perhaps the archives are incomplete.";
}
