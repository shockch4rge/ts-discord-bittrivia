import { InteractionFile } from "../helpers/BotHelper";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, MessageEmbed } from "discord.js";
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

        const player = await helper.cache.getPlayerData(member.id);

        // player has not registered for a profile
        if (!player) {
            await helper.interaction.followUp({
                embeds: [new MessageEmbed()
                    .setTitle("You need to register for a profile!")
                    .setDescription("Do `/register` to start gaining XP for answering questions!")],
                ephemeral: true,
            });
            return;
        }

        const { level, remainder } = XpHelper.getLevelFromXp(player.xp);

        await helper.interaction.followUp({
            embeds: [new MessageEmbed()
                .setTitle(`${member.displayName}`)
                .addField("Guild", `${member.guild!.name}`)
                .addField("Level", `${level} -> ${remainder} xp into next level`)
                .addField("Total Experience", `${player.xp}`, true)
                .addField("Correct", `${player.correct} ✅`)
                .addField("Wrong", `${player.wrong} ❌`, true)],
            ephemeral: true,
        });
    }
} as InteractionFile;
