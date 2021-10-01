import {Client, Message, MessageCollector} from "discord.js";
import {Question} from "./Question";
import {AnswerCollector} from "./AnswerCollector";

export class MainController {
    private readonly bot: Client;

    public constructor(bot: Client) {
        this.bot = bot;
    }

    public subscribeBotEvents() {
        this.bot.on("ready", this.handleReady);
        this.bot.on("messageCreate", this.handleMessageCreate);
    }

    public handleReady(bot: Client) {
        bot.on("ready", bot => console.log(`${bot.user.tag} is ready!`));
        bot.user!.setPresence({
            activities: [{type: "LISTENING", name: "all messages!"}],
            status: "online",
        });
    }

    public async handleMessageCreate(message: Message) {
        if (message.channelId !== "879645377463222313") return;
        if (message.author.bot || !message.guild || !message.channel) return;

        // 50% chance of question popping up
        const chance = 0.5

        if (Math.random() >= chance) {
            // placeholder question
            const question = new Question({content: "what is 2+2", answers: ["4",]});
            await question.ask(message.channel);

            try {
                // filter messages from original author and if the given answer is correct
                const f = (m: Message) => m.author.id === message.author.id && question.checkCorrect(m.content);
                // start collecting messages
                const collector = new AnswerCollector(message.channel, {filter: f, time: 5000});
            } catch {
                await message.channel.send({content: "ran out of time lul"});
                return;
            }
        }
    }
}
