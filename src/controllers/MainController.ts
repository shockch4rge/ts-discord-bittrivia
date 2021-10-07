import {Client, Message} from "discord.js";
import {askQuestion} from "../../utils/messaging";
import Question from "../models/Question";
import AnswerCollector from "../AnswerCollector";
import QuestionRequester from "../services/QuestionRequester";
import MessageController from "./MessageController";

export default class MainController {
    private readonly bot: Client;
    private readonly messageController;

    public constructor(bot: Client) {
        this.bot = bot;
        this.messageController = new MessageController();
    }

    public subscribeBotEvents(bot: Client) {
        bot.on("ready", this.handleReady);
        bot.on("messageCreate", async message => {
            await this.messageController.handleMessageCreate(message);
        });
    }

    public handleReady(bot: Client) {
        console.log(`${bot.user!.tag} is ready!`);
        bot.user!.setPresence({
            activities: [{type: "LISTENING", name: "all messages!"}],
            status: "online",
        });
    }
}
