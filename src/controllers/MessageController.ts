import {Message} from "discord.js";
import Question from "../models/Question";
import {askQuestion} from "../../utils/messaging";
import AnswerCollector from "../AnswerCollector";
import QuestionRequester from "../services/QuestionRequester";

export default class MessageController {
    private readonly questionRequester;

    public constructor() {
        this.questionRequester = new QuestionRequester();
    }

    public async handleMessageCreate(message: Message) {
        if (message.channelId !== "879645377463222313") return;
        if (message.author.bot || !message.guild || !message.channel) return;

        // 50% chance of question popping up with every message
        const chance = 0.5

        if (chance >= Math.random()) {
            //TODO help
            await this.handleQuestionChance(message);
        }
    }

    public async handleQuestionChance(message: Message) {
        // Query API for question
        const result = await this.questionRequester.request();

        // construct the question and send it to the channel
        const question = new Question(result!);
        await askQuestion(message.channel, question);

        // filter messages from original author and if the given answer is correct
        const f = (m: Message) => {
            return m.author.id === message.author.id && question.checkCorrect(Number.parseInt(m.content));
        }

        try {
            // start collecting messages
            const collector = new AnswerCollector(message.channel, {filter: f, time: 5000});
            collector.start();

            //TODO implement event when answer is correct
        }
        catch {
            await message.channel.send({content: "ran out of time lul"});
            return;
        }
    }

}
