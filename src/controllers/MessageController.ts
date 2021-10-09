import {Message} from "discord.js";
import Question from "../models/Question";
import {deleteMessages, editMessage, MessageLevel, sendMessage} from "../../utils/messaging";
import ApiService from "../services/ApiService";

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
        if (message.channelId !== "879645377463222313") return;
        if (message.author.bot || !message.guild || !message.channel) return;
        if (this.messageLock) {
            console.log("Message lock is active");
            return;
        }

        // 50% chance of question popping up with every message
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
        const questionMessage = await sendMessage(message.channel, {
            title: question.content,
            fields: [
                {name: "Category", value: question.category, inline: true},
                {name: "Type", value: question.type, inline: true},
                {name: "Difficulty", value: question.difficulty, inline: true},
                {name: "1", value: question.allAnswers[0]},
                {name: "2", value: question.allAnswers[1], inline: true},
                {name: "3", value: question.allAnswers[2]},
                {name: "4", value: question.allAnswers[3], inline: true},
            ],
            footer: "❗ There is only 1 correct answer."
        });

        // filter messages from original author
        const f = (m: Message): boolean => m.author.id === message.author.id;

        try {
            const answers = await message.channel.awaitMessages({filter: f, max: 1, time: 8000, errors: ['time']});

            // correct answer
            if (!question.checkCorrect(answers.first()!.content)) {
                const alertWrong = await editMessage(questionMessage, {
                    title: "❌  Wrong!",
                    level: MessageLevel.WARNING,
                    footer: `Correct answer: ${question.correctAnswer}`,
                });
                await deleteMessages([alertWrong, answers.first()!], 5000);
            }
            // wrong answer
            else {
                const alertCorrect = await editMessage(questionMessage, {
                    title: "✅  Correct!",
                    level: MessageLevel.SUCCESS,
                });
                await deleteMessages([alertCorrect, answers.first()!], 5000);
            }

            this.messageLock = false;
        }
            // user didn't answer in time
        catch {
            const alertOutOfTime = await message.channel.send({content: "You didn't answer in time"});
            await deleteMessages([questionMessage, alertOutOfTime], 5000);
        }
    }
}
