import { InteractionFile } from "../helpers/BotHelper";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, MessageEmbed } from "discord.js";
import XpHelper from "../utilities/XpHelper";
import { PlayerData } from "../models/Player";

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
                embeds: [new MessageEmbed()
                    .setTitle(`${member.displayName} does not have a profile!`)
                    .setDescription("Do `/register` to create a profile and start gaining XP for answering questions!")],
                ephemeral: true,
            });
            return;
        }

        const { level, remainder } = XpHelper.getLevelFromXp(playerData.xp);

        await helper.interaction.followUp({
            embeds: [new MessageEmbed()
                .setTitle(`${member.displayName}`)
                .addField("Guild", `${member.guild!.name}`)
                .addField("Level", `${level} -> ${remainder} xp into next level`)
                .addField("Total Experience", `${playerData.xp}`, true)
                .addField("Correct", `${playerData.correct} ✅`)
                .addField("Wrong", `${playerData.wrong} ❌`, true)],
            ephemeral: true,
        });
    }
} as InteractionFile;
