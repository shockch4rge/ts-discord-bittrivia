import { InteractionFile } from "../helpers/BotHelper";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, MessageEmbed } from "discord.js";
import { MessageLevel } from "../utilities/messaging";
import LevelCalculator from "../utilities/LevelCalculator";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Get the stats of yourself or another player's in the server!")
        .addStringOption(option =>
            option
                .setName("player-id")
                .setDescription("The id of the player to get stats of. Leave empty to get your own.")
                .setRequired(false)
        ),

    execute: async helper => {
        const playerId = helper.getInteractionString("player-id");
        const calculator = new LevelCalculator();

        // user requested another player's stats
        if (playerId) {
            const player = helper.cache.findPlayer(playerId);

            // requested player doesn't exist
            if (!player) {
                await helper.interaction.followUp({
                    embeds: [new MessageEmbed()
                        .setTitle(`❌  That player doesn't exist in ${helper.interaction.guild!.name}!`)
                        .setDescription(`Given ID: ${playerId}`)
                        .setColor(MessageLevel.WARNING)
                    ],
                    ephemeral: true,
                }).catch(() => {
                });
            }
            else {
                const { level, remainder } = calculator.getLevelFromXp(player.data.xp);

                await helper.interaction.followUp({
                    embeds: [new MessageEmbed()
                        .setTitle(`${player.member.displayName}`)
                        .addField("Guild", `${helper.interaction.guild!.name}`)
                        .addField("Level", `${level} -> ${remainder} xp into next level`)
                        .addField("Total Experience", `${player.data.xp}`, true)
                        .addField("Correct", `${player.data.correct} ✅`)
                        .addField("Wrong", `${player.data.wrong} ❌`, true)
                    ],
                    ephemeral: true,
                }).catch(() => {
                });
            }
        }
        // user requests own stats
        else {
            const member = helper.interaction.member as GuildMember;
            const player = helper.cache.findPlayer(member.id)!;

            const { level, remainder } = calculator.getLevelFromXp(player.data.xp);

            await helper.interaction.followUp({
                embeds: [new MessageEmbed()
                    .setTitle(`${player.member.displayName}`)
                    .addField("Guild", `${helper.interaction.guild!.name}`)
                    .addField("Level", `${level} -> ${remainder} xp into next level`)
                    .addField("Total Experience", `${player.data.xp}`, true)
                    .addField("Questions answered correctly", `${player.data.correct} ✅`)
                    .addField("Questions answered wrongly", `${player.data.wrong} ❌`, true)
                ],
                ephemeral: true,
            }).catch(() => {
            });
        }
    }

} as InteractionFile;
