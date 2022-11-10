import { Colors, EmbedBuilder, GuildMember } from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";

import { InteractionFile } from "../helpers/BotHelper";
import { MessageLevel } from "../utilities/messaging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register for a profile to view your guild statistics!"),

    execute: async helper => {
        const member = helper.interaction.member as GuildMember;

        try {
            await helper.cache.registerPlayer(member);
        }
        catch {
            await helper.interaction.followUp({
                embeds: [new EmbedBuilder()
                    .setTitle("❌  You've already registered in the server!")
                    .setColor(Colors.Red)],
                ephemeral: true,
            });
            return;
        }

        await helper.interaction.followUp({
            embeds: [new EmbedBuilder()
                .setTitle("✅  Registered in the server!")
                .setColor(Colors.Green)],
            ephemeral: true,
        });
    }

} as InteractionFile;
