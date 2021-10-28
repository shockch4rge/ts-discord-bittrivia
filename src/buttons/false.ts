import {iButtonFile} from "../helpers/BotHelper";
import {GuildMember} from "discord.js";

module.exports = {
    id: "false",
    execute: async helper => {
        const member = helper.interaction.member as GuildMember;

        if (member) {
            console.log("CLICKED THE FALSE BUTTON");
        }

        await helper.interaction.followUp({content: "Logging your personal data...", ephemeral: true});
    }
} as iButtonFile;
