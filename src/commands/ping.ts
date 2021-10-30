import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, MessageActionRow, MessageButton } from "discord.js";
import { InteractionFile } from "../helpers/BotHelper";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Receive the bot's response time, in milliseconds.")
        .setDefaultPermission(true),

    execute: async helper => {
        const member = helper.interaction.member as GuildMember;

        if (member) {
            const row = new MessageActionRow().addComponents([
                new MessageButton()
                    .setCustomId("true")
                    .setLabel("TRUE")
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("false")
                    .setLabel("FALSE")
                    .setStyle("PRIMARY"),
            ]);

            await helper.interaction.followUp({
                content: `Pong! ${helper.cache.bot.ws.ping}ms`,
                components: [row]
            });
        }
    }
} as InteractionFile;
