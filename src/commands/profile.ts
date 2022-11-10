import { EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";

import { InteractionFile } from "../helpers/BotHelper";
import { PlayerData } from "../models/Player";
import XpHelper from "../utilities/XpHelper";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("View your own or someone else's profile in the server.")
        .addMentionableOption(option =>
            option
                .setName("member")
                .setDescription("The player to fetch the profile of. Leave empty for your own.")
                .setRequired(false)
        ),

    execute: async helper => {
        // may be null
        let member = helper.getInteractionMentionable("member") as GuildMember | null;

        // user requested own stats
        if (!member) {
            member = helper.interaction.member as GuildMember;
        }

        let playerData: PlayerData;

        try {
            playerData = await helper.cache.getPlayerData(member.id);
        }
        // player has not registered for a profile
        catch {
            await helper.interaction.followUp({
                embeds: [new EmbedBuilder()
                    .setTitle(`${member.displayName} does not have a profile!`)
                    .setDescription("Do `/register` to create a profile and start gaining XP for answering questions!")],
                ephemeral: true,
            });
            return;
        }

        const { level, remainder } = XpHelper.calculateLevel(playerData.xp);

        await helper.interaction.followUp({
            embeds: [new EmbedBuilder()
                .setTitle(`${member.displayName}`)
                .addFields({ name: "Guild", value: `${member.guild!.name}` })
                .addFields({ name: "Level", value: `${level} -> ${remainder} xp into next level` })
                .addFields({ name: "Total Experience", value: `${playerData.xp}`, inline: true })
                .addFields({ name: "Correct", value: `${playerData.correct} ✅` })
                .addFields({ name: "Wrong", value: `${playerData.wrong} ❌`, inline: true })],
            ephemeral: true,
        });
    }
} as InteractionFile;
