import { InteractionFile } from "../helpers/BotHelper";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Question, QuestionCategory, QuestionDifficulty } from "../models/Question";
import { createEmbed, delay } from "../utilities/utils";
import {
    ButtonInteraction,
    EmojiIdentifierResolvable,
    MessageActionRow,
    MessageButton,
    MessageEmbed
} from "discord.js";
import { MessageLevel } from "../utilities/messaging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("question")
        .setDescription("Get a question.")
        .addIntegerOption(option =>
            option
                .setName("category")
                .setDescription("Find what you're interested in!. Leave empty for any category.")
                .addChoices([
                    ["general knowledge", QuestionCategory.GENERAL_KNOWLEDGE],
                    ["books", QuestionCategory.BOOKS],
                    ["film", QuestionCategory.FILM],
                    ["music", QuestionCategory.MUSIC],
                    ["musicals and theatre", QuestionCategory.MUSICALS_AND_THEATRE],
                    ["television", QuestionCategory.TELEVISION],
                    ["video games", QuestionCategory.VIDEO_GAMES],
                    ["board games", QuestionCategory.BOARD_GAMES],
                    ["nature", QuestionCategory.NATURE],
                    ["computers", QuestionCategory.COMPUTERS],
                    ["mathematics", QuestionCategory.MATHEMATICS],
                    ["mythology", QuestionCategory.MYTHOLOGY],
                    ["sports", QuestionCategory.SPORTS],
                    ["geography", QuestionCategory.GEOGRAPHY],
                    ["history", QuestionCategory.HISTORY],
                    ["politics", QuestionCategory.POLITICS],
                    ["art", QuestionCategory.ART],
                    ["celebrities", QuestionCategory.CELEBRITIES],
                    ["animals", QuestionCategory.ANIMALS],
                    ["vehicles", QuestionCategory.VEHICLES],
                    ["comics", QuestionCategory.COMICS],
                    ["gadgets", QuestionCategory.GADGETS],
                    ["anime", QuestionCategory.ANIME],
                    ["cartoons", QuestionCategory.CARTOON],
                ])
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("difficulty")
                .setDescription("Challenge yourself! Leave empty for any difficulty.")
                .addChoices([
                    ["easy", QuestionDifficulty.EASY],
                    ["medium", QuestionDifficulty.MEDIUM],
                    ["hard", QuestionDifficulty.HARD]])
                .setRequired(false)
        ),

    execute: async helper => {
        const service = helper.cache.service;

        const category = helper.getInteractionInteger("category") as QuestionCategory;
        const difficulty = helper.getInteractionString("difficulty") as QuestionDifficulty;

        // make sure to check for null values
        const questionData = await service.getQuestion(
            category ?? QuestionCategory.ANY,
            difficulty ?? QuestionDifficulty.ANY
        );
        const question = new Question(questionData);

        const questionEmbed = createEmbed({
            title: question.content,
            fields: [
                { name: "Category", value: question.category, inline: true },
                { name: "Type", value: question.type, inline: true },
                { name: "Difficulty", value: question.difficulty, inline: true },
            ],
            footer: "❗  There is only 1 correct answer."
        });

        const answerButtons: MessageButton[] = [];
        const numbers: EmojiIdentifierResolvable[] = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

        for (let i = 0; i < question.allAnswers.length; i++) {
            // append all answers to the question
            questionEmbed.addField(
                `${i + 1}.`,
                question.allAnswers[i]);

            // append buttons based on number of answers
            answerButtons.push(
                new MessageButton()
                    .setCustomId(`answer_${i}`)
                    .setLabel(question.allAnswers[i])
                    .setEmoji(numbers.at(i)!)
                    .setStyle("PRIMARY"));
        }

        await helper.interaction.editReply({
            embeds: [questionEmbed],
            components: [
                new MessageActionRow()
                    .addComponents(answerButtons),
            ]
        }).catch(() => {});

        const collector = helper.interaction.channel!
            .createMessageComponentCollector({
                filter: i => i.customId.startsWith("answer_"),
                componentType: "BUTTON",
            });

        collector.on("collect", async (i: ButtonInteraction) => {
            const button = i.component as MessageButton;
            const answer = button.label!;

            if (question.checkCorrect(answer)) {
                await i.update({
                    embeds: [new MessageEmbed()
                        .setTitle("✅  You got the correct answer!")
                        .setColor(MessageLevel.SUCCESS)
                    ],
                    components: [],
                }).catch(() => {});
            }
            else {
                await i.update({
                    embeds: [new MessageEmbed()
                        .setTitle("❌  You got the wrong answer!")
                        .setColor(MessageLevel.WARNING)
                    ],
                    components: [],
                }).catch(() => {});
            }

            await delay(7000);
            await helper.interaction.deleteReply().catch(() => {});
        });

    }
} as InteractionFile;
