import {Client} from "discord.js";
import MessageController from "./MessageController";

export default class MainController {
    private readonly messageController;

    public constructor() {
        this.messageController = new MessageController();
    }

    public subscribeBotEvents(bot: Client) {
        bot.once("ready", this.handleReady);
        bot.on("messageCreate", async message => {
            await this.messageController.handleMessageCreate(message);
        });
    }

    public handleReady(bot: Client) {
        console.log(`${bot.user!.username} is ready!`);
        bot.user!.setPresence({
            activities: [{type: "LISTENING", name: "all messages!"}],
            status: "online",
        });
    }
}
