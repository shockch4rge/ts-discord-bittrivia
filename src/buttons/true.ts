import {GuildMember} from "discord.js";
import {iButtonFile} from "../helpers/BotHelper";

module.exports = {
    id: "true",
    execute: async helper => {
        const member = helper.interaction.member as GuildMember;

        if (member) {
            console.log("CLICKED THE TRUE BUTTON")
        }

        await helper.interaction.followUp({content: "Logging your personal data...", ephemeral: true});

    }
} as iButtonFile;
