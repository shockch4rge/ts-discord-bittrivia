import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { InteractionFile } from "../helpers/BotHelper";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Receive the bot's response time, in milliseconds.")
        .setDefaultPermission(true),

    execute: async helper => {
        const member = helper.interaction.member as GuildMember;

        if (member) {
            await helper.interaction.followUp({ content: `Pong! ${helper.cache.bot.ws.ping}ms`, });
        }
    }
} as InteractionFile;
