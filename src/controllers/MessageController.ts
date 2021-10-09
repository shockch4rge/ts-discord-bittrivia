import {Message} from "discord.js";
import Question from "../models/Question";
import {deleteMessages, editMessage, MessageLevel} from "../utils/messaging";
import ApiService from "../services/ApiService";
import {createEmbed} from "../utils/utils";

export default class MessageController {
    // we use a message lock to prevent message events from firing while
    // the user is still answering a question
    private messageLock: boolean;
    private readonly api: ApiService;

    public constructor() {
        this.api = new ApiService();
        this.messageLock = false;
    }

    public async handleMessageCreate(message: Message) {
        if (message.author.bot || !message.guild || !message.channel) return;
        if (this.messageLock) return;

        // 1% chance of question popping up with every message
        const chance = 0.5

        if (chance >= Math.random()) {
            await this.handleQuestionChance(message);
        }
    }

    public async handleQuestionChance(message: Message) {
        // prevent sending new questions
        this.messageLock = true;

        // queries api for random question
        const questionData = await this.api.getQuestion();

        // construct the question and send it to the channel
        const question = new Question(questionData!);
        const questionEmbed = createEmbed({
            title: question.content,
            fields: [
                {name: "Category", value: question.category, inline: true},
                {name: "Type", value: question.type, inline: true},
                {name: "Difficulty", value: question.difficulty, inline: true},
            ],
            footer: "❗ There is only 1 correct answer."
        });

        for (let i = 1; i < question.allAnswers.length + 1; i++) {
            questionEmbed.addField(i.toString(), question.allAnswers[i - 1]);
        }

        const questionMessage = await message.channel.send({embeds: [questionEmbed]});

        try {
            const answers = await message.channel.awaitMessages({max: 1, time: 15000, errors: ['time']});

            // correct answer
            if (!question.checkCorrect(answers.first()!.content)) {
                const alertWrong = await editMessage(questionMessage, {
                    title: "❌  Wrong!",
                    level: MessageLevel.WARNING,
                    footer: `Correct answer: ${question.correctAnswer}`,
                });
                await deleteMessages([alertWrong], 5000);
            }
            // wrong answer
            else {
                const alertCorrect = await editMessage(questionMessage, {
                    title: "✅  Correct!",
                    level: MessageLevel.SUCCESS,
                    footer: `Answered by: ${answers.first()!.author.username}`
                });
                await deleteMessages([alertCorrect], 5000);
            }

            // allow sending new questions
            this.messageLock = false;
        }
            // user didn't answer in time
        catch {
            const alertOutOfTime = await editMessage(questionMessage, {
                title: "❗  You ran out of time!",
                level: MessageLevel.WARNING,
                footer: `Correct answer: ${question.correctAnswer}`,
            })
            await deleteMessages([questionMessage, alertOutOfTime], 5000);
            this.messageLock = false;
        }
    }
}
