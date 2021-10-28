import {iInteractionFile} from "../helpers/BotHelper";
import {SlashCommandBuilder} from "@discordjs/builders";
import ApiService, {QuestionDifficulty} from "../services/ApiService";
import {createEmbed} from "../utilities/utils";
import {EmojiIdentifierResolvable, MessageActionRow, MessageButton} from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("question")
        .setDescription("Get a question")
        .addStringOption(option =>
            option
                .setName("category")
                .setDescription("Find a specific category for your question")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("difficulty")
                .setDescription("Challenge yourself!")
                .setRequired(false)
        ),

    execute: async helper => {
        let apiService = helper.cache.service;

        if (!apiService) {
            apiService = new ApiService();
        }

        const category = helper.getInteractionString("category");
        const difficulty = helper.getInteractionString("difficulty") as QuestionDifficulty;

        const question = await apiService.getQuestion({
            category: category ?? "",
            difficulty: difficulty ?? QuestionDifficulty.ANY
        });

        const questionEmbed = createEmbed({
            title: question.content,
            fields: [
                {name: "Category", value: question.category, inline: true},
                {name: "Type", value: question.type, inline: true},
                {name: "Difficulty", value: question.difficulty, inline: true},
            ],
            footer: "❗ There is only 1 correct answer."
        });

        const answerButtons: MessageButton[] = [];
        const numbers: EmojiIdentifierResolvable[] =
            ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

        for (let i = 0; i < question.allAnswers.length; i++) {
            // Append all answers to the question
            questionEmbed.addField(
                i.toString() + ".",
                question.allAnswers[i]);

            // Append buttons based on number of answers
            answerButtons.push(
                new MessageButton()
                    .setCustomId("answer-" + i.toString())
                    .setLabel(question.allAnswers[i])
                    .setEmoji(numbers.at(i)!)
                    .setStyle("PRIMARY"));
        }

        await helper.interaction.followUp({
            embeds: [questionEmbed],
            components: [new MessageActionRow()
                .addComponents(answerButtons),
            ]
        }).catch();

    }
} as iInteractionFile;
