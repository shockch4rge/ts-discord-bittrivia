import { ComponentType } from "discord-api-types/v9";
import {
    ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Colors,
    ComponentEmojiResolvable, EmbedBuilder, GuildMember
} from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";

import { InteractionFile } from "../helpers/BotHelper";
import { Question, QuestionCategory, QuestionDifficulty } from "../models/Question";
import { delay } from "../utilities/utils";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("question")
        .setDescription("Get a question.")
        .addIntegerOption(option =>
            option
                .setName("category")
                .setDescription("Find what you're interested in! Leave empty for a random category.")
                .addChoices(
                    { name: "general knowledge", value: QuestionCategory.GeneralKnowledge },
                    { name: "books", value: QuestionCategory.Books },
                    { name: "film", value: QuestionCategory.Film },
                    { name: "music", value: QuestionCategory.Music },
                    { name: "musicals and theatre", value: QuestionCategory.MusicalsAndTheatre },
                    { name: "television", value: QuestionCategory.Television },
                    { name: "video games", value: QuestionCategory.VideoGames },
                    { name: "board games", value: QuestionCategory.BoardGames },
                    { name: "nature", value: QuestionCategory.Nature },
                    { name: "computers", value: QuestionCategory.Computers },
                    { name: "mathematics", value: QuestionCategory.Mathematics },
                    { name: "mythology", value: QuestionCategory.Mythology },
                    { name: "sports", value: QuestionCategory.Sports },
                    { name: "geography", value: QuestionCategory.Geography },
                    { name: "history", value: QuestionCategory.History },
                    { name: "politics", value: QuestionCategory.Politics },
                    { name: "art", value: QuestionCategory.Art },
                    { name: "celebrities", value: QuestionCategory.Celebrities },
                    { name: "animals", value: QuestionCategory.Animals },
                    { name: "vehicles", value: QuestionCategory.Vehicles },
                    { name: "comics", value: QuestionCategory.Comics },
                    { name: "gadgets", value: QuestionCategory.Gadgets },
                    { name: "anime", value: QuestionCategory.Anime },
                    { name: "cartoons", value: QuestionCategory.Cartoon },
                )
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("difficulty")
                .setDescription("Challenge yourself! Leave empty for a random difficulty.")
                .addChoices(
                    { name: "easy", value: QuestionDifficulty.Easy },
                    { name: "medium", value: QuestionDifficulty.Medium },
                    { name: "hard", value: QuestionDifficulty.Hard }
                )
                .setRequired(false)
        ),

    execute: async helper => {
        const service = helper.cache.service;
        const member = helper.interaction.member as GuildMember;

        // may return null
        const category = helper.getInteractionInteger("category") as QuestionCategory;
        const difficulty = helper.getInteractionString("difficulty") as QuestionDifficulty;

        const questionData = await service.getQuestion(
            category ?? QuestionCategory.Any,
            difficulty ?? QuestionDifficulty.Any
        );
        const question = new Question(questionData);

        const questionEmbed = new EmbedBuilder()
            .setTitle(question.content)
            .addFields({ name: "Category", value: question.category, inline: true })
            .addFields({ name: "Type", value: question.type, inline: true })
            .addFields({ name: "Difficulty", value: question.difficulty, inline: true })
            .setFooter({ text: "❗  There is only 1 correct answer." });

        const answerButtons: ButtonBuilder[] = [];
        const numbers: ComponentEmojiResolvable[] = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

        // append the answer choices to the embed
        for (let i = 0; i < question.allAnswers.length; i++) {
            questionEmbed.addFields({ name: `${i + 1}.`, value: question.allAnswers[i] });
            answerButtons.push(new ButtonBuilder()
                .setCustomId(`answer_${i}`)
                .setLabel(question.allAnswers[i])
                .setEmoji(numbers[i])
                .setStyle(ButtonStyle.Primary));
        }

        await helper.interaction.editReply({
            embeds: [questionEmbed],
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(answerButtons)]
        })

        let buttonInteraction: ButtonInteraction;

        try {
            buttonInteraction = await helper.interaction.channel!
                .awaitMessageComponent<ComponentType.Button>({
                    filter: i => i.customId.startsWith("answer_") && i.member.id === member.id,
                    time: 15000,
                }) as ButtonInteraction;
        }
        // 15 seconds passed without an answer
        catch {
            await helper.interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle("🕕  You ran out of time!")
                    .setDescription(`Correct answer: ${question.correctAnswer}`)],
                components: [],
            }).catch(() => {
            });
            await delay(5000);
            await helper.interaction.deleteReply();
            return;
        }

        const respondent = buttonInteraction.member as GuildMember;
        const answer = buttonInteraction.component.label!;
        const isRegistered = await helper.cache.isRegistered(respondent.id);

        if (question.check(answer)) {
            if (isRegistered) {
                await helper.cache.incrementStats(respondent.id);
            }

            await buttonInteraction.update({
                embeds: [new EmbedBuilder()
                    .setTitle("✅  You got the correct answer!")
                    .setDescription(`Correct answer: ${question.correctAnswer}\n
                        ${isRegistered ? "XP Awarded: +25" : "Register for a profile to gain XP!"}`)
                    .setColor(Colors.Green)
                    .setFooter({ text: `Answered by: ${respondent.displayName}` })],
                components: [],
            }).catch(() => {
            });
        }
        else {
            if (isRegistered) {
                await helper.cache.decrementStats(respondent.id);
            }

            await buttonInteraction.update({
                embeds: [new EmbedBuilder()
                    .setTitle("❌  You got the wrong answer!")
                    .setDescription(`Correct answer: ${question.correctAnswer}`)
                    .setColor(Colors.Red)
                    .setFooter({ text: `Answered by: ${respondent.displayName}` })],
                components: [],
            }).catch(() => {
            });
        }
        await delay(7000);
        await helper.interaction.deleteReply().catch(() => {
        });
    }
} as InteractionFile;
