import { InteractionFile } from "../helpers/BotHelper";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, MessageEmbed } from "discord.js";
import { MessageLevel } from "../utilities/messaging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register for a profile to view your guild statistics!"),

    execute: async helper => {
        const member = helper.interaction.member as GuildMember;

        try {
            await helper.cache.registerPlayer(member);
            await helper.interaction.followUp({
                embeds: [new MessageEmbed()
                    .setTitle("✅  Registered in the server!")
                    .setColor(MessageLevel.SUCCESS)],
                ephemeral: false,
            });
        }
            // member has already registered as player in the guild
        catch {
            await helper.interaction.followUp({
                embeds: [new MessageEmbed()
                    .setTitle("❌  You've already registered in the server!")
                    .setColor(MessageLevel.WARNING)],
                ephemeral: false,
            });
        }
    }

} as InteractionFile;
