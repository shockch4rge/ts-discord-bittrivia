import { InteractionFile } from "../helpers/BotHelper";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, MessageEmbed } from "discord.js";
import LevelCalculator from "../utilities/LevelCalculator";

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
        const calculator = new LevelCalculator();

        // may be null
        let member = helper.getInteractionMentionable("member") as GuildMember | null;

        // user requested own stats
        if (!member) {
            member = helper.interaction.member as GuildMember;
        }

        const player = await helper.cache.getPlayer(member);

        // user tried to mention a bot
        if (player.member.user.bot) {
            await helper.interaction.followUp({
                content: "Bots are not valid players!",
                ephemeral: true,
            }).catch(() => {
            });
        }

        const { level, remainder } = calculator.getLevelFromXp(player.data.xp);

        await helper.interaction.followUp({
            embeds: [new MessageEmbed()
                .setTitle(`${player.member.displayName}`)
                .addField("Guild", `${helper.interaction.guild!.name}`)
                .addField("Level", `${level} -> ${remainder} xp into next level`)
                .addField("Total Experience", `${player.data.xp}`, true)
                .addField("Correct", `${player.data.correct} ✅`)
                .addField("Wrong", `${player.data.wrong} ❌`, true)],
            ephemeral: true,
        }).catch(() => {
        });
    }
} as InteractionFile;
